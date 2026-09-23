import { useEffect, useState } from 'react'
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
    onSubmit: (data: CreateEventCategoryRequest | UpdateEventCategoryRequest) => void
}

const EventCategoryDialog = ({
    open,
    category,
    loading = false,
    onClose,
    onSubmit,
}: EventCategoryDialogProps) => {
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

    const handleSubmit = () => {
        if (!name.trim()) {
            return
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            sortOrder,
        })
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? 'Kategorie bearbeiten' : 'Kategorie hinzufügen'}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <TextField
                        label="Beschreibung"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label="Sortierung"
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
                    Abbrechen
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                >
                    {isEdit ? 'Speichern' : 'Hinzufügen'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventCategoryDialog
