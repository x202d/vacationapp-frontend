import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'

import type { TemplateTourType } from '../../../types/events/EventTypes'

interface TourTypeStepProps {
    tourTypes: TemplateTourType[]
    selectedTourTypeId: string | null
    onSelect: (tourType: TemplateTourType) => void
}

export default function TourTypeStep({
    tourTypes,
    selectedTourTypeId,
    onSelect,
}: TourTypeStepProps) {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Tourtyp auswählen
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Wähle eine Vorlage aus, aus der der neue Ausflug erstellt werden soll.
            </Typography>

            <Stack spacing={2}>
                {tourTypes.map((tourType) => {
                    const selected = selectedTourTypeId === tourType.id
                    console.log(tourType)
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
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        spacing={2}
                                    >
                                        <Box>
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
                                                    label={`${tourType.templateCategories.length} Kategorien`}
                                                />

                                                <Chip size="small" label={`${itemCount} Items`} />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </Stack>
        </Box>
    )
}
