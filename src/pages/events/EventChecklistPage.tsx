import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PrintIcon from '@mui/icons-material/Print'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageHeader from '../../components/common/PageHeader'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
    useGetEventQuery,
    useLazyGetEventChecklistPdfQuery,
    useUpdateItemMutation,
} from '../../stores/events/EventApi'

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'

const EventChecklistPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [updateItem] = useUpdateItemMutation()

    const [getEventChecklistPdf, { isFetching: isGeneratingPdf }] =
        useLazyGetEventChecklistPdfQuery()

    const {
        data: event,
        isLoading,
        isError,
    } = useGetEventQuery(id ?? '', {
        skip: !id,
    })

    const handleToggle = async (
        categoryId: string,
        itemId: string,
        isCompleted: boolean,
    ): Promise<void> => {
        if (!id) {
            return
        }

        try {
            await updateItem({
                eventId: id,
                categoryId,
                itemId,
                data: {
                    isCompleted: !isCompleted,
                },
            }).unwrap()
        } catch {
            setErrorMessage(t('events.messages.error'))
        }
    }

    const handleExportPdf = async (): Promise<void> => {
        if (!event) {
            return
        }

        try {
            const blob = await getEventChecklistPdf(event.id).unwrap()

            const url = URL.createObjectURL(blob)

            window.open(url, '_blank')

            setTimeout(() => {
                URL.revokeObjectURL(url)
            }, 60000)
        } catch {
            setErrorMessage(t('events.messages.error'))
        }
    }

    const handlePrint = async (): Promise<void> => {
        if (!event) {
            return
        }

        try {
            const blob = await getEventChecklistPdf(event.id).unwrap()

            const url = URL.createObjectURL(blob)
            const printWindow = window.open(url, '_blank')

            if (!printWindow) {
                URL.revokeObjectURL(url)
                return
            }

            printWindow.addEventListener('load', () => {
                printWindow.print()
            })

            setTimeout(() => {
                URL.revokeObjectURL(url)
            }, 60000)
        } catch {
            setErrorMessage(t('events.messages.error'))
        }
    }

    if (isLoading) {
        return (
            <Stack alignItems="center" py={4}>
                <CircularProgress />
            </Stack>
        )
    }

    if (isError || !event) {
        return <Alert severity="error">{t('events.messages.loadError')}</Alert>
    }

    const totalItems = event.categories.reduce(
        (total, category) => total + category.items.length,
        0,
    )

    const completedItems = event.categories.reduce(
        (total, category) => total + category.items.filter((item) => item.isCompleted).length,
        0,
    )

    return (
        <>
            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title={t('common.back')}>
                        <IconButton onClick={() => navigate(`/events/${event.id}`)}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>

                    <PageHeader title={t('events.checklist.title')} />

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={isGeneratingPdf}
                        title={t('events.checklist.print')}
                    ></Button>

                    <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleExportPdf}
                        disabled={isGeneratingPdf}
                        title={t('events.checklist.exportPdf')}
                    ></Button>
                </Stack>

                <Box>
                    <Typography variant="h5" gutterBottom>
                        {event.eventName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t('events.checklist.count', {
                            count: completedItems,
                            total: totalItems,
                        })}
                    </Typography>
                </Box>

                <Stack spacing={2}>
                    {event.categories
                        .filter((category) => category.items.length > 0)
                        .map((category) => (
                            <Card key={category.id}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {category.name}
                                    </Typography>

                                    <Divider />

                                    <Stack>
                                        {category.items.map((item) => (
                                            <FormControlLabel
                                                key={item.id}
                                                control={
                                                    <Checkbox
                                                        checked={item.isCompleted}
                                                        onChange={() =>
                                                            handleToggle(
                                                                category.id,
                                                                item.id,
                                                                item.isCompleted,
                                                            )
                                                        }
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                textDecoration: item.isCompleted
                                                                    ? 'line-through'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Typography>

                                                        {item.details && (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {item.details}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                </Stack>
            </Stack>

            <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={5000}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />
        </>
    )
}

export default EventChecklistPage
