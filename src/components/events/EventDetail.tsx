import { useTranslation } from 'react-i18next'
import EventIcon from '@mui/icons-material/Event'
import NotesIcon from '@mui/icons-material/Notes'
import EventCategoryList from './EventCategoryList'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import type {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    Event,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes'

interface EventDetailProps {
    event: Event
    onBack: () => void
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

const EventDetail = ({
    event,
    onBack,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
    onCreateItem,
    onUpdateItem,
    onDeleteItem,
    mutationLoading = false,
}: EventDetailProps) => {
    const { t } = useTranslation()

    const itemCount = event.categories.reduce((count, category) => count + category.items.length, 0)

    return (
        <Stack spacing={3}>
            <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ alignSelf: 'flex-start' }}>
                {t('events.actions.back')}
            </Button>

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h4" component="h1">
                            {event.eventName}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={3}
                            divider={
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                    }}
                                />
                            }
                        >
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
        </Stack>
    )
}

export default EventDetail
