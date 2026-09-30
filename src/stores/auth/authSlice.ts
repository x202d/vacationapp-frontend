import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthState, AuthUser } from '../../types/auth/auth'

const TOKEN_STORAGE_KEY = 'auth_token'
const USER_STORAGE_KEY = 'auth_user'

const getInitialState = (): AuthState => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)

    let user: AuthUser | null = null

    if (storedUser) {
        try {
            user = JSON.parse(storedUser) as AuthUser
        } catch {
            localStorage.removeItem(USER_STORAGE_KEY)
        }
    }

    return {
        token,
        user,
        isAuthenticated: null !== token,
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string
                user: AuthUser
            }>,
        ) => {
            const { token, user } = action.payload

            state.token = token
            state.user = user
            state.isAuthenticated = true

            localStorage.setItem(TOKEN_STORAGE_KEY, token)
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
        },

        logout: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false

            localStorage.removeItem(TOKEN_STORAGE_KEY)
            localStorage.removeItem(USER_STORAGE_KEY)
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
