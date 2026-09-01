import { Outlet } from "react-router"

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <Outlet />
    </div>
  )
}

export default Dashboard
