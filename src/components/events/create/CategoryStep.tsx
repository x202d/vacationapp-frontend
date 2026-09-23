import { useTranslation } from 'react-i18next'
import { Checkbox, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'

import type { TourType } from '../../../types/templates/TourTypeTypes'

interface CategoryStepProps {
    tourType: TourType
    selectedCategoryIds: string[]
    onToggle: (categoryId: string) => void
    onToggleAll: () => void
}

export default function CategoryStep({
    tourType,
    selectedCategoryIds,
    onToggle,
    onToggleAll,
}: CategoryStepProps) {
    const { t } = useTranslation()

    const categories = [...tourType.templateCategories].sort((a, b) => a.sortOrder - b.sortOrder)

    const allSelected =
        categories.length > 0 &&
        categories.every((category) => selectedCategoryIds.includes(category.id))

    const someSelected = selectedCategoryIds.length > 0 && !allSelected

    return (
        <Paper variant="outlined">
            <List>
                <ListItem>
                    <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={onToggleAll}
                    />

                    <ListItemText
                        primary={t('events.wizard.categories.all')}
                        secondary={t('events.wizard.categories.selected', {
                            selected: selectedCategoryIds.length,
                            count: categories.length,
                        })}
                    />
                </ListItem>

                <Divider />

                {categories.map((category) => (
                    <ListItem key={category.id}>
                        <Checkbox
                            checked={selectedCategoryIds.includes(category.id)}
                            onChange={() => onToggle(category.id)}
                        />

                        <ListItemText
                            primary={category.name}
                            secondary={
                                category.description ??
                                t('events.items.count', {
                                    count: category.items.length,
                                })
                            }
                        />
                    </ListItem>
                ))}

                {categories.length === 0 && (
                    <ListItem>
                        <Typography color="text.secondary">
                            {t('events.wizard.categories.empty')}
                        </Typography>
                    </ListItem>
                )}
            </List>
        </Paper>
    )
}
