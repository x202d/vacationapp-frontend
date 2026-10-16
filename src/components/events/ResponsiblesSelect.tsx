import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Autocomplete, Chip, Snackbar, TextField } from '@mui/material'

import type { User } from '../../types/user/UserTypes'
import { useGetUsersQuery } from '../../stores/user/UserApi'
import type { EventItem } from '../../types/events/EventTypes'
import { useSetItemResponsiblesMutation } from '../../stores/events/EventApi.ts'

export const getUserDisplayName = (user: User): string =>
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username

interface ResponsiblesSelectProps {
    eventId: string
    categoryId: string
    item: EventItem
}

const ResponsiblesSelect = ({ eventId, categoryId, item }: ResponsiblesSelectProps) => {
    const { t } = useTranslation()

    const { data: users = [], isLoading } = useGetUsersQuery()
    const [setResponsibles] = useSetItemResponsiblesMutation()
    const [error, setError] = useState(false)

    const handleChange = async (selected: User[]): Promise<void> => {
        try {
            await setResponsibles({
                eventId,
                categoryId,
                itemId: item.id,
                users: selected,
            }).unwrap()
        } catch {
            // Der optimistische Wert wurde bereits zurückgerollt
            setError(true)
        }
    }

    return (
        <>
            <Autocomplete
                multiple
                size="small"
                limitTags={3}
                disableCloseOnSelect
                loading={isLoading}
                options={users}
                value={item.responsibles}
                getOptionLabel={getUserDisplayName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_event, selected) => void handleChange(selected)}
                noOptionsText={t('events.items.noUsers')}
                renderTags={(value, getTagProps) =>
                    value.map((user, index) => {
                        const { key, ...tagProps } = getTagProps({ index })

                        return (
                            <Chip
                                key={key}
                                size="small"
                                label={getUserDisplayName(user)}
                                {...tagProps}
                            />
                        )
                    })
                }
                renderInput={(params) => (
                    <TextField {...params} label={t('events.items.responsibles')} />
                )}
                sx={{ mt: 1, maxWidth: 480 }}
            />

            <Snackbar
                open={error}
                autoHideDuration={5000}
                onClose={() => setError(false)}
                message={t('events.messages.error')}
            />
        </>
    )
}

export default ResponsiblesSelect
