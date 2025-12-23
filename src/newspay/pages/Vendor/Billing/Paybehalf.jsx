import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  payOnBehalf,
  resetPayOnBehalf,
  searchCustomerExist
} from "../../../redux/slices/payOnBehalfSlice";

const Paybehalf = () => {
  const dispatch = useDispatch();
  const { result, loading, success, error } = useSelector((state) => state.payOnBehalf);

  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]); // default to today
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerNumber || !paymentAmount || !paymentDate) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      // Step 1: Search if customer exists
      const response = await dispatch(
        searchCustomerExist({ mobile: customerNumber })
      ).unwrap();

      const customer = response?.data;

      if (customer?.id) {
        // Step 2: Dispatch payOnBehalf with customer ID, amount, and date
        await dispatch(
          payOnBehalf({
            customer_id: customer.id,
            amount: paymentAmount,
            paid_date: paymentDate // Pass this only if backend supports it
          })
        ).unwrap();

        setMessage("Payment entry recorded successfully!");
        setCustomerNumber("");
        setPaymentAmount("");
        setPaymentDate(new Date().toISOString().split("T")[0]); // reset to today
      } else {
        setMessage("Customer not found. Please check the number.");
      }
    } catch (err) {
      setMessage(err?.message || "An error occurred during the payment process.");
    }
  };

  return (
    <div className="flex items-center justify-center px-2">
      <div className="bg-white rounded-lg shadow-md p-2 w-full">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-6">
          Pay on Behalf of Customer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Number
            </label>
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Enter Customer No"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Payment Date */}
          <div className="hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded-md font-semibold hover:bg-amber-600 transition"
          >
            {loading ? "Processing..." : "Pay"}
          </button>

          {/* Message */}
          {message && (
            <p className="text-sm text-center mt-3 text-green-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Paybehalf;
