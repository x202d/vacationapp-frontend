import { baseQuery } from '../../api/baseQuery.ts'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
    CreateTourTypeRequest,
    TourType,
    UpdateTourTypeCategoriesRequest,
    UpdateTourTypeRequest,
} from '../../types/templates/TourTypeTypes'

const tagTypes = ['TourType'] as const

export const tourTypeApi = createApi({
    reducerPath: 'tourTypeApi',

    baseQuery,

    tagTypes,

    endpoints: (builder) => ({
        getTourTypes: builder.query<TourType[], void>({
            query: () => '/template-tours',

            providesTags: (result) => [
                {
                    type: 'TourType',
                    id: 'LIST',
                },

                ...(result ?? []).map(({ id }) => ({
                    type: 'TourType' as const,
                    id,
                })),
            ],
        }),

        getTourType: builder.query<TourType, string>({
            query: (id) => `/template-tours/${id}`,

            providesTags: (_result, _error, id) => [
                {
                    type: 'TourType',
                    id,
                },
            ],
        }),

        createTourType: builder.mutation<TourType, CreateTourTypeRequest>({
            query: (data) => ({
                url: '/template-tours',
                method: 'POST',
                body: data,
            }),

            invalidatesTags: [
                {
                    type: 'TourType',
                    id: 'LIST',
                },
            ],
        }),

        updateTourType: builder.mutation<
            TourType,
            {
                id: string
                data: UpdateTourTypeRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/template-tours/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
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

        deleteTourType: builder.mutation<void, string>({
            query: (id) => ({
                url: `/template-tours/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, id) => [
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

        updateTourTypeCategories: builder.mutation<
            TourType,
            {
                id: string
                data: UpdateTourTypeCategoriesRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/template-tours/${id}/categories`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
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
    useGetTourTypesQuery,
    useGetTourTypeQuery,
    useCreateTourTypeMutation,
    useUpdateTourTypeMutation,
    useDeleteTourTypeMutation,
    useUpdateTourTypeCategoriesMutation,
} = tourTypeApi
