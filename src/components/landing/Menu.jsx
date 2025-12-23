import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";
import {
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaGraduationCap,
  FaFilm,
  FaUtensils,
  FaTruck,
  FaPlane,
  FaHandsHelping,
  FaNewspaper,
  FaTv,
} from "react-icons/fa";
import { GiMilkCarton, GiCableStayedBridge } from "react-icons/gi";

const staticMenuItems = [
  {
    id: 1,
    title: "Daily",
    icon: <FaShoppingCart className="text-blue-500" size={20} />,
    subcategories: [
      {
        name: "GuntiMart",
        image: "/cat/gunti_mart_1.jpeg",
        fallbackIcon: <FaShoppingCart className="text-blue-400" size={24} />,
        url: "/home",
      },
      {
        name: "GuntiFast",
        // image: "/gfast/gfm.jpeg",
        image: "/gfast/gf.png",
        fallbackIcon: <FaShoppingCart className="text-blue-300" size={24} />,
        url: "/gunti-fast",
      },
    ],
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    categoryUrl: "/categories",
  },
  {
    id: 2,
    title: "My Bills",
    icon: <FaFileInvoiceDollar className="text-purple-500" size={20} />,
    subcategories: [
      {
        name: "GuntiNewsPay", // Subcategory under My Bills
        image: "/logo/logo.jpeg", // Image for Gunti News (can be customized)
        fallbackIcon: <MdNewspaper className="text-blue-400" size={24} />, // News icon for Gunti News
        url: "/news", // You can replace this with an actual URL
      },
    ],
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-100",
    categoryUrl: "#",
  },
  // {
  //   id: 3,
  //   title: 'Book',
  //   icon: <FaCalendarAlt className="text-green-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'BookMyAppointment',
  //       image: '/cat/Book.jpeg',
  //       fallbackIcon: <FaCalendarAlt className="text-green-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-green-50',
  //   textColor: 'text-green-600',
  //   borderColor: 'border-green-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 4,
  //   title: 'Education',
  //   icon: <FaGraduationCap className="text-red-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'Ramanujan Excellence Hub',
  //       image: '/cat/Education.jpeg',
  //       fallbackIcon: <FaGraduationCap className="text-red-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-red-50',
  //   textColor: 'text-red-600',
  //   borderColor: 'border-red-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 5,
  //   title: 'Entertainment',
  //   icon: <FaFilm className="text-yellow-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'MT',
  //       image: '/cat/MT.jpeg',
  //       fallbackIcon: <FaTv className="text-yellow-400" size={24} />,
  //       url: '#',
  //     },
  //     {
  //       name: 'OTT',
  //       image: '/cat/OTT.jpeg',
  //       fallbackIcon: <FaFilm className="text-yellow-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-yellow-50',
  //   textColor: 'text-yellow-600',
  //   borderColor: 'border-yellow-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 6,
  //   title: 'Food',
  //   icon: <FaUtensils className="text-orange-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'GuntiEats',
  //       image: '/cat/GuntiEats.jpeg',
  //       fallbackIcon: <FaUtensils className="text-orange-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-orange-50',
  //   textColor: 'text-orange-600',
  //   borderColor: 'border-orange-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 7,
  //   title: 'Logistics',
  //   icon: <FaTruck className="text-indigo-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'Jatayuconnect',
  //       image: '/cat/Jatayuconnect.jpeg',
  //       fallbackIcon: <FaTruck className="text-indigo-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-indigo-50',
  //   textColor: 'text-indigo-600',
  //   borderColor: 'border-indigo-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 8,
  //   title: 'Travel',
  //   icon: <FaPlane className="text-teal-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'GuntiTravels',
  //       image: '/cat/GuntiTravels.jpeg',
  //       fallbackIcon: <FaPlane className="text-teal-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-teal-50',
  //   textColor: 'text-teal-600',
  //   borderColor: 'border-teal-100',
  //   categoryUrl: '#',
  // },
  // {
  //   id: 9,
  //   title: 'Non-Profit',
  //   icon: <FaHandsHelping className="text-pink-500" size={20} />,
  //   subcategories: [
  //     {
  //       name: 'DR Foundation',
  //       image: '/cat/DR Foundation.jpeg',
  //       fallbackIcon: <FaHandsHelping className="text-pink-400" size={24} />,
  //       url: '#',
  //     },
  //   ],
  //   bgColor: 'bg-pink-50',
  //   textColor: 'text-pink-600',
  //   borderColor: 'border-pink-100',
  //   categoryUrl: '#',
  // },
];

const Menu = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-4">
        {staticMenuItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 shadow-sm border ${item.borderColor} bg-white`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  {item.icon}
                </div>
                <h3 className={`font-semibold text-sm ${item.textColor}`}>
                  {item.title}
                </h3>
              </div>
              {/* <Link to={item.categoryUrl} className="text-gray-400 hover:text-black">
                <FaChevronRight size={16} />
              </Link> */}
            </div>

            {/* Subcategories */}
            <div className="grid grid-cols-2 gap-4">
              {item.subcategories.map((sub, index) => (
                <Link
                  to={sub.url}
                  key={index}
                  className="flex flex-col items-center text-center group"
                  onClick={() => {
                    if (sub.name === "GuntiMart") {
                      localStorage.setItem("store_type", "1");
                    }
                  }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover bg-black"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <span className="text-[9px] mt-2 text-gray-700 font-medium">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
