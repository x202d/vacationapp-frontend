import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '../../config/api'

import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from '../../types/templates/CategoryTypes'

const tagTypes = ['Category'] as const

export const categoryApi = createApi({
    reducerPath: 'categoryApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        getItems: builder.query<Category[], void>({
            query: () => '/categories',

            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: 'Category' as const,
                              id,
                          })),
                          {
                              type: 'Category' as const,
                              id: 'LIST',
                          },
                      ]
                    : [
                          {
                              type: 'Category' as const,
                              id: 'LIST',
                          },
                      ],
        }),

        getItem: builder.query<Category, string>({
            query: (id) => `/categories/${id}`,

            providesTags: (_, __, id) => [
                {
                    type: 'Category',
                    id,
                },
            ],
        }),

        createItem: builder.mutation<Category, CreateCategoryRequest>({
            query: (item) => ({
                url: '/categories',
                method: 'POST',
                body: item,
            }),

            invalidatesTags: [
                {
                    type: 'Category',
                    id: 'LIST',
                },
            ],
        }),

        updateItem: builder.mutation<
            Category,
            {
                id: string
                data: UpdateCategoryRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_, __, { id }) => [
                {
                    type: 'Category',
                    id,
                },
                {
                    type: 'Category',
                    id: 'LIST',
                },
            ],
        }),

        deleteItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_, __, id) => [
                {
                    type: 'Category',
                    id,
                },
                {
                    type: 'Category',
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
} = categoryApi
