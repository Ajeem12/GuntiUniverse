import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import {
  FiHome,
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";

import { BsBoxSeam } from "react-icons/bs";
import { BsBoxSeamFill } from "react-icons/bs";
import { IoMdHome } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { useCartStore } from "../store/cartStore";
import { AiFillShopping, AiOutlineShopping } from "react-icons/ai";

const BottomNavigate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const logout = useAuthStore((state) => state.logout);
  const { cart, fetchCartFromServer } = useCartStore();

  const handleLogout = async () => {
    const closeLoginModal = useModalStore.getState().closeLoginModal;
    await logout();
    closeLoginModal();
    navigate("/");
  };

  const handlenavigate = (path) => {
    if (!token && path === "/user/my-order") {
      openLoginModal();
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);

  const sections = [
    {
      key: "home",
      label: "Home",
      path: "/home",
      icon: <IoMdHome size={24} />,
      activeIcon: <IoMdHome size={24} className="text-[#FDBD3C]" />,
    },
    {
      key: "categories",
      label: "Categories",
      path: "/category",
      icon: <AiOutlineShopping size={24} />,
      activeIcon: <AiFillShopping size={24} className="text-[#FDBD3C]" />,
    },
    {
      key: "orders",
      label: "Orders",
      path: "/user/my-order",
      icon: <BsBoxSeam size={18} />,
      activeIcon: <BsBoxSeamFill size={18} className="text-[#FDBD3C]" />,
    },
    {
      key: "cart",
      label: "Cart",
      path: "/cart",
      icon: (
        <div className="relative">
          <FiShoppingCart size={18} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      ),
      activeIcon: (
        <div className="relative">
          <FiShoppingCart size={18} className="text-[#FDBD3C]" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around items-center py-3 px-1">
        {sections.map((sec) => {
          const isActive =
            location.pathname === sec.path ||
            (sec.key === "profile" && location.pathname === "/user") ||
            (sec.key === "orders" &&
              location.pathname.includes("/user/order-detail"));

          return (
            <button
              key={sec.key}
              onClick={() =>
                sec.key === "logout" ? handleLogout() : handlenavigate(sec.path)
              }
              className={`flex flex-col items-center justify-center w-full py-1 ${
                isActive ? "text-[#FDBD3C]" : "text-gray-500"
              }`}
            >
              <div className="flex items-center justify-center w-6 h-6">
                {isActive ? sec.activeIcon : sec.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigate;
