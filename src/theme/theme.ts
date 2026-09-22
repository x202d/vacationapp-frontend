import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,

            ...(mode === 'light'
                ? {
                    background: {
                        default: '#f5f6f8',
                        paper: '#ffffff',
                    },
                }
                : {
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                    },
                }),
        },

        shape: {
            borderRadius: 8,
        },

        typography: {
            fontFamily: [
                'Inter',
                'Roboto',
                'Arial',
                'sans-serif',
            ].join(','),
        },

        components: {
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        border: '1px solid',
                        borderColor: 'divider',
                    },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 600,
                    },
                },
            },
        },
    })