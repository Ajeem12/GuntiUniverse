import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <FiCheckCircle className="text-green-600" size={64} />
      <h1 className="text-3xl font-bold mt-4 text-green-700">Order Successful!</h1>
      <p className="mt-2 text-gray-700">
        Thank you for your order. We've received it and will start processing shortly.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default Success;
