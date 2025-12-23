import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import hashids from "../../util/hashids";
import { useFetchProductHistory } from "../../hooks/useProductHistory";
import { useCancelProduct } from "../../hooks/useCancelProduct";
import Loader from "../../components/Loader";

const FastOrderDetails = () => {
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

  const totalAmount = products
    ? products.reduce(
        (sum, product) => sum + Number(product.total_sales_price || 0),
        0
      )
    : 0;

  /* ---------------- INVALID ORDER ---------------- */
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
            to="/gunti-fast/my-orders"
            className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            View My Fast Orders
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */
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

  /* ---------------- ERROR ---------------- */
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

  /* ---------------- EMPTY ---------------- */
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any products for this order.
          </p>
          <Link
            to="/gunti-fast/my-orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Fast Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderInfo = products[0];

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ================= ORDER HEADER ================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Fast Order Details
            </h1>
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

          {/* ================= SUMMARY ================= */}
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
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Delivery Charge
                  </p>
                  <p className="text-sm text-gray-900">
                    ₹{orderInfo.order_place_details.delivery_charge}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Wallet Used Amount
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    ₹{orderInfo.order_place_details.use_cash_back_amt}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payable Amount
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    ₹{orderInfo.order_place_details.final_amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ordered Products
            </h2>

            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="py-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={
                        product.image
                          ? `${import.meta.env.VITE_MEDIA_URL}/products/${
                              product.image
                            }`
                          : "/img/Noimages.png"
                      }
                      alt={product.product_name}
                      className="w-20 h-20 rounded-lg object-contain border"
                    />

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

                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Qty:{" "}
                          <span className="text-gray-700">
                            {product.product_qty}
                          </span>
                        </div>
                        <div>Price: ₹{product.sales_price} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t py-4 px-3">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount: ₹{totalAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STATUS HELPER ================= */
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

export default FastOrderDetails;
