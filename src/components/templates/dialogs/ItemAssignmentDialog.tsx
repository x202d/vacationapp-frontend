import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { Add, DragIndicator, Remove } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material'

import { TemplateCategory } from '../../../types/templates/CategoryTypes.ts'
import { useGetTemplateItemsQuery } from '../../../stores/templates/ItemsApi.ts'
import { useUpdateCategoryItemsMutation } from '../../../stores/templates/CategoryApi.ts'

interface ItemAssignmentDialogProps {
    open: boolean
    templateCategory: TemplateCategory | null
    onClose: () => void
}

interface AssignmentItem {
    id: string
    title: string
    details: string | null
}

export default function ItemAssignmentDialog({
    open,
    templateCategory,
    onClose,
}: ItemAssignmentDialogProps) {
    const { t } = useTranslation()

    const { data: items = [], isLoading: itemsLoading } = useGetTemplateItemsQuery()

    const [updateCategories, { isLoading: isSaving }] = useUpdateCategoryItemsMutation()

    const [selectedCategories, setSelectedCategories] = useState<AssignmentItem[]>([])

    const [draggedId, setDraggedId] = useState<string | null>(null)

    useEffect(() => {
        if (!templateCategory) {
            setSelectedCategories([])
            return
        }

        const assigned = [...(templateCategory.items ?? [])]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category) => ({
                id: category.id,
                title: category.title,
                details: category.details ?? null,
            }))

        setSelectedCategories(assigned)
    }, [templateCategory])

    const selectedIds = useMemo(
        () => new Set(selectedCategories.map((category) => category.id)),
        [selectedCategories],
    )

    const availableCategories = items.filter((category) => !selectedIds.has(category.id))

    const addCategory = (category: AssignmentItem) => {
        setSelectedCategories((current) => [...current, category])
    }

    const removeCategory = (categoryId: string) => {
        setSelectedCategories((current) => current.filter((category) => category.id !== categoryId))
    }

    const handleDragStart = (categoryId: string) => {
        setDraggedId(categoryId)
    }

    const handleDrop = (targetId: string) => {
        if (!draggedId || draggedId === targetId) {
            return
        }

        setSelectedCategories((current) => {
            const sourceIndex = current.findIndex((category) => category.id === draggedId)

            const targetIndex = current.findIndex((category) => category.id === targetId)

            if (sourceIndex === -1 || targetIndex === -1) {
                return current
            }

            const result = [...current]
            const [moved] = result.splice(sourceIndex, 1)

            result.splice(targetIndex, 0, moved)

            return result
        })

        setDraggedId(null)
    }

    const handleDragEnd = () => {
        setDraggedId(null)
    }

    const handleSave = async () => {
        if (!templateCategory) {
            return
        }

        await updateCategories({
            id: templateCategory.id,
            data: {
                itemIds: selectedCategories.map((category) => category.id),
            },
        }).unwrap()

        onClose()
    }

    return (
        <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {t('categories.items.title')}

                {templateCategory && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {templateCategory.name}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent dividers>
                {itemsLoading ? (
                    <Box
                        sx={{
                            minHeight: 250,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack
                        direction={{
                            xs: 'column',
                            md: 'row',
                        }}
                        spacing={3}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                {t('categories.items.available')}
                            </Typography>

                            <Paper variant="outlined">
                                {availableCategories.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('categories.items.noAvailable')}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List disablePadding>
                                        {availableCategories.map((category, index) => (
                                            <Box key={category.id}>
                                                {index > 0 && <Divider />}

                                                <ListItem
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => addCategory(category)}
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={category.title}
                                                        secondary={category.details}
                                                    />
                                                </ListItem>
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                {t('categories.items.assigned')}
                            </Typography>

                            <Paper variant="outlined">
                                {selectedCategories.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('categories.items.noAssigned')}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List disablePadding>
                                        {selectedCategories.map((category, index) => (
                                            <Box key={category.id}>
                                                {index > 0 && <Divider />}

                                                <ListItem
                                                    draggable
                                                    onDragStart={() => handleDragStart(category.id)}
                                                    onDragOver={(event) => event.preventDefault()}
                                                    onDrop={() => handleDrop(category.id)}
                                                    onDragEnd={handleDragEnd}
                                                    sx={{
                                                        cursor: 'grab',
                                                        '&:active': {
                                                            cursor: 'grabbing',
                                                        },
                                                    }}
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() =>
                                                                removeCategory(category.id)
                                                            }
                                                        >
                                                            <Remove />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 36,
                                                        }}
                                                    >
                                                        <DragIndicator />
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        primary={category.title}
                                                        secondary={`${t(
                                                            'categories.items.position',
                                                        )}: ${index + 1}`}
                                                    />
                                                </ListItem>
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>
                    {t('common.cancel')}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving || !templateCategory}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
