import { useState } from 'react'
import { Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import PageHeader from '../../components/common/PageHeader.tsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.tsx'
import DataTable, { type DataTableColumn } from '../../components/common/DataTable.tsx'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
} from '@mui/material'

import ItemForm from '../../components/templates/ItemForm.tsx'
import { CreateTemplateItemRequest, TemplateItem } from '../../types/templates/ItemTypes.ts'
import {
    useCreateItemMutation,
    useDeleteItemMutation,
    useGetItemsQuery,
    useUpdateItemMutation,
} from '../../stores/templates/ItemsApi'

export default function ItemsPage() {
    const { t } = useTranslation()

    const { data: items = [], isLoading, isFetching } = useGetItemsQuery()

    const [createItem, { isLoading: isCreating }] = useCreateItemMutation()

    const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()

    const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation()

    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [selectedItem, setSelectedItem] = useState<TemplateItem | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const formId = 'item-form'

    const isSaving = isCreating || isUpdating

    const handleCreate = () => {
        setSelectedItem(null)
        setFormOpen(true)
    }

    const handleEdit = (item: TemplateItem) => {
        setSelectedItem(item)
        setFormOpen(true)
    }

    const handleDelete = (item: TemplateItem) => {
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

    const handleSave = async (data: CreateTemplateItemRequest) => {
        try {
            if (selectedItem) {
                await updateItem({
                    id: selectedItem.id,
                    data,
                }).unwrap()

                setSuccess(t('items.messages.updated'))
            } else {
                await createItem(data).unwrap()

                setSuccess(t('items.messages.created'))
            }

            setFormOpen(false)
            setSelectedItem(null)
        } catch {
            setError(t('items.messages.saveError'))
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
            setSuccess(t('items.messages.deleted'))
        } catch {
            setError(t('items.messages.deleteError'))
        }
    }

    const columns: DataTableColumn<TemplateItem>[] = [
        {
            key: 'title',
            label: t('items.table.name'),
        },
        {
            key: 'details',
            label: t('items.table.description'),
            render: (item) =>
                item.details || <span style={{ opacity: 0.5 }}>{t('common.notAvailable')}</span>,
        },
        {
            key: 'sortOrder',
            label: t('items.table.sortOrder'),
        },
    ]

    return (
        <>
            <PageHeader
                title={t('items.title')}
                description={t('items.description')}
                action={{
                    label: t('items.actions.create'),
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
                    {selectedItem ? t('items.dialog.editTitle') : t('items.dialog.createTitle')}
                </DialogTitle>

                <DialogContent dividers>
                    <ItemForm item={selectedItem} formId={formId} onSubmit={handleSave} />
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
                title={t('items.dialog.deleteTitle')}
                message={t('items.dialog.deleteMessage', {
                    name: selectedItem?.title ?? '',
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
