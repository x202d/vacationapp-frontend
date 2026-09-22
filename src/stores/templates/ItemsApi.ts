import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '../../config/api'

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
        getItems: builder.query<TemplateItem[], void>({
            query: () => '/template-items',

            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: 'TemplateItem' as const,
                              id,
                          })),
                          {
                              type: 'TemplateItem' as const,
                              id: 'LIST',
                          },
                      ]
                    : [
                          {
                              type: 'TemplateItem' as const,
                              id: 'LIST',
                          },
                      ],
        }),

        getItem: builder.query<TemplateItem, string>({
            query: (id) => `/template-items/${id}`,

            providesTags: (_, __, id) => [
                {
                    type: 'TemplateItem',
                    id,
                },
            ],
        }),

        createItem: builder.mutation<TemplateItem, CreateTemplateItemRequest>({
            query: (item) => ({
                url: '/template-items',
                method: 'POST',
                body: item,
            }),

            invalidatesTags: [
                {
                    type: 'TemplateItem',
                    id: 'LIST',
                },
            ],
        }),

        updateItem: builder.mutation<
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

            invalidatesTags: (_, __, { id }) => [
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

        deleteItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/template-items/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_, __, id) => [
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
    useGetItemsQuery,
    useGetItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = templateItemApi
