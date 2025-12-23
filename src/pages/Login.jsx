import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import useVerifyOtpStore from "../store/verifyOtp";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";
import { useModalStore } from "../store/uiStore";

const Login = ({ onClose }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { cart } = useCartStore.getState();
  const verifyOtp = useVerifyOtpStore((state) => state.verifyOtp);
  const openRegisterModal = useModalStore((state) => state.openRegisterModal);
  const referredMobile = localStorage.getItem("referredMobile");

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    if (!mobile) {
      return toast.error("Please enter your mobile number");
    }

    if (mobile.length !== 10) {
      return toast.error("Please enter a valid 10-digit mobile number");
    }

    setLoading(true);

    const result = await login(mobile, cart, referredMobile);

    setLoading(false);

    if (result.success) {
      toast.success("OTP sent successfully");
      setStep(2);
    } else {
      toast.error(result.error || "Failed to send OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      return toast.error("Please enter all OTP digits");
    }

    setLoading(true);

    const otpCode = otp.join("");
    const result = await verifyOtp(mobile, otpCode, cart);

    setLoading(false);

    if (result.success) {
      toast.success("User login successfully");
      onClose();
    } else {
      toast.error("Invalid or expired OTP");
    }
  };

  const handleClose = () => {
    onClose();
    // navigate(-1);
  };
  const handleRegisterClick = () => {
    onClose();
    openRegisterModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <CloseIcon />
        </button>

        {/* Brand Header */}
        <div className="bg-black   py-4 px-6">
          <h2 className="text-2xl font-bold text-[#FDBD3C] text-center">
            GuntiUniverse
          </h2>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {step === 1 ? "Login to Your Account" : "Verify OTP"}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {step === 1
              ? "Enter your whatsapp mobile number"
              : `We've sent an OTP to +91 ${mobile}`}
          </p>

          {step === 1 ? (
            // Mobile Number Form
            <form onSubmit={handleMobileSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="10"
                    placeholder="Enter whatsapp number"
                    value={mobile}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setMobile(e.target.value);
                      }
                    }}
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-black text-[#FDBD3C] font-bold rounded-lg  transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Sending OTP...
                  </span>
                ) : (
                  "SEND OTP"
                )}
              </button>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 4-digit OTP
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-black text-[#FDBD3C] font-bold rounded-lg  transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Verifying...
                  </span>
                ) : (
                  "VERIFY OTP"
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-yellow-600 hover:text-yellow-800 hover:underline"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="font-medium text-red-600 hover:text-red-800 hover:underline"
              >
                Register
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
