import { TemplateItem } from './ItemTypes.ts'

export interface TourType {
    id: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
    templateCategories: TemplateCategory[]
}

export interface CreateTourTypeRequest {
    name: string
    description: string | null
    isActive: boolean
}

export interface UpdateTourTypeRequest {
    name: string
    description: string | null
    isActive: boolean
}

export interface TemplateCategory {
    id: string
    name: string
    description: string
    sortOrder: number
    createdAt: string
    updatedAt: string | null
    items: TemplateItem[] | null
}

export interface TourTypeCategory {
    id: string
    name: string
    description: string | null
    sortOrder: number
}

export interface UpdateTourTypeCategoriesRequest {
    categoryIds: string[]
}
