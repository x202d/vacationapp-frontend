import { useState } from 'react'
import EventItemList from './EventItemList'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../common/ConfirmDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import CategoryIcon from '@mui/icons-material/Category'
import EventCategoryDialog from './dialogs/EventCategoryDialog'
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import type {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    EventCategory,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes'

interface EventCategoryListProps {
    eventId: string
    categories: EventCategory[]
    onCreate: (data: CreateEventCategoryRequest) => Promise<void>
    onUpdate: (categoryId: string, data: UpdateEventCategoryRequest) => Promise<void>
    onDelete: (categoryId: string) => Promise<void>
    onCreateItem: (categoryId: string, data: CreateEventItemRequest) => Promise<void>
    onUpdateItem: (
        categoryId: string,
        itemId: string,
        data: UpdateEventItemRequest,
    ) => Promise<void>
    onDeleteItem: (categoryId: string, itemId: string) => Promise<void>
    mutationLoading?: boolean
}

const EventCategoryList = ({
    categories,
    onCreate,
    onUpdate,
    onDelete,
    onCreateItem,
    onUpdateItem,
    onDeleteItem,
    mutationLoading = false,
}: EventCategoryListProps) => {
    const { t } = useTranslation()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<EventCategory>()

    const [deletingCategory, setDeletingCategory] = useState<EventCategory>()

    const handleCreate = () => {
        setEditingCategory(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (category: EventCategory) => {
        setEditingCategory(category)
        setDialogOpen(true)
    }

    const handleDialogClose = () => {
        if (mutationLoading) {
            return
        }

        setDialogOpen(false)
        setEditingCategory(undefined)
    }

    const handleDialogSubmit = async (
        data: CreateEventCategoryRequest | UpdateEventCategoryRequest,
    ): Promise<void> => {
        if (editingCategory) {
            await onUpdate(editingCategory.id, data)
            return
        }

        await onCreate(data)
    }

    const handleDeleteConfirm = async (): Promise<void> => {
        if (!deletingCategory) {
            return
        }

        await onDelete(deletingCategory.id)
        setDeletingCategory(undefined)
    }

    return (
        <>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6">{t('events.categories.title')}</Typography>

                        <Chip icon={<CategoryIcon />} label={categories.length} size="small" />
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        disabled={mutationLoading}
                    >
                        {t('events.categories.add')}
                    </Button>
                </Stack>

                {categories.length === 0 ? (
                    <Typography color="text.secondary">{t('events.categories.empty')}</Typography>
                ) : (
                    categories.map((category) => (
                        <Card key={category.id}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        alignItems="flex-start"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack spacing={0.5}>
                                            <Typography variant="h6" component="h3">
                                                {category.name}
                                            </Typography>

                                            {category.description && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {category.description}
                                                </Typography>
                                            )}
                                        </Stack>

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Chip
                                                label={t('events.categories.itemCount', {
                                                    count: category.items.length,
                                                })}
                                                size="small"
                                            />

                                            <Tooltip title={t('events.actions.edit')}>
                                                <IconButton
                                                    onClick={() => handleEdit(category)}
                                                    disabled={mutationLoading}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title={t('events.actions.delete')}>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeletingCategory(category)}
                                                    disabled={mutationLoading}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>

                                    <Divider />

                                    <EventItemList
                                        items={category.items}
                                        onCreate={(data) => onCreateItem(category.id, data)}
                                        onUpdate={(itemId, data) =>
                                            onUpdateItem(category.id, itemId, data)
                                        }
                                        onDelete={(itemId) => onDeleteItem(category.id, itemId)}
                                        mutationLoading={mutationLoading}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>

            <EventCategoryDialog
                open={dialogOpen}
                category={editingCategory}
                loading={mutationLoading}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />

            <ConfirmDialog
                open={Boolean(deletingCategory)}
                title={t('events.categories.delete')}
                message={
                    deletingCategory
                        ? t('events.categories.deleteConfirm', {
                              name: deletingCategory.name,
                          })
                        : ''
                }
                loading={mutationLoading}
                onCancel={() => setDeletingCategory(undefined)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    )
}

export default EventCategoryList
