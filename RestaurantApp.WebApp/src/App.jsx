import { Route, Routes } from 'react-router'
import Login from './pages/auth/login'
import Dashboard from './pages/dashboard/dashboard'
import ProductCategories from './pages/dashboard/product-categories'
import ProtectedRoute from './components/ProtectedRoute'
import Products from './pages/dashboard/products'

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<ProductCategories />} />
          <Route path="/dashboard/products" element={<Products />} />
        </Route>
      </Route>
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  )
}

export default App
