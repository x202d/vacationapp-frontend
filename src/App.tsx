import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'

import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import TourTypesPage from './pages/TourTypesPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<DashboardPage />} />

                    <Route path="/templates/tour-types" element={<TourTypesPage />} />

                    <Route path="/templates/categories" element={<CategoriesPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
