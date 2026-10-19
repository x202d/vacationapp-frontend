import { useState } from 'react'

export const usePagination = <T>(items: T[], pageSize: number) => {
    const [page, setPage] = useState(1)

    const size = Math.max(1, Math.floor(pageSize) || 1)
    const pageCount = Math.max(1, Math.ceil(items.length / size))

    // Seite begrenzen, falls Liste oder Seitengröße schrumpfen (z. B. nach dem Löschen)
    const currentPage = Math.min(page, pageCount)

    const pageItems = items.slice((currentPage - 1) * size, currentPage * size)

    return { page: currentPage, setPage, pageCount, pageItems }
}
