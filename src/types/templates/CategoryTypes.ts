export interface Category {
    id: string
    name: string
    description: string | null
    sortOrder: number
    createdAt: string
    updatedAt: string | null
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
