import { Pagination, Stack } from '@mui/material'

interface ListPaginationProps {
    page: number
    pageCount: number
    onChange: (page: number) => void
}

const ListPagination = ({ page, pageCount, onChange }: ListPaginationProps) => {
    if (pageCount <= 1) {
        return null
    }

    return (
        <Stack alignItems="center" sx={{ pt: 1 }}>
            <Pagination
                page={page}
                count={pageCount}
                onChange={(_event, value) => onChange(value)}
                color="primary"
            />
        </Stack>
    )
}

export default ListPagination
