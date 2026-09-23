import { useEffect, useState } from 'react'
import type {
    CreateEventItemRequest,
    EventItem,
    UpdateEventItemRequest,
} from '../../../types/events/EventTypes'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from '@mui/material'

interface EventItemDialogProps {
    open: boolean
    item?: EventItem
    loading?: boolean
    onClose: () => void
    onSubmit: (data: CreateEventItemRequest | UpdateEventItemRequest) => void
}

const EventItemDialog = ({
    open,
    item,
    loading = false,
    onClose,
    onSubmit,
}: EventItemDialogProps) => {
    const [itemType, setItemType] = useState('todo')
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [sortOrder, setSortOrder] = useState(0)
    const [isRequired, setIsRequired] = useState(false)

    const isEdit = Boolean(item)

    useEffect(() => {
        if (!open) {
            return
        }

        setItemType(item?.itemType ?? 'todo')
        setTitle(item?.title ?? '')
        setDetails(item?.details ?? '')
        setSortOrder(item?.sortOrder ?? 0)
        setIsRequired(item?.isRequired ?? false)
    }, [open, item])

    const handleSubmit = () => {
        if (!title.trim()) {
            return
        }

        onSubmit({
            itemType: itemType.trim() || 'todo',
            title: title.trim(),
            details: details.trim() || null,
            sortOrder,
            isRequired,
        })
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? 'Item bearbeiten' : 'Item hinzufügen'}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Titel"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <TextField
                        label="Typ"
                        value={itemType}
                        onChange={(event) => setItemType(event.target.value)}
                        fullWidth
                        helperText="Zum Beispiel: todo"
                    />

                    <TextField
                        label="Details"
                        value={details}
                        onChange={(event) => setDetails(event.target.value)}
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

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isRequired}
                                onChange={(event) => setIsRequired(event.target.checked)}
                            />
                        }
                        label="Pflichtfeld"
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
                    disabled={loading || !title.trim()}
                >
                    {isEdit ? 'Speichern' : 'Hinzufügen'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventItemDialog
