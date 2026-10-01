import { useTranslation } from 'react-i18next'
import ClearIcon from '@mui/icons-material/Clear'
import { Delete, Edit } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import { ReactNode, useMemo, useState } from 'react'
import {
    Box,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'

export interface DataTableColumn<T> {
    key: keyof T
    label: string
    render?: (item: T) => ReactNode
    searchable?: boolean
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
    searchable?: boolean
}

export default function DataTable<T extends { id: string }>({
    data,
    columns,
    loading = false,
    onEdit,
    onDelete,
    actions = [],
    searchable = false,
}: DataTableProps<T>) {
    const { t } = useTranslation()

    const [searchTerm, setSearchTerm] = useState('')
    const [searchColumn, setSearchColumn] = useState<string>('all')

    const hasActions = Boolean(onEdit || onDelete || actions.length)

    const searchableColumns = useMemo(
        () => columns.filter((column) => column.searchable),
        [columns],
    )

    const filteredData = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()

        if (!normalizedSearchTerm || !searchable || searchableColumns.length === 0) {
            return data
        }

        return data.filter((item) => {
            if (searchColumn === 'all') {
                return searchableColumns.some((column) =>
                    String(item[column.key] ?? '')
                        .toLocaleLowerCase()
                        .includes(normalizedSearchTerm),
                )
            }

            const column = searchableColumns.find((column) => String(column.key) === searchColumn)

            if (!column) {
                return true
            }

            return String(item[column.key] ?? '')
                .toLocaleLowerCase()
                .includes(normalizedSearchTerm)
        })
    }, [data, searchColumn, searchTerm, searchable, searchableColumns])

    const handleSearchColumnChange = (event: SelectChangeEvent) => {
        setSearchColumn(event.target.value)
    }

    const clearSearch = () => {
        setSearchTerm('')
    }

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

    return (
        <Paper>
            {searchable && searchableColumns.length > 0 && (
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t('common.search')}
                        size="small"
                        sx={{
                            flex: 1,
                            minWidth: 220,
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={clearSearch} edge="end">
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 180,
                        }}
                    >
                        <InputLabel id="datatable-search-column-label">
                            {t('common.searchIn')}
                        </InputLabel>

                        <Select
                            labelId="datatable-search-column-label"
                            value={searchColumn}
                            label={t('common.searchIn')}
                            onChange={handleSearchColumnChange}
                        >
                            <MenuItem value="all">{t('common.allColumns')}</MenuItem>

                            {searchableColumns.map((column) => (
                                <MenuItem key={String(column.key)} value={String(column.key)}>
                                    {column.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {data.length === 0 ? (
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
            ) : filteredData.length === 0 ? (
                <Box
                    sx={{
                        minHeight: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 3,
                    }}
                >
                    <Typography color="text.secondary">{t('common.noSearchResults')}</Typography>
                </Box>
            ) : (
                <TableContainer>
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
                            {filteredData.map((item) => (
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
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(item)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {onDelete && (
                                                <Tooltip title={t('common.actions.delete')}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDelete(item)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    )
}
