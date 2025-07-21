import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrepOrbitImage from "../assets/PrepOrbit.png";
import API from "../utils/axios";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img
            src={PrepOrbitImage}
            alt="Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="text-xl font-bold text-blue-700 tracking-wide">
            PrepOrbit
          </span>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          {user && (
            <>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-700 font-medium"
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className="text-gray-700 hover:text-blue-700 font-medium"
              >
                LeaderBoard
              </Link>
              {user.isAdmin ? (
                <Link
                  to="/admin/upload"
                  className="text-gray-700 hover:text-blue-700 font-medium"
                >
                  Upload
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-700 font-medium"
                >
                  Profile
                </Link>
              )}
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition shadow"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          {user && (
            <>
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/leaderboard"
                className="block text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                LeaderBoard
              </Link>
              {user.isAdmin ? (
                <Link
                  to="/admin/upload"
                  className="block text-gray-700 hover:text-blue-700 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Upload
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-blue-700 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="block text-blue-600 font-medium hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow w-fit"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition shadow w-fit"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
