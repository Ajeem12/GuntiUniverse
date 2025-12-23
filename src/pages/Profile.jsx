import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useUpdateUserProfile } from "../hooks/useUpdateProfile";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";
import useGetProfile from "../hooks/useGetProfile";
import Loader from "../components/Loader";
import { AiOutlineClose } from "react-icons/ai";

const Profile = ({ onClose }) => {
  const { setUser } = useAuthStore();
  const { profile, loading, error } = useGetProfile();

  const [formUser, setFormUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "", // Include mobile
  });

  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  useEffect(() => {
    if (profile) {
      setFormUser({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(
      {
        firstname: formUser.firstName,
        lastname: formUser.lastName,
        email: formUser.email,
      },
      {
        onSuccess: () => {
          setUser({
            first_name: formUser.firstName,
            last_name: formUser.lastName,
            email: formUser.email,
          });
          setIsEditing(false);
        },
        onError: (err) => {
          console.error("Profile update failed:", err);
        },
      }
    );
  };

  if (loading)
    return (
      <div className="text-center text-gray-600 flex flex-col items-center">
        <Loader />
        <p className="mt-2 text-lg font-medium">
          Loading Your Profile
          <span className="dots" />
        </p>
      </div>
    );
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <div className=" relative px-6  sm:py-2">
        <button
          onClick={onClose}
          aria-label="Close Profile"
          className="absolute top-1 right-6 p-2 rounded-full transition"
        >
          <AiOutlineClose className="text-gray-600 text-2xl" />
        </button>
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg px-6 py-2 sm:px-10 sm:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* First Name */}
            <div>
              <label className="block text-gray-600 font-semibold text-lg ">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formUser.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={`w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring ${
                  isEditing
                    ? "border-yellow-400 focus:ring-yellow-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-600 font-semibold text-lg ">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formUser.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={`w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring ${
                  isEditing
                    ? "border-yellow-400 focus:ring-yellow-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-semibold text-lg ">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formUser.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={`w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring ${
                  isEditing
                    ? "border-yellow-400 focus:ring-yellow-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </div>

            {/* Mobile Number (disabled) */}
            <div>
              <label className="block text-gray-600 font-semibold text-lg ">
                Mobile No.
              </label>
              <input
                type="text"
                name="mobile"
                value={formUser.mobile}
                disabled
                className="w-full px-6 py-3 border rounded-lg bg-gray-100 border-gray-300 text-gray-700 text-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-6 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    if (profile) {
                      setFormUser({
                        firstName: profile.first_name || "",
                        lastName: profile.last_name || "",
                        email: profile.email || "",
                        mobile: profile.mobile || "",
                      });
                    }
                    setIsEditing(false);
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 text-lg"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-8 py-3 bg-[#FDBD3C] text-black rounded-lg transition text-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
