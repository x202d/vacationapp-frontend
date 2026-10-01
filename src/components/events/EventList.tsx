import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import CategoryIcon from '@mui/icons-material/Category'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

import type { Event } from '../../types/events/EventTypes'

interface EventListProps {
    events: Event[]
}

const isEventCompleted = (event: Event): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const relevantDate = event.endDate ?? event.startDate

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

const EventList = ({ events }: EventListProps) => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    if (events.length === 0) {
        return <Typography color="text.secondary">{t('events.empty')}</Typography>
    }

    const sortedEvents = [...events].sort((a, b) => {
        const aCompleted = isEventCompleted(a)
        const bCompleted = isEventCompleted(b)

        if (aCompleted !== bCompleted) {
            return aCompleted ? 1 : -1
        }

        return 0
    })

    return (
        <Stack spacing={2}>
            {sortedEvents.map((event) => {
                const completed = isEventCompleted(event)

                const categoryCount = event.categories.length

                const itemCount = event.categories.reduce(
                    (count, category) => count + category.items.length,
                    0,
                )

                return (
                    <Card
                        key={event.id}
                        sx={{
                            opacity: completed ? 0.75 : 1,
                        }}
                    >
                        <CardActionArea onClick={() => navigate(`/events/${event.id}`)}>
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

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            <Chip
                                                icon={<EventIcon />}
                                                label={formatEventDate(
                                                    event.startDate,
                                                    event.endDate,
                                                    i18n.language,
                                                )}
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
            })}
        </Stack>
    )
}

export default EventList
