import { baseQuery } from '../../api/baseQuery.ts'
import { User } from '../../types/user/UserTypes.ts'
import { createApi } from '@reduxjs/toolkit/query/react'
import {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    CreateEventRequest,
    Event,
    EventItem,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
    UpdateEventRequest,
} from '../../types/events/EventTypes'

const tagTypes = ['Event'] as const

export const eventApi = createApi({
    reducerPath: 'eventApi',

    baseQuery,

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

        updateEvent: builder.mutation<
            Event,
            {
                eventId: string
                data: UpdateEventRequest
            }
        >({
            query: ({ eventId, data }) => ({
                url: `/events/${eventId}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { eventId }) => [
                { type: 'Event', id: eventId },
                { type: 'Event', id: 'LIST' },
            ],
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

        createEvent: builder.mutation<Event, CreateEventRequest>({
            query: (data) => ({
                url: '/events/create-from-wizard',
                method: 'POST',
                body: data,
            }),

            invalidatesTags: [{ type: 'Event', id: 'LIST' }],
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

        getEventChecklistPdf: builder.query<Blob, string>({
            query: (eventId) => ({
                url: `/${eventId}/checklist/pdf`,
                responseHandler: async (response) => response.blob(),
            }),
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
        setItemResponsibles: builder.mutation<
            EventItem,
            {
                eventId: string
                categoryId: string
                itemId: string
                users: User[]
            }
        >({
            query: ({ eventId, categoryId, itemId, users }) => ({
                url: `/events/${eventId}/categories/${categoryId}/items/${itemId}/responsibles`,
                method: 'PUT',
                body: { userIds: users.map((user) => user.id) },
            }),

            // Kein invalidatesTags: Der Cache wird optimistisch gepatcht
            async onQueryStarted({ eventId, itemId, users }, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    eventApi.util.updateQueryData('getEvent', eventId, (draft) => {
                        for (const category of draft.categories) {
                            const item = category.items.find((entry) => entry.id === itemId)

                            if (item) {
                                item.responsibles = users
                                return
                            }
                        }
                    }),
                )

                try {
                    await queryFulfilled
                } catch {
                    patch.undo()
                }
            },
        }),
    }),
})

export const {
    useGetEventsQuery,
    useGetEventQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useLazyGetEventChecklistPdfQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    useSetItemResponsiblesMutation,
} = eventApi
