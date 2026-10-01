import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Event, UpdateEventRequest } from '../../../types/events/EventTypes'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'

interface EventEditDialogProps {
    open: boolean
    event: Event
    loading?: boolean
    onClose: () => void
    onSubmit: (data: UpdateEventRequest) => Promise<void>
}

const toDateInputValue = (value: string | null): string => {
    if (!value) {
        return ''
    }

    return value.slice(0, 10)
}

const EventEditDialog = ({
    open,
    event,
    loading = false,
    onClose,
    onSubmit,
}: EventEditDialogProps) => {
    const { t } = useTranslation()

    const [eventName, setEventName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [location, setLocation] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (!open) {
            return
        }

        setEventName(event.eventName)
        setStartDate(toDateInputValue(event.startDate))
        setEndDate(toDateInputValue(event.endDate))
        setLocation(event.location ?? '')
        setNotes(event.notes ?? '')
    }, [open, event])

    const endDateInvalid = Boolean(startDate) && Boolean(endDate) && endDate < startDate

    const handleSubmit = async (): Promise<void> => {
        if (!eventName.trim() || !startDate || endDateInvalid) {
            return
        }

        await onSubmit({
            eventName: eventName.trim(),
            startDate,
            endDate: endDate || null,
            location: location.trim() || null,
            notes: notes.trim() || null,
        })

        onClose()
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('events.edit.title')}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label={t('events.fields.eventName')}
                        value={eventName}
                        onChange={(event) => setEventName(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label={t('events.fields.startDate')}
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            fullWidth
                            required
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <TextField
                            label={t('events.fields.endDate')}
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            fullWidth
                            error={endDateInvalid}
                            helperText={
                                endDateInvalid
                                    ? t('events.validation.endDateBeforeStart')
                                    : undefined
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Stack>

                    <TextField
                        label={t('events.fields.location')}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        fullWidth
                    />

                    <TextField
                        label={t('events.fields.notes')}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
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
                    disabled={loading || !eventName.trim() || !startDate || endDateInvalid}
                >
                    {t('events.actions.save')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EventEditDialog
