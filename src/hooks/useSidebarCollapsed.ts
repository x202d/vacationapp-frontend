import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sidebar_collapsed'

export const SIDEBAR_WIDTH = 240
export const SIDEBAR_WIDTH_COLLAPSED = 68

const readInitial = (): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

export const useSidebarCollapsed = () => {
    const [collapsed, setCollapsed] = useState<boolean>(readInitial)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
        } catch {
            // Speichern ist nur ein Komfort, die Sidebar funktioniert auch ohne
        }
    }, [collapsed])

    const toggle = useCallback(() => setCollapsed((previous) => !previous), [])

    return {
        collapsed,
        toggle,
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
    }
}
