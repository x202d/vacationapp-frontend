import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountCircle, DarkMode, LightMode, Logout, Menu as MenuIcon } from '@mui/icons-material'
import {
    AppBar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Select,
    SelectChangeEvent,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'

import { logout } from '../../stores/auth/authSlice'
import { useLogoutMutation } from '../../stores/auth/AuthApi'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { setLanguage, toggleTheme } from '../../stores/settings/settingsSlice'

interface HeaderProps {
    drawerWidth: number
    onMenuClick: () => void
    showMenuButton: boolean
}

export default function Header({ drawerWidth, onMenuClick, showMenuButton }: HeaderProps) {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const theme = useAppSelector((state) => state.settings.theme)
    const language = useAppSelector((state) => state.settings.language)
    const user = useAppSelector((state) => state.auth.user)

    const [logoutRequest] = useLogoutMutation()

    const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null)

    const accountMenuOpen = Boolean(accountMenuAnchor)

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value as 'de' | 'en'

        dispatch(setLanguage(value))
        i18n.changeLanguage(value)
    }

    const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAccountMenuAnchor(event.currentTarget)
    }

    const handleAccountMenuClose = () => {
        setAccountMenuAnchor(null)
    }

    const handleLogout = async () => {
        handleAccountMenuClose()

        try {
            await logoutRequest().unwrap()
        } finally {
            dispatch(logout())
            navigate('/login', { replace: true })
        }
    }

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: {
                    md: `calc(100% - ${drawerWidth}px)`,
                },
                ml: {
                    md: `${drawerWidth}px`,
                },
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                color: 'text.primary',
            }}
        >
            <Toolbar>
                {showMenuButton && (
                    <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 600,
                    }}
                >
                    {user?.username ?? 'VacationApp'}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Select
                        size="small"
                        value={language}
                        onChange={handleLanguageChange}
                        variant="outlined"
                        sx={{
                            minWidth: 70,
                        }}
                        aria-label={t('common.language')}
                    >
                        <MenuItem value="de">DE</MenuItem>
                        <MenuItem value="en">EN</MenuItem>
                    </Select>

                    <Tooltip title={t('common.toggleTheme')}>
                        <IconButton onClick={() => dispatch(toggleTheme())}>
                            {theme === 'dark' ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={user?.username ?? 'Account'}>
                        <IconButton onClick={handleAccountMenuOpen}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={accountMenuAnchor}
                        open={accountMenuOpen}
                        onClose={handleAccountMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <Logout fontSize="small" sx={{ mr: 1 }} />
                            Abmelden
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
