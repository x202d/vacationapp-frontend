import { useEffect, useState } from 'react'
import {
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import type {
    CreateTourTypeRequest,
    TourType,
} from '../../types/templates/TourTypeTypes'

interface TourTypeFormProps {
    item?: TourType | null
    formId: string
    onSubmit: (data: CreateTourTypeRequest) => void
}

export default function TourTypeForm({
                                         item,
                                         formId,
                                         onSubmit,
                                     }: TourTypeFormProps) {
    const { t } = useTranslation()


const [name, setName] = useState('')
const [description, setDescription] = useState('')
const [isActive, setIsActive] = useState(true)

useEffect(() => {
    if (item) {
        setName(item.name)
        setDescription(item.description ?? '')
        setIsActive(item.isActive)
        return
    }

    setName('')
    setDescription('')
    setIsActive(true)
}, [item])

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        isActive,
    })
}

return (
    <form id={formId} onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
            <TextField
                fullWidth
                required
                autoFocus
                label={t('tourTypes.form.name')}
                value={name}
                onChange={(event) => setName(event.target.value)}
            />

            <TextField
                fullWidth
                multiline
                minRows={4}
                label={t('tourTypes.form.description')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={isActive}
                        onChange={(event) =>
                            setIsActive(event.target.checked)
                        }
                    />
                }
                label={t('tourTypes.form.active')}
            />
        </Stack>
    </form>
)

}