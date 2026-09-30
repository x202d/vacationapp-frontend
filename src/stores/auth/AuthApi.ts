import { baseQuery } from '../../api/baseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { LoginRequest, LoginResponse } from '../../types/auth/auth'

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery,

    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
