import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'

import DashboardPage from './pages/DashboardPage'
import ItemsPage from './pages/templates/ItemsPage.tsx'
import TourTypesPage from './pages/templates/TourTypesPage.tsx'
import CategoriesPage from './pages/templates/CategoriesPage.tsx'
import CreateEventPage from './pages/events/CreateEventWizard.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<DashboardPage />} />

                    <Route path="/templates/tour-types" element={<TourTypesPage />} />

                    <Route path="/templates/categories" element={<CategoriesPage />} />

                    <Route path="/templates/items" element={<ItemsPage />} />
                    <Route path="/events/wizard" element={<CreateEventPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
