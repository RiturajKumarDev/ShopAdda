import { Routes, Route } from 'react-router-dom'

import './App.css'
import Dashboard from '../pages/Dashboard'
import UploadProduct from '../admin/UploadProduct'
import VendorDashboard from '../admin/VendorDashboard'
import AdminDashboard from '../admin/AdminDashboard'
import VendorProfile from '../admin/VendorProfile'
import ProfilePage from '../pages/ProfilePage'
import ProductPage from '../pages/ProductPage'
import AuthPage from '../pages/AuthPage'
import AddressManagement from '../pages/AddressManagement'
import OrderPage from '../pages/OrderPage'
import OrderProductPage from '../pages/OrderProductPage'
import ProtectedRoute from './ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/productPage" element={<ProductPage />} />
      <Route path="/profilePage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/AddressManagement" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
      <Route path="/OrderPage" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
      <Route path="/OrderProductPage" element={<ProtectedRoute><OrderProductPage /></ProtectedRoute>} />
      <Route path="/uploadProduct" element={<ProtectedRoute allowedRoles={['Vendor', 'Admin']}><UploadProduct /></ProtectedRoute>} />
      <Route path="/vendor-dashboard" element={<ProtectedRoute allowedRoles={['Vendor']}><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor-profile" element={<ProtectedRoute allowedRoles={['Vendor']}><VendorProfile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
