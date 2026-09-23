import { API_URL } from '../../config/api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    CreateTemplateItemRequest,
    TemplateItem,
    UpdateTemplateItemRequest,
} from '../../types/templates/ItemTypes'

const tagTypes = ['TemplateItem'] as const

export const templateItemApi = createApi({
    reducerPath: 'templateItemApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        getTemplateItems: builder.query<TemplateItem[], void>({
            query: () => '/template-items',

            providesTags: (result) => [
                {
                    type: 'TemplateItem',
                    id: 'LIST',
                },

                ...(result ?? []).map(({ id }) => ({
                    type: 'TemplateItem' as const,
                    id,
                })),
            ],
        }),

        getTemplateItem: builder.query<TemplateItem, string>({
            query: (id) => `/template-items/${id}`,

            providesTags: (_result, _error, id) => [
                {
                    type: 'TemplateItem',
                    id,
                },
            ],
        }),

        createTemplateItem: builder.mutation<TemplateItem, CreateTemplateItemRequest>({
            query: (data) => ({
                url: '/template-items',
                method: 'POST',
                body: data,
            }),

            invalidatesTags: [
                {
                    type: 'TemplateItem',
                    id: 'LIST',
                },
            ],
        }),

        updateTemplateItem: builder.mutation<
            TemplateItem,
            {
                id: string
                data: UpdateTemplateItemRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/template-items/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: 'TemplateItem',
                    id,
                },
                {
                    type: 'TemplateItem',
                    id: 'LIST',
                },
            ],
        }),

        deleteTemplateItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/template-items/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: 'TemplateItem',
                    id,
                },
                {
                    type: 'TemplateItem',
                    id: 'LIST',
                },
            ],
        }),
    }),
})

export const {
    useGetTemplateItemsQuery,
    useGetTemplateItemQuery,
    useCreateTemplateItemMutation,
    useUpdateTemplateItemMutation,
    useDeleteTemplateItemMutation,
} = templateItemApi
