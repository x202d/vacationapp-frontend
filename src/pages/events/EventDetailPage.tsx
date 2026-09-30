import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import EventDetail from '../../components/events/EventDetail'
import { Alert, CircularProgress, Snackbar, Stack } from '@mui/material'
import type {
    CreateEventCategoryRequest,
    CreateEventItemRequest,
    UpdateEventCategoryRequest,
    UpdateEventItemRequest,
} from '../../types/events/EventTypes'
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
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

    const handleMutationError = (error: unknown): never => {
        setErrorMessage(t('events.messages.error'))
        throw error
    }

    const handleCreateCategory = async (data: CreateEventCategoryRequest): Promise<void> => {
        if (!event) {
            return
        }

        try {
            await createCategory({
                eventId: event.id,
                data,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    const handleUpdateCategory = async (
        categoryId: string,
        data: UpdateEventCategoryRequest,
    ): Promise<void> => {
        if (!event) {
            return
        }

        try {
            await updateCategory({
                eventId: event.id,
                categoryId,
                data,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    const handleDeleteCategory = async (categoryId: string): Promise<void> => {
        if (!id) {
            return
        }

        try {
            await deleteCategory({
                eventId: id,
                categoryId,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    const handleCreateItem = async (
        categoryId: string,
        data: CreateEventItemRequest,
    ): Promise<void> => {
        if (!id) {
            return
        }

        try {
            await createItem({
                eventId: id,
                categoryId,
                data,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    const handleUpdateItem = async (
        categoryId: string,
        itemId: string,
        data: UpdateEventItemRequest,
    ): Promise<void> => {
        if (!id) {
            return
        }

        try {
            await updateItem({
                eventId: id,
                categoryId,
                itemId,
                data,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    const handleDeleteItem = async (categoryId: string, itemId: string): Promise<void> => {
        if (!id) {
            return
        }

        try {
            await deleteItem({
                eventId: id,
                categoryId,
                itemId,
            }).unwrap()
        } catch (error) {
            handleMutationError(error)
        }
    }

    if (isLoading) {
        return (
            <Stack alignItems="center" py={4}>
                <CircularProgress />
            </Stack>
        )
    }

    if (isError || !event) {
        return <Alert severity="error">{t('events.messages.loadError')}</Alert>
    }

    return (
        <>
            <EventDetail
                event={event}
                onBack={() => navigate('/events')}
                onChecklist={() => navigate(`/events/${event.id}/checklist`)}
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

            <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={5000}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />
        </>
    )
}

export default EventDetailPage
