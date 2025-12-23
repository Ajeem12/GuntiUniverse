// import React, { useState, useRef } from "react";
// import { ArrowDropDown, Close as CloseIcon, Home } from "@mui/icons-material";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { useCategories } from "../hooks/useCategories";
// import { Link } from "react-router-dom";
// import hashids from "../util/hashids";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { HiInformationCircle } from "react-icons/hi";
// const CategoryMenu = ({ isMobileOpen, setMobileOpen }) => {
//   const [openParent, setOpenParent] = useState(null);
//   const [mobileSubOpen, setMobileSubOpen] = useState({});
//   const closeTimeout = useRef(null);
//   const { data } = useCategories();
//   const categories = data?.data || [];

//   const handleMouseEnterParent = (index) => {
//     clearTimeout(closeTimeout.current);
//     setOpenParent(index);
//   };

//   const handleMouseLeaveParent = () => {
//     closeTimeout.current = setTimeout(() => {
//       setOpenParent(null);
//     }, 200);
//   };

//   const generateLink = (parentName, rawCatId) => {
//     if (!parentName || !rawCatId) return "#";
//     const formattedName = parentName.toLowerCase().replace(/\s+/g, "-");
//     const encodedId = hashids.encode(Number(rawCatId));
//     return `/category/${formattedName}?catId=${encodedId}`;
//   };

//   const findSubcategoryId = (name) => {
//     const match = categories.find((item) => item.parentcate === name);
//     return match?.id;
//   };

//   const toggleMobileSub = (index) => {
//     setMobileSubOpen((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const renderDesktopMenu = () =>
//     categories
//       .filter((cat) => cat.type === 0)
//       .map((cat, parentIndex) => (
//         <li
//           key={cat.id}
//           className="relative group"
//           onMouseEnter={() => handleMouseEnterParent(parentIndex)}
//           onMouseLeave={handleMouseLeaveParent}
//         >
//           <div className="flex items-center gap-1 cursor-pointer px-3 py-2 ">
//             <Link
//               to={generateLink(cat.parentcate, cat.id)}
//               className="hover:underline  text-sm font-semibold text-gray-800"
//             >
//               {cat.parentcate}
//             </Link>
//             {cat.subcate1?.length > 0 && (
//               <ArrowDropDown fontSize="small" className="ml-[2px]" />
//             )}
//           </div>

//           {cat.subcate1?.length > 0 && openParent === parentIndex && (
//             <ul
//               className="absolute left-0 top-full bg-[#FDBD3C] shadow-lg rounded-md z-50 mt-1 min-w-[200px]"
//               onMouseEnter={() => handleMouseEnterParent(parentIndex)}
//               onMouseLeave={handleMouseLeaveParent}
//             >
//               {cat.subcate1.map((sub1, sub1Index) => (
//                 <li key={`${cat.id}-sub1-${sub1Index}`} className="border-b last:border-none">
//                   <Link
//                     to={generateLink(cat.parentcate, findSubcategoryId(sub1.sub_cate2))}
//                     className="block px-4 py-2 text-sm text-gray-800 hover:bg-yellow-200 hover:text-black"
//                   >
//                     {sub1.sub_cate2}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}

//         </li>
//       ));

//   const renderMobileMenu = () => (
//     <div className="bg-white">
//       {/* Menu Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
//         <h3 className="font-bold text-gray-800">All Categories</h3>
//       </div>

//       {/* Category Accordion */}
//       <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
//         {categories
//           .filter((cat) => cat.type === 0)
//           .map((cat) => (
//             <div key={cat.id} className="border-b border-gray-100">
//               {/* Parent Category (e.g., Grocery) */}
//               <button
//                 onClick={() =>
//                   setMobileSubOpen((prev) => ({
//                     ...prev,
//                     [cat.id]: !prev[cat.id],
//                   }))
//                 }
//                 className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={`${import.meta.env.VITE_MEDIA_URL}/categories/${cat.image
//                       }`}
//                     alt={cat.parentcate}
//                     className="w-8 h-8 object-cover rounded border border-gray-200"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "/img/category-placeholder.png";
//                     }}
//                   />
//                   <span className="font-semibold text-gray-800">
//                     {cat.parentcate}
//                   </span>
//                 </div>

//                 <ChevronRightIcon
//                   className={`text-gray-400 transform transition-transform ${mobileSubOpen[cat.id] ? "rotate-90" : ""
//                     }`}
//                 />
//               </button>

//               {/* Show subcate1 under parent when expanded */}
//               {mobileSubOpen[cat.id] && cat.subcate1 && (
//                 <div className="bg-gray-50 pl-6 pr-4 animate-slideDown">
//                   {Object.values(cat.subcate1).map((sub1) => (
//                     <Link
//                       key={sub1.sub_cate_id}
//                       to={generateLink(sub1.sub_cate2, sub1.sub_cate_id)}
//                       onClick={() => setMobileOpen(false)}
//                       className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
//                     >
//                       <div className="w-8 h-8 mr-3 flex-shrink-0">
//                         <img
//                           src={`${import.meta.env.VITE_MEDIA_URL}/categories/${sub1.sub_cate_images
//                             }`}
//                           alt={sub1.sub_cate2}
//                           className="w-full h-full object-cover rounded border"
//                         />
//                       </div>
//                       {sub1.sub_cate2}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop View */}
//       <div className="bg-[#FDBD3C] border-b border-black hidden md:block sticky top-[88px] z-40">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-start whitespace-nowrap "
//             style={{ WebkitOverflowScrolling: "touch" }}>
//             <Link
//               to="/"
//               className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
//             >
//               <Home fontSize="small" />
//               <span>Gunti Universe</span>
//             </Link>

//             {renderDesktopMenu()}

//             <Link
//               to="/offers"
//               className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
//             >
//               <span>Offers</span>
//             </Link>

//             <Link
//               to="/contact"
//               className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
//             >
//               <span>Contact</span>
//             </Link>
//           </div>
//         </div>
//       </div >

//       {/* Mobile View */}
//       < div
//         className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-all duration-300 ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
//           }`
//         }
//         onClick={() => setMobileOpen(false)}
//       ></div >

//       <div
//         className={`fixed top-0 left-0 h-full w-full  bg-white z-50 shadow-lg transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//       >
//         <div className="flex items-center justify-between px-4 py-3 border-b bg-[#FDBD3C] text-black">
//           <h3 className="font-semibold text-lg">GuntiMart</h3>
//           <button onClick={() => setMobileOpen(false)}>
//             <CloseIcon className="text-black" />
//           </button>
//         </div>

//         <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
//           <div className="border-b">
//             <Link
//               to="/"
//               onClick={() => setMobileOpen(false)}
//               className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800"
//             >
//               <Home fontSize="small" />
//               <span>GuntiUniverse</span>
//             </Link>
//           </div>

//           <div className="border-b">
//             <Link
//               to="/contact-us"
//               onClick={() => setMobileOpen(false)}
//               className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800"
//             >
//               <HiInformationCircle fontSize="small" />
//               <span>ContactUs</span>
//             </Link>
//           </div>

//           <div className="pt-4 px-4">
//             <h4 className="text-lg text-gray-700 font-medium mb-3">
//               Other Apps
//             </h4>
//             <Link
//               to="/news"
//               onClick={() => setMobileOpen(false)}
//               className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
//             >
//               <div className="w-8 h-8 mr-3 flex-shrink-0">
//                 <img
//                   src="/logo/logo.jpeg"
//                   alt="Gunti News"
//                   className="w-full h-full object-cover rounded border"
//                 />
//               </div>
//               GuntiNewsPay
//             </Link>
//           </div>

//           {renderMobileMenu()}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryMenu;

import React, { useState, useRef } from "react";
import { ArrowDropDown, Close as CloseIcon, Home } from "@mui/icons-material";
import { RxHamburgerMenu } from "react-icons/rx";
import { useCategories } from "../hooks/useCategories";
import { Link } from "react-router-dom";
import hashids from "../util/hashids";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HiInformationCircle } from "react-icons/hi";

const CategoryMenu = ({ isMobileOpen, setMobileOpen }) => {
  const [openParent, setOpenParent] = useState(null);
  const [mobileSubOpen, setMobileSubOpen] = useState({});
  const closeTimeout = useRef(null);
  const { data } = useCategories();
  const categories = data?.data || [];

  // Get only first 4 categories for desktop menu
  const limitedCategories = categories
    .filter((cat) => cat.type === 0)
    .slice(0, 7);

  const handleMouseEnterParent = (index) => {
    clearTimeout(closeTimeout.current);
    setOpenParent(index);
  };

  const handleMouseLeaveParent = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenParent(null);
    }, 200);
  };

  const generateLink = (parentName, rawCatId) => {
    if (!parentName || !rawCatId) return "#";
    const formattedName = parentName.toLowerCase().replace(/\s+/g, "-");
    const encodedId = hashids.encode(Number(rawCatId));
    return `/category/${formattedName}?catId=${encodedId}`;
  };

  const findSubcategoryId = (name) => {
    const match = categories.find((item) => item.parentcate === name);
    return match?.id;
  };

  const toggleMobileSub = (index) => {
    setMobileSubOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderDesktopMenu = () =>
    limitedCategories.map((cat, parentIndex) => (
      <li
        key={cat.id}
        className="relative group"
        onMouseEnter={() => handleMouseEnterParent(parentIndex)}
        onMouseLeave={handleMouseLeaveParent}
      >
        <div className="flex items-center gap-1 cursor-pointer px-3 py-2 ">
          <Link
            to={generateLink(cat.parentcate, cat.id)}
            className="hover:underline  text-sm font-semibold text-gray-800"
          >
            {cat.parentcate}
          </Link>
          {cat.subcate1?.length > 0 && (
            <ArrowDropDown fontSize="small" className="ml-[2px]" />
          )}
        </div>

        {cat.subcate1?.length > 0 && openParent === parentIndex && (
          <ul
            className="absolute left-0 top-full bg-[#FDBD3C] shadow-lg rounded-md z-50 mt-1 min-w-[200px]"
            onMouseEnter={() => handleMouseEnterParent(parentIndex)}
            onMouseLeave={handleMouseLeaveParent}
          >
            {cat.subcate1.map((sub1, sub1Index) => (
              <li
                key={`${cat.id}-sub1-${sub1Index}`}
                className="border-b last:border-none"
              >
                <Link
                  to={generateLink(
                    cat.parentcate,
                    findSubcategoryId(sub1.sub_cate2)
                  )}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-yellow-200 hover:text-black"
                >
                  {sub1.sub_cate2}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));

  const renderMobileMenu = () => (
    <div className="bg-white">
      {/* Menu Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-800">All Categories</h3>
      </div>

      {/* Category Accordion */}
      <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
        {limitedCategories.map((cat) => (
          <div key={cat.id} className="border-b border-gray-100">
            {/* Parent Category (e.g., Grocery) */}
            <button
              onClick={() =>
                setMobileSubOpen((prev) => ({
                  ...prev,
                  [cat.id]: !prev[cat.id],
                }))
              }
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_MEDIA_URL}/categories/${
                    cat.image
                  }`}
                  alt={cat.parentcate}
                  className="w-8 h-8 object-cover rounded border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/category-placeholder.png";
                  }}
                />
                <span className="font-semibold text-gray-800">
                  {cat.parentcate}
                </span>
              </div>

              <ChevronRightIcon
                className={`text-gray-400 transform transition-transform ${
                  mobileSubOpen[cat.id] ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Show subcate1 under parent when expanded */}
            {mobileSubOpen[cat.id] && cat.subcate1 && (
              <div className="bg-gray-50 pl-6 pr-4 animate-slideDown">
                {Object.values(cat.subcate1).map((sub1) => (
                  <Link
                    key={sub1.sub_cate_id}
                    to={generateLink(sub1.sub_cate2, sub1.sub_cate_id)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
                  >
                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                      <img
                        src={`${import.meta.env.VITE_MEDIA_URL}/categories/${
                          sub1.sub_cate_images
                        }`}
                        alt={sub1.sub_cate2}
                        className="w-full h-full object-cover rounded border"
                      />
                    </div>
                    {sub1.sub_cate2}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="bg-[#FDBD3C] border-b border-black hidden md:block sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="flex items-center justify-start whitespace-nowrap "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
            >
              <Home fontSize="small" />
              <span>Gunti Universe</span>
            </Link>

            {renderDesktopMenu()}

            <Link
              to="/offers"
              className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
            >
              <span>Offers</span>
            </Link>

            <Link
              to="/contact"
              className="flex items-center gap-1 px-3 py-3 text-gray-800 hover:text-white font-medium text-sm"
            >
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-all duration-300 ${
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-full  bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-[#FDBD3C] text-black">
          <h3 className="font-semibold text-lg">GuntiMart</h3>
          <button onClick={() => setMobileOpen(false)}>
            <CloseIcon className="text-black" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
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
              className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800"
            >
              <HiInformationCircle fontSize="small" />
              <span>ContactUs</span>
            </Link>
          </div>

          <div className="pt-4 px-4">
            <h4 className="text-lg text-gray-700 font-medium mb-3">
              Other Apps
            </h4>
            <Link
              to="/gunti-fast"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded"
            >
              <div className="w-8 h-8 mr-3 flex-shrink-0">
                <img
                  src="/gfast/gfb.jpeg"
                  alt="GuntiFast"
                  className="w-full h-full object-cover rounded border"
                />
              </div>
              GuntiFast
            </Link>
            <Link
              to="/news"
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
              GuntiNewsPay
            </Link>
          </div>

          {renderMobileMenu()}
        </div>
      </div>
    </>
  );
};

export default CategoryMenu;
