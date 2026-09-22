import { Container, Typography } from '@mui/material'
import InputListCard from '../components/InputListCard'
import { useTranslation } from 'react-i18next'
import { useCreateItemMutation, useGetItemsQuery } from '../stores/templates/TourTypeApi'

function TourTypes() {
    const { t } = useTranslation()

    const { data: items = [], isLoading, isError } = useGetItemsQuery()

    const [createItem, { isLoading: isCreating }] = useCreateItemMutation()

    const handleAddItem = async (name: string) => {
        await createItem({
            name,
            description: null,
            isActive: true,
        }).unwrap()
    }

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography>Lade Items...</Typography>
            </Container>
        )
    }

    if (isError) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography color="error">Items konnten nicht geladen werden.</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <InputListCard
                title={t('common.save')}
                description="Deine Items aus der API"
                inputLabel="Neues Item"
                buttonLabel={isCreating ? 'Wird hinzugefügt...' : 'Item hinzufügen'}
                items={items}
                onAdd={handleAddItem}
            />
        </Container>
    )
}

export default TourTypes
