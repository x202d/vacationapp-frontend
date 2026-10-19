import io from 'socket.io-client'
import { store } from '../stores/store'
import { IOBROKER_URL, IS_IOBROKER_CONFIGURED } from '../config/api.ts'
import {
    setConnectionError,
    setConnectionStatus,
    SpotifyDevice,
    updateSpotifyState,
} from '../stores/iobroker/iobrokerSlice'
import Socket = SocketIOClient.Socket

const SPOTIFY = 'spotify-premium.0'

const IDS = {
    trackName: `${SPOTIFY}.player.trackName`,
    artistName: `${SPOTIFY}.player.artistName`,
    album: `${SPOTIFY}.player.album`,
    albumImageUrl: `${SPOTIFY}.player.albumImageUrl`,
    isPlaying: `${SPOTIFY}.player.isPlaying`,
    deviceName: `${SPOTIFY}.player.device.name`,
    deviceId: `${SPOTIFY}.player.device.id`, // NEU
    volume: `${SPOTIFY}.player.volume`,
    deviceListIds: `${SPOTIFY}.devices.deviceListIds`,
    deviceListString: `${SPOTIFY}.devices.deviceListString`,
} as const

const COMMAND_IDS = {
    play: `${SPOTIFY}.player.play`,
    pause: `${SPOTIFY}.player.pause`,
    next: `${SPOTIFY}.player.skipPlus`,
    prev: `${SPOTIFY}.player.skipMinus`,
} as const

type SpotifyPatch = Parameters<typeof updateSpotifyState>[0]
type IoBrokerState = { val: unknown } | null | undefined

/**
 * Ordnet jeder State-ID zu, wie der Wert in den Redux-Store geschrieben wird.
 * Wird sowohl für den initialen Load als auch für stateChange-Events genutzt.
 */
const stateHandlers: Record<string, (val: unknown) => SpotifyPatch> = {
    [IDS.trackName]: (val) => ({ trackName: String(val ?? '') }),
    [IDS.artistName]: (val) => ({ artist: String(val ?? '') }),
    [IDS.album]: (val) => ({ album: String(val ?? '') }),
    [IDS.albumImageUrl]: (val) => ({ imageUrl: String(val ?? '') }),
    [IDS.isPlaying]: (val) => ({ isPlaying: Boolean(val) }),
    [IDS.deviceName]: (val) => ({ currentDevice: String(val ?? '') }),
    [IDS.deviceId]: (val) => ({ currentDeviceId: String(val ?? '') }), // NEU
    [IDS.volume]: (val) => ({ volume: toNumber(val, 50) }),
}

const subscribedIds = [...Object.keys(stateHandlers), IDS.deviceListIds, IDS.deviceListString]

let socket: Socket | null = null
let deviceReloadTimer: ReturnType<typeof setTimeout> | undefined

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNumber(value: unknown, fallback: number): number {
    const num = Number(value)
    return value === null || value === undefined || Number.isNaN(num) ? fallback : num
}

function parseList(value: unknown): string[] {
    if (value === null || value === undefined) {
        return []
    }

    return String(value)
        .split(';')
        .map((entry) => entry.trim())
        .filter(Boolean)
}

function createDeviceList(ids: unknown, names: unknown): SpotifyDevice[] {
    const nameList = parseList(names)

    return parseList(ids).map((id, index) => ({
        id,
        name: nameList[index] ?? id,
    }))
}

/**
 * Generischer Wrapper für socket.emit mit ioBroker-Callback (error, result).
 */
function emit<T = void>(event: string, ...args: unknown[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if (!socket?.connected) {
            reject(new Error('ioBroker Socket nicht verbunden'))
            return
        }

        socket.emit(event, ...args, (error: unknown, result: T) => {
            if (error) {
                reject(error instanceof Error ? error : new Error(String(error)))
                return
            }

            resolve(result)
        })
    })
}

function getStates(ids: string[]): Promise<Record<string, IoBrokerState>> {
    return emit<Record<string, IoBrokerState> | undefined>('getStates', ids).then(
        (states) => states ?? {},
    )
}

function setState(id: string, value: unknown): Promise<void> {
    return emit('setState', id, value)
}

function subscribe(ids: string[]): Promise<void> {
    return emit('subscribe', ids)
}

function devicesFromStates(states: Record<string, IoBrokerState>): SpotifyDevice[] {
    return createDeviceList(states[IDS.deviceListIds]?.val, states[IDS.deviceListString]?.val)
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------

async function loadSpotifyState(): Promise<void> {
    const states = await getStates(subscribedIds)
    const patch: SpotifyPatch = {}

    for (const [id, handler] of Object.entries(stateHandlers)) {
        const state = states[id]

        if (state) {
            Object.assign(patch, handler(state.val))
        }
    }

    patch.deviceList = devicesFromStates(states)

    store.dispatch(updateSpotifyState(patch))
}

async function reloadDevices(): Promise<void> {
    try {
        const states = await getStates([IDS.deviceListIds, IDS.deviceListString])

        store.dispatch(updateSpotifyState({ deviceList: devicesFromStates(states) }))
    } catch (error) {
        console.error('[ioBroker] Fehler beim Lesen der Geräte:', error)
    }
}

/**
 * deviceListIds und deviceListString ändern sich meist gleichzeitig.
 * Das Debounce verhindert zwei Reloads hintereinander.
 */
function scheduleDeviceReload(): void {
    clearTimeout(deviceReloadTimer)
    deviceReloadTimer = setTimeout(() => void reloadDevices(), 100)
}

// ---------------------------------------------------------------------------
// Verbindung
// ---------------------------------------------------------------------------

export function initIoBrokerWebSocket(): void {
    // Auch während des Verbindungsaufbaus keinen zweiten Socket erzeugen

    if (!IS_IOBROKER_CONFIGURED || socket) {
        return
    }

    if (socket) {
        return
    }

    socket = io(IOBROKER_URL, {
        transports: ['websocket'],
    })

    socket.on('connect', async () => {
        console.log('[ioBroker] Socket verbunden:', socket?.id)

        try {
            await subscribe(subscribedIds)
            await loadSpotifyState()

            // Erst jetzt als "verbunden" markieren, damit die Karte
            // nicht kurz mit Default-Werten aufblitzt
            store.dispatch(setConnectionStatus(true))
        } catch (error) {
            console.error('[ioBroker] Subscribe/GetStates Fehler:', error)
            store.dispatch(setConnectionError(true))
        }
    })

    socket.on('disconnect', (reason: string) => {
        console.warn('[ioBroker] Socket getrennt:', reason)

        store.dispatch(setConnectionStatus(false))
        store.dispatch(setConnectionError(true))
    })

    socket.on('connect_error', (error: Error) => {
        console.error('[ioBroker] Socket-Verbindungsfehler:', error)

        store.dispatch(setConnectionStatus(false))
        store.dispatch(setConnectionError(true))
    })

    socket.on('stateChange', (id: string, state: IoBrokerState) => {
        if (!state) {
            return
        }

        if (id === IDS.deviceListIds || id === IDS.deviceListString) {
            scheduleDeviceReload()
            return
        }

        const handler = stateHandlers[id]

        if (handler) {
            store.dispatch(updateSpotifyState(handler(state.val)))
        }
    })
}

// ---------------------------------------------------------------------------
// Befehle
// ---------------------------------------------------------------------------

export async function switchSpotifyDevice(deviceId: string): Promise<void> {
    if (!deviceId) {
        return
    }

    try {
        await setState(`${SPOTIFY}.devices.${deviceId}.useForPlayback`, true)
    } catch (error) {
        console.error('[ioBroker] Fehler beim Umschalten:', error)
    }
}

export async function sendSpotifyCommand(command: keyof typeof COMMAND_IDS): Promise<void> {
    try {
        await setState(COMMAND_IDS[command], true)
    } catch (error) {
        console.error('[ioBroker] Fehler beim Spotify-Befehl:', error)
    }
}

export async function setSpotifyVolume(volume: number): Promise<void> {
    const value = Math.round(Math.max(0, Math.min(100, volume)))

    try {
        // Der Store wird bewusst NICHT direkt aktualisiert.
        // Das passiert erst über das stateChange-Event von ioBroker.
        await setState(IDS.volume, value)
    } catch (error) {
        console.error('[ioBroker] Fehler beim Setzen der Lautstärke:', error)
    }
}
