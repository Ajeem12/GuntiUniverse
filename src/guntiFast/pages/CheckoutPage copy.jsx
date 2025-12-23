import React, { useEffect, useMemo, useState } from "react";
import {
  LocalShipping,
  Discount,
  Check,
  LocationOn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddAddressModal from "./AddAddressModal";
import { IoAdd, IoRemove } from "react-icons/io5";
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
    error,
    data,
  } = useFastPlaceOrder();

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

  // wallet
  const { mutate: fetchWallet, data: walletData } = useWallet();

  // coupon
  const { applyCoupon } = useCoupon();

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  // payment & wallet
  const [paymentMode, setPaymentMode] = useState("online");
  const [useWalletAmount, setUseWalletAmount] = useState(false);

  // delivery option & rules
  // const [deliveryOption, setDeliveryOption] = useState();
  // const [maxAmountForFreeDelivery, setMaxAmountForFreeDelivery] = useState();
  // const [minOrderAmount, setMinOrderAmount] = useState();
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [maxAmountForFreeDelivery, setMaxAmountForFreeDelivery] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);

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

      // Also call updateUserAmountHook like handleSelectAddress does
      updateUserAmountHook.mutate(
        {
          type: 2,
        },
        {
          onSuccess: (data) => {
            setMinOrderAmount(data?.data?.min_amount);
            setMaxAmountForFreeDelivery(data?.delivery_Setting?.max_amount);
            setDeliveryOption(data?.delivery_Setting?.delivery_option);
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

  // const deliveryCharge = useMemo(() => {
  //   if (!selectedAddress) return 0;
  //   if (!isPincodeAvailable) return 0;

  //   const hasPackage =
  //     selectedAddress?.package &&
  //     typeof selectedAddress.package === "object" &&
  //     !Array.isArray(selectedAddress.package);

  //   if (hasPackage) {
  //     return 0;
  //   } else if (deliveryOption === 0) {
  //     return 0;
  //   } else if (hasPackage && deliveryOption === 1) {
  //     if (subtotal < maxAmountForFreeDelivery) {
  //       return baseDeliveryCharge;
  //     }
  //     return 0;
  //   }
  //   return baseDeliveryCharge;
  // }, [selectedAddress, isPincodeAvailable, subtotal, baseDeliveryCharge]);

  //new delivery charge logic --****
  const deliveryCharge = useMemo(() => {
    if (!selectedAddress) return 0;
    if (!isPincodeAvailable) return 0;

    // wait for settings API
    if (deliveryOption === null) return 0;

    // const hasPackage =
    //   Array.isArray(selectedAddress?.package) &&
    //   selectedAddress.package.length > 0;
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

  // test case

  // console.log({
  //   isPincodeAvailable,
  //   // selectedAddress,
  //   pincodeData,
  //   minOrderAmount,
  //   // cart,
  // });
  // console.log("[DELIVERY_RULE_CHECK]", {
  //   mode: deliveryOption,
  //   threshold: maxAmountForFreeDelivery,
  //   subtotal,
  //   ruleApplied:
  //     deliveryOption === 1 && subtotal >= maxAmountForFreeDelivery
  //       ? "FREE_DELIVERY"
  //       : "PAID_DELIVERY",
  // });

  const discountAmount =
    appliedCoupon && discountPercent ? (subtotal * discountPercent) / 100 : 0;

  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);
  const isBelowMinOrder = useMemo(() => {
    return grandTotal < (minOrderAmount || 0);
  }, [grandTotal, minOrderAmount]);

  const walletAvailable = walletData?.data ?? 0;

  const payableAfterWallet = useMemo(() => {
    if (!useWalletAmount) return grandTotal;
    return Math.max(0, grandTotal - walletAvailable);
  }, [grandTotal, walletAvailable, useWalletAmount]);

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
          setMaxAmountForFreeDelivery(data?.delivery_Setting?.max_amount);
          setDeliveryOption(data?.delivery_Setting?.delivery_option);
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
      alert("Order placed (response ambiguous). Check console.");
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order");
    }
  };

  // -------- JSX (unchanged UI) --------
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-8 ">
      <div className="max-w-6xl mx-auto mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Check Out</h1>
          <div className="mx-auto mt-2 w-24 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Items + Shipping address */}
          <div className="lg:col-span-2 space-y-4">
            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">
                  Your Items ({cart.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {formatRs(subtotal)}
                </div>
              </div>

              <div className="space-y-3">
                {cart.map((item) => {
                  const id = item.id ?? item.product_id;
                  const qty = Number(item.quantity ?? item.qty ?? 1);
                  const lineTotal = (Number(item.price) || 0) * qty;

                  return (
                    <div
                      key={id}
                      className="flex gap-3 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                          <img
                            src={`${import.meta.env.VITE_MEDIA_URL}/products/${
                              item.image
                            }`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Unit: {formatRs(item.price)}
                        </p>
                        {/* item quantity and line total */}
                        <div className="flex items-center gap-1 mt-3">
                          <button
                            onClick={() => handleQty(id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg"
                          >
                            <IoRemove />
                          </button>
                          <div className="min-w-[36px] text-center font-semibold">
                            {qty}
                          </div>
                          <button
                            onClick={() => handleQty(id, +1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg"
                          >
                            <IoAdd />
                          </button>

                          <div className="ml-auto text-right">
                            <div className="font-semibold">
                              {formatRs(lineTotal)}
                            </div>
                            <button
                              onClick={() => handleRemove(id)}
                              className="text-red-500 text-sm mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center">
                  <LocalShipping className="text-amber-400 mr-2" /> Shipping
                  Address
                </h2>
                <button
                  onClick={openAddModal}
                  className="bg-amber-400 px-3 py-2 rounded-lg text-sm text-black"
                >
                  Add New Address
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr, idx) => {
                    const addressHasEdit =
                      addr?.package &&
                      typeof addr.package === "object" &&
                      !Array.isArray(addr.package);

                    const societyAddress =
                      addr?.society_add &&
                      typeof addr.society_add === "object" &&
                      !Array.isArray(addr.society_add);

                    return (
                      <div
                        key={addr.id || idx}
                        onClick={() => handleSelectAddress(idx)}
                        className={`p-3 border rounded-lg cursor-pointer transition ${
                          selectedIndex === idx
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {addr.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.phone}
                            </p>
                          </div>
                          {selectedIndex === idx && (
                            <div className="text-xs bg-amber-400 text-white px-2 py-1 rounded-full flex items-center gap-1">
                              <Check fontSize="small" /> Selected
                            </div>
                          )}
                        </div>

                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">House No:</span>{" "}
                            {addr.house_no || "-"}
                          </div>
                          <div>
                            <span className="font-medium">Colony:</span>{" "}
                            {addr.colony_name || "-"}
                          </div>
                          <div>
                            <span className="font-medium">Area:</span>{" "}
                            {addr.area || "-"}
                          </div>
                          {addr.landmark && (
                            <div>
                              <span className="font-medium">Landmark:</span>{" "}
                              {addr.landmark}
                            </div>
                          )}
                          <div className="mt-2">{addr.address}</div>
                          <div className="mt-1 text-xs">
                            <span className="font-medium">Pincode:</span>{" "}
                            {addr.pincode}
                          </div>
                        </div>

                        {societyAddress && (
                          <>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Society Name:</span>{" "}
                              {addr.society_add.society_name}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">
                                Society Address:
                              </span>{" "}
                              {addr.society_add.society_address}
                            </div>
                          </>
                        )}

                        {!addressHasEdit && (
                          <div className="mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(addr);
                              }}
                              className="text-amber-500 text-sm"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <LocationOn className="text-gray-400" />
                  </div>
                  <div className="text-gray-500 mb-3">
                    No addresses saved yet
                  </div>
                  <button
                    onClick={openAddModal}
                    className="bg-amber-400 px-3 py-2 rounded-lg"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}

              {selectedAddress && !isPincodeAvailable && (
                <div className="mt-3 text-sm text-red-600">
                  Delivery not available for selected pincode
                </div>
              )}
            </div>
          </div>

          {/* Right column: order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-lg mb-3">Order Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRs(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{formatRs(deliveryCharge)}</span>
                </div>
                {/* when discount is applied then show discount****** */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600">
                      -{formatRs(discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* wallet toggle */}
              <div className="mt-4 p-3 border rounded-lg">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useWalletAmount}
                    onChange={(e) => setUseWalletAmount(e.target.checked)}
                  />
                  <span className="text-sm">
                    Use Wallet (Available {formatRs(walletAvailable)})
                  </span>
                </label>
              </div>
              {/* minimum order section when order amount is below min */}
              {isBelowMinOrder && (
                <div className="mb-2 text-xs text-red-600">
                  Minimum order: {formatRs(minOrderAmount)}
                  (Add {formatRs(minOrderAmount - grandTotal)} more)
                </div>
              )}

              {/* payment mode */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Payment Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-3 border rounded-lg cursor-pointer ${
                      paymentMode === "cod"
                        ? "border-amber-400 bg-amber-50"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMode === "cod"}
                      onChange={() => setPaymentMode("cod")}
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                  <label
                    className={`p-3 border rounded-lg cursor-pointer ${
                      paymentMode === "online"
                        ? "border-amber-400 bg-amber-50"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMode === "online"}
                      onChange={() => setPaymentMode("online")}
                    />
                    <span className="ml-2">Online Payment</span>
                  </label>
                </div>
                {!isSocietyAddress && (
                  <div className="flex mt-4 items-center justify-center">
                    <span className="text-red-600 ">
                      It's Available Only For Society Address
                    </span>
                  </div>
                )}
              </div>

              {/* totals */}
              <div className="mt-4 border-t pt-4  hidden lg:block">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Total</span>
                  <span className="font-bold text-lg">
                    {formatRs(grandTotal)}
                  </span>
                </div>

                {useWalletAmount && (
                  <div className="flex justify-between text-sm text-gray-700 mt-2">
                    <span>Wallet Used</span>
                    <span className="font-medium">
                      -{formatRs(Math.min(walletAvailable, grandTotal))}
                    </span>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={
                      isPending ||
                      grandTotal < (minOrderAmount || 0) ||
                      !(
                        selectedAddress?.society_add &&
                        typeof selectedAddress.society_add === "object" &&
                        !Array.isArray(selectedAddress.society_add)
                      )
                    }
                    className={`w-full py-3 px-2 rounded-lg font-semibold ${
                      isPending ||
                      !(
                        selectedAddress?.society_add &&
                        typeof selectedAddress.society_add === "object" &&
                        !Array.isArray(selectedAddress.society_add)
                      )
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-400"
                    }`}
                  >
                    {isPending ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
/////
        {/* mobile footer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t z-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-bold text-lg">
                {formatRs(payableAfterWallet)}
              </div>
            </div>
            <div>
              <button
                onClick={handlePlaceOrder}
                disabled={
                  isPending ||
                  grandTotal < (minOrderAmount || 0) ||
                  !(
                    selectedAddress?.society_add &&
                    typeof selectedAddress.society_add === "object" &&
                    !Array.isArray(selectedAddress.society_add)
                  )
                }
                className={`w-full py-3 px-2 rounded-lg font-semibold ${
                  isPending ||
                  !(
                    selectedAddress?.society_add &&
                    typeof selectedAddress.society_add === "object" &&
                    !Array.isArray(selectedAddress.society_add)
                  )
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-400"
                }`}
              >
                {isPending ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleAddressSaved}
        isEditing={isEditingAddress}
        initialData={editingAddress || {}}
        addAddressMutate={(payload, opts) =>
          addAddressHook.mutate(payload, opts)
        }
        updateAddressMutate={(args, opts) =>
          updateAddressHook.mutate(args, opts)
        }
        getLocation={getLocation}
        locationError={locationError}
        gettingLocation={gettingLocation}
      />
    </div>
  );
}
