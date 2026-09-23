import { useNavigate } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import CategoryIcon from '@mui/icons-material/Category'
import type { Event } from '../../types/events/EventTypes'
import ChecklistIcon from '@mui/icons-material/Checklist'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

interface EventListProps {
    events: Event[]
}

const EventList = ({ events }: EventListProps) => {
    const navigate = useNavigate()

    if (events.length === 0) {
        return <Typography color="text.secondary">Keine Ausflüge vorhanden.</Typography>
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
                                                label={`${categoryCount} ${
                                                    categoryCount === 1 ? 'Kategorie' : 'Kategorien'
                                                }`}
                                                size="small"
                                            />

                                            <Chip
                                                icon={<ChecklistIcon />}
                                                label={`${itemCount} ${
                                                    itemCount === 1 ? 'Item' : 'Items'
                                                }`}
                                                size="small"
                                            />

                                            <Chip
                                                icon={<EventIcon />}
                                                label={new Date(event.createdAt).toLocaleDateString(
                                                    'de-DE',
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
