import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  Shield,
  Trash2,
  ArrowLeft,
} from "lucide-react";

const Profile = () => {
  const { user, setUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "" });
    }
  }, [user, isLoggedIn, navigate]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(
        "http://localhost:3000/api/auth/update-profile",
        formData,
        { withCredentials: true },
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
        },
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
        { withCredentials: true },
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-400"></div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center -mt-20 mb-8">
              <div className="relative group mb-4">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {getInitials(user?.username)}
                  </div>
                )}
                {/* Camera Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-50 transition-colors cursor-pointer"
                  title="Change photo"
                >
                  <Camera size={18} className="text-orange-500" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicUpload}
                />
              </div>

              {/* Upload/Remove Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  Change photo
                </button>
                {user?.profilePic && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={handleRemovePic}
                      disabled={saving}
                      className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </>
                )}
              </div>

              {/* Username and Role */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user?.username}
              </h2>
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                <Shield size={14} />
                {user?.role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>

            {/* Form Section */}
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Username Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <User size={14} />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-800 font-medium">
                    {user?.username}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Mail size={14} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-800 font-medium truncate">
                    {user?.email}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
                    >
                      <Save size={18} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
