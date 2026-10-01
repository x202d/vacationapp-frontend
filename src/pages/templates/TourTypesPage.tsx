import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Add, Category } from '@mui/icons-material'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
} from '@mui/material'

import PageHeader from '../../components/common/PageHeader.tsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.tsx'
import TourTypeForm from '../../components/templates/TourTypeForm.tsx'
import DataTable, { type DataTableColumn } from '../../components/common/DataTable.tsx'

import CategoryAssignmentDialog from '../../components/templates/dialogs/CategoryAssignmentDialog.tsx'

import type { CreateTourTypeRequest, TourType } from '../../types/templates/TourTypeTypes.ts'

import {
    useCreateTourTypeMutation,
    useDeleteTourTypeMutation,
    useGetTourTypesQuery,
    useUpdateTourTypeMutation,
} from '../../stores/templates/TourTypeApi.ts'

export default function TourTypesPage() {
    const { t } = useTranslation()

    const { data: items = [], isLoading, isFetching } = useGetTourTypesQuery()

    const [createItem, { isLoading: isCreating }] = useCreateTourTypeMutation()

    const [updateItem, { isLoading: isUpdating }] = useUpdateTourTypeMutation()

    const [deleteItem, { isLoading: isDeleting }] = useDeleteTourTypeMutation()
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

    const [categoryTourType, setCategoryTourType] = useState<TourType | null>(null)

    const handleManageCategories = (item: TourType) => {
        setCategoryTourType(item)
        setCategoryDialogOpen(true)
    }

    const handleCloseCategoryDialog = () => {
        setCategoryDialogOpen(false)
        setCategoryTourType(null)
    }
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<TourType | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const formId = 'tour-type-form'
    const isSaving = isCreating || isUpdating

    const handleCreate = () => {
        setSelectedItem(null)
        setFormOpen(true)
    }

    const handleEdit = (item: TourType) => {
        setSelectedItem(item)
        setFormOpen(true)
    }

    const handleDelete = (item: TourType) => {
        setSelectedItem(item)
        setDeleteOpen(true)
    }

    const handleCloseForm = () => {
        if (isSaving) {
            return
        }

        setFormOpen(false)
        setSelectedItem(null)
    }

    const handleSave = async (data: CreateTourTypeRequest) => {
        try {
            if (selectedItem) {
                await updateItem({
                    id: selectedItem.id,
                    data,
                }).unwrap()

                setSuccess(t('tourTypes.messages.updated'))
            } else {
                await createItem(data).unwrap()

                setSuccess(t('tourTypes.messages.created'))
            }

            setFormOpen(false)
            setSelectedItem(null)
        } catch {
            setError(t('tourTypes.messages.saveError'))
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedItem) {
            return
        }

        try {
            await deleteItem(selectedItem.id).unwrap()

            setDeleteOpen(false)
            setSelectedItem(null)
            setSuccess(t('tourTypes.messages.deleted'))
        } catch {
            setError(t('tourTypes.messages.deleteError'))
        }
    }

    const columns: DataTableColumn<TourType>[] = [
        {
            key: 'name',
            searchable: true,
            label: t('tourTypes.table.name'),
        },
        {
            key: 'description',
            searchable: true,
            label: t('tourTypes.table.description'),
            render: (item) =>
                item.description || (
                    <span style={{ opacity: 0.5 }}>{t('common.notAvailable')}</span>
                ),
        },
        {
            key: 'isActive',
            label: t('tourTypes.table.status'),
            render: (item) => (item.isActive ? t('common.active') : t('common.inactive')),
        },
    ]

    return (
        <>
            <PageHeader
                title={t('tourTypes.title')}
                description={t('tourTypes.description')}
                action={{
                    label: t('tourTypes.actions.create'),
                    icon: <Add />,
                    onClick: handleCreate,
                }}
            />

            <DataTable
                data={items}
                columns={columns}
                loading={isLoading || isFetching}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchable
                actions={[
                    {
                        label: t('tourTypes.categories.manage'),
                        icon: <Category />,
                        onClick: handleManageCategories,
                    },
                ]}
            />

            <Dialog open={formOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedItem
                        ? t('tourTypes.dialog.editTitle')
                        : t('tourTypes.dialog.createTitle')}
                </DialogTitle>

                <DialogContent dividers>
                    <TourTypeForm item={selectedItem} formId={formId} onSubmit={handleSave} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseForm} disabled={isSaving}>
                        {t('common.cancel')}
                    </Button>

                    <Button type="submit" form={formId} variant="contained" disabled={isSaving}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                title={t('tourTypes.dialog.deleteTitle')}
                message={t('tourTypes.dialog.deleteMessage', {
                    name: selectedItem?.name ?? '',
                })}
                loading={isDeleting}
                onCancel={() => {
                    if (!isDeleting) {
                        setDeleteOpen(false)
                        setSelectedItem(null)
                    }
                }}
                onConfirm={handleConfirmDelete}
            />

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess(null)}
            >
                <Alert severity="success" variant="filled" onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() => setError(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
            <CategoryAssignmentDialog
                open={categoryDialogOpen}
                tourType={categoryTourType}
                onClose={handleCloseCategoryDialog}
            />
        </>
    )
}
