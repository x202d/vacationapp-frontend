import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    onSubmit: (data: CreateEventItemRequest | UpdateEventItemRequest) => Promise<void>
}

const EventItemDialog = ({
    open,
    item,
    loading = false,
    onClose,
    onSubmit,
}: EventItemDialogProps) => {
    const { t } = useTranslation()

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

    const handleSubmit = async () => {
        await onSubmit({
            itemType,
            title,
            details: details || null,
            sortOrder,
            isRequired,
        })

        onClose()
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t(isEdit ? 'events.items.edit' : 'events.items.add')}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label={t('events.fields.itemType')}
                        value={itemType}
                        onChange={(event) => setItemType(event.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label={t('events.fields.title')}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <TextField
                        label={t('events.fields.details')}
                        value={details}
                        onChange={(event) => setDetails(event.target.value)}
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

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isRequired}
                                onChange={(event) => setIsRequired(event.target.checked)}
                            />
                        }
                        label={t('events.fields.required')}
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
                    disabled={loading || !title.trim()}
                >
                    {t(isEdit ? 'events.actions.save' : 'events.actions.add')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventItemDialog
