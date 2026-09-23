import type { TemplateCategory } from './CategoryTypes'

export interface TourType {
    id: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
    templateCategories: TemplateCategory[]
    categoriesCount: number
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

export interface UpdateTourTypeCategoriesRequest {
    categoryIds: string[]
}
