import { Routes, Route } from 'react-router-dom'

import './App.css'
import Dashboard from '../pages/Dashboard'
import UploadProduct from '../admin/UploadProduct'
import ProfilePage from '../pages/ProfilePage'
import ProductPage from '../pages/ProductPage'
import AuthPage from '../pages/AuthPage'
import AddressManagement from '../pages/AddressManagement'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/productPage" element={<ProductPage />} />
      <Route path="/profilePage" element={<ProfilePage />} />
      <Route path="/AddressManagement" element={<AddressManagement />} />
      <Route path="/uploadProduct" element={<UploadProduct />} />
    </Routes>
  )
}

export default App
