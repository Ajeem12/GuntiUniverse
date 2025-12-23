import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStatus } from "../hooks/useOrderStatus"; // 🔥 your existing hook
import hashids from "../util/hashids";
import TataNeuNavbar from "../components/TataNeuNavbar";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import Guntiimg from "../components/Guntiimg";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";

const ThankYouGuntiPass = () => {
  const { id: transactionId } = useParams();
  const navigate = useNavigate();
  // const location = useLocation();
  // const packageBuyId = location.state?.packageBuyId;

  const token = localStorage.getItem("token");

  // Fetch transaction status using your existing hook
  const {
    data: orderStatus,
    isLoading,
    isError,
    error,
  } = useOrderStatus(transactionId);
  const status = Array.isArray(orderStatus) ? orderStatus[0] : orderStatus;

  // const packageBuyId = orderStatus?.local_data.id;
  const packageBuyId =
    status?.local_data?.type === "pass" ? status.local_data.id : null;

  const encodedId = orderStatus?.orderId
    ? hashids.encode(Number(orderStatus.orderId))
    : null;
  const redirectWithPost = (url, data = {}) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    Object.keys(data).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };
  const amountPaid = orderStatus?.amount / 100;
  const payableAmount = orderStatus?.payableAmount / 100;
  const isPaymentSuccessful = orderStatus?.state === "COMPLETED";
  const isPaymentFailed = orderStatus?.state === "FAILED";
  const handleTryAgain = () => {
    if (!packageBuyId) {
      alert("Unable to retry payment");
      return;
    }

    const payURL = `${
      import.meta.env.VITE_PAY_URL
    }/pay-gunti-pass/${packageBuyId}`;

    redirectWithPost(payURL, {
      package_buy_id: packageBuyId,
    });
  };

  const handleViewPass = () => {
    if (!encodedId) {
      alert("Unable to open pass details");
      return;
    }
    // navigate(`/user/gunti-pass-detail/${encodedId}`);
    navigate(`/thank-you-gunti-pass/${encodedId}`);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };
  const handleShopping = () => {
    navigate("/");
  };

  // const handleTryAgain = () => {
  //   if (!packageBuyId) {
  //     alert("Unable to retry payment");
  //     return;
  //   }

  //   const payURL = `${
  //     import.meta.env.VITE_PAY_URL
  //   }/pay-gunti-pass/${packageBuyId}`;

  //   redirectWithPost(payURL, {
  //     package_buy_id: packageBuyId,
  //   });
  // };

  // -------------------------
  // 🔄 Loading State
  // -------------------------
  if (isLoading) {
    return (
      <>
        <TataNeuNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking payment status...</p>
          </div>
        </div>
        <MobileBottomMenu />
        <Guntiimg />
      </>
    );
  }

  // -------------------------
  // ❌ Error State (API error)
  // -------------------------
  if (isError) {
    return (
      <>
        <TataNeuNavbar />
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
                {error?.message || "Unable to verify your payment"}
              </p>
            </div>
          </div>
        </div>
        <MobileBottomMenu />
        <Guntiimg />
      </>
    );
  }

  // -------------------------
  // ✨ Success / Failed UI
  // -------------------------
  return (
    <>
      <TataNeuNavbar />
      <div
        className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8  ${
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
                ? "Thank you for purchasing the Gunti Universe Pass!"
                : "We could not process your payment"}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                Payment Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-gray-900">
                    {transactionId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Pass ID</span>
                  <span className="font-medium text-gray-900">
                    {orderStatus?.orderId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isPaymentSuccessful
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {orderStatus?.state}
                  </span>
                </div>

                {isPaymentSuccessful && (
                  <>
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <span className="text-gray-600">Payable Amount</span>
                      <span className="font-medium text-gray-900">
                        ₹{payableAmount?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-bold text-green-600 text-lg">
                        ₹{amountPaid?.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {isPaymentFailed && orderStatus?.errorCode && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-1">Error Code</p>
                    <p className="font-medium text-red-600">
                      {orderStatus.errorCode}
                    </p>

                    {orderStatus.detailedErrorCode && (
                      <>
                        <p className="text-gray-600 mt-3 mb-1">
                          Detailed Error
                        </p>
                        <p className="font-medium text-red-600">
                          {orderStatus.detailedErrorCode}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-4">
              {isPaymentSuccessful ? (
                <>
                  {/* <button
                    onClick={handleViewPass}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    View Pass Details
                  </button> */}

                  <button
                    onClick={handleShopping}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Go to Home Page
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleTryAgain}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Go to Home Page
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <MobileBottomMenu />
      <Guntiimg />
    </>
  );
};

export default ThankYouGuntiPass;
