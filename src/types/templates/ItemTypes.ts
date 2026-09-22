export interface TemplateItem {
    id: string
    category: string
    itemType: string
    title: string
    details: string | null
    sortOrder: number
    isRequired: boolean
    createdAt: string
    updatedAt: string | null
}

export interface CreateTemplateItemRequest {
    //category: string
    //itemType: string
    title: string
    details?: string | null
    sortOrder?: number
    isRequired?: boolean
}

export interface UpdateTemplateItemRequest {
    //category?: string
    //itemType?: string
    title?: string
    details?: string | null
    sortOrder?: number
    isRequired?: boolean
}
