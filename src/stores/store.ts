import authReducer from './auth/authSlice'
import { authApi } from './auth/AuthApi.ts'
import { userApi } from './user/UserApi.ts'
import { eventApi } from './events/EventApi'
import { wizardApi } from './events/WizardApi'
import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './templates/CategoryApi'
import { tourTypeApi } from './templates/TourTypeApi'
import { templateItemApi } from './templates/ItemsApi'
import settingsReducer from './settings/settingsSlice'
import iobrokerReducer from './iobroker/iobrokerSlice.ts'
import { informationApi } from './information/InformationApi'

export const store = configureStore({
    reducer: {
        [templateItemApi.reducerPath]: templateItemApi.reducer,
        [tourTypeApi.reducerPath]: tourTypeApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [wizardApi.reducerPath]: wizardApi.reducer,
        [eventApi.reducerPath]: eventApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [informationApi.reducerPath]: informationApi.reducer,
        [userApi.reducerPath]: userApi.reducer,

        auth: authReducer,
        settings: settingsReducer,
        iobroker: iobrokerReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(templateItemApi.middleware)
            .concat(tourTypeApi.middleware)
            .concat(categoryApi.middleware)
            .concat(wizardApi.middleware)
            .concat(eventApi.middleware)
            .concat(authApi.middleware)
            .concat(informationApi.middleware)
            .concat(userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
