import React, { useState } from 'react';
import { FiUser, FiChevronRight } from 'react-icons/fi';
import Login from "../pages/Login";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePWAInstallPrompt } from "../hooks/usePWAInstallPrompt";
const TataNeuNavbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutate: fetchWallet, data: walletData, isLoading, isError } = useWallet();
  const { isInstallable, promptInstall } = usePWAInstallPrompt();
  const walletAmount = walletData?.data ?? 0;

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate("/my-profiles");
    } else {
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and NeuCoins */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src='/img/image-1.png'
                  alt="Gunti Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="sm:block">
                <div className="flex flex-col items-start">
                  {/* <span className="text-xs font-medium text-green-600">
                    Earn up to 5%
                  </span> */}
                  <div className="flex flex-col items-start">
                    <Link to="/?re=true" className="text-md font-medium text-gray-700">
                      GuntiUniverse
                    </Link>
                  </div>


                </div>
              </div>
            </div>


            <div className="flex items-center space-x-4">
              {/* Wallet Amount */}
              <button onClick={() => navigate("/rewards")} className="flex items-center bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 transition-colors">
                <span className="text-blue-600 font-bold mr-2">₹</span>
                <span className="text-blue-800 font-medium text-sm">
                  {isLoading ? 'Loading...' : walletAmount}
                </span>
                <FiChevronRight className="text-blue-600 ml-1.5" size={16} />
              </button>

              {/* Download App Button (PWA) */}
              {/* {isInstallable && (
    <button
      onClick={promptInstall}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
    >
      Download App
    </button>
  )} */}

              {/* User Profile/Login */}
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="text-gray-600" size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {user ? "Account" : "Login"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Login onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default TataNeuNavbar;
