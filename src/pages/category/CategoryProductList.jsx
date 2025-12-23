// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useCategorieProduct } from "../../hooks/useCategorieProduct";
// import hashids from "../../util/hashids";
// import Loader from "../../components/Loader";
// import Cat from "./Cat";
// import Breadcrumbs from "../../components/Breadcrumb";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, FreeMode } from "swiper/modules";
// import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
// import Filter from "../../components/Filter";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/free-mode";

// const SubCategory = ({ subCategories, selectedId, onSelect }) => {
//   const navigationPrevRef = React.useRef(null);
//   const navigationNextRef = React.useRef(null);

//   return (
//     <div className="w-full relative md:px-4">
//       {subCategories.length === 0 ? (
//         <div className="flex items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200">
//           <p className="text-gray-500 text-sm md:text-base text-center">
//             No categories available
//           </p>
//         </div>
//       ) : (
//         <>
//           <Swiper
//             modules={[Navigation, FreeMode]}
//             spaceBetween={12}
//             freeMode={true}
//             navigation={{
//               prevEl: navigationPrevRef.current,
//               nextEl: navigationNextRef.current,
//             }}
//             breakpoints={{
//               320: { slidesPerView: 3.5, spaceBetween: 8 },
//               480: { slidesPerView: 4.8 },
//               640: { slidesPerView: 6 },
//               768: { slidesPerView: 7 },
//               1024: { slidesPerView: 8.5, spaceBetween: 14 },
//               1280: { slidesPerView: 9.5 },
//             }}
//             onInit={(swiper) => {
//               swiper.params.navigation.prevEl = navigationPrevRef.current;
//               swiper.params.navigation.nextEl = navigationNextRef.current;
//               swiper.navigation.init();
//               swiper.navigation.update();
//             }}
//             className="px-1 py-4 md:py-6"
//           >

//             <SwiperSlide>
//               <div
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => onSelect(null, "All Products")}
//                 onKeyDown={(e) => e.key === "Enter" && onSelect(null, "All Products")}
//                 className={`group my-4 mx-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 
//                   flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow hover:shadow-md cursor-pointer h-full ${selectedId === null
//                     ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
//                     : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
//                   }`}
//               >
//                 <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 shadow text-white group-hover:scale-110 transition-transform duration-300">
//                   <span className="text-sm font-bold">All</span>
//                 </div>
//                 <p className="text-[10px] lg:text-sm font-medium text-center text-gray-800 truncate w-full px-1">
//                   All Products
//                 </p>
//               </div>
//             </SwiperSlide>

//             {subCategories.map((category) => {
//               const isSelected = selectedId === category.cat_id;
//               return (
//                 <SwiperSlide key={category.cat_id}>
//                   <div
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => onSelect(category.cat_id, category.cat_name)}
//                     onKeyDown={(e) => e.key === "Enter" && onSelect(category.cat_id, category.cat_name)}
//                     className={`group my-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
//                       flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow hover:shadow-md cursor-pointer h-full ${isSelected
//                         ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
//                         : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
//                       }`}
//                   >
//                     <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                       <img
//                         src={
//                           category.image
//                             ? `${import.meta.env.VITE_MEDIA_URL}/categories/${category.image}`
//                             : "/img/Nocat.png"
//                         }
//                         alt={category.cat_name}
//                         className="w-full h-full object-cover"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.src = "/img/Nocat.png";
//                         }}
//                       />
//                     </div>
//                     <p className="text-[11px] md:text-sm font-medium text-center text-gray-800 truncate w-full px-1">
//                       {category.cat_name}
//                     </p>
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </>
//       )}
//     </div>
//   );
// };

// const ClayArtProductList = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const encodedCatId = queryParams.get("catId");
//   const categoryId = encodedCatId ? hashids.decode(encodedCatId)[0] : null;
//   const { data, isLoading, error } = useCategorieProduct(categoryId);
//   const subcategories = data?.subcat || [];
//   const allProducts = data?.product || [];
//   const [selectedFilterId, setSelectedFilterId] = useState(null);
//   const [selectedFilterName, setSelectedFilterName] = useState("All Products");
//   const [isFilterVisible, setIsFilterVisible] = useState(true);

//   const getPriceRange = (products) => {
//     if (products.length === 0) return [0, 50000];
//     const prices = products.map(product => {
//       return product.varient_details[0]?.sales_price ||
//         product.varient_details[0]?.product_price || 0;
//     });
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);
//     return [minPrice, maxPrice];
//   };

//   const getCurrentProducts = () => {
//     return selectedFilterId
//       ? allProducts.filter(product => product.category_id === selectedFilterId)
//       : allProducts;
//   };

//   const currentProducts = getCurrentProducts();
//   const currentPriceRange = getPriceRange(currentProducts);

//   const [filterCriteria, setFilterCriteria] = useState({
//     priceRange: currentPriceRange,
//     sort: "",
//     categories: [],
//     isBulk: null,
//   });


//   // useEffect(() => {
//   //   setFilterCriteria(prev => {
//   //     const [minPrev, maxPrev] = prev.priceRange;
//   //     const [minCurr, maxCurr] = currentPriceRange;
//   //     if (minPrev === minCurr && maxPrev === maxCurr) {
//   //       return prev;
//   //     }
//   //     return { ...prev, priceRange: currentPriceRange };
//   //   });
//   // }, [currentPriceRange]);

//   useEffect(() => {
//     // Reset filters only when category changes
//     setFilterCriteria({
//       priceRange: getPriceRange(getCurrentProducts()),
//       sort: "",
//       categories: [],
//       isBulk: null,
//     });
//   }, [categoryId, selectedFilterId]);


//   useEffect(() => {
//     // Reset filter when category changes
//     setSelectedFilterId(null);
//     setSelectedFilterName("All Products");
//   }, [categoryId]);

//   const handleFilterChange = (newCriteria) => {
//     setFilterCriteria((prev) => ({ ...prev, ...newCriteria }));
//   };

//   const handleSubCatSelect = (subId, subName) => {
//     setSelectedFilterId(subId);
//     setSelectedFilterName(subName || "All Products");
//   };

//   const toggleFilterVisibility = () => {
//     setIsFilterVisible(!isFilterVisible);
//   };

//   if (!categoryId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-4">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Category</h2>
//           <p className="text-gray-600">The category ID is missing or invalid.</p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) return <Loader />;
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-4">
//           <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
//           <p className="text-gray-600">{error.message}</p>
//         </div>
//       </div>
//     );
//   }

//   let filteredProducts = currentProducts;

//   if (filterCriteria.isBulk !== null) {
//     filteredProducts = filteredProducts.filter(product => product.is_bulk === filterCriteria.isBulk);
//   }

//   filteredProducts = filteredProducts.filter(product => {
//     const price = product.varient_details[0]?.sales_price ||
//       product.varient_details[0]?.product_price || 0;
//     return price >= filterCriteria.priceRange[0] &&
//       price <= filterCriteria.priceRange[1];
//   });

//   if (filterCriteria.sort === "price-asc") {
//     filteredProducts = [...filteredProducts].sort((a, b) => {
//       const priceA = a.varient_details[0]?.sales_price || a.varient_details[0]?.product_price || 0;
//       const priceB = b.varient_details[0]?.sales_price || b.varient_details[0]?.product_price || 0;
//       return priceA - priceB;
//     });
//   } else if (filterCriteria.sort === "price-desc") {
//     filteredProducts = [...filteredProducts].sort((a, b) => {
//       const priceA = a.varient_details[0]?.sales_price || a.varient_details[0]?.product_price || 0;
//       const priceB = b.varient_details[0]?.sales_price || b.varient_details[0]?.product_price || 0;
//       return priceB - priceA;
//     });
//   } else if (filterCriteria.sort === "rating") {
//     filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
//   } else if (filterCriteria.sort === "newest") {
//     filteredProducts = [...filteredProducts].sort(
//       (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="container mx-auto px-3 py-4 max-w-7xl">
//         {/* <div className="bg-white rounded-2xl shadow-xs p-4 md:mb-4">
//           <Breadcrumbs className="text-sm" catId={categoryId} />
//         </div> */}

//         <div className="flex flex-col lg:flex-row gap-1 md:gap-6">
//           <div className="lg:w-1/4">
//             <Filter
//               filterCriteria={filterCriteria}
//               onFilterChange={handleFilterChange}
//               isCollapsed={!isFilterVisible}
//               toggleCollapse={toggleFilterVisibility}
//               minPrice={currentPriceRange[0]}
//               maxPrice={currentPriceRange[1]}
//               isBulk={filterCriteria.isBulk}
//               onBulkFilterChange={(value) => {
//                 setFilterCriteria(prev => ({ ...prev, isBulk: value }));
//               }}
//             />
//           </div>

//           <div className="lg:w-3/4">
//             {subcategories.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-xs overflow-hidden mb-6 sticky top-14 md:top-32 z-10">
//                 <SubCategory
//                   subCategories={subcategories}
//                   selectedId={selectedFilterId}
//                   onSelect={handleSubCatSelect}
//                 />
//               </div>
//             )}

//             {filteredProducts.length > 0 ? (
//               <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
//                 <div className="p-2 md:p-6">
//                   <Cat products={filteredProducts} />
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl shadow-xs p-8 text-center">
//                 <div className="max-w-md mx-auto">
//                   <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     No products found
//                   </h3>
//                   <p className="text-gray-600 mb-6">
//                     {selectedFilterName !== "All Products"
//                       ? `There are no products in the "${selectedFilterName}" category matching your filters.`
//                       : "There are no products available matching your filters."
//                     }
//                   </p>
//                   <button
//                     onClick={() => {
//                       setSelectedFilterId(null);
//                       setSelectedFilterName("All Products");
//                       setFilterCriteria({
//                         priceRange: getPriceRange(allProducts),
//                         sort: "",
//                         categories: [],
//                       });
//                     }}
//                     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClayArtProductList;


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCategorieProduct } from "../../hooks/useCategorieProduct";
import hashids from "../../util/hashids";
import Loader from "../../components/Loader";
import Cat from "./Cat";
import Breadcrumbs from "../../components/Breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import Filter from "../../components/Filter";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const SubCategory = ({ subCategories, selectedId, onSelect }) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  return (
    <div className="w-full relative md:px-4">
      {subCategories.length === 0 ? (
        <div className="flex items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm md:text-base text-center">
            No categories available
          </p>
        </div>
      ) : (
        <>
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={12}
            freeMode={true}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            breakpoints={{
              320: { slidesPerView: 3.5, spaceBetween: 8 },
              480: { slidesPerView: 4.8 },
              640: { slidesPerView: 6 },
              768: { slidesPerView: 7 },
              1024: { slidesPerView: 8.5, spaceBetween: 14 },
              1280: { slidesPerView: 9.5 },
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="px-1 py-4 md:py-6"
          >

            <SwiperSlide>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelect(null, "All Products")}
                onKeyDown={(e) => e.key === "Enter" && onSelect(null, "All Products")}
                className={`group my-4 mx-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 
                  flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow hover:shadow-md cursor-pointer h-full ${selectedId === null
                    ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
                    : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                  }`}
              >
                <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 shadow text-white group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold">All</span>
                </div>
                <p className="text-[10px] lg:text-sm font-medium text-center text-gray-800 truncate w-full px-1">
                  All Products
                </p>
              </div>
            </SwiperSlide>

            {subCategories.map((category) => {
              const isSelected = selectedId === category.cat_id;
              return (
                <SwiperSlide key={category.cat_id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(category.cat_id, category.cat_name)}
                    onKeyDown={(e) => e.key === "Enter" && onSelect(category.cat_id, category.cat_name)}
                    className={`group my-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
                      flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow hover:shadow-md cursor-pointer h-full ${isSelected
                        ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
                        : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={
                          category.image
                            ? `${import.meta.env.VITE_MEDIA_URL}/categories/${category.image}`
                            : "/img/Nocat.png"
                        }
                        alt={category.cat_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/img/Nocat.png";
                        }}
                      />
                    </div>
                    <p className="text-[11px] md:text-sm font-medium text-center text-gray-800 truncate w-full px-1">
                      {category.cat_name}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      )}
    </div>
  );
};

const ClayArtProductList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedCatId = queryParams.get("catId");
  const categoryId = encodedCatId ? hashids.decode(encodedCatId)[0] : null;
  const { data, isLoading, error } = useCategorieProduct(categoryId);
  const subcategories = data?.subcat || [];
  const allProducts = data?.product || [];
  const [selectedFilterId, setSelectedFilterId] = useState(null);
  const [selectedFilterName, setSelectedFilterName] = useState("All Products");
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const getPriceRange = (products) => {
    if (products.length === 0) return [0, 50000];
    const prices = products.map(product => {
      return product.varient_details[0]?.sales_price ||
        product.varient_details[0]?.product_price || 0;
    });
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice, maxPrice];
  };

  const getCurrentProducts = () => {
    return selectedFilterId
      ? allProducts.filter(product => product.category_id === selectedFilterId)
      : allProducts;
  };

  const currentProducts = getCurrentProducts();
  const currentPriceRange = getPriceRange(currentProducts);

  // Updated to use priceRanges instead of priceRange
  const [filterCriteria, setFilterCriteria] = useState({
    priceRanges: [], // Changed from priceRange to priceRanges
    sort: "",
    categories: [],
    isBulk: null,
  });

  useEffect(() => {
    // Reset filters only when category changes
    setFilterCriteria({
      priceRanges: [], // Reset price ranges when category changes
      sort: "",
      categories: [],
      isBulk: null,
    });
  }, [categoryId, selectedFilterId]);

  useEffect(() => {
    // Reset filter when category changes
    setSelectedFilterId(null);
    setSelectedFilterName("All Products");
  }, [categoryId]);

  const handleFilterChange = (newCriteria) => {
    setFilterCriteria((prev) => ({ ...prev, ...newCriteria }));
  };

  const handleSubCatSelect = (subId, subName) => {
    setSelectedFilterId(subId);
    setSelectedFilterName(subName || "All Products");
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Check if product price matches any selected price range
  const isProductInPriceRanges = (productPrice, priceRanges) => {
    if (!priceRanges || priceRanges.length === 0) return true;

    return priceRanges.some(range => {
      return productPrice >= range.min && productPrice <= range.max;
    });
  };

  let filteredProducts = currentProducts;

  // Apply bulk filter
  if (filterCriteria.isBulk !== null) {
    filteredProducts = filteredProducts.filter(product => product.is_bulk === filterCriteria.isBulk);
  }

  // Apply price range filter
  if (filterCriteria.priceRanges && filterCriteria.priceRanges.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const price = product.varient_details[0]?.sales_price ||
        product.varient_details[0]?.product_price || 0;
      return isProductInPriceRanges(price, filterCriteria.priceRanges);
    });
  }

  // Apply sorting
  if (filterCriteria.sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.varient_details[0]?.sales_price || a.varient_details[0]?.product_price || 0;
      const priceB = b.varient_details[0]?.sales_price || b.varient_details[0]?.product_price || 0;
      return priceA - priceB;
    });
  } else if (filterCriteria.sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.varient_details[0]?.sales_price || a.varient_details[0]?.product_price || 0;
      const priceB = b.varient_details[0]?.sales_price || b.varient_details[0]?.product_price || 0;
      return priceB - priceA;
    });
  } else if (filterCriteria.sort === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (filterCriteria.sort === "newest") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }

  if (!categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Category</h2>
          <p className="text-gray-600">The category ID is missing or invalid.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 py-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-1 md:gap-6">
          <div className="lg:w-1/4">
            <Filter
              filterCriteria={filterCriteria}
              onFilterChange={handleFilterChange}
              isCollapsed={!isFilterVisible}
              toggleCollapse={toggleFilterVisibility}
              minPrice={currentPriceRange[0]}
              maxPrice={currentPriceRange[1]}
              isBulk={filterCriteria.isBulk}
              onBulkFilterChange={(value) => {
                setFilterCriteria(prev => ({ ...prev, isBulk: value }));
              }}
            />
          </div>

          <div className="lg:w-3/4">
            {subcategories.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xs overflow-hidden mb-6 sticky top-14 md:top-32 z-10">
                <SubCategory
                  subCategories={subcategories}
                  selectedId={selectedFilterId}
                  onSelect={handleSubCatSelect}
                />
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
                <div className="p-2 md:p-6">
                  <Cat products={filteredProducts} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xs p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedFilterName !== "All Products"
                      ? `There are no products in the "${selectedFilterName}" category matching your filters.`
                      : "There are no products available matching your filters."
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFilterId(null);
                      setSelectedFilterName("All Products");
                      setFilterCriteria({
                        priceRanges: [],
                        sort: "",
                        categories: [],
                        isBulk: null,
                      });
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClayArtProductList;
