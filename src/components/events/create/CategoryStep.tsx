import { Checkbox, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'

import type { TemplateTourType } from './types'

interface CategoryStepProps {
    tourType: TemplateTourType
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
                        primary="Alle Kategorien"
                        secondary={`${selectedCategoryIds.length} von ${categories.length} ausgewählt`}
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
                            secondary={category.description ?? `${category.items.length} Items`}
                        />
                    </ListItem>
                ))}

                {categories.length === 0 && (
                    <ListItem>
                        <Typography color="text.secondary">
                            Für diesen Tourtyp sind keine Kategorien vorhanden.
                        </Typography>
                    </ListItem>
                )}
            </List>
        </Paper>
    )
}
