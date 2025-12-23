import React, { useState } from "react";
import { FiX, FiHome, FiMapPin } from "react-icons/fi";
import { useAddress } from "../hooks/useAddress";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const PurchaseModal = ({ isOpen, onClose, packageId }) => {
  const { data: addressData = [] } = useAddress();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const buyMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/buy_package`,
        {
          package_id: packageId,
          address_id: selectedAddress,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      alert("Redirecting to payment...");
      window.location.href = data.redirect_link;
    },
    onError: () => {
      alert("Failed to initiate purchase.");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Select Address</h2>

        {/* Address List */}
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
          {addressData?.data?.length > 0 ? (
            addressData.data.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAddress(ad.id)}
                className={`border rounded-lg p-3 cursor-pointer transition 
                ${
                  selectedAddress === ad.id
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FiHome />
                  <p className="font-semibold">{ad.name}</p>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FiMapPin /> {ad.pincode}
                </p>
                <p className="text-sm">{ad.address}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">
              No address found. Please add one.
            </p>
          )}
        </div>

        <button
          disabled={!selectedAddress || buyMutation.isLoading}
          onClick={() => buyMutation.mutate()}
          className="w-full mt-5 bg-yellow-400 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:bg-gray-300"
        >
          {buyMutation.isLoading ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default PurchaseModal;
