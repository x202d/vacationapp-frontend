import { TemplateItem } from './ItemTypes.ts'

export interface Category {
    id: string
    name: string
    description: string | null
    sortOrder: number
    createdAt: string
    updatedAt: string | null
    itemsCount: number
    items: TemplateItem[] | null
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
