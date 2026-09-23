import { useTranslation } from 'react-i18next'
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

import type { SelectedItems } from '../../../types/events/EventTypes'
import type { TourType } from '../../../types/templates/TourTypeTypes.ts'
import type { TemplateCategory } from '../../../types/templates/CategoryTypes.ts'

interface SummaryStepProps {
    tourType: TourType
    categories: TemplateCategory[]
    selectedItems: SelectedItems
}

export default function SummaryStep({ tourType, categories, selectedItems }: SummaryStepProps) {
    const { t } = useTranslation()

    const selectedItemCount = categories.reduce(
        (total, category) => total + (selectedItems[category.id]?.length ?? 0),
        0,
    )

    return (
        <Stack spacing={3}>
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="overline" color="text.secondary" fontWeight={600}>
                        {t('events.wizard.summary.tourType')}
                    </Typography>

                    <Typography variant="h6">{tourType.name}</Typography>

                    {tourType.description && (
                        <Typography variant="body2" color="text.secondary">
                            {tourType.description}
                        </Typography>
                    )}
                </Stack>
            </Paper>

            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{t('events.categories.title')}</Typography>

                        <Chip
                            size="small"
                            label={t('events.categories.count', {
                                count: categories.length,
                            })}
                        />
                    </Stack>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {categories.map((category) => (
                            <Chip key={category.id} label={category.name} variant="outlined" />
                        ))}
                    </Stack>
                </Stack>
            </Paper>

            <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{t('events.items.title')}</Typography>

                    <Chip
                        size="small"
                        label={t('events.items.count', {
                            count: selectedItemCount,
                        })}
                    />
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
                                        label={t('events.items.count', {
                                            count: items.length,
                                        })}
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
                                            <ListItemIcon sx={{ minWidth: 36 }}>
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
                                                    label={t('events.items.required')}
                                                    variant="outlined"
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ px: 2, py: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('events.wizard.summary.noItems')}
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
