import { NavLink, Outlet } from "react-router"
import logoImage from '../../assets/logo.png'

function Dashboard() {
  return (
    <>
    <header className="dashboard-header">
      <nav className="dashboard-header__nav">
        <img src={logoImage} alt="Logo de la aplicación"/>
      </nav>
    </header>
    <main className="dashboard-container">
      <nav class="dashboard-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) =>
            isActive ? "dashboard-nav__link dashboard-nav__link--active" : "dashboard-nav__link"
          }
        >
          Categorias
        </NavLink>
        <NavLink 
          to="/dashboard/products" 
          className={({ isActive }) =>
            isActive ? "dashboard-nav__link dashboard-nav__link--active" : "dashboard-nav__link"
          }
        >
          Productos
        </NavLink>
      </nav>

      <Outlet />
    </main>
    </>
  )
}

export default Dashboard
