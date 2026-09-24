import { Box, Button, Typography } from '@mui/material'

import type { ReactNode } from 'react'
import { Add } from '@mui/icons-material'

interface PageHeaderProps {
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        icon?: ReactNode
    }
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <Box
            sx={{
                mb: 3,
                display: 'flex',
                alignItems: {
                    xs: 'flex-start',
                    sm: 'center',
                },
                justifyContent: 'space-between',
                gap: 2,
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {title}
                </Typography>

                {description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {description}
                    </Typography>
                )}
            </Box>

            {action && (
                <Button
                    variant="contained"
                    startIcon={action.icon ?? <Add />}
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </Box>
    )
}
