import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import PaginatedList from '../common/PaginatedList.tsx'
import CategoryIcon from '@mui/icons-material/Category'
import ChecklistIcon from '@mui/icons-material/Checklist'
import type { Event } from '../../types/events/EventTypes'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

interface EventListProps {
    events: Event[]
}

const isEventCompleted = (event: Event): boolean => {
    const relevantDate = event.endDate ?? event.startDate

    if (!relevantDate) {
        return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const eventDate = new Date(`${relevantDate.slice(0, 10)}T00:00:00`)

    return eventDate < today
}

const formatEventDate = (startDate: string, endDate: string | null, locale: string): string => {
    const start = new Date(`${startDate.slice(0, 10)}T00:00:00`).toLocaleDateString(locale)

    if (!endDate) {
        return start
    }

    const end = new Date(`${endDate.slice(0, 10)}T00:00:00`).toLocaleDateString(locale)

    return `${start} – ${end}`
}

const EventCard = ({
    event,
    completed,
    locale,
    onClick,
}: {
    event: Event
    completed: boolean
    locale: string
    onClick: () => void
}) => {
    const { t } = useTranslation()

    const categoryCount = event.categories.length

    const itemCount = event.categories.reduce((count, category) => count + category.items.length, 0)

    return (
        <Card
            sx={{
                opacity: completed ? 0.75 : 1,
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Stack spacing={1} minWidth={0}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h6" component="h2" noWrap>
                                    {event.eventName}
                                </Typography>

                                {completed && (
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={t('events.status.completed')}
                                        size="small"
                                        color="success"
                                    />
                                )}
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    icon={<EventIcon />}
                                    label={formatEventDate(event.startDate, event.endDate, locale)}
                                    size="small"
                                    variant="outlined"
                                />

                                <Chip
                                    icon={<CategoryIcon />}
                                    label={t('events.categories.count', {
                                        count: categoryCount,
                                    })}
                                    size="small"
                                />

                                <Chip
                                    icon={<ChecklistIcon />}
                                    label={t('events.items.count', {
                                        count: itemCount,
                                    })}
                                    size="small"
                                />
                            </Stack>
                        </Stack>

                        <ChevronRightIcon color="action" />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const EventSection = ({
    title,
    events,
    completed,
    locale,
}: {
    title: string
    events: Event[]
    completed: boolean
    locale: string
}) => {
    const navigate = useNavigate()

    return (
        <Stack spacing={2}>
            <Typography variant="h5" component="h2">
                {title}
            </Typography>

            <PaginatedList items={events}>
                {(pageItems) => (
                    <Stack spacing={2}>
                        {pageItems.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                completed={completed}
                                locale={locale}
                                onClick={() => navigate(`/events/${event.id}`)}
                            />
                        ))}
                    </Stack>
                )}
            </PaginatedList>
        </Stack>
    )
}

const EventList = ({ events }: EventListProps) => {
    const { t, i18n } = useTranslation()

    if (events.length === 0) {
        return <Typography color="text.secondary">{t('events.empty')}</Typography>
    }

    const openEvents = events
        .filter((event) => !isEventCompleted(event))
        .sort((a, b) => a.startDate.localeCompare(b.startDate))

    const completedEvents = events
        .filter(isEventCompleted)
        .sort((a, b) => b.startDate.localeCompare(a.startDate))

    return (
        <Stack spacing={4}>
            {openEvents.length > 0 && (
                <EventSection
                    title={t('events.sections.open')}
                    events={openEvents}
                    completed={false}
                    locale={i18n.language}
                />
            )}

            {completedEvents.length > 0 && (
                <EventSection
                    title={t('events.sections.completed')}
                    events={completedEvents}
                    completed
                    locale={i18n.language}
                />
            )}
        </Stack>
    )
}

export default EventList
