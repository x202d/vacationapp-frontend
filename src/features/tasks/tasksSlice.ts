import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Task {
    id: number
    label: string
    checked: boolean
}

interface TasksState {
    items: Task[]
}

const initialState: TasksState = {
    items: [],
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<string>) => {
            state.items.push({
                id: Date.now(),
                label: action.payload,
                checked: false,
            })
        },

        toggleTask: (state, action: PayloadAction<number>) => {
            const task = state.items.find(
                (item) => item.id === action.payload,
            )

            if (task) {
                task.checked = !task.checked
            }
        },
    },
})

export const { addTask, toggleTask } = tasksSlice.actions

export default tasksSlice.reducer