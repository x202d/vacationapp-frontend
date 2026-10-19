import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores/store.ts'
import { type Setting, useGetSettingsQuery } from '../stores/settings/SettingsApi'

export interface TypedSettings {
    reminder_days: number
    send_mails: boolean
    layout: 'light' | 'dark'
    items_per_page: number
    language: string
}

// Fallback, solange nichts geladen ist (oder der Request fehlschlägt)
const DEFAULTS: TypedSettings = {
    reminder_days: 7,
    send_mails: true,
    layout: 'light',
    items_per_page: 20,
    language: 'de',
}

const cast = (setting: Setting): string | number | boolean => {
    switch (setting.type) {
        case 'int':
            return Number(setting.value)
        case 'bool':
            return setting.value === '1'
        default:
            return setting.value
    }
}

export const useSettings = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    const { data, isLoading, isSuccess } = useGetSettingsQuery(undefined, {
        skip: !isAuthenticated,
    })

    const settings = useMemo(() => {
        const result: Record<string, unknown> = { ...DEFAULTS }

        for (const setting of data ?? []) {
            result[setting.key] = cast(setting)
        }

        return result as unknown as TypedSettings
    }, [data])

    return { settings, isLoading, isLoaded: isSuccess }
}

export const useSetting = <K extends keyof TypedSettings>(key: K): TypedSettings[K] =>
    useSettings().settings[key]
