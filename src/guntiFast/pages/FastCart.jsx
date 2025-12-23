import React, { useState } from "react";
import { useCMartCartStore } from "../store/cmartCartStore";
import { IoAdd, IoRemove } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Login from "../../pages/Login";
import { useAuthStore } from "../../store/authStore";

const FastCart = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { cart, addToCart, updateQty, removeFromCart } = useCMartCartStore();
  const { user } = useAuthStore();

  // Increase quantity
  const handleIncrease = (item) => {
    addToCart(item);
  };

  // Decrease quantity
  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      updateQty(item.id, item.quantity - 1);
    }
  };

  // Unified qty handler used in JSX below
  const handleQty = (id, change) => {
    const item = cart.find((c) => c.id === id || c.product_id === id);
    if (!item) return;

    const newQty = (item.quantity || item.qty || 1) + change;

    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      updateQty(id, newQty);
    }
  };

  // Remove item
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  // Checkout navigation
  const handleNavigate = () => {
    if (user) {
      navigate("/gunti-fast/fast-checkout");
    } else {
      setShowLoginModal(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
            to="/gunti-fast"
            className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const formatRs = (v) => `₹${Number(v || 0).toLocaleString()}`;

  const totalAmount = cart.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  return (
    <>
      <div className="min-h-screen p-2 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">
              Your Items ({cart.length})
            </h2>
            <div className="text-sm text-gray-500">{formatRs(totalAmount)}</div>
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
                      {/* <img
                        src={`${import.meta.env.VITE_MEDIA_URL}/products/${
                          item.image
                        }`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      /> */}
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_MEDIA_URL.replace(
                                /\/$/,
                                ""
                              )}/products/${item.image}`
                        }
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

                    <div className="flex items-center gap-1 mt-3">
                      {/* Decrease */}
                      <button
                        onClick={() => handleQty(id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg"
                      >
                        <IoRemove />
                      </button>

                      <div className="min-w-[36px] text-center font-semibold">
                        {qty}
                      </div>

                      {/* Increase */}
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

        {/* Total & Checkout */}
        <div className="mt-6 py-2 px-4 bg-white rounded-2xl shadow-sm flex justify-between items-center fixed bottom-16 left-0 right-0">
          <div className="flex flex-col">
            <span className="text-gray-700 text-sm">Total Amount</span>
            <span className="font-bold text-xl text-gray-900">
              ₹{totalAmount}
            </span>
          </div>
          <button
            onClick={handleNavigate}
            className="bg-yellow-500 text-white px-4 py-3 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
};

export default FastCart;
