import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'
export type Language = 'de' | 'en'

interface SettingsState {
    theme: ThemeMode
    language: Language
}

const getStoredTheme = (): ThemeMode => {
    const value = localStorage.getItem('theme')

    return value === 'dark' ? 'dark' : 'light'
}

const getStoredLanguage = (): Language => {
    const value = localStorage.getItem('language')

    return value === 'en' ? 'en' : 'de'
}

const initialState: SettingsState = {
    theme: getStoredTheme(),
    language: getStoredLanguage(),
}

const settingsSlice = createSlice({
    name: 'settings',

    initialState,

    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.theme = action.payload
            localStorage.setItem('theme', action.payload)
        },

        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', state.theme)
        },

        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload
            localStorage.setItem('language', action.payload)
        },
    },
})

export const { setTheme, toggleTheme, setLanguage } = settingsSlice.actions

export default settingsSlice.reducer
