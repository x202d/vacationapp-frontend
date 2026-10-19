import type { ReactNode } from 'react'
import {
    AdminPanelSettings as AdminIcon,
    Category as CategoryIcon,
    Check as CheckIcon,
    Dashboard as DashboardIcon,
    Event as EventIcon,
    EventNote as PlanningIcon,
    Extension as ExampleIcon,
    Map as MapIcon,
    PlusOne as PlusOneIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material'

export interface NavLink {
    type: 'link'
    key: string
    labelKey: string
    icon: ReactNode
    path: string
    /** Überschreibt die Standardprüfung (Pfad beginnt mit `path`). */
    isActive?: (pathname: string) => boolean
    disabled?: boolean
}

export interface NavGroup {
    type: 'group'
    /** Muss im gesamten Menü eindeutig sein (wird für den Auf-/Zu-Zustand genutzt). */
    key: string
    labelKey: string
    icon: ReactNode
    children: NavNode[]
}

export type NavNode = NavLink | NavGroup

export const isLinkActive = (link: NavLink, pathname: string): boolean => {
    if (link.disabled) {
        return false
    }

    if (link.isActive) {
        return link.isActive(pathname)
    }

    return link.path === '/' ? pathname === '/' : pathname.startsWith(link.path)
}

export const containsActive = (node: NavNode, pathname: string): boolean =>
    node.type === 'link'
        ? isLinkActive(node, pathname)
        : node.children.some((child) => containsActive(child, pathname))

/**
 * Hauptmenü. Neue Einträge kommen einfach in das passende `children`-Array,
 * die Sidebar rendert beliebig tief verschachtelte Gruppen.
 */
export const mainNavigation: NavNode[] = [
    {
        type: 'link',
        key: 'dashboard',
        labelKey: 'navigation.dashboard',
        icon: <DashboardIcon />,
        path: '/',
    },
    {
        type: 'group',
        key: 'planning',
        labelKey: 'navigation.planning',
        icon: <PlanningIcon />,
        children: [
            {
                type: 'group',
                key: 'templates',
                labelKey: 'navigation.templates',
                icon: <MapIcon />,
                children: [
                    {
                        type: 'link',
                        key: 'tour-types',
                        labelKey: 'navigation.tourTypes',
                        icon: <MapIcon />,
                        path: '/templates/tour-types',
                    },
                    {
                        type: 'link',
                        key: 'categories',
                        labelKey: 'navigation.categories',
                        icon: <CategoryIcon />,
                        path: '/templates/categories',
                    },
                    {
                        type: 'link',
                        key: 'items',
                        labelKey: 'navigation.items',
                        icon: <CheckIcon />,
                        path: '/templates/items',
                    },
                ],
            },
            {
                type: 'group',
                key: 'trips',
                labelKey: 'navigation.plannedTrips',
                icon: <EventIcon />,
                children: [
                    {
                        type: 'link',
                        key: 'trip-create',
                        labelKey: 'navigation.create',
                        icon: <PlusOneIcon />,
                        path: '/events/wizard',
                    },
                    {
                        type: 'link',
                        key: 'trip-list',
                        labelKey: 'navigation.trips',
                        icon: <EventIcon />,
                        path: '/events',
                        // Auch Detailseiten (/events/:id) gehören zu "Ausflüge", der Wizard nicht
                        isActive: (pathname) =>
                            pathname.startsWith('/events') &&
                            !pathname.startsWith('/events/wizard'),
                    },
                ],
            },
        ],
    },
    {
        // Beispielgruppe für spätere Einträge: Platzhalter ersetzen oder ergänzen
        type: 'group',
        key: 'administration',
        labelKey: 'navigation.administration',
        icon: <AdminIcon />,
        children: [
            {
                type: 'link',
                key: 'example',
                labelKey: 'navigation.example',
                icon: <ExampleIcon />,
                path: '/example',
                disabled: true,
            },
        ],
    },
]

/** Unterer Bereich, bleibt am Boden der Sidebar. */
export const bottomNavigation: NavNode[] = [
    {
        type: 'link',
        key: 'settings',
        labelKey: 'navigation.settings',
        icon: <SettingsIcon />,
        path: '/settings',
    },
]
