import { baseQuery } from '../../api/baseQuery.ts'
import { createApi } from '@reduxjs/toolkit/query/react'

export type SettingType = 'string' | 'text' | 'int' | 'bool' | 'select'

export interface Setting {
    key: string
    label: string
    description: string | null
    type: SettingType
    value: string
    defaultValue: string
    options: { min?: number; max?: number; choices?: string[] } | null
}

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery,
    tagTypes: ['Settings'],
    endpoints: (builder) => ({
        getSettings: builder.query<Setting[], void>({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),

        updateSettings: builder.mutation<Setting[], Record<string, string>>({
            query: (data) => ({
                url: '/settings',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
})

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi
