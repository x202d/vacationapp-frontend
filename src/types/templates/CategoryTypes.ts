import type { TemplateItem } from './ItemTypes'

export interface TemplateCategory {
    id: string
    name: string
    description: string | null
    sortOrder: number
    createdAt: string
    updatedAt: string | null
    items: TemplateItem[]
    itemsCount: number
    toursCount: number
}

export interface CreateCategoryRequest {
    name: string
    description: string | null
    sortOrder: number
}

export interface UpdateCategoryRequest {
    name: string
    description: string | null
    sortOrder: number
}

export interface UpdateCategoryItemsRequest {
    itemIds: string[]
}
