import type { TourType } from '../templates/TourTypeTypes'

export interface CreateEventRequest {
    tourTypeId: string
    categories: {
        categoryId: string
        itemIds: string[]
    }[]
}

export type SelectedItems = Record<string, string[]>

export interface CreateEventWizardProps {
    tourTypes: TourType[]
    onSubmit: (data: CreateEventRequest) => void | Promise<void>
    onCancel?: () => void
    loading?: boolean
    isCreating?: boolean
}

export interface EventItemStatus {
    id: string
}

export interface EventItem {
    id: string
    itemType: string
    title: string
    details: string | null
    sortOrder: number
    isRequired: boolean
    createdAt: string
    updatedAt: string | null
    isCompleted: boolean
    status: EventItemStatus[]
}

export interface EventCategory {
    id: string
    name: string
    description: string | null
    sortOrder: number
    createdAt: string
    updatedAt: string | null
    items: EventItem[]
}

export interface Event {
    id: string
    eventName: string
    startDate: string | null
    endDate: string | null
    location: string | null
    notes: string | null
    createdAt: string
    updatedAt: string | null
    categories: EventCategory[]
}

export interface CreateEventCategoryRequest {
    name: string
    description: string | null
    sortOrder: number
}

export interface UpdateEventCategoryRequest {
    name: string
    description: string | null
    sortOrder: number
}

export interface CreateEventItemRequest {
    itemType?: string
    title?: string
    details?: string
    sortOrder?: number
    isRequired?: boolean
    isCompleted?: boolean
}

export interface UpdateEventItemRequest {
    itemType?: string
    title?: string
    details?: string
    sortOrder?: number
    isRequired?: boolean
    isCompleted?: boolean
}
