import { useTranslation } from 'react-i18next'
import { Stack, TextField, Typography } from '@mui/material'

interface DateStepProps {
    startDate: string
    endDate: string
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
}

export default function DateStep({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: DateStepProps) {
    const { t } = useTranslation()

    const isEndDateInvalid = Boolean(startDate && endDate && endDate < startDate)

    return (
        <Stack spacing={3}>
            <Typography variant="h6">{t('events.wizard.date.title')}</Typography>

            <Typography variant="body2" color="text.secondary">
                {t('events.wizard.date.description')}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    label={t('events.wizard.date.startDate')}
                    type="date"
                    value={startDate}
                    onChange={(event) => onStartDateChange(event.target.value)}
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    label={t('events.wizard.date.endDate')}
                    type="date"
                    value={endDate}
                    onChange={(event) => onEndDateChange(event.target.value)}
                    fullWidth
                    error={isEndDateInvalid}
                    helperText={
                        isEndDateInvalid
                            ? t('events.wizard.date.endDateInvalid')
                            : t('events.wizard.date.endDateOptional')
                    }
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />
            </Stack>
        </Stack>
    )
}
