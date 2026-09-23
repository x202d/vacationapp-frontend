import { useNavigate, useParams } from 'react-router-dom'
import { Alert, CircularProgress, Stack } from '@mui/material'
import EventDetail from '../../components/events/EventDetail'
import {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes.ts'
import {
    useCreateCategoryMutation,
    useCreateItemMutation,
    useDeleteCategoryMutation,
    useDeleteItemMutation,
    useGetEventQuery,
    useUpdateCategoryMutation,
    useUpdateItemMutation,
} from '../../stores/events/EventApi'

const EventDetailPage = () => {
    const { id } = useParams<{ id: string }>()

    const navigate = useNavigate()

    const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation()
    const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation()
    const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation()
    const [createItem, { isLoading: isCreatingItem }] = useCreateItemMutation()
    const [updateItem, { isLoading: isUpdatingItem }] = useUpdateItemMutation()
    const [deleteItem, { isLoading: isDeletingItem }] = useDeleteItemMutation()

    const {
        data: event,
        isLoading,
        isError,
    } = useGetEventQuery(id ?? '', {
        skip: !id,
    })

    const handleCreateCategory = async (data: CreateEventCategoryRequest): Promise<void> => {
        if (!event) {
            return
        }

        await createCategory({
            eventId: event.id,
            data,
        }).unwrap()
    }

    const handleUpdateCategory = async (
        categoryId: string,
        data: UpdateEventCategoryRequest,
    ): Promise<void> => {
        if (!event) {
            return
        }

        await updateCategory({
            eventId: event.id,
            categoryId,
            data,
        }).unwrap()
    }

    const handleDeleteCategory = async (categoryId: string) => {
        if (!id) {
            return
        }

        await deleteCategory({
            eventId: id,
            categoryId,
        }).unwrap()
    }

    const handleCreateItem = async (categoryId: string, data: CreateEventItemRequest) => {
        if (!id) {
            return
        }

        await createItem({
            eventId: id,
            categoryId,
            data,
        }).unwrap()
    }

    const handleUpdateItem = async (
        categoryId: string,
        itemId: string,
        data: UpdateEventItemRequest,
    ) => {
        if (!id) {
            return
        }

        await updateItem({
            eventId: id,
            categoryId,
            itemId,
            data,
        }).unwrap()
    }

    const handleDeleteItem = async (categoryId: string, itemId: string) => {
        if (!id) {
            return
        }

        await deleteItem({
            eventId: id,
            categoryId,
            itemId,
        }).unwrap()
    }

    if (isLoading) {
        return (
            <Stack alignItems="center" py={4}>
                <CircularProgress />
            </Stack>
        )
    }

    if (isError || !event) {
        return <Alert severity="error">Der Ausflug konnte nicht geladen werden.</Alert>
    }

    return (
        <EventDetail
            event={event}
            onBack={() => navigate('/events')}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onCreateItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            mutationLoading={
                isCreatingCategory ||
                isUpdatingCategory ||
                isDeletingCategory ||
                isCreatingItem ||
                isUpdatingItem ||
                isDeletingItem
            }
        />
    )
}

export default EventDetailPage
