import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1565c0', // kräftiges Blau
            light: '#5e92f3',
            dark: '#003c8f',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#4fc3f7', // helles Himmelblau als Akzent
            contrastText: '#0a2540',
        },
        background: {
            default: '#eaf2fb', // sehr helles Blau als Seitenhintergrund
            paper: '#ffffff',
        },
        text: {
            primary: '#0a2540',
            secondary: '#365a7d',
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: ['Inter', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h5: {
            fontWeight: 600,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0d47a1',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #d3e3f7',
                },
            },
        },
    },
})

export default theme
