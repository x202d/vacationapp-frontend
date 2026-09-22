import { configureStore } from '@reduxjs/toolkit'
import { itemsApi } from '../stores/items/itemsApi'
import { tourTypeApi } from '../stores/templates/TourTypeApi'
import { categoryApi } from '../stores/templates/CategoryApi'
import settingsReducer from '../stores/settings/settingsSlice'

export const store = configureStore({
    reducer: {
        [itemsApi.reducerPath]: itemsApi.reducer,
        [tourTypeApi.reducerPath]: tourTypeApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,

        settings: settingsReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(itemsApi.middleware)
            .concat(tourTypeApi.middleware)
            .concat(categoryApi.middleware)
        ,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch