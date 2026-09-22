import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import PageOne from './pages/PageOne'

function Navigation() {
  const location = useLocation()

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MUI React App
        </Typography>
        <Tabs
          value={location.pathname === '/seite-2' ? '/seite-2' : '/'}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Seite 1" value="/" component={Link} to="/" />
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<PageOne />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App
