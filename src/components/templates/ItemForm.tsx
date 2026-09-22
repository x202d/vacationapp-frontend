import { useTranslation } from 'react-i18next'
import { Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

import type { CreateTemplateItemRequest, TemplateItem } from '../../types/templates/ItemTypes'

interface ItemFormProps {
    item?: TemplateItem | null
    formId: string
    onSubmit: (data: CreateTemplateItemRequest) => void
}

export default function ItemForm({ item, formId, onSubmit }: ItemFormProps) {
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (item) {
            setName(item.title)
            setDescription(item.details ?? '')

            return
        }

        setName('')
        setDescription('')
    }, [item])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        onSubmit({
            title: name.trim(),
            details: description.trim() || null,
        })
    }

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
                <TextField
                    fullWidth
                    required
                    autoFocus
                    label={t('categories.form.name')}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label={t('categories.form.description')}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </Stack>
        </form>
    )
}
