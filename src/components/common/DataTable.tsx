import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface DataTableColumn<T> {
    key: keyof T
    label: string
    render?: (item: T) => ReactNode
}

export interface DataTableAction<T> {
    label: string
    icon: ReactNode
    onClick: (item: T) => void
}

interface DataTableProps<T extends { id: string }> {
    data: T[]
    columns: DataTableColumn<T>[]
    loading?: boolean
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    actions?: DataTableAction<T>[]
}

export default function DataTable<T extends { id: string }>({
    data,
    columns,
    loading = false,
    onEdit,
    onDelete,
    actions = [],
}: DataTableProps<T>) {
    const { t } = useTranslation()
    const hasActions = Boolean(onEdit || onDelete || actions.length)
    if (loading) {
        return (
            <Paper>
                <Box
                    sx={{
                        minHeight: 250,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Paper>
        )
    }

    if (data.length === 0) {
        return (
            <Paper>
                <Box
                    sx={{
                        minHeight: 250,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 3,
                    }}
                >
                    <Typography color="text.secondary">{t('common.noEntries')}</Typography>
                </Box>
            </Paper>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={String(column.key)}>{column.label}</TableCell>
                        ))}

                        {hasActions && (
                            <TableCell align="right">{t('common.actions.title')}</TableCell>
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} hover>
                            {columns.map((column) => (
                                <TableCell key={String(column.key)}>
                                    {column.render
                                        ? column.render(item)
                                        : String(item[column.key] ?? '')}
                                </TableCell>
                            ))}

                            {hasActions && (
                                <TableCell align="right">
                                    {actions.map((action) => (
                                        <Tooltip key={action.label} title={action.label}>
                                            <IconButton
                                                size="small"
                                                onClick={() => action.onClick(item)}
                                            >
                                                {action.icon}
                                            </IconButton>
                                        </Tooltip>
                                    ))}
                                    {onEdit && (
                                        <Tooltip title={t('common.actions.edit')}>
                                            <IconButton size="small" onClick={() => onEdit(item)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {onDelete && (
                                        <Tooltip title={t('common.actions.delete')}>
                                            <IconButton size="small" onClick={() => onDelete(item)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    )}{' '}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
