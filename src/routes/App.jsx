import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
