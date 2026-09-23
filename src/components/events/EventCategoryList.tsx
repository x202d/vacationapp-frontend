import { useState } from 'react'
import EventItemList from './EventItemList'
import AddIcon from '@mui/icons-material/Add'
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
    onCreate: (data: CreateEventCategoryRequest) => void
    onUpdate: (categoryId: string, data: UpdateEventCategoryRequest) => void
    onDelete: (categoryId: string) => void
    onCreateItem: (categoryId: string, data: CreateEventItemRequest) => void
    onUpdateItem: (categoryId: string, itemId: string, data: UpdateEventItemRequest) => void
    onDeleteItem: (categoryId: string, itemId: string) => void
    mutationLoading?: boolean
}

const EventCategoryList = ({
    eventId,
    categories,
    onCreate,
    onUpdate,
    onDelete,
    onCreateItem,
    onUpdateItem,
    onDeleteItem,
    mutationLoading = false,
}: EventCategoryListProps) => {
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

    const handleDialogSubmit = (data: CreateEventCategoryRequest | UpdateEventCategoryRequest) => {
        if (editingCategory) {
            onUpdate(editingCategory.id, data)
        } else {
            onCreate(data)
        }
    }

    const handleDeleteConfirm = () => {
        if (!deletingCategory) {
            return
        }

        onDelete(deletingCategory.id)
        setDeletingCategory(undefined)
    }

    return (
        <>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" component="h2">
                            Kategorien
                        </Typography>

                        <Chip icon={<CategoryIcon />} label={categories.length} size="small" />
                    </Stack>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Kategorie
                    </Button>
                </Stack>

                {categories.map((category) => (
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
                                            label={`${category.items.length} ${
                                                category.items.length === 1 ? 'Item' : 'Items'
                                            }`}
                                            size="small"
                                        />

                                        <Tooltip title="Bearbeiten">
                                            <IconButton
                                                onClick={() => handleEdit(category)}
                                                disabled={mutationLoading}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Löschen">
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
                                    eventId={eventId}
                                    categoryId={category.id}
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
                ))}
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
                title="Kategorie löschen"
                message={
                    deletingCategory
                        ? `Möchtest du die Kategorie „${deletingCategory.name}“ wirklich löschen?`
                        : ''
                }
                onCancel={() => setDeletingCategory(undefined)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    )
}

export default EventCategoryList
