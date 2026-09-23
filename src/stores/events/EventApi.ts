import { API_URL } from '../../config/api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    Event,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes'

const tagTypes = ['Event'] as const

export const eventApi = createApi({
    reducerPath: 'eventApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes,

    endpoints: (builder) => ({
        getEvents: builder.query<Event[], void>({
            query: () => '/events',

            providesTags: (result) => [
                { type: 'Event', id: 'LIST' },

                ...(result ?? []).map((event) => ({
                    type: 'Event' as const,
                    id: event.id,
                })),
            ],
        }),

        getEvent: builder.query<Event, string>({
            query: (id) => `/events/${id}`,

            providesTags: (_result, _error, id) => [{ type: 'Event', id }],
        }),

        createCategory: builder.mutation<
            Event['categories'][number],
            {
                eventId: string
                data: CreateEventCategoryRequest
            }
        >({
            query: ({ eventId, data }) => ({
                url: `/events/${eventId}/categories`,
                method: 'POST',
                body: data,
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),

        updateCategory: builder.mutation<
            Event['categories'][number],
            {
                eventId: string
                categoryId: string
                data: UpdateEventCategoryRequest
            }
        >({
            query: ({ eventId, categoryId, data }) => ({
                url: `/events/${eventId}/categories/${categoryId}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),

        deleteCategory: builder.mutation<
            void,
            {
                eventId: string
                categoryId: string
            }
        >({
            query: ({ eventId, categoryId }) => ({
                url: `/events/${eventId}/categories/${categoryId}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),

        createItem: builder.mutation<
            Event['categories'][number]['items'][number],
            {
                eventId: string
                categoryId: string
                data: CreateEventItemRequest
            }
        >({
            query: ({ eventId, categoryId, data }) => ({
                url: `/events/${eventId}/categories/${categoryId}/items`,
                method: 'POST',
                body: data,
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),

        updateItem: builder.mutation<
            Event['categories'][number]['items'][number],
            {
                eventId: string
                categoryId: string
                itemId: string
                data: UpdateEventItemRequest
            }
        >({
            query: ({ eventId, categoryId, itemId, data }) => ({
                url: `/events/${eventId}/categories/${categoryId}/items/${itemId}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),

        deleteItem: builder.mutation<
            void,
            {
                eventId: string
                categoryId: string
                itemId: string
            }
        >({
            query: ({ eventId, categoryId, itemId }) => ({
                url: `/events/${eventId}/categories/${categoryId}/items/${itemId}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, { eventId }) => [{ type: 'Event', id: eventId }],
        }),
    }),
})

export const {
    useGetEventsQuery,
    useGetEventQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = eventApi
