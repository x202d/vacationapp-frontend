export interface TemplateItem {
    id: string
    itemType: string
    title: string
    details: string | null
    sortOrder: number
    isRequired: boolean
    createdAt: string
    updatedAt: string | null
}

export interface CreateTemplateItemRequest {
    title: string
    details?: string | null
    sortOrder?: number
    isRequired?: boolean
}

export interface UpdateTemplateItemRequest {
    title?: string
    details?: string | null
    sortOrder?: number
    isRequired?: boolean
}
