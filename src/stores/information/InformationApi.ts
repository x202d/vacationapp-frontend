import { baseQuery } from '../../api/baseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { Information } from '../../types/InformationTypes'

export const informationApi = createApi({
    reducerPath: 'informationApi',

    baseQuery,

    endpoints: (builder) => ({
        getInformation: builder.query<Information, void>({
            query: () => '/version',
        }),
    }),
})

export const { useGetInformationQuery } = informationApi
