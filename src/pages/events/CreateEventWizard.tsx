import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { CreateEventRequest } from '../../types/events/EventTypes'
import { useCreateEventMutation } from '../../stores/events/EventApi.ts'
import { useGetTourTypesQuery } from '../../stores/templates/TourTypeApi.ts'
import CreateEventWizard from '../../components/events/create/CreateEventWizard'

export default function CreateEventPage() {
    const navigate = useNavigate()

    const { data: tourTypes = [], isLoading } = useGetTourTypesQuery()

    const [createEvent, { isLoading: isCreating }] = useCreateEventMutation()

    const handleSubmit = async (data: CreateEventRequest) => {
        try {
            const event = await createEvent(data).unwrap()

            navigate(`/events/${event.id}`)
        } catch (error) {
            console.error('Event konnte nicht erstellt werden:', error)
        }
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Ausflug erstellen
            </Typography>

            <CreateEventWizard
                tourTypes={tourTypes}
                loading={isLoading}
                isCreating={isCreating}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/events/wizard')}
            />
        </Box>
    )
}
