import { configureStore } from '@reduxjs/toolkit'
import { itemsApi } from '../stores/items/itemsApi'
import { tourTypeApi } from '../stores/templates/TourTypeApi'

export const store = configureStore({
    reducer: {
        [itemsApi.reducerPath]: itemsApi.reducer,
        [tourTypeApi.reducerPath]: tourTypeApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(itemsApi.middleware)
            .concat(tourTypeApi.middleware)
        ,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch