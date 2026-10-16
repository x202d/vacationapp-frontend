import { baseQuery } from '../../api/baseQuery.ts'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { User } from '../../types/user/UserTypes.ts'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
        }),
    }),
})

export const { useGetUsersQuery } = userApi
