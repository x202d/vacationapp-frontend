import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material'

import {
    type Setting,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} from '../../stores/settings/SettingsApi'

const SettingInput = ({
    setting,
    value,
    onChange,
}: {
    setting: Setting
    value: string
    onChange: (value: string) => void
}) => {
    const common = {
        size: 'small' as const,
        label: setting.label,
        helperText: setting.description ?? undefined,
        value,
    }

    switch (setting.type) {
        case 'bool':
            return (
                <FormControlLabel
                    label={setting.label}
                    control={
                        <Switch
                            checked={value === '1'}
                            onChange={(event) => onChange(event.target.checked ? '1' : '0')}
                        />
                    }
                />
            )

        case 'select':
            return (
                <TextField {...common} select onChange={(e) => onChange(e.target.value)}>
                    {(setting.options?.choices ?? []).map((choice) => (
                        <MenuItem key={choice} value={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </TextField>
            )

        case 'int':
            return (
                <TextField
                    {...common}
                    type="number"
                    slotProps={{
                        htmlInput: { min: setting.options?.min, max: setting.options?.max },
                    }}
                    onChange={(e) => onChange(e.target.value)}
                />
            )

        case 'text':
            return (
                <TextField
                    {...common}
                    multiline
                    minRows={3}
                    onChange={(e) => onChange(e.target.value)}
                />
            )

        default:
            return <TextField {...common} onChange={(e) => onChange(e.target.value)} />
    }
}

const SettingsForm = ({ settings }: { settings: Setting[] }) => {
    const { t } = useTranslation()
    const [updateSettings, { isLoading }] = useUpdateSettingsMutation()

    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(settings.map((s) => [s.key, s.value])),
    )
    const [message, setMessage] = useState<'success' | 'error' | null>(null)

    const handleSave = async (): Promise<void> => {
        // Nur geänderte Werte senden
        const changed = Object.fromEntries(
            settings.filter((s) => values[s.key] !== s.value).map((s) => [s.key, values[s.key]]),
        )

        if (Object.keys(changed).length === 0) {
            return
        }

        try {
            await updateSettings(changed).unwrap()
            setMessage('success')
        } catch {
            setMessage('error')
        }
    }

    return (
        <>
            <Card sx={{ maxWidth: 600 }}>
                <CardContent>
                    <Stack spacing={2}>
                        {settings.map((setting) => (
                            <SettingInput
                                key={setting.key}
                                setting={setting}
                                value={values[setting.key] ?? ''}
                                onChange={(value) =>
                                    setValues((prev) => ({ ...prev, [setting.key]: value }))
                                }
                            />
                        ))}

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={isLoading}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {t('settings.save')}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={message !== null}
                autoHideDuration={4000}
                onClose={() => setMessage(null)}
            >
                <Alert severity={message ?? 'success'} onClose={() => setMessage(null)}>
                    {message === 'error' ? t('settings.error') : t('settings.saved')}
                </Alert>
            </Snackbar>
        </>
    )
}

const SettingsPage = () => {
    const { t } = useTranslation()
    const { data, isLoading, isError } = useGetSettingsQuery()

    return (
        <Stack spacing={3}>
            <Typography variant="h4" component="h1">
                {t('settings.title')}
            </Typography>

            {isLoading && <CircularProgress />}
            {isError && <Alert severity="error">{t('settings.error')}</Alert>}
            {data && <SettingsForm settings={data} />}
        </Stack>
    )
}

export default SettingsPage
