
import React from "react";
import useGetProfile from "../../hooks/useGetProfile";
import { FaShoppingBag, FaShoppingCart, FaHeart } from "react-icons/fa";

const SoftClosedCard = () => {
  const { profile } = useGetProfile();

  const userName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "Guest";

  return (
    <div className="w-[320px] bg-white rounded-[20px] p-6 text-center shadow-xl">
      <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-4xl">
        🛍️🛒❤️
        {/* <div className="flex gap-2 text-2xl">
          <FaShoppingBag />
          <FaShoppingCart />
          <FaHeart />
        </div> */}
      </div>

      <h2 className="text-xl font-bold text-gray-800">We’re closed for now!</h2>

      {/* <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 mb-3 rounded-full bg-[#fff1e1] text-[#f39a3c] font-semibold text-sm">
        ⏰ Opens in <span className="font-bold">Morning</span>
      </div> */}

      <p className="text-sm text-gray-600 mb-5">
        See you again soon,
        <br />
        <span className="font-semibold text-gray-800">{userName} 😊</span>
      </p>

      <button
        onClick={
          () => (window.location.href = "https://guntiuniverse.com/home")
          // (link = "/home")
        }
        className="w-full py-3 rounded-xl bg-gradient-to-b from-[#f7a24a] to-[#f39a3c] text-white font-semibold shadow-lg"
      >
        Buy Groceries On GuntiMart
      </button>
    </div>
  );
};

export default SoftClosedCard;
