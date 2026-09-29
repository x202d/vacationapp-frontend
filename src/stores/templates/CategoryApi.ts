import { baseQuery } from '../../api/baseQuery.ts'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
    CreateCategoryRequest,
    TemplateCategory,
    UpdateCategoryItemsRequest,
    UpdateCategoryRequest,
} from '../../types/templates/CategoryTypes'

const tagTypes = ['Category'] as const

export const categoryApi = createApi({
    reducerPath: 'categoryApi',

    baseQuery,

    tagTypes,

    endpoints: (builder) => ({
        getCategories: builder.query<TemplateCategory[], void>({
            query: () => '/template-categories',

            providesTags: (result) => [
                {
                    type: 'Category',
                    id: 'LIST',
                },

                ...(result ?? []).map(({ id }) => ({
                    type: 'Category' as const,
                    id,
                })),
            ],
        }),

        getCategory: builder.query<TemplateCategory, string>({
            query: (id) => `/template-categories/${id}`,

            providesTags: (_result, _error, id) => [
                {
                    type: 'Category',
                    id,
                },
            ],
        }),

        createCategory: builder.mutation<TemplateCategory, CreateCategoryRequest>({
            query: (data) => ({
                url: '/template-categories',
                method: 'POST',
                body: data,
            }),

            invalidatesTags: [
                {
                    type: 'Category',
                    id: 'LIST',
                },
            ],
        }),

        updateCategory: builder.mutation<
            TemplateCategory,
            {
                id: string
                data: UpdateCategoryRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/template-categories/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
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

        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/template-categories/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, id) => [
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

        updateCategoryItems: builder.mutation<
            TemplateCategory,
            {
                id: string
                data: UpdateCategoryItemsRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/template-categories/${id}/items`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
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
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryItemsMutation,
} = categoryApi
