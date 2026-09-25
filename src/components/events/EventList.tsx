import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import CategoryIcon from '@mui/icons-material/Category'
import ChecklistIcon from '@mui/icons-material/Checklist'
import type { Event } from '../../types/events/EventTypes'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

interface EventListProps {
    events: Event[]
}

const EventList = ({ events }: EventListProps) => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    if (events.length === 0) {
        return <Typography color="text.secondary">{t('events.empty')}</Typography>
    }

    return (
        <Stack spacing={2}>
            {events.map((event) => {
                const categoryCount = event.categories.length

                const itemCount = event.categories.reduce(
                    (count, category) => count + category.items.length,
                    0,
                )

                return (
                    <Card key={event.id}>
                        <CardActionArea onClick={() => navigate(`/events/${event.id}`)}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Stack spacing={1} minWidth={0}>
                                        <Typography variant="h6" component="h2" noWrap>
                                            {event.eventName}
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
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

                                            <Chip
                                                icon={<EventIcon />}
                                                label={new Date(event.createdAt).toLocaleDateString(
                                                    i18n.language,
                                                )}
                                                size="small"
                                                variant="outlined"
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
