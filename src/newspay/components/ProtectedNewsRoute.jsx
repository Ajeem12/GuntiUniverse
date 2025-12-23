import React from "react";
import { useAuthStore } from "../../store/authStore";
import { useModalStore } from "../../store/uiStore";
import { FiLogIn, FiUser, FiAlertCircle } from "react-icons/fi";

const Protected = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <FiUser className="text-2xl text-amber-600" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this content. Please sign in to continue.
          </p>

          {/* Alert Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FiAlertCircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                This content is protected and requires user authentication.
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={ ()=>{openLoginModal()}  }
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <FiLogIn className="mr-2" />
            Sign In to Continue
          </button>

          {/* Additional Options */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Don't have an account? </p>
            <button
              onClick={openLoginModal}
              className="text-amber-600 hover:text-amber-700 font-medium mt-1"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default Protected;