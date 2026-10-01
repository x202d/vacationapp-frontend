import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import type { Event } from '../../types/events/EventTypes'
import { useGetEventsQuery } from '../../stores/events/EventApi'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material'

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

export default function UpcomingEventsCard() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const { data: events = [], isLoading } = useGetEventsQuery()

    const upcomingEvents = useMemo(() => {
        return events
            .filter((event) => !isEventCompleted(event))
            .filter((event) => event.startDate !== null)
            .sort((a, b) => {
                if (!a.startDate || !b.startDate) {
                    return 0
                }

                return a.startDate.localeCompare(b.startDate)
            })
            .slice(0, 5)
    }, [events])

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('dashboard.upcomingEvents')}
                </Typography>

                {isLoading ? (
                    <Typography color="text.secondary">{t('common.loading')}</Typography>
                ) : upcomingEvents.length === 0 ? (
                    <Typography color="text.secondary">
                        {t('dashboard.noUpcomingEvents')}
                    </Typography>
                ) : (
                    <Stack divider={<Divider />}>
                        {upcomingEvents.map((event) => (
                            <CardActionArea
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                sx={{ borderRadius: 1 }}
                            >
                                <Box
                                    sx={{
                                        py: 1.5,
                                        px: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <EventIcon color="action" />

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography fontWeight={600} noWrap>
                                            {event.eventName}
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                            sx={{ mt: 0.5 }}
                                        >
                                            <Chip
                                                label={formatEventDate(
                                                    event.startDate!,
                                                    event.endDate,
                                                    i18n.language,
                                                )}
                                                size="small"
                                                variant="outlined"
                                            />

                                            {event.location && (
                                                <Chip label={event.location} size="small" />
                                            )}
                                        </Stack>
                                    </Box>

                                    <ChevronRightIcon color="action" />
                                </Box>
                            </CardActionArea>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}
