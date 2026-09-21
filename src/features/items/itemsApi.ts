import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../config/api'

export interface Item {
    id: number
    name: string
    description: string | null
    amount: string
    checked: boolean
    createdAt: string
    updatedAt: string | null
}

interface cat {
    id: number,
    name: string
}

export interface CreateItemRequest {
    name: string
    description?: string | null
    category: cat,
    amount: string
    checked?: boolean
}

const tagTypes = ['Item'] as const

export const itemsApi = createApi({
    reducerPath: 'itemsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        getItems: builder.query<Item[], void>({
            query: () => '/items',
            providesTags: ['Item']
        }),

        createItem: builder.mutation<Item, CreateItemRequest>({
            query: (item) => ({
                url: '/items',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['Item']
        }),
    }),
})

export const {
    useGetItemsQuery,
    useCreateItemMutation,
} = itemsApi