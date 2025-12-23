// import React, { useState, useEffect } from "react";
// import {
//   Edit,
//   Close,
//   LocalShipping,
//   Discount,
//   Home,
//   Work,
//   LocationOn,
//   Check,
// } from "@mui/icons-material";
// import { useCartStore } from "../store/cartStore";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   useAddress,
//   useAddAddress,
//   useUpdateAddress,
// } from "../hooks/useAddress";
// import useCoupon from "../hooks/useCoupon";
// import usePlaceOrder from "../hooks/usePlaceOrder";
// import { usePostalCode } from "../hooks/usePostalCode";
// import toast from "react-hot-toast";
// import { useWallet } from "../hooks/useWallet";
// import { useUpdateUserAmount } from "../hooks/updateUserAmount";

// const Order = () => {
//   const navigate = useNavigate();
//   const [coupon, setCoupon] = useState("");
//   const [isApplied, setIsApplied] = useState(false);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [deliveryOption, setDeliveryOption] = useState();
//   console.log("deliveryOption", deliveryOption);

//   const [minOrderAmount, setMinOrderAmount] = useState();
//   const [maxAmount, setMaxAmount] = useState(0);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     colony_name: "",
//     house_no: "",
//     landmark: "",
//     address_type: "",
//     area: "",
//     latitude: "",
//     longitude: "",
//   });
//   const mutation = useUpdateUserAmount();
//   const [pincodeError, setPincodeError] = useState("");
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [paymentMode, setPaymentMode] = useState("online");
//   const [locationError, setLocationError] = useState(null);
//   const [coords, setCoords] = useState({ latitude: null, longitude: null });
//   const [gettingLocation, setGettingLocation] = useState(false);

//   const {
//     data,
//     isLoading: isAddressLoading,
//     isError: isAddressError,
//     error: addressError,
//   } = useAddress();
//   const addresses = data || [];

//   const selectedAddress = addresses[selectedIndex];
//   const {
//     data: pincodeData,
//     isLoading: isPincodeLoading,
//     isError: isPincodeError,
//   } = usePostalCode(selectedAddress?.pincode);
//   const {
//     mutate: fetchWallet,
//     data: walletData,
//     isLoading,
//     isError,
//   } = useWallet();

//   useEffect(() => {
//     fetchWallet();
//   }, []);

//   const [useWalletAmount, setUseWalletAmount] = useState(false);
//   const walletAmount = walletData?.data ?? 0;

//   const { cart, buyNowProducts, clearBuyNowProduct, clearCart } =
//     useCartStore();
//   const location = useLocation();

//   const isBuyNow =
//     new URLSearchParams(location.search).get("buyNow") === "true";
//   const productsToDisplay =
//     isBuyNow && buyNowProducts
//       ? Array.isArray(buyNowProducts)
//         ? buyNowProducts
//         : [buyNowProducts]
//       : cart;

//   const calculateSubtotal = () =>
//     productsToDisplay.reduce((total, item) => {
//       const unitPrice = item.price ?? item.product_price ?? 0;
//       const quantity = item.quantity ?? item.qty ?? 1;
//       return total + unitPrice * quantity;
//     }, 0);

//   const subtotal = calculateSubtotal();
//   const discount = isApplied ? (subtotal * discountPercentage) / 100 : 0;
//   const grandTotal = subtotal + deliveryCharge - discount;

//   const {
//     applyCoupon,
//     isLoading: isCouponLoading,
//     error: couponError,
//     couponResponse,
//   } = useCoupon();

//   const handleApplyCoupon = async () => {
//     if (!coupon) return toast("Please enter a coupon code");

//     try {
//       const response = await applyCoupon(coupon);
//       if (response?.data?.discount_per) {
//         setDiscountPercentage(parseFloat(response.data.discount_per));
//         setIsApplied(true);
//       } else {
//         toast.error("Invalid coupon response");
//         setIsApplied(false);
//       }
//     } catch (err) {
//       toast.error(couponError || "Invalid coupon code!");
//       setIsApplied(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
//   };

//   const { mutate: addAddress } = useAddAddress();
//   const { mutate: updateAddress } = useUpdateAddress();

//   const saveEditedAddress = () => {
//     if (
//       !newAddress.name ||
//       !newAddress.phone ||
//       !newAddress.address ||
//       !newAddress.pincode ||
//       !newAddress.house_no ||
//       !newAddress.colony_name ||
//       !newAddress.area
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     const payload = {
//       ...newAddress,
//       latitude: coords.latitude || "",
//       longitude: coords.longitude || "",
//     };

//     if (isEditing) {
//       updateAddress(
//         {
//           id: addresses[selectedIndex].id,
//           payload: payload,
//         },
//         {
//           onSuccess: () => {
//             toast.success("Address updated successfully!");
//             setIsOpen(false);
//           },
//           onError: (error) => {
//             console.error("Failed to update address:", error);
//             toast.error("Failed to update address. Please try again.");
//           },
//         }
//       );
//     } else {
//       addAddress(payload, {
//         onSuccess: () => {
//           toast.success("Address added successfully!");
//           setIsOpen(false);
//         },
//         onError: (error) => {
//           console.error("Failed to add address:", error);
//           toast.error("Failed to add address. Please try again.");
//         },
//       });
//     }
//   };

//   const {
//     placeOrder,
//     isPlacing: isOrderLoading,
//     error: orderError,
//   } = usePlaceOrder();

//   const handleAddressSelection = (index) => {
//     setSelectedIndex(index);
//     const selectedAddress = addresses[index];

//     if (!isPincodeLoading && pincodeData?.message !== "aviliable") {
//       setPincodeError("The selected address has an invalid pincode.");
//     } else {
//       setPincodeError("");
//     }
//   };

//   const getLocation = () => {
//     setGettingLocation(true);
//     setLocationError(null);

//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser.");
//       setGettingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCoords({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         setNewAddress((prev) => ({
//           ...prev,
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         }));
//         setGettingLocation(false);
//       },
//       (error) => {
//         setLocationError(
//           "Unable to retrieve your location. Please enter manually."
//         );
//         setGettingLocation(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const handleOrderComplete = async () => {
//     if (!selectedAddress) {
//       toast("Please select a delivery address.");
//       return;
//     }

//     if (pincodeError) {
//       toast.error("Please select an address with a valid pincode.");
//       return;
//     }

//     const usableWalletAmount = useWalletAmount
//       ? Math.min(walletAmount, grandTotal)
//       : 0;

//     const orderPayload = {
//       use_wallet: usableWalletAmount,
//       address: selectedAddress.address,
//       addressId: selectedAddress.id,
//       payment_type: paymentMode,
//       valid_coupan: isApplied ? coupon : null,
//       product: productsToDisplay.map((item) => ({
//         id: item.product_id,
//         qty: item.quantity || item.qty,
//       })),
//     };

//     try {
//       const result = await placeOrder(orderPayload);

//       if (result?.payment_window) {
//         toast.success("Redirecting to payment...");
//         if (isBuyNow) {
//           clearBuyNowProduct();
//         } else {
//           clearCart();
//         }

//         // window.location.replace(result.payment_window);

//         redirectWithPost(result.payment_window, result.post_data || {});

//         //  window.location.reload(true);
//       } else if (result?.payment_window2 === "cod") {
//         toast.success("Order placed successfully with Cash on Delivery.");

//         if (isBuyNow) {
//           clearBuyNowProduct();
//         } else {
//           clearCart();
//         }

//         // Navigate to success page
//         window.location.href = "/success";
//       } else {
//         throw new Error("Invalid response received.");
//       }
//     } catch (err) {
//       console.error("Failed to place order:", orderError || err.message);
//       toast.error(orderError || "Failed to place order. Please try again.");
//     }
//   };

//   const redirectWithPost = (url, data = {}) => {
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = url;

//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         const input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = data[key];
//         form.appendChild(input);
//       }
//     }

//     document.body.appendChild(form);
//     form.submit();
//   };

//   useEffect(() => {
//     const storeType = localStorage.getItem("store_type") || 1;

//     mutation.mutate(
//       { type: storeType },
//       {
//         onSuccess: (data) => {
//           setMinOrderAmount(data?.data?.min_amount);
//           const deliverySetting = data?.delivery_Setting;
//           if (deliverySetting) {
//             setDeliveryOption(deliverySetting.delivery_option ?? 0);
//             setMaxAmount(deliverySetting.max_amount ?? 0);
//           }
//         },
//         onError: (err) => {
//           console.error("Failed to fetch delivery settings:", err);
//           toast.error("Something went wrong while fetching delivery settings.");
//         },
//       }
//     );
//   }, []);

//   const calculateTotalSavings = () => {
//     return productsToDisplay.reduce((total, item) => {
//       const originalPrice = parseFloat(item.product_price || item.price || 0);
//       const finalPrice = parseFloat(item.actual_price || item.price || 0);
//       const quantity = item.quantity || item.qty || 1;

//       const itemSavings = (originalPrice - finalPrice) * quantity;
//       return total + itemSavings;
//     }, 0);
//   };

//   const totalSavings = calculateTotalSavings();

//   const calculateTotalAmount = () => {
//     return productsToDisplay.reduce((total, item) => {
//       const price = parseFloat(item.actual_price || item.price || 0);
//       const quantity = item.quantity || item.qty || 1;
//       return total + price * quantity;
//     }, 0);
//   };

//   useEffect(() => {
//     if (!selectedAddress || isPincodeLoading) return;

//     if (pincodeData?.message === "aviliable") {
//       const baseDeliveryCharge = pincodeData.data?.delivery_charge || 0;
//       const totalAmount = calculateTotalAmount();

//       if (deliveryOption === 0) {
//         setDeliveryCharge(0);
//       } else if (deliveryOption === 1) {
//         if (totalAmount < maxAmount) {
//           setDeliveryCharge(baseDeliveryCharge);
//         } else {
//           setDeliveryCharge(0);
//         }
//       } else {
//         setDeliveryCharge(baseDeliveryCharge);
//       }

//       setPincodeError("");
//     } else {
//       setPincodeError("Delivery not available on this pincode.");
//       setDeliveryCharge(0);
//     }
//   }, [
//     selectedAddress,
//     pincodeData,
//     isPincodeLoading,
//     deliveryOption,
//     maxAmount,
//   ]);

//   // useEffect(() => {
//   //   if (!selectedAddress || isPincodeLoading) return;

//   //   if (pincodeData?.message === "aviliable") {
//   //     const baseDeliveryCharge = parseFloat(
//   //       pincodeData.data?.delivery_charge || 0
//   //     );

//   //     const hasPackage =
//   //       selectedAddress?.package &&
//   //       typeof selectedAddress.package === "object" &&
//   //       !Array.isArray(selectedAddress.package);

//   //     const mainDeliveryCharge = hasPackage ? 0 : baseDeliveryCharge;

//   //     const totalAmount = parseFloat(calculateTotalAmount() || 0);

//   //     // If order amount is 3000 or more => free delivery
//   //     if (totalAmount >= 3000) {
//   //       setDeliveryCharge(0);
//   //     } else {
//   //       setDeliveryCharge(mainDeliveryCharge);
//   //     }

//   //     setPincodeError("");
//   //   } else {
//   //     setPincodeError("Delivery not available on this pincode.");
//   //     setDeliveryCharge(0);
//   //   }
//   // }, [
//   //   selectedAddress,
//   //   pincodeData,
//   //   isPincodeLoading,
//   //   deliveryOption,
//   //   maxAmount,
//   // ]);

//   if (isAddressLoading) return <div>Loading addresses...</div>;
//   if (isAddressError) return <div>Error: {addressError.message}</div>;

//   const MIN_ORDER_AMOUNT = minOrderAmount;

//   const payableAmount = Math.max(
//     0,
//     useWalletAmount ? grandTotal - (walletData?.data || 0) : grandTotal
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 ">
//       <div className="max-w-7xl mx-auto ">
//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-12">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//             Complete Your Order
//           </h1>
//           <div className="flex justify-center">
//             <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//           {/* Left Column - Order Items */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
//             {/* Order Items */}
//             <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
//               <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
//                 <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#EAA11E] rounded-full mr-2"></span>
//                 Your Items ({productsToDisplay.length})
//               </h2>

//               <div className="space-y-3 sm:space-y-4">
//                 {productsToDisplay.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition"
//                   >
//                     <div className="flex-shrink-0">
//                       <img
//                         src={
//                           item.image.startsWith("http")
//                             ? item.image
//                             : `${import.meta.env.VITE_MEDIA_URL}/products/${
//                                 item.image
//                               }`
//                         }
//                         alt={item.name || item.product_name}
//                         className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded-lg border border-gray-200"
//                       />
//                     </div>
//                     <div className="flex-grow min-w-0">
//                       <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
//                         {item.name || item.product_name}
//                       </h3>
//                       <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                         Quantity: {item.quantity || item.qty}
//                       </p>
//                     </div>
//                     <div className="flex-shrink-0 text-right">
//                       <p className="font-bold text-gray-900 text-sm sm:text-base">
//                         ₹
//                         {(item.price || item.product_price) *
//                           (item.quantity || item.qty)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Enhanced Shipping Address Section */}
//             <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
//               <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//                 <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
//                   <LocalShipping className="text-[#EAA11E] mr-2 text-lg sm:text-xl" />
//                   Shipping Address
//                 </h2>

//                 <button
//                   onClick={() => {
//                     setIsOpen(true);
//                     setIsEditing(false);
//                     setNewAddress({
//                       name: "",
//                       phone: "",
//                       address: "",
//                       pincode: "",
//                       colony_name: "",
//                       house_no: "",
//                       landmark: "",
//                       address_type: "",
//                       area: "",
//                       latitude: "",
//                       longitude: "",
//                     });
//                   }}
//                   className="w-full md:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-[#EAA11E] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition"
//                 >
//                   Add New Address
//                 </button>
//               </div>

//               {addresses.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {addresses.map((addr, index) => {
//                     const addressHasEdit =
//                       addr?.package &&
//                       typeof addr.package === "object" &&
//                       !Array.isArray(addr.package);

//                     return (
//                       <div
//                         key={index}
//                         onClick={() => handleAddressSelection(index)}
//                         className={`p-3 sm:p-4 md:p-5 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
//                           selectedIndex === index
//                             ? "border-2 border-[#EAA11E] bg-amber-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div className="flex items-start gap-2 sm:gap-3">
//                             <div
//                               className={`p-1 sm:p-2 rounded-full mt-1 ${
//                                 addr.address_type === "Home"
//                                   ? "bg-blue-100 text-blue-600"
//                                   : addr.address_type === "Work"
//                                   ? "bg-purple-100 text-purple-600"
//                                   : "bg-gray-100 text-gray-600"
//                               }`}
//                             >
//                               {addr.address_type === "Home" ? (
//                                 <Home fontSize="small" />
//                               ) : addr.address_type === "Work" ? (
//                                 <Work fontSize="small" />
//                               ) : (
//                                 <LocationOn fontSize="small" />
//                               )}
//                             </div>
//                             <div className="min-w-0">
//                               <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
//                                 {addr.name}
//                               </h3>
//                               <p className="text-gray-600 text-xs sm:text-sm">
//                                 {addr.phone}
//                               </p>
//                             </div>
//                           </div>
//                           {selectedIndex === index && (
//                             <span className="flex items-center text-xs bg-[#EAA11E] text-white px-2 py-1 rounded-full">
//                               <Check fontSize="small" className="mr-1" />{" "}
//                               Selected
//                             </span>
//                           )}
//                         </div>

//                         <div className="ml-10 sm:ml-12 mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm text-gray-600">
//                           <p>
//                             <span className="font-medium">House No:</span>{" "}
//                             {addr.house_no || "-"}
//                           </p>
//                           <p>
//                             <span className="font-medium">Colony:</span>{" "}
//                             {addr.colony_name || "-"}
//                           </p>
//                           <p>
//                             <span className="font-medium">Area:</span>{" "}
//                             {addr.area || "-"}
//                           </p>
//                           {addr.landmark && (
//                             <p>
//                               <span className="font-medium">Landmark:</span>{" "}
//                               {addr.landmark}
//                             </p>
//                           )}
//                           <p className="mt-1 sm:mt-2">
//                             <span className="font-medium">Address:</span>{" "}
//                             {addr.address}
//                           </p>
//                           <p>
//                             <span className="font-medium">Pincode:</span>{" "}
//                             {addr.pincode}
//                           </p>
//                         </div>
//                         {!addressHasEdit && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setIsOpen(true);
//                               setIsEditing(true);
//                               setNewAddress({
//                                 ...addresses[index],
//                                 latitude: addr.latitude || "",
//                                 longitude: addr.longitude || "",
//                               });
//                             }}
//                             className="mt-2 sm:mt-3 ml-10 sm:ml-12 text-xs sm:text-sm text-[#EAA11E] flex items-center hover:underline"
//                           >
//                             <Edit fontSize="small" className="mr-1" />
//                             Edit Address
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-6 sm:py-8">
//                   <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
//                     <LocationOn className="text-gray-400 text-xl sm:text-2xl" />
//                   </div>
//                   <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
//                     No addresses saved yet
//                   </p>
//                   <button
//                     onClick={() => setIsOpen(true)}
//                     className="px-3 py-2 sm:px-4 sm:py-2 bg-[#EAA11E] text-white rounded-lg hover:shadow-md transition text-sm sm:text-base"
//                   >
//                     Add Your First Address
//                   </button>
//                 </div>
//               )}

//               {pincodeError && (
//                 <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm">
//                   {pincodeError}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sticky top-4 sm:top-8">
//               <div className="p-4 sm:p-6 border-b border-gray-200">
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
//                   Order Summary
//                 </h2>

//                 <div className="space-y-2 sm:space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 text-sm sm:text-base">
//                       Subtotal
//                     </span>
//                     <span className="font-medium text-sm sm:text-base">
//                       ₹{subtotal}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 text-sm sm:text-base">
//                       Shipping
//                     </span>
//                     <span className="font-medium text-sm sm:text-base">
//                       ₹{deliveryCharge}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Coupon Section */}
//               <div className="p-4 sm:p-6 border-b border-gray-200">
//                 <div className="flex items-center mb-2 sm:mb-3">
//                   <Discount className="text-[#EAA11E] mr-2 text-lg sm:text-xl" />
//                   <h3 className="font-medium text-gray-800 text-sm sm:text-base">
//                     Apply Coupon
//                   </h3>
//                 </div>

//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Enter coupon code"
//                     value={coupon}
//                     onChange={(e) => setCoupon(e.target.value)}
//                     className="flex-grow px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent text-sm sm:text-base"
//                   />
//                   <button
//                     onClick={handleApplyCoupon}
//                     disabled={isCouponLoading}
//                     className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm ${
//                       isApplied
//                         ? "bg-green-500 text-white"
//                         : "bg-[#EAA11E] text-white hover:shadow-md"
//                     } transition`}
//                   >
//                     {isCouponLoading ? "..." : isApplied ? "Applied" : "Apply"}
//                   </button>
//                 </div>

//                 {isApplied && (
//                   <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-600">
//                     {discountPercentage}% discount applied!
//                   </div>
//                 )}
//                 {couponError && (
//                   <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600">
//                     {couponError}
//                   </div>
//                 )}
//               </div>

//               {/* Wallet Section */}
//               <div className="p-4 sm:p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
//                   <label
//                     htmlFor="useWallet"
//                     className="flex items-center cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       id="useWallet"
//                       checked={useWalletAmount}
//                       onChange={(e) => setUseWalletAmount(e.target.checked)}
//                       className="h-4 w-4 sm:h-5 sm:w-5 text-[#EAA11E] border-gray-300 rounded focus:ring-0"
//                     />
//                     <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-800 font-medium">
//                       Use Wallet Amount
//                     </span>
//                   </label>

//                   <span className="text-xs sm:text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-semibold text-gray-800">
//                       ₹{walletAmount}
//                     </span>
//                   </span>
//                 </div>
//               </div>

//               {/* Payment Mode Section */}
//               <div className="p-4 sm:p-6 border-t border-gray-200">
//                 <h3 className="font-medium text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">
//                   Select Payment Mode
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                   <label
//                     htmlFor="cod"
//                     className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition
//                       ${
//                         paymentMode === "cod"
//                           ? "border-[#EAA11E] bg-[#FFF7E7]"
//                           : "border-gray-300 hover:border-[#EAA11E]"
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       id="cod"
//                       name="paymentMode"
//                       value="cod"
//                       checked={paymentMode === "cod"}
//                       onChange={() => setPaymentMode("cod")}
//                       className="form-radio text-[#EAA11E] h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
//                     />
//                     <span className="text-gray-700 text-xs sm:text-sm">
//                       Cash on Delivery
//                     </span>
//                   </label>

//                   <label
//                     htmlFor="online"
//                     className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition
//                       ${
//                         paymentMode === "online"
//                           ? "border-[#EAA11E] bg-[#FFF7E7]"
//                           : "border-gray-300 hover:border-[#EAA11E]"
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       id="online"
//                       name="paymentMode"
//                       value="online"
//                       checked={paymentMode === "online"}
//                       onChange={() => setPaymentMode("online")}
//                       className="form-radio text-[#EAA11E] h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
//                     />
//                     <span className="text-gray-700 text-xs sm:text-sm">
//                       Online Payment
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               {/* Total Section */}
//               <div className="p-4 sm:p-6">
//                 <div className="flex justify-between mb-3 sm:mb-4">
//                   <span className="font-medium text-gray-700 text-sm sm:text-base">
//                     Discount
//                   </span>
//                   <span className="font-medium text-green-600 text-sm sm:text-base">
//                     -₹{discount}
//                   </span>
//                 </div>
//                 <div className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 space-y-1">
//                   {/* Line 1: Total */}
//                   <div className="flex justify-between">
//                     <span>Total</span>
//                     <span>₹{grandTotal.toLocaleString()}</span>
//                   </div>

//                   {/* Line 2: Wallet Used (only if wallet is applied) */}
//                   {useWalletAmount && (
//                     <div className="flex justify-between text-sm sm:text-base text-gray-700">
//                       <span> Wallet Used</span>
//                       <span>
//                         -₹
//                         {Math.min(
//                           walletData?.data || 0,
//                           grandTotal
//                         ).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Divider */}
//                   {useWalletAmount && <hr className="border-gray-300 my-1" />}

//                   {/* Line 3: Payable Amount */}
//                   <div className="flex justify-between text-green-700">
//                     <span>Payable Amount</span>
//                     <span>
//                       ₹
//                       {Math.max(
//                         0,
//                         useWalletAmount
//                           ? grandTotal - (walletData?.data || 0)
//                           : grandTotal
//                       ).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between mb-3 rounded-lg">
//                   <span className="font-medium text-green-700 text-xs sm:text-sm">
//                     Total Savings
//                   </span>
//                   <span className="font-bold text-green-700 text-xs sm:text-sm">
//                     ₹{Math.abs(totalSavings).toFixed(2)}
//                   </span>
//                 </div>

//                 {!pincodeError && (
//                   <button
//                     onClick={handleOrderComplete}
//                     disabled={
//                       isOrderLoading ||
//                       payableAmount < MIN_ORDER_AMOUNT ||
//                       pincodeError
//                     }
//                     className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 font-bold rounded-lg shadow
//       hover:shadow-lg transition flex items-center justify-center text-sm sm:text-base
//       ${
//         payableAmount < MIN_ORDER_AMOUNT
//           ? "bg-red-700 cursor-not-allowed text-white"
//           : "bg-[#EAA11E] text-white hover:shadow-lg"
//       }`}
//                   >
//                     {isOrderLoading ? (
//                       <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//                     ) : null}
//                     {isOrderLoading
//                       ? "Processing..."
//                       : payableAmount < MIN_ORDER_AMOUNT
//                       ? `Minimum order  is ₹${MIN_ORDER_AMOUNT}`
//                       : "Proceed to Payment"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Footer */}
//         {!pincodeError && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 sm:p-4 border-t border-gray-200 lg:hidden z-50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-xs sm:text-sm text-gray-500">Total</p>
//                 <p className="text-lg sm:text-xl font-bold text-gray-900">
//                   ₹
//                   {Math.max(
//                     0,
//                     useWalletAmount
//                       ? grandTotal - (walletData?.data || 0)
//                       : grandTotal
//                   ).toLocaleString()}
//                 </p>
//               </div>
//               <button
//                 onClick={handleOrderComplete}
//                 disabled={
//                   isOrderLoading ||
//                   payableAmount < MIN_ORDER_AMOUNT ||
//                   pincodeError
//                 }
//                 className={`px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-lg shadow transition text-xs sm:text-sm
//                   ${
//                     pincodeError || payableAmount < MIN_ORDER_AMOUNT
//                       ? "bg-red-700 cursor-not-allowed text-white"
//                       : "bg-[#EAA11E] text-black hover:shadow-md"
//                   }
//                   ${isOrderLoading ? "cursor-wait" : ""}
//                 `}
//               >
//                 {payableAmount < MIN_ORDER_AMOUNT ? (
//                   <>Minimum order is ₹{MIN_ORDER_AMOUNT}</>
//                 ) : (
//                   <>
//                     {" "}
//                     {isOrderLoading && (
//                       <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
//                     )}
//                     {isOrderLoading ? "Processing..." : "Checkout"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Address Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                 {isEditing ? "Edit Address" : "Add New Address"}
//               </h3>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <Close />
//               </button>
//             </div>

//             <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={newAddress.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={newAddress.phone}
//                   onChange={handleInputChange}
//                   pattern="[0-9]{10}"
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Complete Address *
//                 </label>
//                 <textarea
//                   name="address"
//                   value={newAddress.address}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   House No *
//                 </label>
//                 <input
//                   type="text"
//                   name="house_no"
//                   value={newAddress.house_no}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Colony Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="colony_name"
//                   value={newAddress.colony_name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Landmark (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   name="landmark"
//                   value={newAddress.landmark}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Area/Locality *
//                 </label>
//                 <input
//                   type="text"
//                   name="area"
//                   value={newAddress.area}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Pincode *
//                 </label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={newAddress.pincode}
//                   onChange={handleInputChange}
//                   pattern="[0-9]{6}"
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Address Type *
//                 </label>
//                 <select
//                   name="address_type"
//                   value={newAddress.address_type}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
//                   required
//                 >
//                   <option value="">Select Type</option>
//                   <option value="Home">Home</option>
//                   <option value="Work">Work</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div className="md:col-span-2">
//                 <button
//                   type="button"
//                   onClick={getLocation}
//                   disabled={gettingLocation}
//                   className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full text-xs sm:text-sm"
//                 >
//                   {gettingLocation ? (
//                     <>
//                       <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                       Locating...
//                     </>
//                   ) : (
//                     <>
//                       <LocationOn fontSize="small" />
//                       Use Current Location
//                     </>
//                   )}
//                 </button>
//                 {newAddress.latitude && newAddress.longitude && (
//                   <p className="mt-2 text-xs sm:text-sm text-green-600 flex items-center">
//                     <Check fontSize="small" className="mr-1" />
//                     Location coordinates captured
//                   </p>
//                 )}
//                 {locationError && (
//                   <p className="mt-2 text-xs sm:text-sm text-red-600">
//                     {locationError}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end p-3 sm:p-4 border-t border-gray-200 sticky bottom-0 bg-white">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 mr-2 sm:mr-3 rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveEditedAddress}
//                 className="px-4 py-2 sm:px-6 sm:py-2 bg-[#EAA11E] text-black font-medium rounded-lg shadow hover:shadow-md transition text-xs sm:text-sm"
//               >
//                 {isEditing ? "Update Address" : "Save Address"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Order;

import React, { useState, useEffect } from "react";
import {
  Edit,
  Close,
  LocalShipping,
  Discount,
  Home,
  Work,
  LocationOn,
  Check,
} from "@mui/icons-material";
import { useCartStore } from "../store/cartStore";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAddress,
  useAddAddress,
  useUpdateAddress,
} from "../hooks/useAddress";
import useCoupon from "../hooks/useCoupon";
import usePlaceOrder from "../hooks/usePlaceOrder";
import { usePostalCode } from "../hooks/usePostalCode";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useUpdateUserAmount } from "../hooks/updateUserAmount";

const Order = () => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(); // 0 or 1
  const [minOrderAmount, setMinOrderAmount] = useState();
  const [maxAmount, setMaxAmount] = useState();
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    colony_name: "",
    house_no: "",
    landmark: "",
    address_type: "",
    area: "",
    latitude: "",
    longitude: "",
  });
  const mutation = useUpdateUserAmount();
  const [pincodeError, setPincodeError] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMode, setPaymentMode] = useState("online");
  const [locationError, setLocationError] = useState(null);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [gettingLocation, setGettingLocation] = useState(false);

  const {
    data,
    isLoading: isAddressLoading,
    isError: isAddressError,
    error: addressError,
  } = useAddress();
  const addresses = data || [];

  const selectedAddress = addresses[selectedIndex];
  const {
    data: pincodeData,
    isLoading: isPincodeLoading,
    isError: isPincodeError,
  } = usePostalCode(selectedAddress?.pincode);
  const {
    mutate: fetchWallet,
    data: walletData,
    isLoading,
    isError,
  } = useWallet();

  useEffect(() => {
    fetchWallet();
  }, []);

  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const walletAmount = walletData?.data ?? 0;

  const { cart, buyNowProducts, clearBuyNowProduct, clearCart } =
    useCartStore();
  const location = useLocation();

  const isBuyNow =
    new URLSearchParams(location.search).get("buyNow") === "true";
  const productsToDisplay =
    isBuyNow && buyNowProducts
      ? Array.isArray(buyNowProducts)
        ? buyNowProducts
        : [buyNowProducts]
      : cart;

  const calculateSubtotal = () =>
    productsToDisplay.reduce((total, item) => {
      const unitPrice = item.price ?? item.product_price ?? 0;
      const quantity = item.quantity ?? item.qty ?? 1;
      return total + unitPrice * quantity;
    }, 0);

  const subtotal = calculateSubtotal();
  const discount = isApplied ? (subtotal * discountPercentage) / 100 : 0;
  const grandTotal = subtotal + deliveryCharge - discount;

  const {
    applyCoupon,
    isLoading: isCouponLoading,
    error: couponError,
    couponResponse,
  } = useCoupon();

  const handleApplyCoupon = async () => {
    if (!coupon) return toast("Please enter a coupon code");

    try {
      const response = await applyCoupon(coupon);
      if (response?.data?.discount_per) {
        setDiscountPercentage(parseFloat(response.data.discount_per));
        setIsApplied(true);
      } else {
        toast.error("Invalid coupon response");
        setIsApplied(false);
      }
    } catch (err) {
      toast.error(couponError || "Invalid coupon code!");
      setIsApplied(false);
    }
  };

  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const { mutate: addAddress } = useAddAddress();
  const { mutate: updateAddress } = useUpdateAddress();

  const saveEditedAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.pincode ||
      !newAddress.house_no ||
      !newAddress.colony_name ||
      !newAddress.area
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      ...newAddress,
      latitude: coords.latitude || "",
      longitude: coords.longitude || "",
    };

    if (isEditing) {
      updateAddress(
        {
          id: addresses[selectedIndex].id,
          payload: payload,
        },
        {
          onSuccess: () => {
            toast.success("Address updated successfully!");
            setIsOpen(false);
          },
          onError: (error) => {
            console.error("Failed to update address:", error);
            toast.error("Failed to update address. Please try again.");
          },
        }
      );
    } else {
      addAddress(payload, {
        onSuccess: () => {
          toast.success("Address added successfully!");
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Failed to add address:", error);
          toast.error("Failed to add address. Please try again.");
        },
      });
    }
  };

  const {
    placeOrder,
    isPlacing: isOrderLoading,
    error: orderError,
  } = usePlaceOrder();

  const handleAddressSelection = (index) => {
    setSelectedIndex(index);
    const selectedAddress = addresses[index];

    if (!isPincodeLoading && pincodeData?.message !== "aviliable") {
      setPincodeError("The selected address has an invalid pincode.");
    } else {
      setPincodeError("");
    }
  };

  const getLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setNewAddress((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
      },
      (error) => {
        setLocationError(
          "Unable to retrieve your location. Please enter manually."
        );
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // const handleOrderComplete = async () => {
  //   if (!selectedAddress) {
  //     toast("Please select a delivery address.");
  //     return;
  //   }

  //   if (pincodeError) {
  //     toast.error("Please select an address with a valid pincode.");
  //     return;
  //   }

  //   const orderPayload = {
  //     use_wallet: useWalletAmount ? walletAmount : 0,
  //     address: selectedAddress.address,
  //     addressId: selectedAddress.id,
  //     payment_type: paymentMode,
  //     valid_coupan: isApplied ? coupon : null,
  //     product: productsToDisplay.map((item) => ({
  //       id: item.product_id,
  //       qty: item.quantity || item.qty,
  //     })),
  //   };

  //   try {
  //     const result = await placeOrder(orderPayload);

  //     if (result?.payment_window) {
  //       toast.success("Redirecting to payment...");
  //       if (isBuyNow) {
  //         clearBuyNowProduct();
  //       } else {
  //         clearCart();
  //       }

  //       window.location.href = result.payment_window;
  //     } else {
  //       throw new Error("Payment window not received.");
  //     }
  //   } catch (err) {
  //     console.error("Failed to place order:", orderError || err.message);
  //     toast.error(orderError || "Failed to place order. Please try again.");
  //   }
  // };

  const handleOrderComplete = async () => {
    if (!selectedAddress) {
      toast("Please select a delivery address.");
      return;
    }

    if (pincodeError) {
      toast.error("Please select an address with a valid pincode.");
      return;
    }

    const usableWalletAmount = useWalletAmount
      ? Math.min(walletAmount, grandTotal)
      : 0;

    const orderPayload = {
      use_wallet: usableWalletAmount,
      address: selectedAddress.address,
      addressId: selectedAddress.id,
      payment_type: paymentMode,
      valid_coupan: isApplied ? coupon : null,
      product: productsToDisplay.map((item) => ({
        id: item.product_id,
        qty: item.quantity || item.qty,
      })),
    };

    try {
      const result = await placeOrder(orderPayload);

      if (result?.payment_window) {
        toast.success("Redirecting to payment...");
        if (isBuyNow) {
          clearBuyNowProduct();
        } else {
          clearCart();
        }

        // window.location.replace(result.payment_window);

        redirectWithPost(result.payment_window, result.post_data || {});

        //  window.location.reload(true);
      } else if (result?.payment_window2 === "cod") {
        toast.success("Order placed successfully with Cash on Delivery.");

        if (isBuyNow) {
          clearBuyNowProduct();
        } else {
          clearCart();
        }

        // Navigate to success page
        window.location.href = "/success";
      } else {
        throw new Error("Invalid response received.");
      }
    } catch (err) {
      console.error("Failed to place order:", orderError || err.message);
      toast.error(orderError || "Failed to place order. Please try again.");
    }
  };

  const redirectWithPost = (url, data = {}) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    const storeType = localStorage.getItem("store_type") || "default";

    mutation.mutate(
      { type: storeType },
      {
        onSuccess: (data) => {
          setMinOrderAmount(data?.data?.min_amount);
          const deliverySetting = data?.delivery_Setting;
          if (deliverySetting) {
            setDeliveryOption(deliverySetting.delivery_option ?? 0);
            setMaxAmount(deliverySetting.max_amount ?? 0);
          }
        },
        onError: (err) => {
          console.error("Failed to fetch delivery settings:", err);
          toast.error("Something went wrong while fetching delivery settings.");
        },
      }
    );
  }, []);

  // useEffect(() => {
  //   if (!selectedAddress || isPincodeLoading) return;

  //   if (pincodeData?.message === "aviliable") {
  //     setDeliveryCharge(pincodeData.data?.delivery_charge || 200);
  //     setPincodeError("");
  //   } else {
  //     setPincodeError("Delivery not available on this pincode.");
  //     setDeliveryCharge(0);
  //   }
  // }, [selectedAddress, pincodeData, isPincodeLoading]);

  const calculateTotalSavings = () => {
    return productsToDisplay.reduce((total, item) => {
      const originalPrice = parseFloat(item.product_price || item.price || 0);
      const finalPrice = parseFloat(item.actual_price || item.price || 0);
      const quantity = item.quantity || item.qty || 1;

      const itemSavings = (originalPrice - finalPrice) * quantity;
      return total + itemSavings;
    }, 0);
  };

  const totalSavings = calculateTotalSavings();

  const calculateTotalAmount = () => {
    return productsToDisplay.reduce((total, item) => {
      const price = parseFloat(item.actual_price || item.price || 0);
      const quantity = item.quantity || item.qty || 1;
      return total + price * quantity;
    }, 0);
  };

  useEffect(() => {
    if (!selectedAddress || isPincodeLoading) return;

    if (pincodeData?.message === "aviliable") {
      const baseDeliveryCharge = pincodeData.data?.delivery_charge || 0;
      const totalAmount = calculateTotalAmount();

      const hasPackage =
        selectedAddress?.package &&
        typeof selectedAddress.package === "object" &&
        !Array.isArray(selectedAddress.package);

      if (hasPackage) {
        setDeliveryCharge(0);
      } else if (deliveryOption === 0) {
        setDeliveryCharge(0);
      } else if (deliveryOption === 1) {
        if (totalAmount < maxAmount) {
          setDeliveryCharge(baseDeliveryCharge);
        } else {
          setDeliveryCharge(0);
        }
      } else {
        setDeliveryCharge(baseDeliveryCharge);
      }

      setPincodeError("");
    } else {
      setPincodeError("Delivery not available on this pincode.");
      setDeliveryCharge(0);
    }
  }, [
    selectedAddress,
    pincodeData,
    isPincodeLoading,
    deliveryOption,
    maxAmount,
  ]);

  if (isAddressLoading) return <div>Loading addresses...</div>;
  if (isAddressError) return <div>Error: {addressError.message}</div>;

  const MIN_ORDER_AMOUNT = minOrderAmount;

  const payableAmount = Math.max(
    0,
    useWalletAmount ? grandTotal - (walletData?.data || 0) : grandTotal
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 ">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <div className="flex justify-center">
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#EAA11E] rounded-full mr-2"></span>
                Your Items ({productsToDisplay.length})
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {productsToDisplay.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_MEDIA_URL}/products/${
                                item.image
                              }`
                        }
                        alt={item.name || item.product_name}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                        {item.name || item.product_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity || item.qty}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        ₹
                        {(item.price || item.product_price) *
                          (item.quantity || item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Shipping Address Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                  <LocalShipping className="text-[#EAA11E] mr-2 text-lg sm:text-xl" />
                  Shipping Address
                </h2>

                <button
                  onClick={() => {
                    setIsOpen(true);
                    setIsEditing(false);
                    setNewAddress({
                      name: "",
                      phone: "",
                      address: "",
                      pincode: "",
                      colony_name: "",
                      house_no: "",
                      landmark: "",
                      address_type: "",
                      area: "",
                      latitude: "",
                      longitude: "",
                    });
                  }}
                  className="w-full md:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-[#EAA11E] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition"
                >
                  Add New Address
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {addresses.map((addr, index) => {
                    const addressHasEdit =
                      addr?.package &&
                      typeof addr.package === "object" &&
                      !Array.isArray(addr.package);
                    return (
                      <div
                        key={index}
                        onClick={() => handleAddressSelection(index)}
                        className={`p-3 sm:p-4 md:p-5 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                          selectedIndex === index
                            ? "border-2 border-[#EAA11E] bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className={`p-1 sm:p-2 rounded-full mt-1 ${
                                addr.address_type === "Home"
                                  ? "bg-blue-100 text-blue-600"
                                  : addr.address_type === "Work"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {addr.address_type === "Home" ? (
                                <Home fontSize="small" />
                              ) : addr.address_type === "Work" ? (
                                <Work fontSize="small" />
                              ) : (
                                <LocationOn fontSize="small" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {addr.name}
                              </h3>
                              <p className="text-gray-600 text-xs sm:text-sm">
                                {addr.phone}
                              </p>
                            </div>
                          </div>
                          {selectedIndex === index && (
                            <span className="flex items-center text-xs bg-[#EAA11E] text-white px-2 py-1 rounded-full">
                              <Check fontSize="small" className="mr-1" />{" "}
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="ml-10 sm:ml-12 mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm text-gray-600">
                          <p>
                            <span className="font-medium">House No:</span>{" "}
                            {addr.house_no || "-"}
                          </p>
                          <p>
                            <span className="font-medium">Colony:</span>{" "}
                            {addr.colony_name || "-"}
                          </p>
                          <p>
                            <span className="font-medium">Area:</span>{" "}
                            {addr.area || "-"}
                          </p>
                          {addr.landmark && (
                            <p>
                              <span className="font-medium">Landmark:</span>{" "}
                              {addr.landmark}
                            </p>
                          )}
                          <p className="mt-1 sm:mt-2">
                            <span className="font-medium">Address:</span>{" "}
                            {addr.address}
                          </p>
                          <p>
                            <span className="font-medium">Pincode:</span>{" "}
                            {addr.pincode}
                          </p>
                        </div>
                        {!addressHasEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(true);
                              setIsEditing(true);
                              setNewAddress({
                                ...addresses[index],
                                latitude: addr.latitude || "",
                                longitude: addr.longitude || "",
                              });
                            }}
                            className="mt-2 sm:mt-3 ml-10 sm:ml-12 text-xs sm:text-sm text-[#EAA11E] flex items-center hover:underline"
                          >
                            <Edit fontSize="small" className="mr-1" />
                            Edit Address
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <LocationOn className="text-gray-400 text-xl sm:text-2xl" />
                  </div>
                  <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                    No addresses saved yet
                  </p>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-[#EAA11E] text-white rounded-lg hover:shadow-md transition text-sm sm:text-base"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}

              {pincodeError && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm">
                  {pincodeError}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sticky top-4 sm:top-8">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">
                      Subtotal
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">
                      Shipping
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      ₹{deliveryCharge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center mb-2 sm:mb-3">
                  <Discount className="text-[#EAA11E] mr-2 text-lg sm:text-xl" />
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    Apply Coupon
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-grow px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isCouponLoading}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm ${
                      isApplied
                        ? "bg-green-500 text-white"
                        : "bg-[#EAA11E] text-white hover:shadow-md"
                    } transition`}
                  >
                    {isCouponLoading ? "..." : isApplied ? "Applied" : "Apply"}
                  </button>
                </div>

                {isApplied && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-600">
                    {discountPercentage}% discount applied!
                  </div>
                )}
                {couponError && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600">
                    {couponError}
                  </div>
                )}
              </div>

              {/* Wallet Section */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <label
                    htmlFor="useWallet"
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="useWallet"
                      checked={useWalletAmount}
                      onChange={(e) => setUseWalletAmount(e.target.checked)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#EAA11E] border-gray-300 rounded focus:ring-0"
                    />
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-800 font-medium">
                      Use Wallet Amount
                    </span>
                  </label>

                  <span className="text-xs sm:text-sm text-gray-600">
                    Available:{" "}
                    <span className="font-semibold text-gray-800">
                      ₹{walletAmount}
                    </span>
                  </span>
                </div>
              </div>

              {/* Payment Mode Section */}
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">
                  Select Payment Mode
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <label
                    htmlFor="cod"
                    className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition 
                      ${
                        paymentMode === "cod"
                          ? "border-[#EAA11E] bg-[#FFF7E7]"
                          : "border-gray-300 hover:border-[#EAA11E]"
                      }`}
                  >
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMode"
                      value="cod"
                      checked={paymentMode === "cod"}
                      onChange={() => setPaymentMode("cod")}
                      className="form-radio text-[#EAA11E] h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
                    />
                    <span className="text-gray-700 text-xs sm:text-sm">
                      Cash on Delivery
                    </span>
                  </label>

                  <label
                    htmlFor="online"
                    className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition 
                      ${
                        paymentMode === "online"
                          ? "border-[#EAA11E] bg-[#FFF7E7]"
                          : "border-gray-300 hover:border-[#EAA11E]"
                      }`}
                  >
                    <input
                      type="radio"
                      id="online"
                      name="paymentMode"
                      value="online"
                      checked={paymentMode === "online"}
                      onChange={() => setPaymentMode("online")}
                      className="form-radio text-[#EAA11E] h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
                    />
                    <span className="text-gray-700 text-xs sm:text-sm">
                      Online Payment
                    </span>
                  </label>
                </div>
              </div>

              {/* Total Section */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between mb-3 sm:mb-4">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Discount
                  </span>
                  <span className="font-medium text-green-600 text-sm sm:text-base">
                    -₹{discount}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 space-y-1">
                  {/* Line 1: Total */}
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>

                  {/* Line 2: Wallet Used (only if wallet is applied) */}
                  {useWalletAmount && (
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span> Wallet Used</span>
                      <span>
                        -₹
                        {Math.min(
                          walletData?.data || 0,
                          grandTotal
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  {useWalletAmount && <hr className="border-gray-300 my-1" />}

                  {/* Line 3: Payable Amount */}
                  <div className="flex justify-between text-green-700">
                    <span>Payable Amount</span>
                    <span>
                      ₹
                      {Math.max(
                        0,
                        useWalletAmount
                          ? grandTotal - (walletData?.data || 0)
                          : grandTotal
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-3 rounded-lg">
                  <span className="font-medium text-green-700 text-xs sm:text-sm">
                    Total Savings
                  </span>
                  <span className="font-bold text-green-700 text-xs sm:text-sm">
                    ₹{Math.abs(totalSavings).toFixed(2)}
                  </span>
                </div>

                {!pincodeError && (
                  <button
                    onClick={handleOrderComplete}
                    disabled={
                      isOrderLoading ||
                      payableAmount < MIN_ORDER_AMOUNT ||
                      pincodeError
                    }
                    className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 font-bold rounded-lg shadow 
      hover:shadow-lg transition flex items-center justify-center text-sm sm:text-base
      ${
        payableAmount < MIN_ORDER_AMOUNT
          ? "bg-red-700 cursor-not-allowed text-white"
          : "bg-[#EAA11E] text-white hover:shadow-lg"
      }`}
                  >
                    {isOrderLoading ? (
                      <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    ) : null}
                    {isOrderLoading
                      ? "Processing..."
                      : payableAmount < MIN_ORDER_AMOUNT
                      ? `Minimum order  is ₹${MIN_ORDER_AMOUNT}`
                      : "Proceed to Payment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        {!pincodeError && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 sm:p-4 border-t border-gray-200 lg:hidden z-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  ₹
                  {Math.max(
                    0,
                    useWalletAmount
                      ? grandTotal - (walletData?.data || 0)
                      : grandTotal
                  ).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleOrderComplete}
                disabled={
                  isOrderLoading ||
                  payableAmount < MIN_ORDER_AMOUNT ||
                  pincodeError
                }
                className={`px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-lg shadow transition text-xs sm:text-sm
                  ${
                    pincodeError || payableAmount < MIN_ORDER_AMOUNT
                      ? "bg-red-700 cursor-not-allowed text-white"
                      : "bg-[#EAA11E] text-black hover:shadow-md"
                  }
                  ${isOrderLoading ? "cursor-wait" : ""}
                `}
              >
                {payableAmount < MIN_ORDER_AMOUNT ? (
                  <>Minimum order is ₹{MIN_ORDER_AMOUNT}</>
                ) : (
                  <>
                    {" "}
                    {isOrderLoading && (
                      <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                    )}
                    {isOrderLoading ? "Processing..." : "Checkout"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Address Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Close />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={newAddress.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  House No *
                </label>
                <input
                  type="text"
                  name="house_no"
                  value={newAddress.house_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Colony Name *
                </label>
                <input
                  type="text"
                  name="colony_name"
                  value={newAddress.colony_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Area/Locality *
                </label>
                <input
                  type="text"
                  name="area"
                  value={newAddress.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleInputChange}
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Address Type *
                </label>
                <select
                  name="address_type"
                  value={newAddress.address_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={gettingLocation}
                  className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full text-xs sm:text-sm"
                >
                  {gettingLocation ? (
                    <>
                      <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Locating...
                    </>
                  ) : (
                    <>
                      <LocationOn fontSize="small" />
                      Use Current Location
                    </>
                  )}
                </button>
                {newAddress.latitude && newAddress.longitude && (
                  <p className="mt-2 text-xs sm:text-sm text-green-600 flex items-center">
                    <Check fontSize="small" className="mr-1" />
                    Location coordinates captured
                  </p>
                )}
                {locationError && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600">
                    {locationError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end p-3 sm:p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 mr-2 sm:mr-3 rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedAddress}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-[#EAA11E] text-black font-medium rounded-lg shadow hover:shadow-md transition text-xs sm:text-sm"
              >
                {isEditing ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
