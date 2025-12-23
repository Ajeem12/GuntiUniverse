import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Login from "../../pages/Login";
import { useWallet } from "../../hooks/useWallet";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiInformationCircle } from "react-icons/hi";
import { Search } from "@mui/icons-material";
import { Home } from "@mui/icons-material";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { mutate: fetchWallet, data: walletData, isLoading } = useWallet();
  const logout = useAuthStore((state) => state.logout);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const walletAmount = walletData?.data ?? 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // close profile menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) fetchWallet();
  }, [user, fetchWallet]);

  const handleWalletClick = () => navigate("/rewards");

  const handleSearchSubmit = async (e) => {
    // e.preventDefault();
    // if (searchQuery.trim() !== "") {
    //   // Perform the search
    //   await searchProducts(searchQuery);

    //   // Navigate to the SearchResult page with the query
    //   navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    //   setSearchQuery("");
    //   setShowSearch(false);
    // }

    alert("search");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* LEFT SIDE */}
            <div className="flex items-center ">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-800 p-2 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <RxHamburgerMenu size={18} />
              </button>

              {/* LOGO */}
              <Link to="/gunti-fast">
                <img
                  src="/gfast/gfm.jpeg"
                  className="w-32 object-contain "
                  alt="Gunti fast logo"
                />
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center space-x-4">
              {/* WALLET */}
              <button
                className="flex items-center bg-blue-50 hover:bg-blue-100 rounded-full px-2 py-1.5 transition-colors"
                onClick={handleWalletClick}
              >
                <span className="text-blue-600 font-bold mr-1">₹</span>
                <span className="text-blue-800 font-medium text-sm">
                  {isLoading ? "Loading..." : walletAmount}
                </span>
                <FiChevronRight className="text-blue-600 ml-1.5" size={16} />
              </button>

              <button onClick={() => setShowSearch((prev) => !prev)}>
                <Search />
              </button>

              {/* PROFILE / LOGIN */}
              <div className="relative" ref={profileRef}>
                {!user ? (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center text-sm rounded-full focus:outline-none hover:bg-amber-700 transition p-1"
                  >
                    <AccountCircleOutlinedIcon
                      style={{ fontSize: 28, color: "#333" }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/my-profiles")}
                    className="flex items-center text-sm rounded-full focus:outline-none transition hover:shadow p-1"
                  >
                    <AccountCircleOutlinedIcon
                      style={{ fontSize: 28, color: "#333" }}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* BACKDROP */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 rounded-r-2xl transform 
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2 bg-[#FDBD3C] p-3">
          <h2 className="font-bold text-black tracking-wide">GuntiFast</h2>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-black hover:text-gray-800 transition-colors duration-200"
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

        {/* MENU ITEMS */}
        <div className="border-b">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800"
          >
            <Home fontSize="small" />
            <span>GuntiUniverse</span>
          </Link>
        </div>

        <div className="border-b">
          <Link
            to="/contact-us"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-4 font-medium text-gray-800"
          >
            <HiInformationCircle fontSize="small" />
            <span>Contact Us</span>
          </Link>
        </div>

        <div className="pt-4 px-4">
          <h4 className="text-lg text-gray-700 font-medium mb-3">Other Apps</h4>

          <Link
            to="/home"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
          >
            <div className="w-8 h-8 mr-3 flex-shrink-0">
              <img
                src="/cat/gunti_mart_1.jpeg"
                alt="GuntiMart"
                className="w-full h-full object-cover rounded border"
              />
            </div>
            GuntiMart
          </Link>
          <Link
            to="/news"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
          >
            <div className="w-8 h-8 mr-3 flex-shrink-0">
              <img
                src="/logo/lp.jpeg"
                alt="Gunti News Pay"
                className="w-full h-full object-cover rounded border"
              />
            </div>
            GuntiNewsPay
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden p-2 bg-white shadow-md z-50">
          <form onSubmit={handleSearchSubmit} className="flex w-full h-10">
            <input
              type="text"
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#FDBD3C] text-gray-800 px-4 rounded-r-md flex items-center justify-center"
            >
              <Search className="text-white" fontSize="small" />
            </button>
          </form>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;
