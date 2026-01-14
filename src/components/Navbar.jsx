import { NavLink } from "react-router-dom";

export default function Navbar() {

  const linkClass = "px-4 py-2 rounded-lg font-medium transition hover:bg-gray-200";

  const activeClass = "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white shadow sticky top-0 z-50 ">
      
      <h1 className="text-xl font-bold text-blue-600">Expense Tracker</h1>

    
      <div className="flex items-center space-x-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : "text-gray-700"}`}
          >
          Home
        </NavLink>

        <NavLink
          to="/income"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Income
        </NavLink>

        <NavLink
          to="/category"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Category
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Expenses
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Reports
        </NavLink>
      </div>
    </nav>
  );
}
