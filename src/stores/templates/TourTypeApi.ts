import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { API_URL } from '../../config/api'

import {
    TourType,
    CreateTourTypeRequest,
    UpdateTourTypeRequest, UpdateTourTypeCategoriesRequest,
} from '../../types/templates/TourTypeTypes'

const tagTypes = ['TourType'] as const

export const tourTypeApi = createApi({
    reducerPath: 'tourTypeApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        getItems: builder.query<TourType[], void>({
            query: () => '/tour-types',

            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'TourType' as const,
                            id,
                        })),
                        {
                            type: 'TourType' as const,
                            id: 'LIST',
                        },
                    ]
                    : [
                        {
                            type: 'TourType' as const,
                            id: 'LIST',
                        },
                    ],
        }),
        updateCategories: builder.mutation<
            TourType,
            {
                id: string
                data: UpdateTourTypeCategoriesRequest
            }> ({
             query: ({ id, data }) => ({
     url: `/tour-types/${id}/categories`,
 method: 'PUT',
 body: data,
 }),

invalidatesTags: (_, __, { id }) => [
    {
        type: 'TourType',
        id,
    },
    {
        type: 'TourType',
        id: 'LIST',
    },
],

}),

getItem: builder.query<TourType, string>({
            query: (id) => `/tour-types/${id}`,

            providesTags: (_, __, id) => [
                {
                    type: 'TourType',
                    id,
                },
            ],
        }),

        createItem: builder.mutation<
            TourType,
            CreateTourTypeRequest
        >({
            query: (item) => ({
                url: '/tour-types',
                method: 'POST',
                body: item,
            }),

            invalidatesTags: [
                {
                    type: 'TourType',
                    id: 'LIST',
                },
            ],
        }),

        updateItem: builder.mutation<
            TourType,
            {
                id: string
                data: UpdateTourTypeRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/tour-types/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_, __, { id }) => [
                {
                    type: 'TourType',
                    id,
                },
                {
                    type: 'TourType',
                    id: 'LIST',
                },
            ],
        }),

        deleteItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tour-types/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_, __, id) => [
                {
                    type: 'TourType',
                    id,
                },
                {
                    type: 'TourType',
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
    useUpdateCategoriesMutation,
} = tourTypeApi