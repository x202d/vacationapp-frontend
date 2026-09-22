import {
    FormControlLabel,
    Switch,
    TextField,
} from '@mui/material'

import { useEffect, useState } from 'react'

import type {
    CreateTourTypeRequest,
    TourType,
} from '../../types/templates/TourTypeTypes.ts'

interface TourTypeFormProps {
    item?: TourType | null
    formId: string
    onSubmit: (
        data: CreateTourTypeRequest,
    ) => void
}

export default function TourTypeForm({
                                         item,
                                         formId,
                                         onSubmit,
                                     }: TourTypeFormProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        setName(item?.name ?? '')
        setDescription(item?.description ?? '')
        setIsActive(item?.isActive ?? true)
    }, [item])

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            isActive,
        })
    }

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                required
                label="Name"
                value={name}
                onChange={(event) =>
                    setName(event.target.value)
                }
                margin="normal"
                autoFocus
            />

            <TextField
                fullWidth
                multiline
                minRows={3}
                label="Beschreibung"
                value={description}
                onChange={(event) =>
                    setDescription(event.target.value)
                }
                margin="normal"
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={isActive}
                        onChange={(event) =>
                            setIsActive(
                                event.target.checked,
                            )
                        }
                    />
                }
                label="Aktiv"
            />
        </form>
    )
}