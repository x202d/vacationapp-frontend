import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '../../config/api'
import { CreateEventRequest } from '../../types/events/EventTypes.ts'

const tagTypes = ['Event'] as const

export const wizardApi = createApi({
    reducerPath: 'wizardApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        createItem: builder.mutation<Event, CreateEventRequest>({
            query: (body) => ({
                url: '/events/create-from-wizard',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Event'],
        }),
    }),
})

export const { useCreateItemMutation } = wizardApi
