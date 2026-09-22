import { useState } from 'react'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import PageHeader from '../../components/common/PageHeader.tsx'
import DataTable, { type DataTableColumn } from '../../components/common/DataTable.tsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.tsx'
import CategoryForm from '../../components/templates/CategoryForm.tsx'

import type { Category, CreateCategoryRequest } from '../../types/templates/CategoryTypes.ts'

import {
    useCreateItemMutation,
    useDeleteItemMutation,
    useGetItemsQuery,
    useUpdateItemMutation,
} from '../../stores/templates/CategoryApi.ts'

export default function CategoriesPage() {
    const { t } = useTranslation()

    const { data: items = [], isLoading, isFetching } = useGetItemsQuery()

    const [createItem, { isLoading: isCreating }] = useCreateItemMutation()

    const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()

    const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation()

    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [selectedItem, setSelectedItem] = useState<Category | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const formId = 'category-form'

    const isSaving = isCreating || isUpdating

    const handleCreate = () => {
        setSelectedItem(null)
        setFormOpen(true)
    }

    const handleEdit = (item: Category) => {
        setSelectedItem(item)
        setFormOpen(true)
    }

    const handleDelete = (item: Category) => {
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

    const handleSave = async (data: CreateCategoryRequest) => {
        try {
            if (selectedItem) {
                await updateItem({
                    id: selectedItem.id,
                    data,
                }).unwrap()

                setSuccess(t('categories.messages.updated'))
            } else {
                await createItem(data).unwrap()

                setSuccess(t('categories.messages.created'))
            }

            setFormOpen(false)
            setSelectedItem(null)
        } catch {
            setError(t('categories.messages.saveError'))
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
            setSuccess(t('categories.messages.deleted'))
        } catch {
            setError(t('categories.messages.deleteError'))
        }
    }

    const columns: DataTableColumn<Category>[] = [
        {
            key: 'name',
            label: t('categories.table.name'),
        },
        {
            key: 'description',
            label: t('categories.table.description'),
            render: (item) =>
                item.description || (
                    <span style={{ opacity: 0.5 }}>{t('common.notAvailable')}</span>
                ),
        },
        {
            key: 'sortOrder',
            label: t('categories.table.sortOrder'),
        },
    ]

    return (
        <>
            <PageHeader
                title={t('categories.title')}
                description={t('categories.description')}
                action={{
                    label: t('categories.actions.create'),
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
            />

            <Dialog open={formOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedItem
                        ? t('categories.dialog.editTitle')
                        : t('categories.dialog.createTitle')}
                </DialogTitle>

                <DialogContent dividers>
                    <CategoryForm item={selectedItem} formId={formId} onSubmit={handleSave} />
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
                title={t('categories.dialog.deleteTitle')}
                message={t('categories.dialog.deleteMessage', {
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

            <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => setError(null)}>
                <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}
