import React, { useState } from "react";
import { useFetchOrderHistory } from "../../hooks/useOrderHistory";
import { Link } from "react-router-dom";
import hashids from "../../util/hashids";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useModalStore } from "../../store/uiStore";
import { redirectWithPost } from "../../hooks/redirectWithPost";

export default function MyOrders() {
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
  const { setBuyNowProduct } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();

  // const handlePayNow = (order) => {
  //   const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${order.id}`;

  //   window.location.href = paymentUrl;
  // };
  const handlePayNow = (order) => {
    if (!order?.id) {
      alert("Invalid order. Unable to proceed with payment.");
      return;
    }

    const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${order.id}`;

    //  redirect to payment gateway
    // window.location.href = paymentUrl;
    // window.location.assign(paymentUrl);
    redirectWithPost(paymentUrl, {
      order_id: order.id,
    });
  };

  const martOrders = orders?.filter((order) => Number(order.type_mart) === 0);

  const handleCancelSubmit = () => {
    if (!cancelingOrderId || !selectedReason) return;
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
  const handleReorder = (order) => {
    const reorderProducts = order.order_details.map((item) => {
      // Use the variant price if available, otherwise fall back to product price
      const currentPrice =
        item.order_place_vendor_details?.varient_details?.[0]?.sales_price ||
        item.sales_price ||
        0;

      return {
        id: item.product_id,
        product_id: item.product_id,
        name: item.product_name || `Product ${item.product_id}`,
        price: parseFloat(currentPrice) || 0,
        qty: parseInt(item.product_qty) || 1,
        image: item.image
          ? `${import.meta.env.VITE_MEDIA_URL}/products/${item.image}`
          : "/fallback.png",
        variant_id: item.varient_id || null,
        variant_name: item.varient_name || "",
        // Include vendor details for reference
        vendor_details: item.order_place_vendor_details,
      };
    });

    // Set all products as buyNow products
    setBuyNowProduct(reorderProducts);

    console.log("Reorder Products with current prices:", reorderProducts);

    if (isAuthenticated) {
      navigate("/order?buyNow=true");
    } else {
      openLoginModal();
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-600 flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-lg font-medium">
            Loading your orders
            <span className="dots" />
          </p>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">
            Failed to load orders
          </h3>
          <p className="text-yellow-600">
            {error?.message || "Unknown error occuryellow"}
          </p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  if (!martOrders || martOrders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't placed any orders with us yet. When you do, they'll appear
          here.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="bg-gray-50 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your order history
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {martOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No GuntiMart orders found
            </div>
          ) : (
            martOrders.map((order) => {
              const hashedOrderId = hashids.encode(order.id);
              const isCancellable =
                Number(order.order_status) === 0 &&
                Number(order.payment_status) !== 1;

              return (
                <div
                  key={order.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
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
                              ? "bg-yellow-100 text-yellow-800"
                              : order.order_status === 0
                              ? "bg-gray-100 text-gray-800"
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
                            : order.order_status === 0
                            ? "Placed"
                            : "Placed"}
                        </span>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="text-sm text-gray-500">
                          Placed on{" "}
                          {new Date(order.order_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="text-sm font-medium text-gray-500">
                          Delivery Address
                        </h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {order.address}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Items Total
                          </h4>
                          <p className="mt-1 text-sm text-gray-900">
                            ₹{order.products_amount}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Delivery
                          </h4>
                          <p className="mt-1 text-sm text-gray-900">
                            ₹{order.delivery_charge}
                          </p>
                        </div>

                        <div className="mt-2">
                          <span className="text-sm text-gray-500 font-medium">
                            Payment Type:
                          </span>{" "}
                          <span className="text-sm text-gray-800 capitalize">
                            {order.payment_type || "N/A"}
                          </span>
                        </div>
                        <div className="mt-2">
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
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between">
                      <Link
                        to={`/user/order-detail/${hashedOrderId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                      >
                        View order details
                      </Link>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-2">
                          Order Total:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{order.final_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
                      {isCancellable && (
                        <button
                          onClick={() => setCancelingOrderId(order.id)}
                          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
                          disabled={isCanceling}
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
                      >
                        Reorder
                      </button>

                      {order.payment_status === 0 &&
                        order.order_status !== 100 && (
                          <div className="flex items-center gap-2 sm:ml-auto">
                            <span className="text-yellow-600 font-semibold">
                              Pending Payment :{" "}
                            </span>
                            <button
                              onClick={() => handlePayNow(order)}
                              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition disabled:opacity-60"
                            >
                              Pay Now
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cancel Order
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please let us know why you're canceling this order. This
                      helps us improve our service.
                    </p>
                    <textarea
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      rows={4}
                      className="mt-4 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your reason for cancellation..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={!selectedReason.trim() || isCanceling}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCanceling ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCancelingOrderId(null);
                  setSelectedReason("");
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
