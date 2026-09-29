import { useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import { useAppDispatch } from '../../stores/hooks'
import { useLoginMutation } from '../../stores/auth/AuthApi'
import { setCredentials } from '../../stores/auth/authSlice'

export default function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [login, { isLoading }] = useLoginMutation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError(null)

        try {
            const result = await login({
                username,
                password,
            }).unwrap()

            if (result.requiresTwoFactor) {
                setError('Zwei-Faktor-Authentifizierung wird derzeit noch nicht unterstützt.')
                return
            }

            dispatch(
                setCredentials({
                    token: result.token,
                    user: result.user,
                }),
            )

            navigate('/', { replace: true })
        } catch {
            setError('Benutzername oder Passwort ist ungültig.')
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: 4,
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Anmeldung
                        </Typography>

                        <Typography color="text.secondary">
                            Melde dich an, um fortzufahren.
                        </Typography>
                    </Box>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Benutzername"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="username"
                                autoFocus
                                fullWidth
                                required
                            />

                            <TextField
                                label="Passwort"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                fullWidth
                                required
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                fullWidth
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Anmelden'}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    )
}
