import { useTranslation } from 'react-i18next'
import { Stack, Typography } from '@mui/material'
import UpcomingEventsCard from '../components/dashboard/UpcomingEventsCard'

export default function DashboardPage() {
    const { t } = useTranslation()

    return (
        <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {t('dashboard.title')}
            </Typography>

            <UpcomingEventsCard />
        </Stack>
    )
}
