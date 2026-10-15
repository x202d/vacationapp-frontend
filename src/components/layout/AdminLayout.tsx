import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import Header from './Header'
import Sidebar from './Sidebar'
import BuildInfo from '../common/BuildInfo'
import { initIoBrokerWebSocket } from '../../services/iobrokerSocket.ts'

const DRAWER_WIDTH = 260

export default function AdminLayout() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        // Socket-Verbindung beim Start der Admin-Oberfläche initialisieren
        initIoBrokerWebSocket()
    }, [])

    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen((open) => !open)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <Header
                drawerWidth={DRAWER_WIDTH}
                onMenuClick={handleDrawerToggle}
                showMenuButton={isMobile}
            />

            <Sidebar
                drawerWidth={DRAWER_WIDTH}
                mobileOpen={mobileOpen}
                onMobileClose={handleDrawerToggle}
                isMobile={isMobile}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    pt: { xs: 8, md: 8 },
                }}
            >
                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            <BuildInfo />
        </Box>
    )
}
