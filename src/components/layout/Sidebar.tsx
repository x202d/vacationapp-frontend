import { useTranslation } from 'react-i18next'
import type { Theme } from '@mui/material/styles'
import { useLocation, useNavigate } from 'react-router-dom'
import { Fragment, useState, type ReactElement, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material'
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'

import { SIDEBAR_WIDTH } from '../../hooks/useSidebarCollapsed'
import {
    bottomNavigation,
    containsActive,
    isLinkActive,
    mainNavigation,
    type NavNode,
} from './navigation'

interface SidebarProps {
    /** Aktuelle Breite der Desktop-Sidebar (ausgeklappt oder eingeklappt). */
    drawerWidth: number
    collapsed: boolean
    onToggleCollapsed: () => void
    mobileOpen: boolean
    onMobileClose: () => void
    isMobile: boolean
}

const widthTransition = (theme: Theme): string =>
    theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
    })

/** Gruppen, die die aktuelle Seite enthalten, starten aufgeklappt. */
const collectOpenGroups = (
    nodes: NavNode[],
    pathname: string,
    result: Record<string, boolean> = {},
): Record<string, boolean> => {
    for (const node of nodes) {
        if (node.type === 'group') {
            if (containsActive(node, pathname)) {
                result[node.key] = true
            }

            collectOpenGroups(node.children, pathname, result)
        }
    }

    return result
}

export default function Sidebar({
    drawerWidth,
    collapsed,
    onToggleCollapsed,
    mobileOpen,
    onMobileClose,
    isMobile,
}: SidebarProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    // Das mobile Menü ist immer ausgeklappt
    const mini = collapsed && !isMobile

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        collectOpenGroups([...mainNavigation, ...bottomNavigation], pathname),
    )

    const navigateTo = (path: string) => {
        navigate(path)

        if (isMobile) {
            onMobileClose()
        }
    }

    const handleGroupClick = (key: string) => {
        if (mini) {
            // Eingeklappt gibt es keine Untermenüs: Sidebar öffnen und Gruppe aufklappen
            onToggleCollapsed()
            setOpenGroups((previous) => ({ ...previous, [key]: true }))
            return
        }

        setOpenGroups((previous) => ({ ...previous, [key]: !previous[key] }))
    }

    const withTooltip = (label: string, child: ReactElement): ReactElement =>
        mini ? (
            <Tooltip title={label} placement="right">
                {/* span, damit auch deaktivierte Buttons einen Tooltip bekommen */}
                <span style={{ display: 'block' }}>{child}</span>
            </Tooltip>
        ) : (
            child
        )

    const itemSx = (depth: number) =>
        mini ? { justifyContent: 'center', px: 1.5 } : { pl: 2 + depth * 2 }

    const iconSx = (depth: number) =>
        mini ? { minWidth: 0, justifyContent: 'center' } : { minWidth: depth > 0 ? 40 : 56 }

    const renderNodes = (nodes: NavNode[], depth: number): ReactNode =>
        nodes.map((node) => <Fragment key={node.key}>{renderNode(node, depth)}</Fragment>)

    const renderNode = (node: NavNode, depth: number): ReactNode => {
        const label = t(node.labelKey)

        if (node.type === 'link') {
            return withTooltip(
                label,
                <ListItemButton
                    disabled={node.disabled}
                    selected={isLinkActive(node, pathname)}
                    onClick={() => navigateTo(node.path)}
                    sx={itemSx(depth)}
                >
                    <ListItemIcon sx={iconSx(depth)}>{node.icon}</ListItemIcon>

                    {!mini && <ListItemText primary={label} />}
                </ListItemButton>,
            )
        }

        const open = openGroups[node.key] ?? false
        const active = containsActive(node, pathname)

        return (
            <>
                {withTooltip(
                    label,
                    <ListItemButton onClick={() => handleGroupClick(node.key)} sx={itemSx(depth)}>
                        <ListItemIcon
                            sx={{
                                ...iconSx(depth),
                                color: mini && active ? 'primary.main' : undefined,
                            }}
                        >
                            {node.icon}
                        </ListItemIcon>

                        {!mini && (
                            <>
                                <ListItemText primary={label} />

                                {open ? <ExpandLess /> : <ExpandMore />}
                            </>
                        )}
                    </ListItemButton>,
                )}

                {!mini && (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {renderNodes(node.children, depth + 1)}
                        </List>
                    </Collapse>
                )}
            </>
        )
    }

    const content = (
        <>
            <Toolbar
                sx={{
                    justifyContent: mini ? 'center' : 'space-between',
                    px: mini ? 1 : 2,
                }}
            >
                {!mini && (
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                        Jeane d'Arrrgh
                    </Typography>
                )}

                {!isMobile && (
                    <Tooltip
                        title={t(collapsed ? 'navigation.expand' : 'navigation.collapse')}
                        placement="right"
                    >
                        <IconButton
                            size="small"
                            onClick={onToggleCollapsed}
                            aria-label={t(collapsed ? 'navigation.expand' : 'navigation.collapse')}
                        >
                            {collapsed ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>

            <Divider />

            <List sx={{ px: 1, py: 1 }}>{renderNodes(mainNavigation, 0)}</List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider />

            <List sx={{ px: 1, py: 1 }}>{renderNodes(bottomNavigation, 0)}</List>
        </>
    )

    const body = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {content}
        </Box>
    )

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {body}
            </Drawer>
        )
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: widthTransition,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: widthTransition,
                },
            }}
        >
            {body}
        </Drawer>
    )
}
