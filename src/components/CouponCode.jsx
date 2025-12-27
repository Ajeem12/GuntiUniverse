import React, { useState } from "react";
import { redeemCouponRequest } from "../hooks/redeemCoupon";

const CouponCode = () => {
  const [coupon, setCoupon] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!coupon.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await redeemCouponRequest({ couponCode: coupon });
      setIsApplied(true);
      window.location.reload();
    } catch (err) {
      setIsApplied(false);
      setError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setCoupon("");
    setIsApplied(false);
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      isApplied ? handleRemove() : handleApply();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-800">Redeem Coupon</label>

      <div className="flex items-center justify-between gap-3">
        <div className="w-full">
          <input
            type="text"
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter coupon code"
            disabled={isApplied || isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              error
                ? "border-red-500"
                : isApplied
                ? "border-green-500"
                : "border-gray-300"
            }`}
          />
        </div>
        <div className="flex">
          <button
            onClick={isApplied ? handleRemove : handleApply}
            disabled={isLoading}
            className={`w-full px-4 py-[10px] rounded-md text-sm font-medium ${
              isApplied
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-gradient-to-br from-[#EAA11E] to-[#F5C271] text-white"
            } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Checking..." : isApplied ? "Remove" : "Apply"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isApplied && !error && (
        <p className="text-sm text-green-600">Coupon applied successfully 🎉</p>
      )}
    </div>
  );
};

export default CouponCode;
