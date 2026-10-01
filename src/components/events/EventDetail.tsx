import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import EventIcon from '@mui/icons-material/Event'
import NotesIcon from '@mui/icons-material/Notes'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChecklistIcon from '@mui/icons-material/Checklist'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, Button, Card, CardContent, Divider, Snackbar, Stack, Typography } from '@mui/material'

import EventCategoryList from './EventCategoryList'
import EventEditDialog from './dialogs/EventEditDialog'
import { useLazyGetEventChecklistPdfQuery } from '../../stores/events/EventApi'
import type {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    Event,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
    UpdateEventRequest,
} from '../../types/events/EventTypes'

interface EventDetailProps {
    event: Event
    onBack: () => void
    onChecklist: () => void
    onUpdateEvent: (data: UpdateEventRequest) => Promise<void>
    onCreateCategory: (data: CreateEventCategoryRequest) => Promise<void>
    onUpdateCategory: (categoryId: string, data: UpdateEventCategoryRequest) => Promise<void>
    onDeleteCategory: (categoryId: string) => Promise<void>
    onCreateItem: (categoryId: string, data: CreateEventItemRequest) => Promise<void>
    onUpdateItem: (
        categoryId: string,
        itemId: string,
        data: UpdateEventItemRequest,
    ) => Promise<void>
    onDeleteItem: (categoryId: string, itemId: string) => Promise<void>
    mutationLoading?: boolean
}

const formatDate = (value: string | null, locale: string): string => {
    if (!value) {
        return '—'
    }

    return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(locale)
}

const EventDetail = ({
    event,
    onBack,
    onChecklist,
    onUpdateEvent,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
    onCreateItem,
    onUpdateItem,
    onDeleteItem,
    mutationLoading = false,
}: EventDetailProps) => {
    const { t, i18n } = useTranslation()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [editOpen, setEditOpen] = useState(false)

    const itemCount = event.categories.reduce((count, category) => count + category.items.length, 0)

    const [getEventChecklistPdf, { isFetching: isGeneratingPdf }] =
        useLazyGetEventChecklistPdfQuery()

    const handleExportPdf = async (): Promise<void> => {
        try {
            const blob = await getEventChecklistPdf(event.id).unwrap()

            const url = URL.createObjectURL(blob)

            window.open(url, '_blank')

            URL.revokeObjectURL(url)
        } catch {
            setErrorMessage(t('events.messages.error'))
        }
    }

    const handleUpdateEvent = async (data: UpdateEventRequest): Promise<void> => {
        try {
            await onUpdateEvent(data)
        } catch {
            setErrorMessage(t('events.messages.error'))
            throw new Error('Event update failed')
        }
    }

    return (
        <Stack spacing={3}>
            <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ alignSelf: 'flex-start' }}>
                {t('events.actions.back')}
            </Button>

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                        >
                            <Typography variant="h4" component="h1">
                                {event.eventName}
                            </Typography>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditOpen(true)}
                                >
                                    {t('events.actions.edit')}
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<ChecklistIcon />}
                                    onClick={onChecklist}
                                    title={t('events.checklist.title')}
                                >
                                    {t('events.checklist.title')}
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={handleExportPdf}
                                    disabled={isGeneratingPdf}
                                    title={t('events.checklist.exportPdf')}
                                >
                                    PDF
                                </Button>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={3}
                            divider={
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            sm: 'block',
                                        },
                                    }}
                                />
                            }
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EventIcon color="action" />

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('events.fields.startDate')}
                                    </Typography>

                                    <Typography variant="body1">
                                        {formatDate(event.startDate, i18n.language)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <EventIcon color="action" />

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('events.fields.endDate')}
                                    </Typography>

                                    <Typography variant="body1">
                                        {event.endDate
                                            ? formatDate(event.endDate, i18n.language)
                                            : t('events.fields.singleDay')}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <EventIcon color="action" />

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('events.categories.title')}
                                    </Typography>

                                    <Typography variant="body1">
                                        {event.categories.length}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <NotesIcon color="action" />

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('events.items.title')}
                                    </Typography>

                                    <Typography variant="body1">{itemCount}</Typography>
                                </Box>
                            </Stack>

                            {event.location && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon color="action" />

                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('events.fields.location')}
                                        </Typography>

                                        <Typography variant="body1">{event.location}</Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>

                        {event.notes && (
                            <>
                                <Divider />

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {t('events.fields.notes')}
                                    </Typography>

                                    <Typography>{event.notes}</Typography>
                                </Box>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <EventCategoryList
                eventId={event.id}
                categories={event.categories}
                onCreate={onCreateCategory}
                onUpdate={onUpdateCategory}
                onDelete={onDeleteCategory}
                onCreateItem={onCreateItem}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
                mutationLoading={mutationLoading}
            />

            <EventEditDialog
                open={editOpen}
                event={event}
                loading={mutationLoading}
                onClose={() => setEditOpen(false)}
                onSubmit={handleUpdateEvent}
            />

            <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={5000}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />
        </Stack>
    )
}

export default EventDetail
