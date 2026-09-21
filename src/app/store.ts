import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/tasksSlice'
import { itemsApi } from '../features/items/itemsApi'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        [itemsApi.reducerPath]: itemsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(itemsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch