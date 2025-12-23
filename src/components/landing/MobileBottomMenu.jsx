import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineGift,
  AiFillHome,
  AiFillShopping,
  AiFillGift,
  AiOutlinePhone,
  AiFillPhone,
} from "react-icons/ai";
import { IoMdHome } from "react-icons/io";

const menuItems = [
  {
    label: "Home",
    // icon: <AiOutlineHome size={24} />,
    // activeIcon: <AiFillHome size={24} />,
    icon: <IoMdHome size={24} />,
    activeIcon: <IoMdHome size={24} />,
    path: "/?re=true",
  },
  {
    label: "Categories",
    // icon: <AiOutlineShopping size={24} />,
    icon: <AiFillShopping size={24} />,
    activeIcon: <AiFillShopping size={24} />,
    path: "/categories",
  },
  {
    label: "GuntiCoins",
    // icon: <AiOutlineGift size={24} />,
    icon: <AiFillGift size={24} />,
    activeIcon: <AiFillGift size={24} />,
    path: "/rewards",
  },
  {
    label: "Contact",
    // icon: <AiOutlinePhone size={24} />,
    icon: <AiFillPhone size={24} />,
    activeIcon: <AiFillPhone size={24} />,
    path: "/contact-us",
  },
];

const MobileBottomMenu = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-3">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive
                  ? "text-[#FDBD3C]"
                  : "text-gray-700 hover:text-[#FDBD3C]"
              }`}
            >
              <div className="mb-1">
                {isActive ? item.activeIcon : item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomMenu;
