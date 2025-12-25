import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import hashids from "../../util/hashids";
import { useFetchProductHistory } from "../../hooks/useProductHistory";
import { useCancelProduct } from "../../hooks/useCancelProduct";
import Loader from "../../components/Loader";

const OrderDetails = () => {
  const { orderId: encodedOrderId } = useParams();
  const decoded = hashids.decode(encodedOrderId);
  const orderId = decoded.length ? decoded[0] : null;

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProductHistory(orderId);

  const { mutate: cancelProduct, isLoading: isCanceling } = useCancelProduct();

  const [cancelInfo, setCancelInfo] = useState({
    show: false,
    productId: null,
  });
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-700 mb-2">
            Invalid Order ID
          </h3>
          <p className="text-red-600">
            The order ID in the URL appears to be invalid.
          </p>
          <Link
            to="/user/orders"
            className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-700 mb-2">
            Failed to load order
          </h3>
          <p className="text-red-600 mb-4">
            {error?.message || "Unknown error occurred"}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any products for this order.
          </p>
          <Link
            to="/user/orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderInfo = products[0];

  return (
    <div className="bg-gray-50 py-8  sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                orderInfo.order_status === 4
                  ? "bg-green-100 text-green-800"
                  : orderInfo.order_status === 3
                  ? "bg-blue-100 text-blue-800"
                  : orderInfo.order_status === 2
                  ? "bg-yellow-100 text-yellow-800"
                  : orderInfo.order_status === 1
                  ? "bg-orange-100 text-orange-800"
                  : orderInfo.order_status === 100
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getOrderStatus(orderInfo.order_status)}
            </span>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Number
                  </p>
                  <p className="text-sm text-gray-900">
                    {orderInfo.order_place_details.order_no}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(orderInfo.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Delivery Charge
                  </p>
                  {orderInfo.order_place_details.delivery_charge == "0" ? (
                    <p className="mt-1 text-sm text-green-600">Free Delivery</p>
                  ) : (
                    <p className="text-sm text-gray-900">
                      ₹{orderInfo.order_place_details.delivery_charge}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    ₹{orderInfo.order_place_details.final_amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ordered Products
            </h2>
            <div className="divide-y divide-gray-200">
              {products.map((product) => {
                const status = parseInt(product?.order_status);
                const isCancelable =
                  status === 0 || status === 1 || status === 2;

                return (
                  <div key={product.id} className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            product.image
                              ? `${import.meta.env.VITE_MEDIA_URL}/products/${
                                  product.image
                                }`
                              : "/img/Noimages.png"
                          }
                          alt={product.product_name}
                          className="w-20 h-20 rounded-lg object-contain border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {product.product_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {product.varient_name}
                            </p>
                          </div>
                          <p className="text-base font-semibold text-gray-900">
                            ₹{product.total_sales_price}
                          </p>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Qty:</span>{" "}
                            <span className="text-gray-700">
                              {product.product_qty}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>{" "}
                            <span className="text-gray-700">
                              ₹{product.sales_price} each
                            </span>
                          </div>
                        </div>

                        {/* {!isCancelable && status === 100 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Canceled
                            </span>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* {isCancelable && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() =>
                            setCancelInfo({ show: true, productId: product.id })
                          }
                          disabled={isCanceling}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Cancel Item
                        </button>
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t py-4 px-3">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount: ₹{orderInfo.order_place_details.products_amount}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Product Modal */}
      {cancelInfo.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                    Cancel Product
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel this product from your
                      order? Please let us know why you're canceling.
                    </p>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                      className="mt-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Reason for cancellation..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  if (!cancelReason.trim()) {
                    alert("Please enter a reason for cancellation.");
                    return;
                  }
                  cancelProduct([cancelInfo.productId, cancelReason], {
                    onSuccess: () => {
                      refetch();
                      setCancelInfo({ show: false, productId: null });
                      setCancelReason("");
                    },
                  });
                }}
                disabled={isCanceling}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
                    Processing...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCancelInfo({ show: false, productId: null });
                  setCancelReason("");
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
};

const getOrderStatus = (status) => {
  switch (parseInt(status)) {
    case 4:
      return "Delivered";
    case 3:
      return "Packed";
    case 2:
      return "Procuring";
    case 1:
      return "Processing";
    case 0:
      return "Placed";
    case 100:
      return "Canceled";
    default:
      return "Placed";
  }
};

export default OrderDetails;
