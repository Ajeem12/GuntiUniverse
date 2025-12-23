import React, { useState, useEffect } from "react";
import { GiCoffeeCup } from "react-icons/gi";
import { IoIosSunny } from "react-icons/io";
import { LuMoonStar } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { IoAdd, IoRemove } from "react-icons/io5";
import useFastProducts from "../hooks/useFastProducts";
import { useCMartCartStore } from "../store/cmartCartStore";
import useGetProfile from "../../hooks/useGetProfile";

export default function FastHome() {
  const navigate = useNavigate();
  const { profile, loading, error } = useGetProfile();

  // ---------------- CART (Zustand) ----------------
  const { cart, addToCart, updateQty, removeFromCart } = useCMartCartStore();

  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ---------------- TIME BASED GREETING ----------------
  const hour = new Date().getHours();

  let greeting = "";
  let message = "";
  let emojiIcon = null;

  if (hour >= 6 && hour < 11) {
    greeting = profile
      ? `Good Morning, ${profile?.first_name || ""} ${
          profile?.last_name || ""
        } 👋`
      : "Good Morning 👋";
    message = "It's Breakfast Time! Here's what you might need.";
    emojiIcon = <IoIosSunny size={60} className="text-yellow-400" />;
  } else if (hour >= 11 && hour < 15) {
    greeting = profile
      ? `Good Afternoon, ${profile?.first_name || ""} ${
          profile?.last_name || ""
        } 👋`
      : "Good Afternoon 👋";
    message = "It's Lunchtime! Let's get everything you need.";
    emojiIcon = <IoIosSunny size={60} className="text-orange-500" />;
  } else if (hour >= 15 && hour < 19) {
    greeting = profile
      ? `Good Evening, ${profile?.first_name || ""} ${
          profile?.last_name || ""
        } 👋`
      : "Good Evening 👋";
    message = "Snack Time! Here are your favourite quick bites.";
    emojiIcon = <GiCoffeeCup size={60} className="text-amber-500" />;
  } else if (hour >= 19 && hour <= 23) {
    greeting = profile
      ? `Good Night, ${profile?.first_name || ""} ${
          profile?.last_name || ""
        } 🌙`
      : "Good Night 🌙";
    message = "Wind down your day—your night essentials are here.";
    emojiIcon = <LuMoonStar size={60} className="text-blue-400" />;
  }

  // ---------------- FETCH PRODUCTS ----------------
  const { data: slots, isLoading } = useFastProducts();

  if (isLoading) return <p className="p-5">Loading...</p>;

  // -------- FIND ACTIVE SLOT --------
  const activeSlot = slots.find(
    (cat) =>
      cat.slot && hour >= Number(cat.slot.start) && hour < Number(cat.slot.end)
  );

  // -------- GET PRODUCTS FROM PARENT CATEGORY --------
  const timeProducts = activeSlot
    ? slots.find((cat) => cat.id === activeSlot.parent_id)?.products || []
    : [];

  return (
    <div className="min-h-screen p-5 pb-24 font-sans">
      {/* -------- Greeting -------- */}
      <div className="flex justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{greeting}</h1>
          <p className="text-gray-700 mt-2 text-sm">{message}</p>
        </div>
        <div>{emojiIcon}</div>
      </div>

      {/* -------- 4 Time Categories -------- */}
      {/* (NO UI CHANGE) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link
          to="product-list/249"
          className="bg-gradient-to-b from-yellow-200 to-yellow-100 rounded-xl p-2 shadow-sm"
        >
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <IoIosSunny className="text-yellow-400" size={30} />
            <div>Morning Essentials</div>
          </div>
          <div className="flex gap-3 mt-3 text-2xl text-gray-700">🥛 🍞 ☕</div>
        </Link>

        <Link
          to="product-list/250"
          className="bg-gradient-to-b from-orange-300 to-orange-200 rounded-xl p-2 shadow-sm"
        >
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <IoIosSunny className="text-orange-500" size={30} />
            <div>Lunch Essentials</div>
          </div>
          <div className="flex gap-3 mt-3 text-2xl text-gray-700">🍪 🍯 ☕</div>
        </Link>

        <Link
          to="product-list/253"
          className="bg-gradient-to-b from-orange-200 to-orange-100 rounded-xl p-2 shadow-sm"
        >
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <GiCoffeeCup className="text-amber-500" size={30} />
            <div>Evening Snacks</div>
          </div>
          <div className="flex gap-3 mt-3 text-2xl text-gray-700">🍟 🍪 🥤</div>
        </Link>

        <Link
          to="product-list/255"
          className="bg-gradient-to-b from-[#4b66aa] to-[#7286b8] rounded-xl p-2 shadow-sm text-white"
        >
          <div className="flex items-center gap-2 font-semibold">
            <LuMoonStar className="text-blue-200" size={30} />
            <div>Dinner & Night Needs</div>
          </div>
          <div className="flex gap-3 mt-3 text-2xl opacity-90">🥛 🧃 🍼</div>
        </Link>
      </div>

      {/* -------- TIME-SLOT PRODUCTS (NEW) -------- */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        Quick Buy
      </h2>

      {timeProducts.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No products available right now.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {timeProducts.map((prod, idx) => (
            <div key={idx} className="bg-white rounded-xl p-3">
              <div className="flex gap-1 items-start">
                {/* Product Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={`${import.meta.env.VITE_MEDIA_URL}/products/${
                      prod?.image_details?.[0]?.image
                    }`}
                    alt="product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Name (2-line truncate) */}
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-3">
                  {prod.product_name}
                </h3>
              </div>

              <p className="text-gray-700 text-sm font-medium mt-2">
                ₹{prod.c_mart_price}
              </p>

              {cart.find((item) => item.id === prod.id) ? (
                <div className="mt-1 flex items-center justify-between px-6  text-sm font-medium">
                  <button
                    onClick={() => {
                      const item = cart.find((i) => i.id === prod.id);
                      if (item.quantity === 1) removeFromCart(prod.id);
                      else updateQty(prod.id, item.quantity - 1);
                    }}
                    className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-lg"
                  >
                    <IoRemove />
                  </button>

                  <span>{cart.find((i) => i.id === prod.id)?.quantity}</span>

                  <button
                    onClick={() => {
                      const item = cart.find((i) => i.id === prod.id);
                      updateQty(prod.id, item.quantity + 1);
                    }}
                    className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-lg"
                  >
                    <IoAdd />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToCart({
                      id: prod.id,
                      name: prod.product_name,
                      price: prod.c_mart_price,
                      image: prod?.image_details?.[0]?.image,
                    })
                  }
                  className="mt-2 w-full bg-black text-white py-2 rounded-lg text-sm font-medium"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* -------- CART POPUP -------- */}
      {cart.length > 0 && (
        <div
          onClick={() => navigate("fast-cart")}
          className="fixed bottom-16 left-2 right-2  bg-black rounded-xl text-white py-2 text-center font-semibold text-lg shadow-lg cursor-pointer"
        >
          {cart.length} item(s) in cart • View Cart →
        </div>
      )}
    </div>
  );
}
