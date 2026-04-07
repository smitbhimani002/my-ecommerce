import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();
  const [error, setError] = useState();

  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true },
      );

      if (res.data.success) {
        setIsLoggedIn(true);
        setUser(res.data.user);

        if (res.data.user.role === "admin") {
          navigate("/admin/addProduct");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Enter OTP</h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="Enter OTP"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="bg-orange-500 text-white px-4 py-2 w-full">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
