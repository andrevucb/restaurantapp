import { useState } from "react"
import { NavLink, Outlet } from "react-router"
import logoImage from '../../assets/logo.png'
import { useAuth } from '../../contexts/useAuth'

function Dashboard() {
  const { user, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userName = user?.unique_name ?? user?.name ?? 'Usuario'

  return (
    <>
    <header className="dashboard-header">
      <nav className="dashboard-header__nav">
        <img src={logoImage} alt="Logo de la aplicación"/>
      </nav>
      {user && (
        <div className="dashboard-header__account">
          <button
            className="dashboard-header__user"
            type="button"
            aria-expanded={isUserMenuOpen}
            aria-controls="dashboard-user-menu"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          >
            {userName}
          </button>
          {isUserMenuOpen && (
            <div className="dashboard-header__menu" id="dashboard-user-menu">
              <button
                className="dashboard-header__logout"
                type="button"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </header>
    <main className="dashboard-container">
      <nav className="dashboard-nav">
        <NavLink 
          to="/dashboard" 
          end
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
