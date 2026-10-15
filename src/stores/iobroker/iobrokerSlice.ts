import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SpotifyDevice {
    id: string
    name: string
}

export interface IoBrokerSliceState {
    trackName: string
    artist: string
    album: string
    imageUrl: string
    isPlaying: boolean
    currentDevice: string
    currentDeviceId: string
    isConnected: boolean
    deviceList: SpotifyDevice[]
    volume: number
}

const initialState: IoBrokerSliceState = {
    trackName: 'Kein Titel',
    artist: 'Kein Interpret',
    album: '',
    imageUrl: '',
    isPlaying: false,
    currentDevice: '',
    currentDeviceId: '',
    isConnected: false,
    deviceList: [],
    volume: 50,
}

export const iobrokerSlice = createSlice({
    name: 'iobroker',
    initialState,
    reducers: {
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload
        },

        updateSpotifyState: (state, action: PayloadAction<Partial<IoBrokerSliceState>>) => {
            Object.assign(state, action.payload)
        },
    },
})

export const { setConnectionStatus, updateSpotifyState } = iobrokerSlice.actions

export default iobrokerSlice.reducer
