import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'
import type {
    CreateEventCategoryRequest,
    EventCategory,
    UpdateEventCategoryRequest,
} from '../../../types/events/EventTypes'

interface EventCategoryDialogProps {
    open: boolean
    category?: EventCategory
    loading?: boolean
    onClose: () => void
    onSubmit: (data: CreateEventCategoryRequest | UpdateEventCategoryRequest) => Promise<void>
}

const EventCategoryDialog = ({
    open,
    category,
    loading = false,
    onClose,
    onSubmit,
}: EventCategoryDialogProps) => {
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [sortOrder, setSortOrder] = useState(0)

    const isEdit = Boolean(category)

    useEffect(() => {
        if (!open) {
            return
        }

        setName(category?.name ?? '')
        setDescription(category?.description ?? '')
        setSortOrder(category?.sortOrder ?? 0)
    }, [open, category])

    const handleSubmit = async () => {
        await onSubmit({
            name,
            description: description || null,
            sortOrder,
        })

        onClose()
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {t(isEdit ? 'events.categories.edit' : 'events.categories.add')}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label={t('events.fields.name')}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <TextField
                        label={t('events.fields.description')}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label={t('events.fields.sortOrder')}
                        type="number"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(Number(event.target.value))}
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                min: 0,
                            },
                        }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    {t('events.actions.cancel')}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                >
                    {t(isEdit ? 'events.actions.save' : 'events.actions.add')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventCategoryDialog
