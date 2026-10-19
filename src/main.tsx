import ReactDOM from 'react-dom/client'
import React, { useEffect, useMemo } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { Provider } from 'react-redux'

import App from './App'
import { store } from './stores/store.ts'
import { useAppSelector } from './stores/hooks'

import i18n from './i18n/i18n'
import { createTheme } from '@mui/material/styles'
import { useSetting } from './hooks/useSettings.ts'

function AppProviders() {
    const language = useAppSelector((state) => state.settings.language)

    const layout = useSetting('layout')

    const theme = useMemo(() => createTheme({ palette: { mode: layout } }), [layout])

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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <AppProviders />
        </Provider>
    </React.StrictMode>,
)
