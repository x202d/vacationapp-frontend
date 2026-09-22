import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Snackbar,
} from '@mui/material'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import PageHeader from '../components/common/PageHeader'
import DataTable, {
    DataTableColumn,
} from '../components/common/DataTable'

import ConfirmDialog from '../components/common/ConfirmDialog'

import TourTypeForm from '../pages/templates/TourTypeForm'

import {
    useCreateItemMutation,
    useDeleteItemMutation,
    useGetItemsQuery,
    useUpdateItemMutation,
} from '../stores/templates/TourTypeApi'

import type {
    CreateTourTypeRequest,
    TourType,
} from '../types/templates/TourTypeTypes'

export default function TourTypesPage() {
    const { t } = useTranslation()

    const {
        data: items = [],
        isLoading,
    } = useGetItemsQuery()

    const [createItem, createState] =
        useCreateItemMutation()

    const [updateItem, updateState] =
        useUpdateItemMutation()

    const [deleteItem, deleteState] =
        useDeleteItemMutation()

    const [dialogOpen, setDialogOpen] =
        useState(false)

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false)

    const [selectedItem, setSelectedItem] =
        useState<TourType | null>(null)

    const [error, setError] = useState<string | null>(
        null,
    )

    const isSaving =
        createState.isLoading ||
        updateState.isLoading

    const columns: DataTableColumn<TourType>[] = [
        {
            key: 'name',
            label: t('tourTypes.fields.name'),
        },
        {
            key: 'description',
            label: t(
                'tourTypes.fields.description',
            ),
        },
        {
            key: 'isActive',
            label: t(
                'tourTypes.fields.isActive',
            ),
            render: (item) =>
                item.isActive
                    ? t('common.active')
                    : t('common.inactive'),
        },
    ]

    const handleCreate = () => {
        setSelectedItem(null)
        setDialogOpen(true)
    }

    const handleEdit = (item: TourType) => {
        setSelectedItem(item)
        setDialogOpen(true)
    }

    const handleDelete = (item: TourType) => {
        setSelectedItem(item)
        setDeleteDialogOpen(true)
    }

    const handleSave = async (
        data: CreateTourTypeRequest,
    ) => {
        try {
            if (selectedItem) {
                await updateItem({
                    id: selectedItem.id,
                    data,
                }).unwrap()
            } else {
                await createItem(data).unwrap()
            }

            setDialogOpen(false)
            setSelectedItem(null)
        } catch {
            setError(
                'Beim Speichern ist ein Fehler aufgetreten.',
            )
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedItem) {
            return
        }

        try {
            await deleteItem(
                selectedItem.id,
            ).unwrap()

            setDeleteDialogOpen(false)
            setSelectedItem(null)
        } catch {
            setError(
                'Beim Löschen ist ein Fehler aufgetreten.',
            )
        }
    }

    return (
        <>
            <PageHeader
                title={t('tourTypes.title')}
                description={t(
                    'tourTypes.description',
                )}
                action={{
                    label: t(
                        'tourTypes.create',
                    ),
                    onClick: handleCreate,
                }}
            />

            <DataTable
                data={items}
                columns={columns}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog
                open={dialogOpen}
                onClose={
                    isSaving
                        ? undefined
                        : () =>
                            setDialogOpen(
                                false,
                            )
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {selectedItem
                        ? t(
                            'tourTypes.edit',
                        )
                        : t(
                            'tourTypes.create',
                        )}
                </DialogTitle>

                <DialogContent>
                    <TourTypeForm
                        formId="tour-type-form"
                        item={selectedItem}
                        onSubmit={handleSave}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setDialogOpen(
                                false,
                            )
                        }
                        disabled={isSaving}
                    >
                        {t(
                            'common.actions.cancel',
                        )}
                    </Button>

                    <Button
                        type="submit"
                        form="tour-type-form"
                        variant="contained"
                        disabled={isSaving}
                    >
                        {t(
                            'common.actions.save',
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteDialogOpen}
                title={t(
                    'tourTypes.delete.title',
                )}
                message={t(
                    'tourTypes.delete.message',
                )}
                loading={
                    deleteState.isLoading
                }
                onCancel={() =>
                    setDeleteDialogOpen(
                        false,
                    )
                }
                onConfirm={
                    handleConfirmDelete
                }
            />

            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                onClose={() => setError(null)}
            >
                <Alert
                    severity="error"
                    onClose={() =>
                        setError(null)
                    }
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}