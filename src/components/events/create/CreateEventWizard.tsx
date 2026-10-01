import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'

import type { TourType } from '../../../types/templates/TourTypeTypes'
import type { CreateEventRequest, SelectedItems } from '../../../types/events/EventTypes'

import DateStep from './DateStep'
import ItemStep from './ItemStep'
import SummaryStep from './SummaryStep'
import CategoryStep from './CategoryStep'
import TourTypeStep from './TourTypeStep'
import { TemplateCategory } from '../../../types/templates/CategoryTypes.ts'

interface CreateEventWizardProps {
    tourTypes: TourType[]
    onSubmit: (data: CreateEventRequest) => void | Promise<void>
    onCancel?: () => void
    loading?: boolean
    isCreating?: boolean
}

export default function CreateEventWizard({
    tourTypes,
    onSubmit,
    onCancel,
    loading = false,
    isCreating = false,
}: CreateEventWizardProps) {
    const { t } = useTranslation()

    const steps = [
        t('events.wizard.steps.tourType'),
        t('events.wizard.steps.date'),
        t('events.wizard.steps.categories'),
        t('events.wizard.steps.items'),
        t('events.wizard.steps.summary'),
    ]

    const [activeStep, setActiveStep] = useState(0)
    const [selectedTourTypeId, setSelectedTourTypeId] = useState<string | null>(null)
    const [startDate, setStartDate] = useState(() => {
        const today = new Date()

        return today.toISOString().slice(0, 10)
    })
    const [endDate, setEndDate] = useState('')
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

    const handleTourTypeSelect = (tourType: TourType) => {
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

        const category = selectedTourType.templateCategories.find(
            (category) => category.id === categoryId,
        )

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

        setSelectedItems((current) => ({
            ...current,
            [categoryId]: category.items.map((item) => item.id),
        }))
    }

    const handleToggleAllCategories = () => {
        if (!selectedTourType) {
            return
        }

        const categories = [...selectedTourType.templateCategories].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        )

        const allSelected =
            categories.length > 0 &&
            categories.every((category) => selectedCategoryIds.includes(category.id))

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
                return {
                    ...current,
                    [category.id]: category.items
                        .filter((item) => item.isRequired)
                        .map((item) => item.id),
                }
            }

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
                if (!startDate) {
                    return false
                }

                return !(endDate && endDate < startDate)

            case 2:
                return selectedCategoryIds.length > 0

            case 3:
                return selectedCategories.some(
                    (category) => (selectedItems[category.id] ?? []).length > 0,
                )

            default:
                return true
        }
    }

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            if (!selectedTourType || !startDate) {
                return
            }

            onSubmit({
                tourTypeId: selectedTourType.id,
                startDate,
                endDate: endDate || null,
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
        setActiveStep((current) => Math.max(0, current - 1))
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h5">{t('events.create')}</Typography>

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

                {activeStep === 1 && (
                    <DateStep
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                )}

                {activeStep === 2 && selectedTourType && (
                    <CategoryStep
                        tourType={selectedTourType}
                        selectedCategoryIds={selectedCategoryIds}
                        onToggle={handleCategoryToggle}
                        onToggleAll={handleToggleAllCategories}
                    />
                )}

                {activeStep === 3 && (
                    <ItemStep
                        categories={selectedCategories}
                        selectedItems={selectedItems}
                        onToggleItem={handleItemToggle}
                        onToggleCategoryItems={handleToggleCategoryItems}
                    />
                )}

                {activeStep === 4 && selectedTourType && (
                    <SummaryStep
                        tourType={selectedTourType}
                        categories={selectedCategories}
                        selectedItems={selectedItems}
                    />
                )}

                <Stack direction="row" justifyContent="space-between">
                    <Button
                        onClick={handleBack}
                        disabled={activeStep === 0 || loading || isCreating}
                    >
                        {t('events.actions.back')}
                    </Button>

                    <Stack direction="row" spacing={1}>
                        {onCancel && (
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={loading || isCreating}
                            >
                                {t('events.actions.cancel')}
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!canContinue() || loading || isCreating}
                        >
                            {activeStep === steps.length - 1
                                ? t('events.create')
                                : t('events.wizard.next')}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    )
}
