import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material'

import AirIcon from '@mui/icons-material/Air'
import CloudIcon from '@mui/icons-material/Cloud'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import UmbrellaIcon from '@mui/icons-material/Umbrella'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'

import { useGetSettingsQuery } from '../../stores/settings/SettingsApi.ts'

const REFRESH_INTERVAL_MS = 15 * 60 * 1000

type LocationSource = 'settings' | 'browser' | 'ip'

interface Location {
    lat: number
    lon: number
    name: string
    source: LocationSource
}

interface CurrentWeather {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
}

/* ---------- Helfer ---------- */

async function geocode(name: string, signal: AbortSignal): Promise<Location> {
    const url =
        'https://geocoding-api.open-meteo.com/v1/search' +
        `?name=${encodeURIComponent(name)}&count=1&language=de`
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error('geocoding failed')

    const data = await res.json()
    const hit = data.results?.[0]
    if (!hit) throw new Error('location not found')

    return { lat: hit.latitude, lon: hit.longitude, name: hit.name, source: 'settings' }
}

async function locateByIp(signal: AbortSignal): Promise<Location> {
    const res = await fetch('https://ipapi.co/json/', { signal })
    if (!res.ok) throw new Error('ip lookup failed')

    const d = await res.json()
    if (d.latitude == null || d.longitude == null) throw new Error('ip lookup empty')

    return { lat: d.latitude, lon: d.longitude, name: d.city ?? '', source: 'ip' }
}

function locateByBrowser(): Promise<Location> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('geolocation not supported'))
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    name: '',
                    source: 'browser',
                }),
            reject,
            { timeout: 8000, maximumAge: 10 * 60 * 1000 },
        )
    })
}

async function fetchWeather(loc: Location, signal: AbortSignal): Promise<CurrentWeather> {
    const url =
        'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${loc.lat}&longitude=${loc.lon}` +
        '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code' +
        '&timezone=auto'
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error('weather failed')

    return (await res.json()).current
}

/** WMO-Wettercodes → Icon + Text */
function describeWeather(code: number) {
    if (code === 0) return { icon: <WbSunnyIcon fontSize="inherit" />, text: 'Klar' }
    if (code <= 3) return { icon: <CloudIcon fontSize="inherit" />, text: 'Bewölkt' }
    if (code <= 48) return { icon: <CloudIcon fontSize="inherit" />, text: 'Nebel' }
    if (code <= 67) return { icon: <UmbrellaIcon fontSize="inherit" />, text: 'Regen' }
    if (code <= 77) return { icon: <AcUnitIcon fontSize="inherit" />, text: 'Schnee' }
    if (code <= 82) return { icon: <UmbrellaIcon fontSize="inherit" />, text: 'Schauer' }
    if (code <= 86) return { icon: <AcUnitIcon fontSize="inherit" />, text: 'Schneeschauer' }
    return { icon: <ThunderstormIcon fontSize="inherit" />, text: 'Gewitter' }
}

/* ---------- Karte ---------- */

export default function WeatherCard() {
    const { t } = useTranslation()

    const { data: settings, isLoading: settingsLoading } = useGetSettingsQuery()
    const configuredLocation =
        settings?.find((setting) => setting.key === 'location')?.value.trim() ?? ''

    // Vom Nutzer per Button gewählter Browser-Standort (überschreibt IP-Fallback)
    const [browserLocation, setBrowserLocation] = useState<Location | null>(null)

    const [location, setLocation] = useState<Location | null>(null)
    const [weather, setWeather] = useState<CurrentWeather | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // 1) Standort bestimmen: Einstellung → Browser (falls per Button gewählt) → IP
    useEffect(() => {
        if (settingsLoading) return

        const controller = new AbortController()

        const resolve = async () => {
            setError(null)
            try {
                if (configuredLocation) {
                    setLocation(await geocode(configuredLocation, controller.signal))
                } else if (browserLocation) {
                    setLocation(browserLocation)
                } else {
                    setLocation(await locateByIp(controller.signal))
                }
            } catch (err) {
                if (controller.signal.aborted) return
                console.error(err)
                setLocation(null)
                setLoading(false)
                setError(
                    configuredLocation
                        ? `Ort "${configuredLocation}" wurde nicht gefunden.`
                        : 'Standort konnte nicht ermittelt werden. Bitte in den Einstellungen festlegen.',
                )
            }
        }

        void resolve()
        return () => controller.abort()
    }, [settingsLoading, configuredLocation, browserLocation])

    // 2) Wetter laden und alle 15 Minuten aktualisieren
    useEffect(() => {
        if (!location) return

        const controller = new AbortController()

        const load = async () => {
            try {
                setWeather(await fetchWeather(location, controller.signal))
                setError(null)
            } catch (err) {
                if (controller.signal.aborted) return
                console.error(err)
                setError('Wetterdaten konnten nicht geladen werden.')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        setLoading(true)
        void load()
        const interval = setInterval(() => void load(), REFRESH_INTERVAL_MS)

        return () => {
            controller.abort()
            clearInterval(interval)
        }
    }, [location])

    const handleUseBrowserLocation = useCallback(async () => {
        try {
            setBrowserLocation(await locateByBrowser())
        } catch {
            setError('Zugriff auf den Standort wurde verweigert.')
        }
    }, [])

    const info = weather ? describeWeather(weather.weather_code) : null

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('dashboard.weather.title', 'Wetter')}
                    {location?.name ? ` – ${location.name}` : ''}
                </Typography>

                {loading && !weather ? (
                    <Box display="flex" justifyContent="center" py={3}>
                        <CircularProgress size={28} />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {weather && info && (
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{ fontSize: 64, display: 'flex', color: 'primary.main' }}>
                                    {info.icon}
                                </Box>

                                <Box>
                                    <Typography variant="h3" component="p">
                                        {Math.round(weather.temperature_2m)}°C
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {info.text} · gefühlt{' '}
                                        {Math.round(weather.apparent_temperature)}°C
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        {weather && (
                            <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <AirIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                        {Math.round(weather.wind_speed_10m)} km/h
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <WaterDropIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                        {weather.relative_humidity_2m} %
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}

                        {location && location.source !== 'settings' && (
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    {location.source === 'ip'
                                        ? 'Ungefährer Standort (anhand der IP). Du kannst ihn in den Einstellungen festlegen.'
                                        : 'Standort deines Geräts.'}
                                </Typography>

                                {location.source === 'ip' && (
                                    <Button
                                        size="small"
                                        startIcon={<MyLocationIcon />}
                                        onClick={() => void handleUseBrowserLocation()}
                                        sx={{ mt: 0.5 }}
                                    >
                                        Genauen Standort verwenden
                                    </Button>
                                )}
                            </Box>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
