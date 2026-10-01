import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../common/ConfirmDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import EventItemDialog from './dialogs/EventItemDialog'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import type {
    CreateEventItemRequest,
    EventItem,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes'
import {
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'

interface EventItemListProps {
    items: EventItem[]
    onCreate: (data: CreateEventItemRequest) => Promise<void>
    onUpdate: (
        itemId: string,
        data: CreateEventItemRequest | UpdateEventItemRequest,
    ) => Promise<void>
    onDelete: (itemId: string) => Promise<void>
    mutationLoading?: boolean
}

const EventItemList = ({
    items,
    onCreate,
    onUpdate,
    onDelete,
    mutationLoading = false,
}: EventItemListProps) => {
    const { t } = useTranslation()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<EventItem>()
    const [deletingItem, setDeletingItem] = useState<EventItem>()

    const handleCreate = () => {
        setEditingItem(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (item: EventItem) => {
        setEditingItem(item)
        setDialogOpen(true)
    }

    const handleDialogClose = () => {
        if (mutationLoading) {
            return
        }

        setDialogOpen(false)
        setEditingItem(undefined)
    }

    const handleDialogSubmit = async (
        data: CreateEventItemRequest | UpdateEventItemRequest,
    ): Promise<void> => {
        if (editingItem) {
            await onUpdate(editingItem.id, data)
            return
        }

        await onCreate(data)
    }

    const handleIsCompleted = async (item: EventItem): Promise<void> => {
        await onUpdate(item.id, {
            isCompleted: !item.isCompleted,
        })
    }

    const handleDeleteConfirm = async (): Promise<void> => {
        if (!deletingItem) {
            return
        }

        await onDelete(deletingItem.id)
        setDeletingItem(undefined)
    }

    return (
        <>
            <Stack spacing={1}>
                {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        {t('events.items.empty')}
                    </Typography>
                ) : (
                    <List disablePadding>
                        {items.map((item) => (
                            <ListItem
                                key={item.id}
                                disableGutters
                                secondaryAction={
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title={t('events.actions.edit')}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(item)}
                                                disabled={mutationLoading}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={t('events.actions.delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setDeletingItem(item)}
                                                disabled={mutationLoading}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleIsCompleted(item)}
                                        disabled={mutationLoading}
                                        sx={{
                                            color: item.isCompleted
                                                ? 'success.main'
                                                : 'action.active',
                                        }}
                                    >
                                        <CheckCircleOutlineIcon />
                                    </IconButton>
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography
                                                sx={{
                                                    textDecoration: item.isCompleted
                                                        ? 'line-through'
                                                        : 'none',
                                                    color: item.isCompleted
                                                        ? 'text.secondary'
                                                        : 'text.primary',
                                                }}
                                            >
                                                {item.title}
                                            </Typography>

                                            {item.isRequired && (
                                                <Chip
                                                    label={t('events.items.required')}
                                                    size="small"
                                                />
                                            )}
                                        </Stack>
                                    }
                                    secondary={item.details || undefined}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    disabled={mutationLoading}
                    sx={{ alignSelf: 'flex-start' }}
                >
                    {t('events.items.add')}
                </Button>
            </Stack>

            <EventItemDialog
                open={dialogOpen}
                item={editingItem}
                loading={mutationLoading}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />

            <ConfirmDialog
                open={Boolean(deletingItem)}
                title={t('events.items.delete')}
                message={
                    deletingItem
                        ? t('events.items.deleteConfirm', {
                              name: deletingItem.title,
                          })
                        : ''
                }
                loading={mutationLoading}
                onCancel={() => setDeletingItem(undefined)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    )
}

export default EventItemList
