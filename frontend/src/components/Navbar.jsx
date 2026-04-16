import { CgProfile } from "react-icons/cg";
import Logo from "../assets/Logo.png";
import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Settings, LogOut, Heart, User, History } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const { cartCount } = useCart();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  // FETCH CATEGORIES
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/admin/categories`)
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );

      setIsLoggedIn(false);
      alert("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${search}`);
  };

  const openWhatsApp = () => {
    const phoneNumber = "8200973720";
    const message = "Hello shopsy, I need something help regarding my order.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      {/* Upper Bar */}
      <div className="bg-orange-300 py-2">
        <div className="flex flex-wrap justify-around items-center">
          <a href="#" className="font-bold text-2xl flex gap-3">
            <img className="w-10" src={Logo} alt="" /> shopsy
          </a>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hidden sm:block w-50 border rounded-3xl px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>

          {/* ✅ ORDER button only if logged in */}
          {isLoggedIn && (
            <Link
              to="/cart"
              className="relative bg-orange-500 rounded-3xl px-4 py-2 text-white font-semibold hover:bg-orange-600"
            >
              ORDER
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* ✅ Profile or Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <Link to="/Login">
              <CgProfile className="w-10 h-12.5 cursor-pointer" />
            </Link>
          )}

          <div className="relative" ref={settingsRef}>
            <Settings
              size={26}
              className="cursor-pointer"
              onClick={() => {
                setOpenSettings(!openSettings);
                if (openSettings) {
                  setShowProfile(false);
                  setIsEditing(false);
                }
              }}
            />

            {openSettings && (
              <div className="absolute right-0 mt-2 bg-white shadow-2xl rounded-2xl z-50 border border-gray-100 overflow-hidden w-56">
                {/* WhatsApp */}
                <button
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 text-sm font-medium transition-colors"
                >
                  <FaWhatsapp className="text-green-500" size={18} />
                  Chat on WhatsApp
                </button>

                {/* Profile Button - Navigate to Full Profile Page */}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenSettings(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 text-sm font-medium transition-colors"
                  >
                    <User size={18} />
                    My Profile
                  </button>
                )}

                {/* Settings - Wishlist */}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setOpenSettings(false);
                      navigate("/settings");
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-red-50 text-gray-700 text-sm font-medium transition-colors border-t border-gray-100"
                  >
                    <Heart size={18} className="text-red-500" />
                    Wishlist & Settings
                  </button>
                )}

                {/* About Us */}
                <button
                  onClick={() => navigate("/aboutus")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 text-sm font-medium transition-colors"
                >
                  <User size={18} />
                  About Us
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 text-sm font-medium transition-colors"
                >
                  <History size={18} />
                  Order status
                </button>

                {/* Logout */}
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors border-t border-gray-100"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower Bar */}
      <div className="bg-white shadow-sm relative">
        <div className="sm:hidden flex justify-end p-4">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <IoCloseSharp className="text-2xl" />
            ) : (
              <RxHamburgerMenu className="text-2xl" />
            )}
          </button>
        </div>

        <ul
          className={`flex flex-col sm:flex-row sm:justify-center items-center gap-6 py-3 font-medium text-gray-700
          ${menuOpen ? "block" : "hidden"} sm:flex`}
        >
          <li>
            <Link to="/" className="hover:text-orange-500">
              Home
            </Link>
          </li>

          {/* ✅ DYNAMIC CATEGORY  */}
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="hover:text-orange-500"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

          <li>
            <Link to="/TopReted" className="hover:text-orange-500">
              TopReted
            </Link>
          </li>

          <li className="relative group cursor-pointer">
            <span className="hover:text-orange-500">Trending Items</span>
            <ul className="md:absolute hidden md:group-hover:block shadow-md mt-2 w-40 z-99 bg-white text-center">
              <li className="py-2 hover:bg-orange-100">New Arrivals</li>
              <li className="py-2 hover:bg-orange-100">Best Sellers</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
