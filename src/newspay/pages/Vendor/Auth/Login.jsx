import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VendorLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useSelector((state) => state.auth);

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const status = authUser.status;


  // Handle form submit
  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId || !password) {
      toast.error("Please enter Mobile No. and Password");
      return;
    }
    dispatch(loginUser({ mobile: userId, password }));
  };


  useEffect(() => {
    if (user) {
      toast.success("Login successful!");
      if (status === 0) {
        navigate("/vendor/profile");
      } else {
        navigate("/vendor/dashboard");
      }
    }
  }, [user, navigate]);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-amber-600 mb-6 text-center">
          Vendor Portal Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No.
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your Mobile No."
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your Password"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-amber-500 text-white py-2 rounded-md font-semibold hover:bg-amber-600 transition disabled:opacity-60"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Optional Links */}
        <div className="mt-4 text-center">
          <a href="/vendor/register" className="text-sm text-amber-600 hover:underline">
            If you haven't registered, please register.
          </a>
        </div>

      </div>
    </div>
  );
};

export default VendorLogin;
