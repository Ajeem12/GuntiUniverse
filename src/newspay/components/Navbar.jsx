import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiUser, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import Login from "../../pages/Login";
import { useWallet } from "../../hooks/useWallet";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiInformationCircle } from "react-icons/hi";
import { Home } from "@mui/icons-material";
const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mutate: fetchWallet, data: walletData, isLoading } = useWallet();

  const logout = useAuthStore((state) => state.logout);
  const profileRef = useRef(null);
  const walletAmount = walletData?.data ?? 0;

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/news");
  };

  const handleClick = () => {
    navigate("/rewards");
  };

  return (
    <>
      <motion.nav
        className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Hamburger + Logo */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-800 p-2 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <RxHamburgerMenu size={18} />
              </button>

              {/* Gunti News Logo */}
              <Link to="/news">
                <motion.img
                  src="/logo/logo - Copy (2).jpeg"
                  className="w-22 h-10 object-contain"
                  alt="Gunti News Logo"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </Link>
            </div>

            {/* Right Side: Wallet + Profile/Login */}
            <div className="flex items-center space-x-4">
              {/* Wallet */}
              <button
                className="flex items-center bg-blue-50 hover:bg-blue-100 rounded-full px-2 py-1.5 transition-colors"
                onClick={handleClick}
              >
                <span className="text-blue-600 font-bold mr-1">₹</span>
                <span className="text-blue-800 font-medium text-sm">
                  {isLoading ? "Loading..." : walletAmount}
                </span>
                <FiChevronRight className="text-blue-600 ml-1.5" size={16} />
              </button>

              {/* Profile/Login */}
              <div className="relative" ref={profileRef}>
                {!user ? (
                  <motion.button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center text-sm rounded-full focus:outline-none hover:bg-amber-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AccountCircleOutlinedIcon
                      style={{ fontSize: 28, color: "#333" }}
                    />
                  </motion.button>
                ) : (
                  <button
                    onClick={() => navigate("/my-profiles")}
                    className="flex items-center text-sm rounded-full focus:outline-none transition hover:shadow"
                  >
                    <AccountCircleOutlinedIcon
                      style={{ fontSize: 28, color: "#333" }}
                    />
                  </button>
                )}

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {user && showProfileMenu && (
                    <motion.div
                      className="absolute right-0 mt-4 w-56 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 400,
                      }}
                    >
                      <div className="px-5 py-4 border-b border-gray-100 bg-amber-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <motion.a
                          href="/my-profile"
                          className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FiUser className="mr-3 text-amber-600" />
                          Profile
                        </motion.a>
                      </div>
                      <div className="py-2 border-t border-gray-100">
                        <motion.button
                          className="flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none"
                          onClick={handleLogout}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-full h-full bg-white shadow-xl rounded-r-2xl z-50  flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2 bg-[#FDBD3C] p-3 ">
                <h2 className=" font-bold text-black tracking-wide">
                  GuntiNewsPay
                </h2>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-black hover:text-gray-800 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="border-b">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800"
                >
                  <Home fontSize="small" />
                  <span>GuntiUniverse</span>
                </Link>
              </div>

              <div className="border-b">
                <Link
                  to="/contact-us"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-4  font-medium text-gray-800"
                >
                  <HiInformationCircle fontSize="small" />
                  <span>Contact Us</span>
                </Link>
              </div>
              <div className="pt-4 px-4">
                <h4 className="text-lg text-gray-700 font-medium mb-3">
                  Other Apps
                </h4>
                <Link
                  to="/home"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
                >
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <img
                      src="/logo/logo.jpeg"
                      alt="Gunti News"
                      className="w-full h-full object-cover rounded border"
                    />
                  </div>
                  GuntiMart
                </Link>
                <Link
                  to="/gunti-fast"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
                >
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    <img
                      src="/gfast/gfb.jpeg"
                      alt="Gunti Fast"
                      className="w-full h-full object-cover rounded border"
                    />
                  </div>
                  GuntiFast
                </Link>
              </div>
            </motion.div>
            {/* Backdrop */}
          </>
        )}
      </AnimatePresence>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;
