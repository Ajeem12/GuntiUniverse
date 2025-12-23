// // import React, { useState, useEffect } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { Rating } from "@mui/material";
// // import { useCategorieProduct } from "../hooks/useCategorieProduct";
// // import hashids from "../util/hashids";
// // import { useProductDetails } from "../hooks/useProductDetails";
// // import Loader from "./Loader";

// // const SimilarProducts = () => {
// //   const { id: hashedId } = useParams();
// //   const decoded = hashids.decode(hashedId);
// //   const productId = Array.isArray(decoded) && decoded.length > 0 ? decoded[0] : null;
  
// //   const { data: currentProduct } = useProductDetails(productId);
// //   const categoryId = currentProduct?.category_details?.id;
  
// //   const { data: categoryProducts, isLoading } = useCategorieProduct(categoryId);
// //   const [similarProducts, setSimilarProducts] = useState([]);

// //   useEffect(() => {
// //     if (categoryProducts?.product && currentProduct) {
// //       const filtered = categoryProducts.product
// //         .filter(product => product.id !== currentProduct.id)
// //         .slice(0, 4);
// //       setSimilarProducts(filtered);
// //     }
// //   }, [categoryProducts, currentProduct]);

// //   if (!categoryId || isLoading) return <Loader small />;
// //   if (!similarProducts.length) return null;

// //   return (
// //     <div className="mt-12 px-4">
// //       <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
// //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
// //         {similarProducts.map((product) => {
// //           const price = product.varient_details?.[0]?.sales_price || product.sales_price;
// //           const originalPrice = product.varient_details?.[0]?.product_price || product.product_price;
// //           const image = product.image_details?.[0]?.image 
// //             ? `${import.meta.env.VITE_MEDIA_URL}/products/${product.image_details[0].image}`
// //             : '/placeholder-product.jpg';
          
// //           const categoryName = product.category_details?.category_name || 
// //                              currentProduct?.category_details?.category_name || 
// //                              'Products';

// //           return (
// //             <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
// //               <Link
// //                 to={`/product/${product.product_slug}/${hashids.encode(product.id)}`}
// //                 className="block h-full"
// //               >
// //                 <div className="aspect-square overflow-hidden">
// //                   <img 
// //                     src={image} 
// //                     alt={categoryName}
// //                     className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
// //                   />
// //                 </div>
// //                 <div className="p-3">
// //                   <h3 className="font-medium text-gray-900 text-sm line-clamp-2 text-center">
// //                     {categoryName}
// //                   </h3>
// //                   <div className="mt-2">
// //                     <div className="flex items-center gap-1 justify-center">
// //                       <Rating 
// //                         value={product.average_rating || 0} 
// //                         precision={0.5} 
// //                         readOnly 
// //                         size="small" 
// //                       />
// //                       <span className="text-xs text-gray-500">
// //                         ({product.rating_count || 0})
// //                       </span>
// //                     </div>
// //                     <div className="mt-1 text-center">
// //                       <span className="font-bold text-gray-900">₹{price}</span>
// //                       {originalPrice && originalPrice > price && (
// //                         <span className="text-xs text-gray-500 line-through ml-1">
// //                           ₹{originalPrice}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </Link>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SimilarProducts;

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Rating } from "@mui/material";
// import { useCategorieProduct } from "../hooks/useCategorieProduct";
// import hashids from "../util/hashids";
// import { useProductDetails } from "../hooks/useProductDetails";
// import Loader from "./Loader";

// const SimilarProducts = () => {
//   const { id: hashedId } = useParams();
//   const decoded = hashids.decode(hashedId);
//   const productId = Array.isArray(decoded) && decoded.length > 0 ? decoded[0] : null;
  
//   const { data: currentProduct } = useProductDetails(productId);
//   const categoryId = currentProduct?.category_details?.id;
  
//   const { data: categoryProducts, isLoading } = useCategorieProduct(categoryId);
//   const [similarProducts, setSimilarProducts] = useState([]);

//   useEffect(() => {
//     if (categoryProducts?.product && currentProduct) {
//       const filtered = categoryProducts.product
//         .filter(product => product.id !== currentProduct.id)
//         .slice(0, 4);
//       setSimilarProducts(filtered);
//     }
//   }, [categoryProducts, currentProduct]);

//   if (!categoryId || isLoading) return <Loader small />;
//   if (!similarProducts.length) return null;

//   return (
//     <div className="mt-10 px-4 mb-10">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Products</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//         {similarProducts.map((product) => {
//           const price = product.varient_details?.[0]?.sales_price || product.sales_price;
//           const originalPrice = product.varient_details?.[0]?.product_price || product.product_price;
//           const image = product.image_details?.[0]?.image 
//             ? `${import.meta.env.VITE_MEDIA_URL}/products/${product.image_details[0].image}`
//             : '/placeholder-product.jpg';

//           const categoryName = product.category_details?.category_name || 
//                                currentProduct?.category_details?.category_name || 
//                                'Products';

//           return (
//             <div
//               key={product.id}
//               className="bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow"
//             >
//               <Link
//                 to={`/product/${product.product_slug}/${hashids.encode(product.id)}`}
//                 className="block"
//               >
//                 <div className="overflow-hidden rounded-t-md">
//                   <img
//                     src={image}
//                     alt={product.name || categoryName}
//                     className="w-full h-[140px] object-cover hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//                 <div className="p-2">
//                   <h3 className="text-xs font-medium text-gray-900 line-clamp-2 text-center">
//                     {product.name || categoryName}
//                   </h3>
//                   <div className="mt-1 text-center">
//                     <Rating
//                       value={product.average_rating || 0}
//                       precision={0.5}
//                       readOnly
//                       size="small"
//                     />
//                     <span className="text-[10px] text-gray-500 ml-1">
//                       ({product.rating_count || 0})
//                     </span>
//                   </div>
//                   <div className="mt-1 text-center text-sm font-semibold text-gray-800">
//                     ₹{price.toLocaleString()}
//                     {originalPrice > price && (
//                       <span className="text-[11px] text-gray-500 line-through ml-1">
//                         ₹{originalPrice.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SimilarProducts;



import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Rating } from "@mui/material";
import { FaStar, FaRupeeSign } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { useCategorieProduct } from "../hooks/useCategorieProduct";
import hashids from "../util/hashids";
import { useProductDetails } from "../hooks/useProductDetails";
import Loader from "./Loader";

const SimilarProducts = () => {
  const { id: hashedId } = useParams();
  const decoded = hashids.decode(hashedId);
  const productId = Array.isArray(decoded) && decoded.length > 0 ? decoded[0] : null;
  
  const { data: currentProduct } = useProductDetails(productId);
  const categoryId = currentProduct?.category_details?.id;
  
  const { data: categoryProducts, isLoading } = useCategorieProduct(categoryId);

     

  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if (categoryProducts?.product && currentProduct) {
      const filtered = categoryProducts.product
        .filter(product => product.id !== currentProduct.id)
        .slice(0, 4);
      setSimilarProducts(filtered);
    }
  }, [categoryProducts, currentProduct]);

  if (!categoryId || isLoading) return <Loader small />;
  if (!similarProducts.length) return null;

  return (
    <div className="mt-8  mb-8 bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {similarProducts.map((product) => {
            const price = product.varient_details?.[0]?.sales_price || product.sales_price || 0;
            const originalPrice = product.varient_details?.[0]?.product_price || product.product_price || 0;
            const image = product.image_details?.[0]?.image 
              ? `${import.meta.env.VITE_MEDIA_URL}/products/${product.image_details[0].image}`
              : '/img/Noimages.png';

            const calculatedDiscount = originalPrice > 0 
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

            const averageRating = parseFloat(product?.average_rating || 0);
           const productName = product.product_name || product.category_details?.category_name || 'Product';


            return (
              <Link
                key={product.id}
                to={`/product/${product.product_slug}/${hashids.encode(product.id)}`}
                className="w-full bg-white rounded-sm shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:border-yellow-500"
              >
                {/* Product Image */}
                <div className="relative pt-[100%] overflow-hidden bg-white">
                  <img
                    src={image}
                    alt={productName}
                    className="absolute top-0 left-0 w-full h-full object-contain p-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/Noimages.png";
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {calculatedDiscount > 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-sm">
                      {calculatedDiscount}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 border-t border-gray-100">
                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
                    {productName}
                  </h3>

                  {/* Rating */}
                  {averageRating > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded-sm flex items-center mr-2">
                        <span className="font-bold">{averageRating.toFixed(1)}</span>
                        <FaStar className="ml-0.5" size={10} />
                      </div>
                      <span className="text-xs text-gray-500">({product.rating_count || 0})</span>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-base font-bold text-gray-900 flex items-center">
                        <FaRupeeSign size={12} className="mr-0.5" />
                        {price.toLocaleString()}
                      </span>
                      {price < originalPrice && (
                        <del className="text-xs text-gray-500 ml-2">
                          <FaRupeeSign size={10} className="inline mr-0.5" />
                          {originalPrice.toLocaleString()}
                        </del>
                      )}
                    </div>

                    {/* Savings */}
                    {calculatedDiscount > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Save <FaRupeeSign size={10} className="inline mr-0.5" />
                        {(originalPrice - price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts;