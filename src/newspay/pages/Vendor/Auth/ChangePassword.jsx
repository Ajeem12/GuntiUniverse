import { FaLock, FaKey } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetChangePasswordState } from "../../../redux/slices/changePasswordSlice";
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.changePassword);


  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setSuccessMsg("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    if (formData.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    old_password: formData.currentPassword,
    new_password: formData.newPassword,
    new_password_confirmation: formData.confirmPassword,
  };

  try {
    await dispatch(changePassword(payload)).unwrap(); // waits for promise
    setSuccessMsg("Password changed successfully!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (err) {
    console.error("Password change failed:", err);
  }
};

  return (
    <div className="  p-6 rounded-2xl shadow border border-amber-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md mb-4">
          <FaKey className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-amber-700">Change Password</h2>
        <p className="text-amber-600 text-sm mt-1">
          Update your credentials securely
        </p>
        <div className="w-20 h-1 bg-amber-400 mx-auto mt-2 rounded-full"></div>
      </div>

      {successMsg && (
        <div className="mb-4 text-green-600 bg-green-50 border border-green-200 p-2 rounded text-center text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        {/* Current Password */}
        <div>
          <label className="block mb-1 font-medium text-amber-700">
            Current Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-amber-300">
            <span className="px-3 text-amber-500">
              <FaLock />
            </span>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 outline-none rounded-r-md"
              placeholder="Enter current password"
            />
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-1 font-medium text-amber-700">
            New Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-amber-300">
            <span className="px-3 text-amber-500">
              <FaLock />
            </span>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 outline-none rounded-r-md"
              placeholder="Enter new password"
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium text-amber-700">
            Confirm New Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-amber-300">
            <span className="px-3 text-amber-500">
              <FaLock />
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 outline-none rounded-r-md"
              placeholder="Confirm new password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
