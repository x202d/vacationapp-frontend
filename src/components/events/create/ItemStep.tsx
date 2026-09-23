import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
    Checkbox,
    Chip,
    Collapse,
    FormControlLabel,
    List,
    ListItem,
    Paper,
    Stack,
    Typography,
} from '@mui/material'

import type {
    SelectedItems,
    TemplateCategory,
    TemplateItem,
} from '../../../types/events/EventTypes'

interface ItemStepProps {
    categories: TemplateCategory[]
    selectedItems: SelectedItems
    onToggleItem: (categoryId: string, item: TemplateItem) => void
    onToggleCategoryItems: (category: TemplateCategory) => void
}

export default function ItemStep({
    categories,
    selectedItems,
    onToggleItem,
    onToggleCategoryItems,
}: ItemStepProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(() =>
        categories.map((category) => category.id),
    )

    const toggleExpanded = (categoryId: string) => {
        setExpandedCategories((current) =>
            current.includes(categoryId)
                ? current.filter((id) => id !== categoryId)
                : [...current, categoryId],
        )
    }

    return (
        <Stack spacing={2}>
            {categories.map((category) => {
                const items = [...category.items].sort((a, b) => a.sortOrder - b.sortOrder)

                const categorySelectedItems = selectedItems[category.id] ?? []

                const allSelected =
                    items.length > 0 &&
                    items.every((item) => categorySelectedItems.includes(item.id))

                const someSelected = categorySelectedItems.length > 0 && !allSelected

                const expanded = expandedCategories.includes(category.id)

                return (
                    <Paper key={category.id} variant="outlined">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ px: 2, py: 1 }}
                        >
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={() => onToggleCategoryItems(category)}
                            />

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    flex: 1,
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleExpanded(category.id)}
                            >
                                <Typography fontWeight={600}>{category.name}</Typography>

                                <Chip
                                    size="small"
                                    label={`${categorySelectedItems.length}/${items.length}`}
                                />
                            </Stack>

                            <Checkbox
                                checked={expanded}
                                icon={<ExpandMore />}
                                checkedIcon={<ExpandLess />}
                                onChange={() => toggleExpanded(category.id)}
                            />
                        </Stack>

                        <Collapse in={expanded}>
                            <List disablePadding>
                                {items.map((item) => {
                                    const selected = categorySelectedItems.includes(item.id)

                                    return (
                                        <ListItem key={item.id} sx={{ pl: 5 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selected}
                                                        disabled={item.isRequired}
                                                        onChange={() =>
                                                            onToggleItem(category.id, item)
                                                        }
                                                    />
                                                }
                                                label={
                                                    <Stack>
                                                        <Typography>{item.title}</Typography>

                                                        {item.details && (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {item.details}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                }
                                            />

                                            {item.isRequired && (
                                                <Chip size="small" label="Pflicht" sx={{ ml: 1 }} />
                                            )}
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Collapse>
                    </Paper>
                )
            })}
        </Stack>
    )
}
