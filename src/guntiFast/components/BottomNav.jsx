// import React, { useEffect, useState } from "react";
// import { FaHome, FaShoppingCart } from "react-icons/fa";
// import { FiBox } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useCMartCartStore } from "../store/cmartCartStore";
// import clsx from "clsx";
// import { BsBoxSeam } from "react-icons/bs";
// import { BsBoxSeamFill } from "react-icons/bs";
// import { IoMdHome } from "react-icons/io";
// import {
//   FiHome,
//   FiUser,
//   FiShoppingBag,
//   FiMapPin,
//   FiLogOut,
//   FiShoppingCart,
// } from "react-icons/fi";

// const BottomNav = () => {
//   const navigate = useNavigate();
//   const { cart } = useCMartCartStore();
//   const [blink, setBlink] = useState(false);

//   const cartLength = cart.length;

//   // Blink effect when cart length changes
//   useEffect(() => {
//     if (cartLength > 0) {
//       setBlink(true);
//       const timer = setTimeout(() => setBlink(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [cartLength]);

//   const navItems = [
//     { label: "Home", icon: <IoMdHome />, path: "/gunti-fast" },
//     { label: "Orders", icon: <BsBoxSeam />, path: "/gunti-fast/my-orders" },
//     { label: "Cart", icon: <FiShoppingCart />, path: "/gunti-fast/fast-cart" },
//   ];
//   return (
//     <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t py-2 z-40 block md:hidden">
//       <div className="flex justify-around items-center">
//         {navItems.map((item, index) => (
//           <button
//             key={index}
//             onClick={() => navigate(item.path)}
//             className="relative flex flex-col justify-center items-center text-gray-600 hover:text-black"
//           >
//             <div className="text-xl">{item.icon}</div>
//             <span className="text-xs mt-1">{item.label}</span>

//             {/* Cart Badge */}
//             {item.label === "Cart" && cartLength > 0 && (
//               <span
//                 className={clsx(
//                   "absolute top-0 right-0 -mt-1 -mr-2 w-3 h-3 flex items-center justify-center text-[11px] font-bold text-white rounded-full bg-red-500 "
//                 )}
//               >
//                 {cartLength}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BottomNav;

import React, { useEffect, useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { IoMdHome } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useCMartCartStore } from "../store/cmartCartStore";
import clsx from "clsx";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route
  const { cart } = useCMartCartStore();
  const [blink, setBlink] = useState(false);

  const cartLength = cart.length;

  useEffect(() => {
    if (cartLength > 0) {
      setBlink(true);
      const timer = setTimeout(() => setBlink(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartLength]);

  const navItems = [
    { label: "Home", icon: <IoMdHome />, path: "/gunti-fast" },
    { label: "Orders", icon: <BsBoxSeam />, path: "/gunti-fast/my-orders" },
    { label: "Cart", icon: <FiShoppingCart />, path: "/gunti-fast/fast-cart" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t py-2 z-40 block md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={clsx(
                "relative flex flex-col justify-center items-center text-xs transition",
                isActive
                  ? "text-[#FDBD3C] font-semibold"
                  : "text-gray-500 hover:text-black"
              )}
            >
              <div className={clsx("text-xl", isActive && "scale-110")}>
                {item.icon}
              </div>

              <span className="mt-1 ">{item.label}</span>

              {/* Cart Badge */}
              {item.label === "Cart" && cartLength > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-2 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white rounded-full bg-red-500">
                  {cartLength}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
