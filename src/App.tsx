import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import PageOne from './pages/PageOne'
import PageTwo from './pages/PageTwo'

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
          <Tab
            label="Seite 2"
            value="/seite-2"
            component={Link}
            to="/seite-2"
          />
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
          <Route path="/seite-2" element={<PageTwo />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App
