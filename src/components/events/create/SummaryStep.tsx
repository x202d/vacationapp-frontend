import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material'

import type {
    SelectedItems,
    TemplateCategory,
    TemplateTourType,
} from '../../../types/events/EventTypes'

interface SummaryStepProps {
    tourType: TemplateTourType
    categories: TemplateCategory[]
    selectedItems: SelectedItems
}

export default function SummaryStep({ tourType, categories, selectedItems }: SummaryStepProps) {
    const selectedItemCount = categories.reduce(
        (total, category) => total + (selectedItems[category.id]?.length ?? 0),
        0,
    )

    return (
        <Stack spacing={3}>
            {/* Tourtyp */}
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="overline" color="text.secondary" fontWeight={600}>
                        Tourtyp
                    </Typography>

                    <Typography variant="h6">{tourType.name}</Typography>

                    {tourType.description && (
                        <Typography variant="body2" color="text.secondary">
                            {tourType.description}
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* Kategorien */}
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Kategorien</Typography>

                        <Chip size="small" label={`${categories.length} ausgewählt`} />
                    </Stack>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {categories.map((category) => (
                            <Chip key={category.id} label={category.name} variant="outlined" />
                        ))}
                    </Stack>
                </Stack>
            </Paper>

            {/* Items */}
            <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Items</Typography>

                    <Chip size="small" label={`${selectedItemCount} ausgewählt`} />
                </Stack>

                {categories.map((category) => {
                    const selectedItemIds = selectedItems[category.id] ?? []

                    const items = [...category.items]
                        .filter((item) => selectedItemIds.includes(item.id))
                        .sort((a, b) => a.sortOrder - b.sortOrder)

                    return (
                        <Paper
                            key={category.id}
                            variant="outlined"
                            sx={{
                                overflow: 'hidden',
                                borderRadius: 2,
                            }}
                        >
                            {/* Kategorie Header */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    bgcolor: 'action.hover',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography fontWeight={600}>{category.name}</Typography>

                                    <Chip
                                        size="small"
                                        label={`${items.length} ${
                                            items.length === 1 ? 'Item' : 'Items'
                                        }`}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {items.length > 0 ? (
                                <List dense disablePadding>
                                    {items.map((item, index) => (
                                        <ListItem
                                            key={item.id}
                                            divider={index < items.length - 1}
                                            sx={{
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 36,
                                                }}
                                            >
                                                <CheckCircleOutlineIcon
                                                    fontSize="small"
                                                    color="success"
                                                />
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {item.title}
                                                    </Typography>
                                                }
                                                secondary={item.details || undefined}
                                                slotProps={{
                                                    secondary: {
                                                        sx: {
                                                            mt: 0.25,
                                                        },
                                                    },
                                                }}
                                            />

                                            {item.isRequired && (
                                                <Chip
                                                    size="small"
                                                    label="Pflicht"
                                                    variant="outlined"
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 2,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Keine Items ausgewählt
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )
                })}
            </Stack>
        </Stack>
    )
}
