import { useTranslation } from 'react-i18next'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'

interface ConfirmDialogProps {
    open: boolean
    title: string
    message: string
    loading?: boolean
    onConfirm: () => Promise<void>
    onCancel: () => void
}

export default function ConfirmDialog({
    open,
    title,
    message,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    {t('common.actions.cancel')}
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {t('common.actions.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
