import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography,
} from '@mui/material'

import PauseIcon from '@mui/icons-material/Pause'
import DevicesIcon from '@mui/icons-material/Devices'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'

import { useSelector } from 'react-redux'

import type { RootState } from '../../stores/store'

import { useTranslation } from 'react-i18next'
import {
    sendSpotifyCommand,
    setSpotifyVolume,
    switchSpotifyDevice,
} from '../../services/iobrokerSocket'

const OPTIMISTIC_TIMEOUT_MS = 5000

/**
 * Zeigt `pending` an, bis sich der echte Wert (`actual`) ändert
 * oder das Timeout abläuft (falls iobroker nicht antwortet).
 */
function useOptimisticValue<T>(actual: T, timeoutMs = OPTIMISTIC_TIMEOUT_MS) {
    const [pending, setPending] = useState<{ value: T } | null>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    // Echter Wert ist da -> optimistischen Wert verwerfen
    useEffect(() => {
        setPending(null)
        clearTimeout(timerRef.current)
    }, [actual])

    useEffect(() => () => clearTimeout(timerRef.current), [])

    const setOptimistic = useCallback(
        (value: T) => {
            setPending({ value })
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setPending(null), timeoutMs)
        },
        [timeoutMs],
    )

    return [pending ? pending.value : actual, setOptimistic] as const
}

export const SpotifyCard: React.FC = () => {
    const { t } = useTranslation()

    const { trackName, artist, album, imageUrl, isPlaying, currentDeviceId, volume, deviceList } =
        useSelector((state: RootState) => state.iobroker)

    const actualDeviceId = deviceList.some((device) => device.id === currentDeviceId)
        ? currentDeviceId
        : ''

    const [displayDeviceId, setOptimisticDevice] = useOptimisticValue<string>(actualDeviceId)
    const [displayVolume, setOptimisticVolume] = useOptimisticValue<number>(volume ?? 50)
    const [displayPlaying, setOptimisticPlaying] = useOptimisticValue<boolean>(!!isPlaying)

    // Während des Ziehens nur lokal anzeigen, gesendet wird erst beim Loslassen
    const [dragVolume, setDragVolume] = useState<number | null>(null)
    const sliderValue = dragVolume ?? displayVolume

    return (
        <Card sx={{ maxWidth: 600, p: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                        src={imageUrl || undefined}
                        variant="rounded"
                        sx={{ width: 80, height: 80 }}
                    >
                        {!imageUrl && '🎵'}
                    </Avatar>

                    <Box overflow="hidden">
                        <Typography variant="h6" noWrap>
                            {trackName || t('dashboard.spotify.noTrackName')}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" noWrap>
                            {artist || t('dashboard.spotify.noArtist')}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" noWrap>
                            {album}
                        </Typography>
                    </Box>
                </Box>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="spotify-device-select-label" shrink></InputLabel>

                    <Select
                        labelId="spotify-device-select-label"
                        id="spotify-device-select"
                        value={displayDeviceId}
                        label={t('dashboard.spotify.playingDevice')}
                        displayEmpty
                        notched
                        onChange={(event) => {
                            const id = event.target.value
                            setOptimisticDevice(id)
                            void switchSpotifyDevice(id)
                        }}
                        renderValue={(value) => {
                            const device = deviceList.find((item) => item.id === value)
                            return device?.name ?? t('dashboard.spotify.choosePlayingDevice')
                        }}
                        startAdornment={
                            <DevicesIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                        }
                    >
                        {deviceList.length > 0 ? (
                            deviceList.map((device) => (
                                <MenuItem key={device.id} value={device.id}>
                                    {device.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="" disabled>
                                {t('dashboard.spotify.noPlayingDeviceAvailable')}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={2}>
                    <IconButton onClick={() => sendSpotifyCommand('prev')}>
                        <SkipPreviousIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            const next = !displayPlaying
                            setOptimisticPlaying(next)
                            sendSpotifyCommand(next ? 'play' : 'pause')
                        }}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        {displayPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>

                    <IconButton onClick={() => sendSpotifyCommand('next')}>
                        <SkipNextIcon />
                    </IconButton>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <VolumeDownIcon color="action" />

                    <Slider
                        value={sliderValue}
                        min={0}
                        max={100}
                        onChange={(_event, value) => setDragVolume(value as number)}
                        onChangeCommitted={(_event, value) => {
                            const v = value as number
                            setDragVolume(null)
                            setOptimisticVolume(v)
                            setSpotifyVolume(v)
                        }}
                        aria-label="Volume"
                    />

                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: '30px' }}>
                        {sliderValue}%
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
