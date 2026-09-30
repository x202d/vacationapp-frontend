import { baseQuery } from '../../api/baseQuery.ts'
import { createApi } from '@reduxjs/toolkit/query/react'
import { CreateEventRequest } from '../../types/events/EventTypes.ts'

const tagTypes = ['Event'] as const

export const wizardApi = createApi({
    reducerPath: 'wizardApi',

    baseQuery,

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
