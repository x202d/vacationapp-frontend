import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/events/EventsPage'
import ItemsPage from './pages/templates/ItemsPage'
import TourTypesPage from './pages/templates/TourTypesPage'
import EventDetailPage from './pages/events/EventDetailPage'
import SettingsPage from './pages/settings/SettingsPage.tsx'
import CategoriesPage from './pages/templates/CategoriesPage'
import CreateEventPage from './pages/events/CreateEventWizard.tsx'
import EventChecklistPage from './pages/events/EventChecklistPage.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<DashboardPage />} />

                        <Route path="/templates/tour-types" element={<TourTypesPage />} />

                        <Route path="/templates/categories" element={<CategoriesPage />} />

                        <Route path="/templates/items" element={<ItemsPage />} />

                        <Route path="/events/wizard" element={<CreateEventPage />} />

                        <Route path="/events" element={<EventsPage />} />

                        <Route path="/events/:id" element={<EventDetailPage />} />

                        <Route path="/settings" element={<SettingsPage />} />

                        <Route path="*" element={<Navigate to="/" replace />} />

                        <Route path="/events/:id/checklist" element={<EventChecklistPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
