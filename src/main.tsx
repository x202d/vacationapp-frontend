import React, { useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { Provider } from 'react-redux'

import App from './App'
import { store } from './app/store'
import { useAppSelector } from './stores/hooks'
import { createAppTheme } from './theme/theme'

import i18n from './i18n/i18n'

function AppProviders() {
    const themeMode = useAppSelector(
        (state) => state.settings.theme,
    )

    const language = useAppSelector(
        (state) => state.settings.language,
    )

    const theme = useMemo(
        () => createAppTheme(themeMode),
        [themeMode],
    )

    useEffect(() => {
        i18n.changeLanguage(language)
    }, [language])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    )
}

ReactDOM.createRoot(
    document.getElementById('root')!,
).render(
    <React.StrictMode>
        <Provider store={store}>
            <AppProviders />
        </Provider>
    </React.StrictMode>,
)