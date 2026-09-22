import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../config/api'
import { TourType, CreateTourTypeRequest } from "../../types/templates/TourTypeTypes"



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
            providesTags: ['TourType']
        }),

        createItem: builder.mutation<TourType, CreateTourTypeRequest>({
            query: (item) => ({
                url: '/tour-types',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['TourType']
        }),
    }),
})

export const {
    useGetItemsQuery,
    useCreateItemMutation,
} = tourTypeApi