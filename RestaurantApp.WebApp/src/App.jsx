import { Route, Routes } from 'react-router'
import Dashboard from './pages/dashboard/dashboard'
import ProductCategories from './pages/dashboard/product-categories'

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<ProductCategories />} />
      </Route>
    </Routes>
  )
}

export default App
