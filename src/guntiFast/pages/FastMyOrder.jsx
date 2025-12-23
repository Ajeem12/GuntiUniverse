import React, { useState } from "react";
import { useFetchOrderHistory } from "../../hooks/useOrderHistory";
import { Link, useNavigate } from "react-router-dom";
import hashids from "../../util/hashids";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import Loader from "../../components/Loader";
// import { useCartStore } from "../../store/cartStore";
import { useCMartCartStore } from "../store/cmartCartStore";

import { useAuthStore } from "../../store/authStore";
import { useModalStore } from "../../store/uiStore";
// fatching orders
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { redirectWithPost } from "../../hooks/redirectWithPost";

export default function FastMyOrders() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchOrderHistory();

  const { mutate: cancelOrder, isLoading: isCanceling } = useCancelOrder();

  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");

  const navigate = useNavigate();
  const { addToCart } = useCMartCartStore(); // add TO CMART CART STORE

  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();

  // const handlePayNow = (order) => {
  //   const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${order.id}`;
  //   window.location.href = paymentUrl;
  // };

  // const handlePayNow = (order) => {
  //   if (!order?.id) {
  //     alert("Invalid order. Unable to proceed with payment.");
  //     return;
  //   }

  //   const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${order.id}`;

  //   //  redirect to payment gateway
  //   // window.location.href = paymentUrl;
  //   window.location.assign(paymentUrl);
  // };
  const handlePayNow = (order) => {
    if (!order?.id) {
      alert("Invalid order. Unable to proceed with payment.");
      return;
    }

    const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${order.id}`;

    redirectWithPost(paymentUrl, {
      order_id: order.id,
    });
  };

  // FAST ORDERS ONLY
  const fastOrders = orders?.filter((order) => Number(order.type_mart) === 1);

  const handleCancelSubmit = () => {
    if (!cancelingOrderId || !selectedReason.trim()) return;

    cancelOrder(
      { orderId: cancelingOrderId, reason: selectedReason },
      {
        onSuccess: () => {
          refetch();
          setCancelingOrderId(null);
          setSelectedReason("");
        },
      }
    );
  };

  // const handleReorder = (order) => {
  //   const reorderProducts = order.order_details.map((item) => {
  //     const currentPrice =
  //       item.order_place_vendor_details?.varient_details?.[0]?.sales_price ||
  //       item.sales_price ||
  //       0;

  //     return {
  //       id: item.product_id,
  //       product_id: item.product_id,
  //       name: item.product_name || `Product ${item.product_id}`,
  //       price: parseFloat(currentPrice) || 0,
  //       qty: parseInt(item.product_qty) || 1,
  //       image: item.image
  //         ? `${import.meta.env.VITE_MEDIA_URL}/products/${item.image}`
  //         : "/fallback.png",
  //       variant_id: item.varient_id || null,
  //       variant_name: item.varient_name || "",
  //       vendor_details: item.order_place_vendor_details,
  //     };
  //   });

  //   setBuyNowProduct(reorderProducts);
  //   //gunti fast reoder just make all the order item into cart and navigate to gunti-cart page

  //   if (isAuthenticated) {
  //     navigate("/gunti-fast/Order?buyNow=true");
  //   } else {
  //     openLoginModal();
  //   }
  // };
  const handleReorder = (order) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    order.order_details.forEach((item) => {
      const price =
        Number(item.sales_price) ||
        Number(item.order_place_vendor_details?.c_mart_price) ||
        0;

      const imageUrl = item.image
        ? `${import.meta.env.VITE_MEDIA_URL.replace(
            /\/$/,
            ""
          )}/products/${item.image.replace(/^\/+/, "")}`
        : "/fallback.png";

      addToCart({
        id: item.product_id,
        name: item.product_name,
        price,
        image: imageUrl,
        quantity: Number(item.product_qty),
        variant_id: item.varient_id || null,
        variant_name: item.varient_name || "",
      });
    });

    navigate("/gunti-fast/fast-cart");
  };

  /* ---------------- LOADING ---------------- */
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-600 flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-lg font-medium">Loading your fast orders</p>
        </div>
      </div>
    );

  /* ---------------- ERROR ---------------- */
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">
            Failed to load orders
          </h3>
          <p className="text-yellow-600">
            {error?.message || "Unknown error occurred"}
          </p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  /* ---------------- EMPTY ---------------- */
  if (!fastOrders || fastOrders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No GuntiFast Orders Yet ⚡
        </h3>
        <p className="text-gray-500 mb-6">
          Your fast delivery orders will appear here.
        </p>
        <Link
          to="/gunti-fast"
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
        >
          Start Ordering
        </Link>
      </div>
    );

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fast Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your fast delivery orders
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {fastOrders.map((order) => {
            const hashedOrderId = hashids.encode(order.id);
            const isCancellable = Number(order.order_status) === 0;

            return (
              <div
                key={order.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                {/* HEADER */}
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        Order {order.order_no}
                      </h3>
                      <span
                        className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.order_status === 4
                            ? "bg-green-100 text-green-800"
                            : order.order_status === 3
                            ? "bg-blue-100 text-blue-800"
                            : order.order_status === 2
                            ? "bg-yellow-100 text-yellow-800"
                            : order.order_status === 1
                            ? "bg-orange-100 text-orange-800"
                            : order.order_status === 100
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.order_status === 4
                          ? "Delivered"
                          : order.order_status === 3
                          ? "Packed"
                          : order.order_status === 2
                          ? "Procuring"
                          : order.order_status === 1
                          ? "Processing"
                          : order.order_status === 100
                          ? "Canceled"
                          : "Placed"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.order_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="px-4 py-5 sm:p-6 ">
                  <p className="text-sm text-gray-900">{order.address}</p>
                  <div>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Payment:</span>{" "}
                      {order.payment_type || "N/A"}
                    </p>
                  </div>
                  <div className="">
                    <span className="text-sm text-gray-500 font-medium">
                      Payment Status:
                    </span>{" "}
                    <span
                      className={`text-sm font-medium  ${
                        order.payment_status === 1
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.payment_status === 1 ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 py-4 sm:px-6 flex justify-between">
                  <Link
                    to={`/gunti-fast/order-detail/${hashedOrderId}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View order details
                  </Link>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.final_amount}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="px-4 py-4 sm:px-6 bg-gray-50 flex flex-wrap gap-3">
                  {isCancellable && (
                    <button
                      onClick={() => setCancelingOrderId(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      disabled={isCanceling}
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Reorder
                  </button>

                  {order.payment_status === 0 && order.order_status !== 100 && (
                    <button
                      onClick={() => handlePayNow(order)}
                      className="px-4 py-2 bg-yellow-400 rounded-md"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CANCEL MODAL (SAME AS MYORDERS) */}
      {cancelingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-3">Cancel Order</h3>
            <textarea
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              rows={4}
              className="w-full border p-3 rounded-md"
              placeholder="Reason for cancellation..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCancelingOrderId(null);
                  setSelectedReason("");
                }}
                className="px-4 py-2 border rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={!selectedReason.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
