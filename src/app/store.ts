import { configureStore } from '@reduxjs/toolkit'
import { templateItemApi } from '../stores/templates/ItemsApi.ts'
import { tourTypeApi } from '../stores/templates/TourTypeApi'
import { categoryApi } from '../stores/templates/CategoryApi'
import settingsReducer from '../stores/settings/settingsSlice'

export const store = configureStore({
    reducer: {
        [templateItemApi.reducerPath]: templateItemApi.reducer,
        [tourTypeApi.reducerPath]: tourTypeApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,

        settings: settingsReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(templateItemApi.middleware)
            .concat(tourTypeApi.middleware)
            .concat(categoryApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
