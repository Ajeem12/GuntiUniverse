import { useState, useRef, useEffect } from "react";
import { FiMenu, FiLogOut, FiLock, FiUser, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useDispatch } from 'react-redux';
import { logout } from '../../../newspay/redux/slices/authSlice';


const TopBar = ({ collapsed, toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/vendor/login');
    setDropdownOpen(false);
  };

  const notifications = [
    { id: 1, text: "New customer registered", time: "2 min ago" },
    { id: 2, text: "Payment received from John Doe", time: "15 min ago" },
    { id: 3, text: "System update completed", time: "1 hour ago" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 h-16 bg-white shadow-md border-b border-amber-100">
      {/* Left: Sidebar toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all duration-200 shadow-sm"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center">
          <img
            src="/logo/logo_bg_remover.png"
            className="w-20 lg:w-25 transition-all duration-300"
            alt="Shreeji Logo"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User info and Avatar */}
        <div
          className="flex items-center gap-4 lg:gap-6 relative"
          ref={dropdownRef}
        >
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-amber-900">Vendor Admin</p>
          </div>

          {/* Avatar Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative focus:outline-none transition-transform duration-200 hover:scale-105"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <UserAvatar className="border-2 border-amber-200 cursor-pointer shadow-sm" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 mt-1 w-48 bg-white rounded-lg shadow-lg border border-amber-100 z-50 overflow-hidden">
              <div className="p-3 border-b border-amber-100 bg-amber-50">
                <p className="text-sm font-medium text-amber-900">Vendor</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/vendor/change-password");
                }}
                className="flex items-center w-full text-left px-4 py-3 text-amber-800 hover:bg-amber-50 transition-colors"
              >
                <FiLock className="mr-3 text-amber-600" />
                Change Password
              </button>

              <div className="border-t border-amber-100"></div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-amber-800 hover:bg-amber-50 transition-colors"
              >
                <FiLogOut className="mr-3 text-amber-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
