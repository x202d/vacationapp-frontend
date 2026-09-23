import { configureStore } from '@reduxjs/toolkit'
import { wizardApi } from './events/WizardApi.ts'
import { categoryApi } from './templates/CategoryApi.ts'
import { tourTypeApi } from './templates/TourTypeApi.ts'
import { templateItemApi } from './templates/ItemsApi.ts'
import settingsReducer from './settings/settingsSlice.ts'

export const store = configureStore({
    reducer: {
        [templateItemApi.reducerPath]: templateItemApi.reducer,
        [tourTypeApi.reducerPath]: tourTypeApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [wizardApi.reducerPath]: wizardApi.reducer,

        settings: settingsReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(templateItemApi.middleware)
            .concat(tourTypeApi.middleware)
            .concat(categoryApi.middleware)
            .concat(wizardApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
