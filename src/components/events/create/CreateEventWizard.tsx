import { useMemo, useState } from 'react'
import { Button, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'

import ItemStep from './ItemStep'
import SummaryStep from './SummaryStep'
import CategoryStep from './CategoryStep'
import TourTypeStep from './TourTypeStep'

import type {
    CreateEventWizardProps,
    SelectedItems,
    TemplateCategory,
    TemplateTourType,
} from '../../../types/events/EventTypes'

const steps = ['Tourtyp', 'Kategorien', 'Items', 'Zusammenfassung']

export default function CreateEventWizard({
    tourTypes,
    onSubmit,
    onCancel,
    loading = false,
    isCreating = false,
}: CreateEventWizardProps) {
    const [activeStep, setActiveStep] = useState(0)
    const [selectedTourTypeId, setSelectedTourTypeId] = useState<string | null>(null)
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({})

    const selectedTourType = useMemo(
        () => tourTypes.find((tourType) => tourType.id === selectedTourTypeId) ?? null,
        [tourTypes, selectedTourTypeId],
    )

    const selectedCategories = useMemo(() => {
        if (!selectedTourType) {
            return []
        }

        return selectedTourType.templateCategories
            .filter((category) => selectedCategoryIds.includes(category.id))
            .sort((a, b) => a.sortOrder - b.sortOrder)
    }, [selectedTourType, selectedCategoryIds])

    const handleTourTypeSelect = (tourType: TemplateTourType) => {
        setSelectedTourTypeId(tourType.id)

        const categories = [...tourType.templateCategories].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        )

        setSelectedCategoryIds(categories.map((category) => category.id))

        const items: SelectedItems = {}

        categories.forEach((category) => {
            items[category.id] = category.items.map((item) => item.id)
        })

        setSelectedItems(items)
    }

    const handleCategoryToggle = (categoryId: string) => {
        if (!selectedTourType) {
            return
        }

        const category = selectedTourType.templateCategories.find((item) => item.id === categoryId)

        if (!category) {
            return
        }

        const isSelected = selectedCategoryIds.includes(categoryId)

        if (isSelected) {
            setSelectedCategoryIds((current) => current.filter((id) => id !== categoryId))

            setSelectedItems((current) => {
                const next = { ...current }
                delete next[categoryId]

                return next
            })

            return
        }

        setSelectedCategoryIds((current) => [...current, categoryId])

        // Beim Reaktivieren werden ALLE Items der Kategorie
        // wieder ausgewählt.
        setSelectedItems((current) => ({
            ...current,
            [categoryId]: category.items.map((item) => item.id),
        }))
    }

    const handleToggleAllCategories = () => {
        if (!selectedTourType) {
            return
        }

        const categories = selectedTourType.templateCategories

        const allSelected = selectedCategoryIds.length === categories.length

        if (allSelected) {
            setSelectedCategoryIds([])
            setSelectedItems({})

            return
        }

        setSelectedCategoryIds(categories.map((category) => category.id))

        const items: SelectedItems = {}

        categories.forEach((category) => {
            items[category.id] = category.items.map((item) => item.id)
        })

        setSelectedItems(items)
    }

    const handleItemToggle = (categoryId: string, item: TemplateCategory['items'][number]) => {
        if (item.isRequired) {
            return
        }

        setSelectedItems((current) => {
            const categoryItems = current[categoryId] ?? []

            const isSelected = categoryItems.includes(item.id)

            return {
                ...current,
                [categoryId]: isSelected
                    ? categoryItems.filter((id) => id !== item.id)
                    : [...categoryItems, item.id],
            }
        })
    }

    const handleToggleCategoryItems = (category: TemplateCategory) => {
        setSelectedItems((current) => {
            const selectedCategoryItems = current[category.id] ?? []

            const allSelected =
                category.items.length > 0 &&
                category.items.every((item) => selectedCategoryItems.includes(item.id))

            if (allSelected) {
                // Pflicht-Items bleiben ausgewählt.
                return {
                    ...current,
                    [category.id]: category.items
                        .filter((item) => item.isRequired)
                        .map((item) => item.id),
                }
            }

            // Beim Aktivieren werden ALLE Items ausgewählt.
            return {
                ...current,
                [category.id]: category.items.map((item) => item.id),
            }
        })
    }

    const canContinue = () => {
        switch (activeStep) {
            case 0:
                return selectedTourType !== null

            case 1:
                return selectedCategoryIds.length > 0

            case 2:
                return selectedCategories.some(
                    (category) => (selectedItems[category.id] ?? []).length > 0,
                )

            default:
                return true
        }
    }

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            if (!selectedTourType) {
                return
            }

            onSubmit({
                tourTypeId: selectedTourType.id,
                categories: selectedCategories.map((category) => ({
                    categoryId: category.id,
                    itemIds: selectedItems[category.id] ?? [],
                })),
            })

            return
        }

        setActiveStep((current) => current + 1)
    }

    const handleBack = () => {
        setActiveStep((current) => current - 1)
    }

    if (!selectedTourType && activeStep > 0) {
        setActiveStep(0)
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h5">Ausflug erstellen</Typography>

                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === 0 && (
                    <TourTypeStep
                        tourTypes={tourTypes}
                        selectedTourTypeId={selectedTourTypeId}
                        onSelect={handleTourTypeSelect}
                    />
                )}

                {activeStep === 1 && selectedTourType && (
                    <CategoryStep
                        tourType={selectedTourType}
                        selectedCategoryIds={selectedCategoryIds}
                        onToggle={handleCategoryToggle}
                        onToggleAll={handleToggleAllCategories}
                    />
                )}

                {activeStep === 2 && (
                    <ItemStep
                        categories={selectedCategories}
                        selectedItems={selectedItems}
                        onToggleItem={handleItemToggle}
                        onToggleCategoryItems={handleToggleCategoryItems}
                    />
                )}

                {activeStep === 3 && selectedTourType && (
                    <SummaryStep
                        tourType={selectedTourType}
                        categories={selectedCategories}
                        selectedItems={selectedItems}
                    />
                )}

                <Stack direction="row" justifyContent="space-between">
                    <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
                        Zurück
                    </Button>

                    <Stack direction="row" spacing={1}>
                        {onCancel && (
                            <Button variant="outlined" onClick={onCancel} disabled={loading}>
                                Abbrechen
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!canContinue() || loading || isCreating}
                        >
                            {activeStep === steps.length - 1 ? 'Erstellen' : 'Weiter'}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    )
}
