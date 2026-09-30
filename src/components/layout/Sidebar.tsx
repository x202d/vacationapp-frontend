import {
    Box,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material'

import {
    Category,
    Check,
    Dashboard,
    Event,
    ExpandLess,
    ExpandMore,
    Map,
    PlusOne,
    Settings,
} from '@mui/icons-material'

import { useState } from 'react'
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

    const [templatesOpen, setTemplatesOpen] = useState(location.pathname.startsWith('/templates'))

    const [tripsOpen, setTripsOpen] = useState(location.pathname.startsWith('/trips'))

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
                    Jeane d'Arrrgh
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ px: 1, py: 1 }}>
                {/* Dashboard */}
                <ListItemButton
                    selected={location.pathname === '/'}
                    onClick={() => navigateTo('/')}
                >
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.dashboard')} />
                </ListItemButton>

                {/* Vorlagen */}
                <ListItemButton onClick={() => setTemplatesOpen((open) => !open)}>
                    <ListItemIcon>
                        <Map />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.templates')} />

                    {templatesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={templatesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4 }}
                            selected={location.pathname.startsWith('/templates/tour-types')}
                            onClick={() => navigateTo('/templates/tour-types')}
                        >
                            <ListItemIcon>
                                <Map />
                            </ListItemIcon>

                            <ListItemText primary={t('navigation.tourTypes')} />
                        </ListItemButton>

                        <ListItemButton
                            sx={{ pl: 4 }}
                            selected={location.pathname.startsWith('/templates/categories')}
                            onClick={() => navigateTo('/templates/categories')}
                        >
                            <ListItemIcon>
                                <Category />
                            </ListItemIcon>

                            <ListItemText primary={t('navigation.categories')} />
                        </ListItemButton>

                        <ListItemButton
                            sx={{ pl: 4 }}
                            selected={location.pathname.startsWith('/templates/items')}
                            onClick={() => navigateTo('/templates/items')}
                        >
                            <ListItemIcon>
                                <Check />
                            </ListItemIcon>

                            <ListItemText primary={t('navigation.items')} />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Geplante Ausflüge */}
                <ListItemButton onClick={() => setTripsOpen((open) => !open)}>
                    <ListItemIcon>
                        <Event />
                    </ListItemIcon>

                    <ListItemText primary={t('navigation.plannedTrips')} />

                    {tripsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={tripsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4 }}
                            selected={location.pathname.endsWith('wizard')}
                            onClick={() => navigateTo('/events/wizard')}
                        >
                            <ListItemIcon>
                                <PlusOne />
                            </ListItemIcon>

                            <ListItemText primary={t('navigation.create')} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4 }}
                            selected={location.pathname.endsWith('/events')}
                            onClick={() => navigateTo('/events')}
                        >
                            <ListItemIcon>
                                <Event />
                            </ListItemIcon>

                            <ListItemText primary={t('navigation.trips')} />
                        </ListItemButton>
                    </List>
                </Collapse>
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
