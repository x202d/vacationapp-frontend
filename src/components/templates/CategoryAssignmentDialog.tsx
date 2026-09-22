import { useEffect, useMemo, useState } from 'react'
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
import { Add, DragIndicator, Remove } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import type { TourType } from '../../types/templates/TourTypeTypes'

import { useGetItemsQuery as useGetCategoriesQuery } from '../../stores/templates/CategoryApi'

import { useUpdateCategoriesMutation } from '../../stores/templates/TourTypeApi'

interface CategoryAssignmentDialogProps {
    open: boolean
    tourType: TourType | null
    onClose: () => void
}

interface AssignmentCategory {
    id: string
    name: string
    description: string | null
}

export default function CategoryAssignmentDialog({
    open,
    tourType,
    onClose,
}: CategoryAssignmentDialogProps) {
    const { t } = useTranslation()

    const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery()

    const [updateCategories, { isLoading: isSaving }] = useUpdateCategoriesMutation()

    const [selectedCategories, setSelectedCategories] = useState<AssignmentCategory[]>([])

    const [draggedId, setDraggedId] = useState<string | null>(null)

    useEffect(() => {
        if (!tourType) {
            setSelectedCategories([])
            return
        }

        const assigned = [...(tourType.templateCategories ?? [])]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category) => ({
                id: category.id,
                name: category.name,
                description: category.description ?? null,
            }))

        setSelectedCategories(assigned)
    }, [tourType])

    const selectedIds = useMemo(
        () => new Set(selectedCategories.map((category) => category.id)),
        [selectedCategories],
    )

    const availableCategories = categories.filter((category) => !selectedIds.has(category.id))

    const addCategory = (category: AssignmentCategory) => {
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
        if (!tourType) {
            return
        }

        await updateCategories({
            id: tourType.id,
            data: {
                categoryIds: selectedCategories.map((category) => category.id),
            },
        }).unwrap()

        onClose()
    }

    return (
        <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {t('tourTypes.categories.title')}

                {tourType && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {tourType.name}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent dividers>
                {categoriesLoading ? (
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
                                {t('tourTypes.categories.available')}
                            </Typography>

                            <Paper variant="outlined">
                                {availableCategories.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('tourTypes.categories.noAvailable')}
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
                                                        primary={category.name}
                                                        secondary={category.description}
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
                                {t('tourTypes.categories.assigned')}
                            </Typography>

                            <Paper variant="outlined">
                                {selectedCategories.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('tourTypes.categories.noAssigned')}
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
                                                        primary={category.name}
                                                        secondary={`${t(
                                                            'tourTypes.categories.position',
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

                <Button variant="contained" onClick={handleSave} disabled={isSaving || !tourType}>
                    {isSaving ? t('common.saving') : t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
