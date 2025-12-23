import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import hashids from "../../util/hashids";
import { FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useRef } from "react";

const CategorySection = () => {
  const { data } = useCategories();
  const navigate = useNavigate();

  const categories = (data?.data || []).filter(
    (category) => category.type === 0
  );

  const categoryRefs = useRef({});

  const scrollToCategory = (id) => {
    categoryRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const generateLink = (name, id) => {
    const formatted = name?.toLowerCase().replace(/\s+/g, "-");
    const encodedId = hashids.encode(id);
    return `/category/${formatted}?catId=${encodedId}`;
  };

  const getTextColor = (index) => {
    const colors = [
      "text-blue-700",
      "text-emerald-700",
      "text-amber-700",
      "text-purple-700",
      "text-rose-700",
      "text-cyan-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/*  STICKY TOP TABS */}
      {/* <div className="sticky top-[58px] z-30 bg-white border-b mb-6 ">
             <h2 className="text-3xl font-bold text-gray-800">Shop by Categories</h2>
        <div className="flex gap-4 overflow-x-auto py-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="whitespace-nowrap px-4 py-1 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
            >
              {cat.parentcate}
            </button>
          ))}
        </div>
      </div> */}

      <div className="sticky top-[58px] z-30 bg-white border-b mb-6">
        <h2 className="text-3xl font-bold text-gray-800 px-2 pt-3">
          Shop by Categories
        </h2>

        <div className="flex gap-4 overflow-x-auto py-3 px-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="flex-shrink-0 w-24 bg-gray-50 hover:bg-gray-100 border rounded-xl p-2 transition text-center"
            >
              {/* Category Image */}
              <div className="w-11 h-11 mx-auto mb-2 bg-white border rounded-lg flex items-center justify-center">
                <img
                  src={
                    cat.image
                      ? `${import.meta.env.VITE_MEDIA_URL}/categories/${
                          cat.image
                        }`
                      : "/img/Nocat.png"
                  }
                  alt={cat.parentcate}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Category Name */}
              <p className="text-xs font-medium text-gray-700 line-clamp-2">
                {cat.parentcate}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => (categoryRefs.current[category.id] = el)}
            className="rounded-2xl border shadow-sm p-5 scroll-mt-[225px]"
          >
            {/* Parent Header */}
            <h3 className={`text-lg font-semibold mb-4 ${getTextColor(index)}`}>
              {category.parentcate}
            </h3>

            {/* Subcategories */}
            <div className="grid grid-cols-2 gap-3">
              {Object.values(category.subcate1 || {}).map((sub, idx) => {
                const firstChild = sub.subcate3?.[0];
                const targetName = firstChild?.sub_cate2 || sub.sub_cate2;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      navigate(generateLink(targetName, sub.sub_cate_id))
                    }
                    className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="w-16 h-16 mb-2 bg-gray-50 border rounded-lg flex items-center justify-center">
                      <img
                        src={
                          sub.sub_cate_images
                            ? `${import.meta.env.VITE_MEDIA_URL}/categories/${
                                sub.sub_cate_images
                              }`
                            : "/img/Nocat.png"
                        }
                        alt={targetName}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <p className="text-xs text-center font-medium line-clamp-2">
                      {sub.sub_cate2}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// const CategorySection = () => {
//   const { data } = useCategories();
//   const navigate = useNavigate();
//   const categories = (data?.data || []).filter(
//     (category) => category.type === 0
//   );
//   const [hoveredCategory, setHoveredCategory] = useState(null);

//   const generateLink = (name, id) => {
//     const formatted = name?.toLowerCase().replace(/\s+/g, "-");
//     const encodedId = hashids.encode(id);
//     return `/category/${formatted}?catId=${encodedId}`;
//   };

//   // Function to generate a gradient color based on index
//   const getGradientColor = (index) => {
//     const colors = [
//       "from-blue-50 to-blue-100 border-blue-200",
//       "from-emerald-50 to-emerald-100 border-emerald-200",
//       "from-amber-50 to-amber-100 border-amber-200",
//       "from-purple-50 to-purple-100 border-purple-200",
//       "from-rose-50 to-rose-100 border-rose-200",
//       "from-cyan-50 to-cyan-100 border-cyan-200",
//       "from-violet-50 to-violet-100 border-violet-200",
//       "from-fuchsia-50 to-fuchsia-100 border-fuchsia-200",
//     ];
//     return colors[index % colors.length];
//   };

//   // Function to get text color based on index
//   const getTextColor = (index) => {
//     const colors = [
//       "text-blue-700",
//       "text-emerald-700",
//       "text-amber-700",
//       "text-purple-700",
//       "text-rose-700",
//       "text-cyan-700",
//       "text-violet-700",
//       "text-fuchsia-700",
//     ];
//     return colors[index % colors.length];
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-800">Shop by Categories</h2>
//       </div>

//       {/* Parent Category Cards */}
//       <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {categories.map((category, index) => {
//           const subcats = category.subcate1
//             ? Object.values(category.subcate1).map((item) => item.sub_cate2)
//             : [];

//           return (
//             <div
//               key={category.id}
//               className={` rounded-2xl border shadow-sm p-5 flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md`}
//               onMouseEnter={() => setHoveredCategory(category.id)}
//               onMouseLeave={() => setHoveredCategory(null)}
//             >
//               {/* Parent Category Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <h3
//                   className={`text-lg font-semibold ${getTextColor(
//                     index
//                   )} truncate`}
//                 >
//                   {category.parentcate}
//                 </h3>
//               </div>

//               {/* Subcategories */}
//               <div className="grid grid-cols-2 gap-3">
//                 {Object.values(category.subcate1 || {}).map((sub, index) => {
//                   const firstChild = sub.subcate3?.[0];
//                   const targetSubcatName =
//                     firstChild?.sub_cate2 || sub.sub_cate2;
//                   const targetSubcatId = sub.sub_cate_id;
//                   const targetImage = sub.sub_cate_images;

//                   return (
//                     <div
//                       key={index}
//                       onClick={() =>
//                         navigate(generateLink(targetSubcatName, targetSubcatId))
//                       }
//                       className="flex flex-col items-center bg-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
//                     >
//                       {/* Subcategory Image */}
//                       <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
//                         <img
//                           src={
//                             targetImage
//                               ? `${
//                                   import.meta.env.VITE_MEDIA_URL
//                                 }/categories/${targetImage}`
//                               : "/img/Nocat.png"
//                           }
//                           alt={targetSubcatName}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>

//                       {/* Subcategory Name */}
//                       <p className="text-xs sm:text-sm font-medium text-gray-800 text-center line-clamp-2">
//                         {sub.sub_cate2}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

export default CategorySection;
