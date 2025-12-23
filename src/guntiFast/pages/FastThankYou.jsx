import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStatus } from "../../hooks/useOrderStatus";
import hashids from "../../util/hashids";

const FastThankYou = () => {
  const { transaction_id: transactionId } = useParams();
  const navigate = useNavigate();

  const {
    data: orderStatus,
    isLoading,
    isError,
    error,
  } = useOrderStatus(transactionId);

  const rawTransactionId = transactionId;
  const extractedId = rawTransactionId.split("-")[1];
  const encodedId = hashids.encode(Number(extractedId));

  const status = Array.isArray(orderStatus) ? orderStatus[0] : orderStatus;

  const orderId =
    status?.local_data?.id && status?.local_data?.type === "bada"
      ? status.local_data.id
      : null;

  const redirectWithPost = (url, data = {}) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  //  PATH CHANGED FOR GUNTI FAST
  const handleViewOrder = () => {
    navigate(`/gunti-fast/order-detail/${encodedId}`);
  };

  //  PATH CHANGED FOR GUNTI FAST
  const handleContinueShopping = () => {
    navigate("/gunti-fast");
  };

  const handleTryAgain = () => {
    if (!orderId) {
      alert("Unable to retry payment");
      return;
    }

    const paymentUrl = `${import.meta.env.VITE_PAY_URL}/pay/${orderId}`;

    redirectWithPost(paymentUrl, {
      order_id: orderId,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold mt-4">Something went wrong</h2>
            <p className="mt-2">
              {error?.message || "Failed to load order details"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const amountPaid = status?.amount ? status.amount / 100 : 0;
  const payableAmount = status?.payableAmount ? status.payableAmount / 100 : 0;

  const isPaymentSuccessful = status?.state === "COMPLETED";
  const isPaymentFailed = status?.state === "FAILED";

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        isPaymentSuccessful
          ? "bg-gradient-to-br from-green-50 to-blue-50"
          : "bg-gradient-to-br from-red-50 to-orange-50"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Status Icon */}
        <div className="text-center mb-8">
          <div
            className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
              isPaymentSuccessful ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isPaymentSuccessful ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            {isPaymentSuccessful ? "Payment Successful!" : "Payment Failed"}
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            {isPaymentSuccessful
              ? "Thank you for your purchase"
              : "Your payment could not be processed"}
          </p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
              Payment Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium">{transactionId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{status?.orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPaymentSuccessful
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status?.state}
                </span>
              </div>

              {isPaymentSuccessful && (
                <>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="text-gray-600">Payable Amount</span>
                    <span className="font-medium">
                      ₹{payableAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-green-600 text-lg">
                      ₹{amountPaid.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {isPaymentFailed && status?.errorCode && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 mb-1">Error Code</p>
                  <p className="font-medium text-red-600">
                    {/* {orderStatus.errorCode} */}
                    {status.errorCode}
                  </p>
                  {status.detailedErrorCode && (
                    <>
                      <p className="text-gray-600 mt-3 mb-1">Detailed Error</p>
                      <p className="font-medium text-red-600">
                        {status.detailedErrorCode}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {isPaymentSuccessful && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-center text-gray-500 text-sm">
                A confirmation email has been sent to your registered email
                address
              </p>
            </div>
          )}
        </div>
        {/* Next Steps */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {isPaymentSuccessful
              ? "What would you like to do next?"
              : "Please try again or contact support if the problem persists."}
          </p>

          <div className="flex justify-center space-x-4">
            {isPaymentSuccessful ? (
              <>
                <button
                  onClick={handleViewOrder}
                  className="px-4 py-2 bg-white border rounded-md"
                >
                  View Order Details
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Try Again
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="px-4 py-2 bg-white border rounded-md"
                >
                  Continue Shopping
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastThankYou;
