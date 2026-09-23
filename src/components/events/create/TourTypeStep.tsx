import { useTranslation } from 'react-i18next'
import { TourType } from '../../../types/templates/TourTypeTypes.ts'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

interface TourTypeStepProps {
    tourTypes: TourType[]
    selectedTourTypeId: string | null
    onSelect: (tourType: TourType) => void
}

export default function TourTypeStep({
    tourTypes,
    selectedTourTypeId,
    onSelect,
}: TourTypeStepProps) {
    const { t } = useTranslation()

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {t('events.wizard.tourType.title')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('events.wizard.tourType.description')}
            </Typography>

            <Stack spacing={2}>
                {tourTypes.map((tourType) => {
                    const selected = selectedTourTypeId === tourType.id

                    const itemCount = tourType.templateCategories.reduce(
                        (count, category) => count + category.items.length,
                        0,
                    )

                    return (
                        <Card
                            key={tourType.id}
                            variant="outlined"
                            sx={{
                                borderWidth: selected ? 2 : 1,
                                borderColor: selected ? 'primary.main' : 'divider',
                            }}
                        >
                            <CardActionArea onClick={() => onSelect(tourType)}>
                                <CardContent>
                                    <Typography variant="h6">{tourType.name}</Typography>

                                    {tourType.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {tourType.description}
                                        </Typography>
                                    )}

                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                        <Chip
                                            size="small"
                                            label={t('events.categories.count', {
                                                count: tourType.templateCategories.length,
                                            })}
                                        />

                                        <Chip
                                            size="small"
                                            label={t('events.items.count', {
                                                count: itemCount,
                                            })}
                                        />
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })}

                {tourTypes.length === 0 && (
                    <Typography color="text.secondary">
                        {t('events.wizard.tourType.empty')}
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}
