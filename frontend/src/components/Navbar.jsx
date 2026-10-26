import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <h1 className="brand">Feedback Admin Panel</h1>
      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
              Add Feedback
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
