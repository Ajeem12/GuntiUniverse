import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useModalStore } from "../store/uiStore";
import {
  AccountCircle,
  ShoppingBag,
  LocationOn,
  Lock,
  Logout,
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    const closeLoginModal = useModalStore.getState().closeLoginModal;
    await logout();
    closeLoginModal();
    setTimeout(() => navigate("/"), 0);
  };

  const sections = [
    // {
    //   key: "profile",
    //   label: "Profile",
    //   path: "/user",
    //   icon: <AccountCircle className="text-[#FDBD3C]" />,
    // },
    {
      key: "orders",
      label: "Orders",
      path: "/user/my-order",
      icon: <ShoppingBag className="text-[#FDBD3C]" />,
    },
    {
      key: "addresses",
      label: "Address",
      // path: "/user/address",
      path: "/address",
      icon: <LocationOn className="text-[#FDBD3C]" />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <Logout className="text-[#FDBD3C]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full hidden lg:block md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit sticky top-36">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-bold text-black mb-1">My Account</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          <ul className="space-y-2">
            {sections.map((sec) => {
              const isActive =
                location.pathname === sec.path ||
                (sec.key === "orders" &&
                  location.pathname.includes("/user/order-detail"));

              return (
                <li
                  key={sec.key}
                  className={`cursor-pointer px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                    isActive
                      ? "bg-black/10 text-black border-l-4 border-black"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                  onClick={() =>
                    sec.key === "logout" ? handleLogout() : navigate(sec.path)
                  }
                >
                  <span
                    className={`${isActive ? "text-black" : "text-gray-500"}`}
                  >
                    {sec.icon}
                  </span>
                  <span>{sec.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default User;
