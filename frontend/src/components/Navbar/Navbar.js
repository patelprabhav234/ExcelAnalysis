import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClasses = (path) =>
    `text-gray-700 hover:text-green-600 block w-full transition-all duration-150 font-semibold text-green-600 hover:text-green-800`;

  return (
    <nav className="bg-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
          
             to={token ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            className="text-2xl font-bold text-green-600 hover:text-green-800"
          >
            ExcelAnalyzer
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!token ? (
              <>
                <Link to="/login" className={navLinkClasses("/login")}>
                  Login
                </Link>
                <Link to="/register" className={navLinkClasses("/register")}>
                  Register
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className={navLinkClasses("/admin")}>
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-green-600 font-bold hover:text-red-600 transition-all duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={navLinkClasses("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/upload" className={navLinkClasses("/upload")}>
                  Upload
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-green-600 font-bold hover:text-red-600 transition-all duration-150"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute z-10 right-1 bg-white shadow-sm px-4 pt-2 pb-4 space-y-2 transition-all duration-200">
          {!token ? (
            <>
              <Link to="/login" className={navLinkClasses("/login")}>
                Login
              </Link>
              <Link to="/register" className={navLinkClasses("/register")}>
                Register
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/admin" className={navLinkClasses("/admin")}>
                Admin Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block text-left w-full text-green-600 font-bold hover:text-red-600 transition-all duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={navLinkClasses("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/upload" className={navLinkClasses("/upload")}>
                Upload
              </Link>
              <button
                onClick={handleLogout}
                className="block text-left w-full text-green-600 font-bold hover:text-red-600 transition-all duration-150"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
