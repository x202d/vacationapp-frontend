import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useSettings } from '../../hooks/useSettings'

const SettingsSync = () => {
    const { i18n } = useTranslation()
    const { settings, isLoaded } = useSettings()

    useEffect(() => {
        if (!isLoaded) {
            return
        }

        if (i18n.language !== settings.language) {
            void i18n.changeLanguage(settings.language)
        }

        document.documentElement.lang = settings.language
    }, [isLoaded, settings.language, i18n])

    return null
}

export default SettingsSync
