import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNewArrival } from "../../hooks/useNewArrival";
import { Link } from "react-router-dom";
import hashids from "../../util/hashids";
import { Rating } from "@mui/material";
import { FiPlus, FiMinus } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "./NewArrivals.css";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useAddCart } from "../../hooks/useAddCart";
import toast from "react-hot-toast";

const NewArrivalCard = ({ item }) => {
  const encodedId = hashids.encode(item.id);
  const priceInfo = item.varient_details?.[0] || {};
  const outOfStock = item?.out_of_stock;
  const originalPrice = parseFloat(priceInfo.product_price) || 0;
  const salesPrice = parseFloat(priceInfo.sales_price) || 0;
  const ratingValue = parseFloat(item.rating) || 0;
  const discount =
    originalPrice > salesPrice
      ? Math.round(((originalPrice - salesPrice) / originalPrice) * 100)
      : 0;

  const imgUrl = item.image_details?.[0]?.image
    ? `${import.meta.env.VITE_MEDIA_URL}/products/${
        item.image_details[0].image
      }`
    : "/img/Noimages.png";

  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);

  const addToCartServer = useAddCart();
  const isProductInCart = cart.some(
    (cartItem) => (cartItem.product_id || cartItem.id) === item.id
  );

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent link navigation
    const product = {
      product_id: item.id,
      name: item.product_name,
      image: imgUrl,
      price: salesPrice,
    };

    if (isAuthenticated) {
      addToCartServer.mutate(
        { ...product, quantity },
        {
          onSuccess: () => {
            toast.success("Added to cart!");
          },
          onError: () => {
            toast.error("Failed to add to cart");
          },
        }
      );
    } else {
      addToCart(
        {
          id: item.id,
          name: item.product_name,
          image: imgUrl,
          price: salesPrice,
        },
        quantity
      );
      toast.success("Added to cart!");
    }
  };

  return (
    <div className="group relative block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-[#FDBD3C] text-black text-xs font-semibold px-2 py-1 rounded z-10">
          {discount}% OFF
        </span>
      )}

      {/* ✅ Clickable image only */}
      <Link
        to={`/product/${item.product_slug}/${encodedId}`}
        className="relative h-40 block overflow-hidden"
      >
        <img
          src={imgUrl}
          alt={item.product_name}
          className="object-contain w-full h-40 transform group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4">
        {/* ✅ Clickable title */}
        <Link to={`/product/${item.product_slug}/${encodedId}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate mb-2">
            {item.product_name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {ratingValue > 0 ? (
            <Rating value={ratingValue} precision={0.5} readOnly size="small" />
          ) : (
            <span className="text-xs text-gray-400">No ratings</span>
          )}
        </div>

        {salesPrice > 0 && (
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-lg font-bold text-black">
              <span className="text-green-600 text-xl">₹</span>
              {salesPrice}
            </span>
            {originalPrice > salesPrice && (
              <del className="text-sm text-gray-500">₹{originalPrice}</del>
            )}
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex flex-col gap-2">
          {/* Quantity Input */}
          {/* <div className="flex items-center gap-2">
    <label className="text-xs text-gray-500">Qty:</label>
    <input
      type="number"
      min={1}
      value={quantity}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        setQuantity(val);
      }}
      className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
    />
  </div> */}

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Qty:</label>

            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
              {/* Decrease Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
              >
                <FiMinus size={14} />
              </button>

              {/* Quantity Input */}
              <input
                type="number"
                min={1}
                value={quantity}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  setQuantity(val);
                }}
                className="w-10 text-center text-sm font-medium text-gray-800 outline-none border-none
      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none"
              />

              {/* Increase Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity((q) => Math.min(99, q + 1));
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart / Go to Cart Button */}
          <div>
            {outOfStock === 0 ? (
              <>
                {" "}
                {isProductInCart ? (
                  <Link
                    to="/cart"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold text-sm block text-center"
                  >
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold text-sm w-full"
                  >
                    Add to Cart
                  </button>
                )}
              </>
            ) : (
              <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm w-full flex items-center justify-center">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewArrivals = () => {
  const { data, isLoading, error } = useNewArrival();

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading new arrivals...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load products.
      </div>
    );
  if (!data?.length)
    return (
      <div className="text-center py-20 text-gray-400">
        No new arrivals yet.
      </div>
    );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        🎉 New Arrivals
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        spaceBetween={20}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 2.5 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4.5 },
        }}
        className="new-arrivals-swiper"
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <NewArrivalCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewArrivals;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import { useNewArrival } from "../../hooks/useNewArrival";
// import { Link } from "react-router-dom";
// import hashids from "../../util/hashids";
// import { Rating } from "@mui/material";

// import "swiper/css";
// import "swiper/css/navigation";
// import "./NewArrivals.css";

// const NewArrivalCard = ({ item }) => {
//   const encodedId = hashids.encode(item.id);

//   const priceInfo = item.varient_details?.[0] || {};
//   const originalPrice = parseFloat(priceInfo.product_price) || 0;
//   const salesPrice = parseFloat(priceInfo.sales_price) || 0;
//   const ratingValue = parseFloat(item.rating) || 0;
//   const discount = originalPrice > salesPrice
//     ? Math.round((originalPrice - salesPrice) / originalPrice * 100)
//     : 0;

//   const imgUrl = item.image_details?.[0]?.image
//     ? `${import.meta.env.VITE_MEDIA_URL}/products/${item.image_details[0].image}`
//     : "/img/Noimages.png";

//   return (
//     <Link to={`/product/${item.product_slug}/${encodedId}`} className="group">
//       <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
//         {discount > 0 && (
//           <span className="absolute top-3 left-3 bg-[#FDBD3C] text-black text-xs font-semibold px-2 py-1 rounded z-10">
//             {discount}% OFF
//           </span>
//         )}
//         <div className="relative h-40 overflow-hidden">
//           <img
//             src={imgUrl}
//             alt={item.product_name}
//             className="object-contain w-full h-40  transform group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => (e.target.src = "/img/Noimages.png")}
//           />
//         </div>
//         <div className="p-4">
//           <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate mb-2">
//             {item.product_name}
//           </h3>
//           <div className="flex items-center gap-1 mb-2">
//             {ratingValue > 0 ? (
//               <Rating value={ratingValue} precision={0.5} readOnly size="small" />
//             ) : (
//               <span className="text-xs text-gray-400">No ratings</span>
//             )}
//           </div>
//           {/* <div className="flex items-baseline space-x-2">
//             <span className="text-lg font-bold text-black"> <span className="text-green-600 text-xl">₹ </span>{salesPrice}</span>
//             {originalPrice > salesPrice && (
//               <del className="text-sm text-gray-500">₹{originalPrice}</del>
//             )}
//           </div> */}

//           {salesPrice > 0 && (
//             <div className="flex items-baseline space-x-2">
//               <span className="text-lg font-bold text-black">
//                 <span className="text-green-600 text-xl">₹</span>
//                 {salesPrice}
//               </span>

//               {originalPrice > salesPrice && (
//                 <del className="text-sm text-gray-500">₹{originalPrice}</del>
//               )}
//             </div>
//           )}

//         </div>
//       </div>
//     </Link>
//   );
// };

// const NewArrivals = () => {
//   const { data, isLoading, error } = useNewArrival();

//   if (isLoading) return <div className="text-center py-20 text-gray-500">Loading new arrivals...</div>;
//   if (error) return <div className="text-center py-20 text-red-500">Failed to load products.</div>;
//   if (!data?.length) return <div className="text-center py-20 text-gray-400">No new arrivals yet.</div>;

//   return (
//     <div className="py-8 px-4 sm:px-6 lg:px-8">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">🎉 New Arrivals</h2>
//       <Swiper
//         modules={[Navigation, Autoplay]}
//         navigation
//         spaceBetween={20}
//         loop
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         breakpoints={{
//           320: { slidesPerView: 1.5 },
//           640: { slidesPerView: 2.5 },
//           768: { slidesPerView: 3.5 },
//           1024: { slidesPerView: 4.5 },
//         }}
//         className="new-arrivals-swiper"
//       >
//         {data.map((item) => (
//           <SwiperSlide key={item.id}>
//             <NewArrivalCard item={item} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default NewArrivals;

// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import { useNewArrival } from "../../hooks/useNewArrival";
// import { Link } from "react-router-dom";
// import hashids from "../../util/hashids";
// import { Rating } from "@mui/material";
// import { useCartStore } from "../../store/cartStore";
// import { useAddCart } from "../../hooks/useAddCart";
// import toast from "react-hot-toast";
// import "swiper/css";
// import "swiper/css/navigation";
// import "./NewArrivals.css";

// const NewArrivalCard = ({ item, isAuthenticated }) => {
//   const encodedId = item.id;
//   const [quantity, setQuantity] = useState(1);
//   const { addToCart, setBuyNowProduct } = useCartStore();
//   const addToCartServer = useAddCart();

//   const priceInfo = item.varient_details?.[0] || {};
//   const originalPrice = parseFloat(priceInfo.product_price) || 0;
//   const salesPrice = parseFloat(priceInfo.sales_price) || 0;
//   const ratingValue = parseFloat(item.rating) || 0;
//   const discount = originalPrice > salesPrice
//     ? Math.round(((originalPrice - salesPrice) / originalPrice) * 100)
//     : 0;

//   const image = item.image_details?.[0]?.image;
//   const imgUrl = image
//     ? `${import.meta.env.VITE_MEDIA_URL}/products/${image}`
//     : "/img/Noimages.png";

//   const handleAddToCart = () => {

//   const product = {
//     product_id: item.id, // Use raw ID
//     name: item.product_name,
//     image: image || "/img/Noimages.png",
//     price: salesPrice,
//     quantity,
//   };

//    if (isAuthenticated) {
//         addToCartServer(product, {
//           onSuccess: () => {

//             toast.success("Added to cart!");
//           },
//           onError: () => {
//             toast.error("Failed to add to cart");
//           },
//         });
//       }else {
//     addToCart(
//       {
//         id: item.id,
//         name: item.product_name,
//         image: image || "/img/Noimages.png",
//         price: salesPrice,
//       },
//       quantity
//     );
//     toast.success("Added to cart!");
//   }
// };

//   return (
//     <div className="group">
//       <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
//         {discount > 0 && (
//           <span className="absolute top-3 left-3 bg-[#FDBD3C] text-black text-xs font-semibold px-2 py-1 rounded z-10">
//             {discount}% OFF
//           </span>
//         )}

//         <Link to={`/product/${item.product_slug}/${encodedId}`}>
//           <div className="relative h-40 overflow-hidden">
//             <img
//               src={imgUrl}
//               alt={item.product_name}
//               className="object-contain w-full h-40 transform group-hover:scale-105 transition-transform duration-300"
//               onError={(e) => (e.target.src = "/img/Noimages.png")}
//             />
//           </div>
//         </Link>

//         <div className="p-4">
//           <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate mb-2">
//             {item.product_name}
//           </h3>

//           <div className="flex items-center gap-1 mb-2">
//             {ratingValue > 0 ? (
//               <Rating value={ratingValue} precision={0.5} readOnly size="small" />
//             ) : (
//               <span className="text-xs text-gray-400">No ratings</span>
//             )}
//           </div>

//           <div className="flex items-baseline space-x-2 mb-2">
//             <span className="text-lg font-bold text-black">
//               <span className="text-green-600 text-xl">₹</span>
//               {salesPrice}
//             </span>
//             {originalPrice > salesPrice && (
//               <del className="text-sm text-gray-500">₹{originalPrice}</del>
//             )}
//           </div>

//           {/* Quantity Input */}
//           <div className="flex items-center gap-2 mb-2">
//             <label htmlFor={`qty-${item.id}`} className="text-xs text-gray-500">
//               Qty:
//             </label>
//             <input
//               id={`qty-${item.id}`}
//               type="number"
//               min={1}
//               max={99}
//               value={quantity}
//               onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || 1)))}
//               className="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
//             />
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={handleAddToCart}
//             className="w-full mt-1 bg-black text-white text-sm font-medium py-1.5 rounded hover:bg-gray-800 transition"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const NewArrivals = ({ isAuthenticated = false }) => {
//   const { data, isLoading, error } = useNewArrival();

//   if (isLoading)
//     return <div className="text-center py-20 text-gray-500">Loading new arrivals...</div>;

//   if (error)
//     return <div className="text-center py-20 text-red-500">Failed to load products.</div>;

//   if (!data?.length)
//     return <div className="text-center py-20 text-gray-400">No new arrivals yet.</div>;

//   return (
//     <div className="py-8 px-4 sm:px-6 lg:px-8">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">🎉 New Arrivals</h2>
//       <Swiper
//         modules={[Navigation, Autoplay]}
//         navigation
//         spaceBetween={20}
//         loop
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         breakpoints={{
//           320: { slidesPerView: 1.2 },
//           640: { slidesPerView: 2.2 },
//           768: { slidesPerView: 3.2 },
//           1024: { slidesPerView: 4.2 },
//         }}
//         className="new-arrivals-swiper"
//       >
//         {data.map((item) => (
//           <SwiperSlide key={item.id}>
//             <NewArrivalCard item={item} isAuthenticated={isAuthenticated} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default NewArrivals;
