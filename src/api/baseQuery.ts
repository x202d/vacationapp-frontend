import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '../config/api'

export const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
        const token = localStorage.getItem('auth_token')

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    },
})
