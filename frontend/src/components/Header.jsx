import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrepOrbitImage from "../assets/PrepOrbit.png";
import API from "../utils/axios";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

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
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img
          src={PrepOrbitImage}
          alt="Logo"
          className="h-12 w-12 object-contain rounded-full"
        />
        <span className="text-xl font-bold text-blue-700 tracking-wide">
          PrepOrbit
        </span>
      </div>

      <div className="space-x-4 flex items-center">

        {user && (
          <Link
            to="/prepbot"
            className="text-blue-600 hover:underline font-medium"
          >
            🤖 Ask PrepBot
          </Link>
        )}

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

        
      </div>
    </header>
  );
};

export default Header;
