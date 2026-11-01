import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import WeatherCard from '../components/dashboard/WeatherCard.tsx'
import { SpotifyCard } from '../components/dashboard/SpotifyCard.tsx'
import UpcomingEventsCard from '../components/dashboard/UpcomingEventsCard'

export default function DashboardPage() {
    const { t } = useTranslation()

    return (
        <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {t('dashboard.title')}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 3,
                    alignItems: 'stretch',

                    // Karten füllen die Zelle und sind pro Zeile gleich hoch
                    '& > .MuiCard-root': {
                        height: '100%',
                        maxWidth: 'none',
                    },
                }}
            >
                <WeatherCard />
                <SpotifyCard />
                <UpcomingEventsCard />
            </Box>
        </Stack>
    )
}
