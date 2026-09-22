import {
    Card,
    CardContent,
    Typography,
} from '@mui/material'

import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
    const { t } = useTranslation()

    return (
        <>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                }}
            >
                {t('dashboard.title')}
            </Typography>

            <Card>
                <CardContent>
                    <Typography>
                        {t(
                            'dashboard.welcome',
                        )}
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}