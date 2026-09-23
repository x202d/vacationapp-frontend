import { TourType } from '../templates/TourTypeTypes.ts'

export interface CreateEventRequest {
    tourTypeId: string
    categories: {
        categoryId: string
        itemIds: string[]
    }[]
}

export type SelectedItems = Record<string, string[]>

export interface CreateEventWizardSubmit {
    tourTypeId: string
    categories: {
        categoryId: string
        itemIds: string[]
    }[]
}

export interface CreateEventWizardProps {
    tourTypes: TourType[]
    onSubmit: (data: CreateEventWizardSubmit) => void
    onCancel?: () => void
    loading?: boolean
    isCreating?: boolean
}
