import type { ReactNode } from 'react'

import ListPagination from './ListPagination'
import { useSetting } from '../../hooks/useSettings'
import { usePagination } from '../../hooks/usePagination'

interface PaginatedListProps<T> {
    items: T[]
    children: (pageItems: T[]) => ReactNode
    pageSize?: number
}

export default function PaginatedList<T>({ items, children, pageSize }: PaginatedListProps<T>) {
    const defaultPageSize = useSetting('items_per_page')
    const { page, setPage, pageCount, pageItems } = usePagination(
        items,
        pageSize ?? defaultPageSize,
    )

    return (
        <>
            {children(pageItems)}
            <ListPagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
    )
}
