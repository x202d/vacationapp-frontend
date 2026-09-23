import EventList from '../../components/events/EventList'
import PageHeader from '../../components/common/PageHeader'
import { Alert, CircularProgress, Stack } from '@mui/material'
import { useGetEventsQuery } from '../../stores/events/EventApi'

const EventsPage = () => {
    const { data: events = [], isLoading, isError } = useGetEventsQuery()

    return (
        <Stack spacing={3}>
            <PageHeader title="Ausflüge" />

            {isLoading && (
                <Stack alignItems="center" py={4}>
                    <CircularProgress />
                </Stack>
            )}

            {isError && <Alert severity="error">Die Ausflüge konnten nicht geladen werden.</Alert>}

            {!isLoading && !isError && <EventList events={events} />}
        </Stack>
    )
}

export default EventsPage
