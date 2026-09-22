import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material'

import { Dashboard, Category, Map, Settings } from '@mui/icons-material'

import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
    drawerWidth: number
    mobileOpen: boolean
    onMobileClose: () => void
    isMobile: boolean
}

export default function Sidebar({
    drawerWidth,
    mobileOpen,
    onMobileClose,
    isMobile,
}: SidebarProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const navigateTo = (path: string) => {
        navigate(path)

        if (isMobile) {
            onMobileClose()
        }
    }

    const content = (
        <>
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Holiday Planner
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ px: 1, py: 1 }}>
                <ListItemButton
                    selected={location.pathname === '/'}
                    onClick={() => navigateTo('/')}
                >
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.dashboard')} />
                </ListItemButton>

                <ListItemButton
                    selected={location.pathname.startsWith('/templates/tour-types')}
                    onClick={() => navigateTo('/templates/tour-types')}
                >
                    <ListItemIcon>
                        <Map />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.tourTypes')} />
                </ListItemButton>

                <ListItemButton
                    selected={location.pathname.startsWith('/templates/categories')}
                    onClick={() => navigateTo('/templates/categories')}
                >
                    <ListItemIcon>
                        <Category />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.categories')} />
                </ListItemButton>
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider />

            <List sx={{ px: 1, py: 1 }}>
                <ListItemButton>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.settings')} />
                </ListItemButton>
            </List>
        </>
    )

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {content}
                </Box>
            </Drawer>
        )
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {content}
            </Box>
        </Drawer>
    )
}
