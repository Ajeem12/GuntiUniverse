import React, { useEffect, useMemo, useState } from "react";
import {
  LocalShipping,
  Discount,
  Check,
  LocationOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import {
  useAddress,
  useAddAddress,
  useUpdateAddress,
} from "../../hooks/useAddress";
import { usePostalCode } from "../../hooks/usePostalCode";
import useCoupon from "../../hooks/useCoupon";
import { useWallet } from "../../hooks/useWallet";
import useFastPlaceOrder from "../hooks/useFastPlaceOrder";
import { GiMilkCarton, GiBread, GiCoffeeCup } from "react-icons/gi";
import { useCMartCartStore } from "../store/cmartCartStore";
import { useUpdateUserAmount } from "../../hooks/updateUserAmount";
import toast from "react-hot-toast";
import { Home, Work, Edit, Close } from "@mui/icons-material";
import { useSocietyList } from "../hooks/useGetSocietyList";
import AddressModal from "./AddressModal";

// helper
const formatRs = (v) => `₹${Number(v || 0).toLocaleString()}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useCMartCartStore();

  const updateUserAmountHook = useUpdateUserAmount();

  const {
    mutate: placeOrder,
    mutateAsync: placeOrderAsync,
    isPending,
  } = useFastPlaceOrder();
  const productsToDisplay = cart;

  // addresses
  const { data: addressData = [] } = useAddress();
  const addresses = addressData || [];

  const addAddressHook = useAddAddress();
  const updateAddressHook = useUpdateAddress();

  // selected address + pincode
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedAddress = addresses[selectedIndex] || null;

  const selectedPincode = selectedAddress?.pincode || null;
  const { data: pincodeData } = usePostalCode(selectedPincode);

  const {
    mutate: getSocietyList,
    data: societyData,
    isPending: societyLoading,
  } = useSocietyList();

  // wallet
  const { mutate: fetchWallet, data: walletData } = useWallet();

  // coupon
  const { applyCoupon } = useCoupon();

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const isEditing = isEditingAddress;
  const setIsEditing = setIsEditingAddress;
  // -------- Address form state (Order.jsx compatible) --------
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

  // input change handler (shared for add/edit)
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewAddress((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // called when pincode changes
  const fetchSocietiesByPincode = (pincode) => {
    if (!pincode || pincode.length !== 6) return;
    getSocietyList(pincode);
  };

  // modified input handler for address modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pincode") {
      fetchSocietiesByPincode(value);
    }
  };

  // save address (add / update)
  const saveEditedAddress = async () => {
    try {
      if (isEditing) {
        // update address
        await updateAddressHook.mutateAsync({
          id: newAddress.id,
          payload: newAddress,
        });
        toast.success("Address updated successfully");
      } else {
        // add address
        await addAddressHook.mutateAsync(newAddress);
        toast.success("Address added successfully");
      }

      setIsOpen(false);
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
    } catch (err) {
      console.error("Address save failed", err);
      toast.error("Failed to save address");
    }
  };

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // coupon state
  const [couponInput, setCouponInput] = useState("");
  const coupon = couponInput;
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const isApplied = !!appliedCoupon;
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  // payment & wallet
  const [paymentMode, setPaymentMode] = useState("online");
  const [useWalletAmount, setUseWalletAmount] = useState(false);

  // delivery option & rules

  const [deliveryOption, setDeliveryOption] = useState(null);
  const [maxAmountForFreeDelivery, setMaxAmountForFreeDelivery] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const discountPercentage = discountPercent;
  const isCouponLoading = false;

  const walletAmount = walletData?.data || 0;
  const isOrderLoading = isPending;

  const MIN_ORDER_AMOUNT = minOrderAmount || 0;

  // check society

  const isSocietyAddress =
    selectedAddress?.society_add &&
    typeof selectedAddress.society_add === "object" &&
    !Array.isArray(selectedAddress.society_add);

  // icons (currently unused, kept for future dynamic use)
  const iconMap = {
    Milk: <GiMilkCarton className="text-4xl text-blue-400" />,
    Bread: <GiBread className="text-4xl text-orange-400" />,
    Coffee: <GiCoffeeCup className="text-4xl text-brown-400" />,
  };

  // fetch wallet once
  useEffect(() => {
    if (fetchWallet) fetchWallet();
  }, [fetchWallet]);

  // Auto-select address with society_add
  useEffect(() => {
    if (addresses.length === 0) return;

    const societyAddressIndex = addresses.findIndex((addr) => {
      return (
        addr?.society_add &&
        typeof addr.society_add === "object" &&
        !Array.isArray(addr.society_add)
      );
    });

    if (societyAddressIndex !== -1) {
      setSelectedIndex(societyAddressIndex);
      const addr = addresses[societyAddressIndex];

      updateUserAmountHook.mutate(
        {
          type: 2,
        },
        {
          onSuccess: (data) => {
            setMinOrderAmount(data?.data?.min_amount);
            setMaxAmountForFreeDelivery(
              data?.delivery_Setting?.c_mart_max_amount
            );
            setDeliveryOption(data?.delivery_Setting?.c_mart_delivery_option);
          },
          onError: (err) => {
            console.error("updateUserAmount failed", err);
          },
        }
      );
    }
  }, [addresses]);

  // -------- Cart helpers --------
  const handleQty = (productId, delta) => {
    const item = cart.find(
      (p) => p.id === productId || p.product_id === productId
    );
    if (!item) return;

    const currentQty = Number(item.quantity ?? item.qty ?? 1);
    const newQty = Math.max(1, currentQty + delta);

    // store expects id as key; ensure consistent usage
    updateQty(item.id ?? item.product_id, newQty);
  };

  const handleRemove = (productId) => {
    // same id consistency as above
    removeFromCart(productId);
  };

  // -------- Totals & delivery --------
  const subtotal = useMemo(
    () =>
      cart.reduce((sum, it) => {
        const price = Number(it.price) || 0;
        const qty = Number(it.quantity ?? it.qty ?? 1);
        return sum + price * qty;
      }, 0),
    [cart]
  );

  const baseDeliveryCharge = pincodeData?.data?.delivery_charge ?? 0;

  const isPincodeAvailable = pincodeData?.message === "aviliable";

  //new delivery charge logic --****
  const deliveryCharge = useMemo(() => {
    if (!selectedAddress) return 0;
    if (!isPincodeAvailable) return 0;

    // wait for settings API
    if (deliveryOption === null) return 0;

    const hasPackage =
      selectedAddress?.package &&
      typeof selectedAddress.package === "object" &&
      !Array.isArray(selectedAddress.package) &&
      Number(selectedAddress.package.status) === 1;

    // society/package users → free
    if (hasPackage) return 0;

    // delivery_option meanings (from API reality)
    // 0 = PAID DELIVERY
    // 1 = FREE ABOVE max_amount

    if (
      deliveryOption === 1 &&
      maxAmountForFreeDelivery > 0 &&
      subtotal >= maxAmountForFreeDelivery
    ) {
      return 0;
    }

    // otherwise paid delivery
    return Number(baseDeliveryCharge) || 0;
  }, [
    selectedAddress,
    isPincodeAvailable,
    deliveryOption,
    subtotal,
    maxAmountForFreeDelivery,
    baseDeliveryCharge,
  ]);

  const discountAmount =
    appliedCoupon && discountPercent ? (subtotal * discountPercent) / 100 : 0;
  const discount = discountAmount;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  // const isBelowMinOrder = useMemo(() => {
  //   return grandTotal < (minOrderAmount || 0);
  // }, [grandTotal, minOrderAmount]);
  const isBelowMinOrder = useMemo(() => {
    return subtotal < (minOrderAmount || 0);
  }, [subtotal, minOrderAmount]);

  const walletAvailable = walletData?.data ?? 0;

  const payableAfterWallet = useMemo(() => {
    if (!useWalletAmount) return grandTotal;
    return Math.max(0, grandTotal - walletAvailable);
  }, [grandTotal, walletAvailable, useWalletAmount]);

  const payableAmount = payableAfterWallet;
  const walletSavings = useWalletAmount
    ? Math.min(walletAvailable, grandTotal)
    : 0;

  const deliverySavings =
    baseDeliveryCharge > 0 && deliveryCharge === 0 ? baseDeliveryCharge : 0;

  const totalSavings = discountAmount + walletSavings + deliverySavings;

  // -------- Coupon --------
  const handleApplyCoupon = async () => {
    setCouponError("");

    if (!couponInput.trim()) {
      setCouponError("Please enter coupon code");
      return;
    }

    try {
      const resp = await applyCoupon(couponInput.trim());
      const discountPer = Number(resp?.data?.discount_per);

      if (discountPer > 0) {
        setAppliedCoupon(couponInput.trim());
        setDiscountPercent(discountPer);
      } else {
        setCouponError("Invalid coupon response");
      }
    } catch (err) {
      console.error("Coupon error", err);
      setCouponError("Invalid coupon code");
    }
  };

  // -------- Address modal helpers --------
  const openAddModal = () => {
    setIsEditingAddress(false);
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setIsEditingAddress(true);
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleAddressSaved = () => {
    setIsModalOpen(false);
  };

  const getLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setGettingLocation(false);
        setLocationError(null);
      },
      () => {
        setGettingLocation(false);
        setLocationError("Unable to get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectAddress = (idx) => {
    setSelectedIndex(idx);
    const addr = addresses[idx];
    if (!addr) return;

    // send payload with type: 2 whenever address changes
    updateUserAmountHook.mutate(
      {
        type: 2,
      },
      {
        onSuccess: (data) => {
          setMinOrderAmount(data?.data?.min_amount);

          setMaxAmountForFreeDelivery(
            data?.delivery_Setting?.c_mart_max_amount
          );

          setDeliveryOption(data?.delivery_Setting?.c_mart_delivery_option);
        },
        onError: (err) => {
          console.error("updateUserAmount failed", err);
        },
      }
    );
  };

  // -------- Place order --------

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select shipping address");
      return;
    }

    const hasSocietyAddress =
      selectedAddress?.society_add &&
      typeof selectedAddress.society_add === "object" &&
      !Array.isArray(selectedAddress.society_add);

    if (!hasSocietyAddress) {
      toast.error(
        "Delivery available only in society addresses. Please add a society address."
      );
      return;
    }

    const productsPayload = cart.map((p) => ({
      id: p.product_id ?? p.id,
      qty: Number(p.quantity ?? p.qty ?? 1),
    }));

    const walletToUse = useWalletAmount
      ? Math.min(walletAvailable, grandTotal)
      : 0;

    const orderPayload = {
      addressId: selectedAddress.id ?? null,
      address: selectedAddress.address || "",
      payment_type: paymentMode,
      valid_coupan: appliedCoupon || null,
      use_wallet: walletToUse,
      product: productsPayload,
    };

    try {
      const res = await placeOrderAsync(orderPayload);
      if (res?.payment_window) {
        const redirectWithPost = (url, data = {}) => {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = url;

          Object.keys(data).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.submit();
        };

        // Call redirect function here
        redirectWithPost(res.payment_window, {
          order_id: res.order_id,
          amount: res.amount,
          token: res.token,
        });
        clearCart?.();

        return;
      }

      if (res?.payment_window2 === "cod" || res?.success) {
        toast.success("Order placed successfully");
        clearCart?.();
        localStorage.removeItem("fastCart");
        navigate("/gunti-fast/fast-success");
        return;
      }
      console.warn("Unexpected place order response", res);
      toast.error("Order placed (response ambiguous). Check console.");
    } catch (err) {
      console.error("Failed to place order", err);
      toast.error("Failed to place order");
    }
  };
  const handleOrderComplete = handlePlaceOrder;
  const pincodeError =
    selectedAddress && !isPincodeAvailable
      ? "Delivery not available for selected pincode"
      : null;

  useEffect(() => {
    if (isOpen && newAddress?.pincode?.length === 6) {
      fetchSocietiesByPincode(newAddress.pincode);
    }
  }, [isOpen, newAddress.pincode]);

  // -------- JSX (unchanged UI) --------

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
                        onClick={() => handleSelectAddress(index)}
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
                          <div className="flex items-center gap-2">
                            {selectedIndex === index && (
                              <span className="flex items-center text-xs bg-[#EAA11E] text-white px-[3px] py-1 rounded-full">
                                <Check fontSize="inherit" />
                                Selected
                              </span>
                            )}

                            {addressHasEdit && (
                              <span className="flex items-center text-xs  text-green-700 font-semibold">
                                Free Delivery
                              </span>
                            )}
                          </div>
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
                          {addressHasEdit && (
                            <p>
                              <span className="font-medium">Society Name:</span>{" "}
                              {addr.society_add?.society_name}
                            </p>
                          )}

                          {/* {addr.society_add?.society_address && (
                            <p>
                              <span className="font-medium">
                                Society Address:
                              </span>{" "}
                              {addr.society_add?.society_address}
                            </p>
                          )} */}
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
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
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
                {/* Discount Section */}
                {discount > 0 && (
                  <div className="flex justify-between mb-3 sm:mb-4">
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      Discount
                    </span>
                    <span className="font-medium text-green-600 text-sm sm:text-base">
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 space-y-1">
                  {/* Line 1: Total */}
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
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

                {/* <div className="flex justify-between mb-3 rounded-lg">
                  <span className="font-medium text-green-700 text-xs sm:text-sm">
                    Total Savings
                  </span>
                  <span className="font-bold text-green-700 text-xs sm:text-sm">
                    ₹{Math.abs(totalSavings).toFixed(2)}
                  </span>
                </div> */}

                {subtotal >= MIN_ORDER_AMOUNT ? (
                  <div>
                    {deliveryCharge !== 0 && (
                      <p className="text-sm text-green-600 text-center mb-2">
                        Great news! Orders above ₹{maxAmountForFreeDelivery} get
                        free delivery — save more while you shop!
                      </p>
                    )}

                    <button
                      onClick={handleOrderComplete}
                      // disabled={isOrderLoading || pincodeError}
                      disabled={
                        isOrderLoading || pincodeError || isBelowMinOrder
                      }
                      className="mt-2 w-full bg-[#FDBD3C] hover:bg-[#e0ac28] text-white py-2 sm:py-3  px-4 rounded-md font-bold transition  items-center justify-center flex text-sm sm:text-base"
                    >
                      {isOrderLoading ? "Processing..." : "Proceed to Checkout"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-red-600 font-medium text-center">
                    Minimum order amount is ₹{MIN_ORDER_AMOUNT}. Add more items
                    to proceed.
                  </p>
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
              {isBelowMinOrder ? (
                <Link
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-lg shadow transition text-xs sm:text-sm"
                  to="/gunti-fast/fast-cart"
                >
                  Minimum order is ₹{MIN_ORDER_AMOUNT} Add More Products
                </Link>
              ) : (
                <button
                  onClick={handleOrderComplete}
                  disabled={isOrderLoading || isBelowMinOrder || pincodeError}
                  className={`px-4 py-2 sm:px-6 sm:py-3 font-medium rounded-lg shadow transition text-xs sm:text-sm
                        ${
                          pincodeError || isBelowMinOrder
                            ? " cursor-not-allowed"
                            : "bg-[#EAA11E] text-black hover:shadow-md"
                        }
                        ${isOrderLoading ? "cursor-wait" : ""}
                      `}
                >
                  {isOrderLoading && (
                    <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                  )}
                  {isOrderLoading ? "Processing..." : "Checkout"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Address Modal */}
      <AddressModal
        isOpen={isOpen}
        isEditing={isEditing}
        newAddress={newAddress}
        onChange={handleInputChange}
        onClose={() => setIsOpen(false)}
        onSave={saveEditedAddress}
        gettingLocation={gettingLocation}
        locationError={locationError}
        onGetLocation={getLocation}
        societyData={societyData}
        societyLoading={societyLoading}
        onSelectSociety={(societyId) =>
          setNewAddress((prev) => ({ ...prev, society_id: societyId }))
        }
      />

      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
