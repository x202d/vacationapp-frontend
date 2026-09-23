import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, TextField } from '@mui/material'

import type { CreateCategoryRequest, TemplateCategory } from '../../types/templates/CategoryTypes'

interface CategoryFormProps {
    item?: TemplateCategory | null
    formId: string
    onSubmit: (data: CreateCategoryRequest) => void
}

export default function CategoryForm({ item, formId, onSubmit }: CategoryFormProps) {
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [sortOrder, setSortOrder] = useState(0)

    useEffect(() => {
        if (item) {
            setName(item.name)
            setDescription(item.description ?? '')
            setSortOrder(item.sortOrder)

            return
        }

        setName('')
        setDescription('')
        setSortOrder(0)
    }, [item])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            sortOrder,
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

                <TextField
                    fullWidth
                    type="number"
                    label={t('categories.form.sortOrder')}
                    value={sortOrder}
                    onChange={(event) => setSortOrder(Number(event.target.value))}
                    slotProps={{
                        htmlInput: {
                            min: 0,
                            step: 1,
                        },
                    }}
                />
            </Stack>
        </form>
    )
}
