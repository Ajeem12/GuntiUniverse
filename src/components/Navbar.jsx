import React, { useEffect, useState } from "react";
import { Badge } from "@mui/material";
import { Search, ShoppingCartOutlined } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Login from "../pages/Login";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import useSearch from "../hooks/useSearch";
import useGetProfile from "../hooks/useGetProfile";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PromoHeader from "./PromoHeader";
import { RxHamburgerMenu } from "react-icons/rx";
import { useWallet } from "../hooks/useWallet";
import { FiUser, FiChevronRight, FiCreditCard } from 'react-icons/fi';




const Navbar = ({ onOpenMobileMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: fetchWallet, data: walletData, isLoading, isError } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, fetchCartFromServer } = useCartStore();
  const { profile } = useGetProfile();
  const walletAmount = walletData?.data ?? 0;

  const { user } = useAuthStore();
  const { searchProducts } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);


  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);


  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      // Perform the search
      await searchProducts(searchQuery);

      // Navigate to the SearchResult page with the query
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleClick = () => {
    navigate("/rewards");
  };


  return (
    <>

      <nav className="bg-white sticky top-0 z-50 shadow-md sm:shadow-none">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo */}

          <div className="text-xl font-bold text-gray-600  md:ml-0">
            <div className="flex">
              <button
                onClick={onOpenMobileMenu}
                className="md:hidden bg-white p-2 rounded z-50"
              >
                <RxHamburgerMenu fontSize={20} className="text-gray-800" />
              </button>

              <Link to="/home" className="block">
                <img
                  src="/cat/guntiMart.jpeg"
                  alt="GuntiFoods"
                  className="ml-2 w-28 lg:w-32 h-[42px] md:h-20 object-contain"
                />
              </Link>


            </div>
          </div>
          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full max-w-md"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-grow px-4 py-2 border rounded-l-full text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#FDBD3C] text-gray-800 px-4 rounded-r-full flex items-center justify-center"
              >
                <Search className="text-gray-800" fontSize="small" />
              </button>
            </form>
          </div>

          {/* Right Menu: Seller + Account + Cart */}
          <div className="flex items-center gap-2 shrink-0">

            <button
              className="flex items-center bg-blue-50 hover:bg-blue-100 rounded-full px-2 py-1.5 transition-colors"
              onClick={handleClick}
            >
              <span className="text-blue-600 font-bold mr-1">₹</span>
              <span className="text-blue-800 font-medium text-sm">
                {isLoading ? 'Loading...' : walletAmount}
              </span>
              <FiChevronRight className="text-blue-600 ml-1.5" size={16} />
            </button>

            {/* Become a Seller */}
            <a
              href="tel:+919455252833"
              className="hidden md:flex items-center gap-2 text-gray-800 px-4 py-2 rounded-full font-medium"
            >
              <CallOutlinedIcon className="text-[#FDBD3C]" fontSize="small" />
              +91 70000 45686
            </a>

            {/* Desktop Auth/Cart */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
              {!user ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="hover:text-yellow-500"
                >
                  Login
                </button>
              ) : (
                <Link to="/my-profiles" className="flex items-center gap-2">
                  <AccountCircleOutlinedIcon
                    className="text-black"
                    style={{ fontSize: 30 }}
                  />
                  <span>{profile?.first_name}</span>
                </Link>
              )}
              {/* <Link to="/cart" className="hover:text-yellow-500">
              <Badge badgeContent={cart.length || 0}  color="primary ">
                <ShoppingCartOutlined className="text-[#FDBD3C]"  style={{ fontSize: 22 }} />
              </Badge>
            </Link> */}

              <Link to="/cart" className="hover:text-yellow-500">
                <Badge
                  badgeContent={cart.length || 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#dc2626", // Tailwind's red-600 hex code
                      color: "#fff",
                    },
                  }}
                >
                  <ShoppingCartOutlined
                    className="text-black"
                    style={{ fontSize: 22 }}
                  />
                </Badge>
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center gap-3">
              <button onClick={() => setShowSearch((prev) => !prev)}>
                <Search />
              </button>
              {!user ? (
                <button onClick={() => setShowLoginModal(true)}>
                  <AccountCircleOutlinedIcon />
                </button>
              ) : (
                <Link to="/my-profiles">
                  <AccountCircleOutlinedIcon />
                </Link>
              )}
              {/* <Link to="/cart">
                <Badge badgeContent={cart.length || 0} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden p-2 bg-white shadow-md z-50">
            <form onSubmit={handleSearchSubmit} className="flex w-full h-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Login onClose={() => setShowLoginModal(false)} />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
