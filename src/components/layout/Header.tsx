import {
    AppBar,
    Box,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'

import { DarkMode, LightMode, Menu } from '@mui/icons-material'

import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../stores/hooks.ts'

import { setLanguage, toggleTheme } from '../../stores/settings/settingsSlice.ts'

interface HeaderProps {
    drawerWidth: number
    onMenuClick: () => void
    showMenuButton: boolean
}

export default function Header({ drawerWidth, onMenuClick, showMenuButton }: HeaderProps) {
    const { t, i18n } = useTranslation()

    const dispatch = useAppDispatch()

    const theme = useAppSelector((state) => state.settings.theme)

    const language = useAppSelector((state) => state.settings.language)

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value as 'de' | 'en'

        dispatch(setLanguage(value))
        i18n.changeLanguage(value)
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
                        <Menu />
                    </IconButton>
                )}

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 600,
                    }}
                >
                    Holiday Planner
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
                </Box>
            </Toolbar>
        </AppBar>
    )
}
