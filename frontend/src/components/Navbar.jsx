import { CgProfile } from "react-icons/cg";
import Logo from "../assets/Logo.png";
import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Settings } from "lucide-react";
import { LogOut } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { User, Edit3, Save, X, Camera, Mail, Shield, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { History, List } from "lucide-react";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { cartCount } = useCart();
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "" });
    }
  }, [user]);

  // FETCH CATEGORIES
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/categories")
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
        setShowProfile(false);
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
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

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(
        "http://localhost:3000/api/auth/update-profile",
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditing(false);
        toast.success("Profile updated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("profilePic", file);

    try {
      setSaving(true);
      const res = await axios.put(
        "http://localhost:3000/api/auth/update-profile",
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      toast.error("Failed to upload picture");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ username: user?.username || "", email: user?.email || "" });
    setIsEditing(false);
  };

  const handleRemovePic = async () => {
    try {
      setSaving(true);
      const res = await axios.delete(
        "http://localhost:3000/api/auth/remove-profile-pic",
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile picture removed!");
      }
    } catch (error) {
      toast.error("Failed to remove picture");
    } finally {
      setSaving(false);
    }
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
              <div
                className="absolute right-0 mt-2 bg-white shadow-2xl rounded-2xl z-50 border border-gray-100 overflow-hidden"
                style={{ width: showProfile ? "320px" : "200px", transition: "width 0.3s ease" }}
              >
                {/* WhatsApp */}
                <button
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 text-sm font-medium transition-colors"
                >
                  <FaWhatsapp className="text-green-500" size={18} />
                  Chat on WhatsApp
                </button>

                {/* Profile Toggle Button */}
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    showProfile ? "bg-orange-100 text-orange-600" : "hover:bg-orange-50 text-gray-700"
                  }`}
                >
                  <User size={18} />
                  Profile
                </button>

                {/* ✅ INLINE PROFILE PANEL */}
                {showProfile && isLoggedIn && (
                  <div className="border-t border-orange-100">
                    {/* Profile Header with Pic */}
                    <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-5 flex flex-col items-center">
                      {/* Profile Pic */}
                      <div className="relative group">
                        {user?.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-3 border-white shadow-lg">
                            {getInitials(user?.username)}
                          </div>
                        )}
                        {/* Camera overlay */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Change photo"
                        >
                          <Camera size={14} className="text-orange-500" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePicUpload}
                        />
                      </div>
                      {/* Upload / Remove buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-white/90 text-xs hover:text-white underline cursor-pointer"
                        >
                          Change photo
                        </button>
                        {user?.profilePic && (
                          <>
                            <span className="text-white/50">|</span>
                            <button
                              onClick={handleRemovePic}
                              disabled={saving}
                              className="text-white/90 text-xs hover:text-red-200 underline cursor-pointer flex items-center gap-0.5"
                            >
                              <Trash2 size={10} />
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-white font-semibold text-sm mt-1">{user?.username}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                        <Shield size={10} />
                        {user?.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </div>

                    {/* User Details */}
                    <div className="p-4 space-y-3">
                      {/* Username */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <User size={12} /> Username
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full mt-1 px-3 py-1.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium text-sm mt-0.5">{user?.username}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Mail size={12} /> Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mt-1 px-3 py-1.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium text-sm mt-0.5 truncate">{user?.email}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleProfileSave}
                              disabled={saving}
                              className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-lg text-xs font-semibold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
                            >
                              <Save size={14} />
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all"
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-lg text-xs font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                          >
                            <Edit3 size={14} />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Show login prompt if not logged in */}
                {showProfile && !isLoggedIn && (
                  <div className="border-t border-gray-100 p-4 text-center">
                    <p className="text-gray-500 text-sm mb-2">Please login to view profile</p>
                    <button
                      onClick={() => { setOpenSettings(false); navigate("/login"); }}
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Login
                    </button>
                  </div>
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

