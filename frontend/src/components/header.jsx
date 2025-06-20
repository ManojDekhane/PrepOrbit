import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrepOrbitImage from "../assets/PrepOrbit.png";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
 

  

  

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img src={PrepOrbitImage} alt="Logo" className="h-12 w-12 object-contain rounded-full" />
        <span className="text-xl font-bold text-blue-700 tracking-wide">PrepOrbit</span>
      </div>

      <div className="space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow">
              Sign Up
            </Link>
          </>
        ) : user ? (
          <button
            onClick={() => {
            setUser(null);
    setTimeout(() => navigate("/"), 0); 
  }}         className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
