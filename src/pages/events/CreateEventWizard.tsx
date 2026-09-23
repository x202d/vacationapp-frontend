import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { CreateEventWizardSubmit } from '../../types/events/EventTypes'
import { useCreateItemMutation } from '../../stores/events/WizardApi.ts'
import { useGetItemsQuery } from '../../stores/templates/TourTypeApi.ts'
import CreateEventWizard from '../../components/events/create/CreateEventWizard'

export default function CreateEventPage() {
    const navigate = useNavigate()

    const { data: tourTypes = [], isLoading } = useGetItemsQuery()
    const [createItem, { isLoading: isCreating }] = useCreateItemMutation()

    const handleSubmit = (data: CreateEventWizardSubmit) => {
        console.log('Event erstellen:', data)
        createItem(data)
            .unwrap()
            .then(() => console.log('Successfully created!')) //ToDo: navigate to events
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
