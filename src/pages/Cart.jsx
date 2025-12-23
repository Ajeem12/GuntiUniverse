import React, { useEffect, useState } from "react";
import { Add, Remove, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import { useAddCart } from '../hooks/useAddCart';
import Rating from "@mui/material/Rating";
import { useUpdateUserAmount } from '../hooks/updateUserAmount';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    fetchCartFromServer,
    isLoading,
    error,
  } = useCartStore();
  const mutation = useUpdateUserAmount();
  const [minAmount, setMinAmount] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();
  const navigate = useNavigate();
  const { mutate: addCartToServer } = useAddCart();

  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);


  useEffect(() => {
    const storeType = localStorage.getItem("store_type") || "default";

    mutation.mutate(
      { type: storeType },
      {
        onSuccess: (data) => {
          if (data?.data?.min_amount) {
            setMinAmount(data.data.min_amount);
            setFreeDelivery(data.delivery_Setting.max_amount);
          }
        },
        onError: (err) => {
          console.error("Failed to fetch min_amount:", err);
          toast.error("Something went wrong.");
        }
      }
    );

    fetchCartFromServer();
  }, []);

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate("/order");
    } else {
      openLoginModal();
    }
  };

  const handleAddToCart = (item) => {
    const productPrice = Number(item.product_price || item.price || 0);
    const currentQty = Number(item.quantity || item.qty || 1); // ensure numeric
    const quantity = currentQty + 1; //  now adds numerically
    const totalPrice = productPrice * quantity;

    const payload = {
      product_id: item.product_id || item.id,
      name: item.product_name || item.name,
      image: item.image,
      price: totalPrice,
      quantity,
    };

    if (isAuthenticated) {
      addCartToServer(payload, {
        onSuccess: () => {
          console.log("Cart updated on server");
          fetchCartFromServer();
        },
        onError: (err) => {
          console.error("Add to cart failed:", err);
        },
      });
    } else {
      addToCart(item, 1);
    }
  };



  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      Number(item.price || item.product_price || 0) *
      (item.quantity || item.qty || 1),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Failed to load your cart
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't load your cart items. Please try again later.
          </p>
          <button
            onClick={fetchCartFromServer}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <img
            src="/img/shopping-cart.gif"
            alt="Empty Cart"
            className="w-40 h-40 mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/home"
            className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-gray-500">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Cart Header */}
              <div className="hidden sm:grid grid-cols-12 bg-gray-100 p-4 border-b">
                <div className="col-span-6 font-medium text-gray-700">
                  Product
                </div>
                <div className="col-span-2 font-medium text-gray-700 text-center">
                  Price
                </div>
                <div className="col-span-3 font-medium text-gray-700 text-center">
                  Quantity
                </div>
                <div className="col-span-1 font-medium text-gray-700 text-right">
                  Total
                </div>
              </div>

              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="sm:col-span-6 flex items-center">
                      <div className="relative">
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `${import.meta.env.VITE_MEDIA_URL}/products/${item.image || "/img/Noimages.png"
                              }`
                          }
                          alt={item.product_name || item.name || "Product"}
                          className="w-20 h-20 object-contain rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900">
                          {item.product_name || item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {item.product_details?.category_details?.category_name ||
                            ""}
                        </p>
                        {item.product_details?.rating ? (
                          <div className="mt-1 flex items-center">
                            <Rating
                              value={item.product_details.rating}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.product_details.rating})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No rating
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 text-center">
                      <span className="text-gray-900 font-medium">
                        ₹{item.product_price || item.price || 0}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-3">
                      <div className="flex items-center justify-center sm:justify-start">
                        <button
                          onClick={() => {
                            if ((item.qty || item.quantity) > 1) {
                              decreaseQuantity(item.id);
                            }
                          }}
                          className={`p-1 rounded-full ${(item.qty || item.quantity) <= 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                          disabled={(item.qty || item.quantity) <= 1}
                        >
                          <Remove fontSize="small" />
                        </button>
                        <span className="mx-3 w-8 text-center">
                          {item.quantity || item.qty || 1}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                        >
                          <Add fontSize="small" />
                        </button>

                      </div>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-1 flex items-center justify-end">
                      <div className="text-right">
                        <span className="block text-gray-900 font-medium">
                          ₹
                          {Number(item.product_price || item.price || 0) *
                            (item.quantity || item.qty || 1)}
                        </span>
                        <button
                          onClick={() =>
                            removeFromCart(item.product_id || item.id)
                          }
                          className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center justify-end w-full"
                        >
                          <Delete fontSize="small" className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/home"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{subtotal}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    ₹{subtotal}
                  </span>
                </div>
              </div>
              {subtotal >= minAmount ? (
                <div>
                  <span className="text-sm text-green-600 text-center"> Great news! Orders above ₹{freeDelivery} get free delivery — save more while you shop! 🛍️</span>
                  <button
                    onClick={handleNavigate}
                    className="mt-2 w-full bg-[#FDBD3C] hover:bg-[#e0ac28] text-gray-800 py-3 px-4 rounded-md font-medium transition flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="mt-6 text-sm text-red-600 font-medium text-center">
                  Minimum order amount is ₹{minAmount}. Add more items to proceed.
                </p>
              )}


              <p className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our{" "}
                <a href="#" className="text-gray-900 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-900 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;