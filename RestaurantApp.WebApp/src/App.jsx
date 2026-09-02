import { Route, Routes } from 'react-router'
import Login from './pages/auth/login'
import Dashboard from './pages/dashboard/dashboard'
import ProductCategories from './pages/dashboard/product-categories'

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<ProductCategories />} />
      </Route>
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  )
}

export default App
