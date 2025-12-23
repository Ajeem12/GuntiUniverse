import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerVendor, resetStatus } from "../../redux/slices/vendorSlice";
import { fetchNewspapers } from "../../redux/slices/newspaperSlice";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiMapPin,
  FiBook,
  FiFileText,
  FiHome,
  FiHash,
  FiDollarSign,
  FiUpload,
  FiCheck,
} from "react-icons/fi";

const RegisterVendor = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.vendor);
  const {
    newspapers,
    loading: loader,
    error: errors,
  } = useSelector((state) => state.newspaper);

  useEffect(() => {
    dispatch(fetchNewspapers());
  }, [dispatch]);

  const [form, setForm] = useState({
    agency_name: "",
    mobile: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // Set file name for display
      if (name === "id_proof") {
        setIdProofName(files[0].name);
      } else if (name === "license") {
        setLicenseName(files[0].name);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "newspapers") {
        form[key].forEach((id) => {
          formData.append("news_paper[]", id);
        });
      } else {
        formData.append(key, form[key]);
      }
    });
    dispatch(registerVendor(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Vendor registered successfully!");
      setForm({
        agency_name: "",
        mobile: "",
        password: "",
        password_confirmation: "",
      });

      dispatch(resetStatus());
    } else if (error) {
      if (error?.errors && typeof error.errors === "object") {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          } else {
            toast.error(messages);
          }
        });
      } else if (typeof error === "string") {
        toast.error(error);
      } else if (error?.message) {
        toast.error(error.message);
      }
      dispatch(resetStatus());
    }
  }, [success, error, dispatch]);

  const inputFields = [
    {
      label: "Agency Name",
      name: "agency_name",
      type: "text",
      icon: <FiBook className="text-amber-600" />,
      colSpan: "md:col-span-1",
    },
    {
      label: "Mobile Number",
      name: "mobile",
      type: "tel",
      icon: <FiPhone className="text-amber-600" />,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      icon: <FiLock className="text-amber-600" />,
    },
    {
      label: "Confirm Password",
      name: "password_confirmation",
      type: "password",
      icon: <FiLock className="text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:flex bg-gradient-to-br from-amber-500 to-amber-700 p-10 flex-col justify-center items-center text-white">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Vendor Network
              </h2>
              <p className="text-amber-100">
                Register your newspaper agency and start growing your business
                with us
              </p>
            </div>
            <div className="w-full max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1624269305548-1527ef905ff6?q=80&w=642&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Newspaper vendor"
                className="rounded-lg shadow-lg object-cover w-full h-64"
              />
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-amber-200 mb-2">
                Already have an account?
              </p>
              <div>
                <a
                  href="/vendor/login"
                  className="px-6 py-2 bg-white text-amber-700 rounded-full font-semibold hover:bg-amber-50 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-6 md:p-10 flex items-center justify-center flex-col overflow-y-auto max-h-screen">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amber-800">
                Vendor Registration
              </h2>
              <p className="text-amber-600 mt-2">
                Complete the form to create your vendor account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {inputFields.map(
                  ({
                    label,
                    name,
                    type,
                    icon,
                    colSpan = "",
                    placeholder = "",
                  }) => (
                    <div key={name} className={colSpan}>
                      <label className="block text-sm font-medium text-amber-700 mb-1">
                        {label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {icon}
                        </div>
                        <input
                          type={
                            type === "password"
                              ? name === "password"
                                ? showPassword
                                  ? "text"
                                  : "password"
                                : showConfirmPassword
                                ? "text"
                                : "password"
                              : type
                          }
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-10 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                          placeholder={
                            placeholder || `Enter your ${label.toLowerCase()}`
                          }
                        />
                        {(name === "password" ||
                          name === "password_confirmation") && (
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              name === "password"
                                ? setShowPassword(!showPassword)
                                : setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {name === "password" ? (
                              showPassword ? (
                                <FiEyeOff className="text-amber-600" />
                              ) : (
                                <FiEye className="text-amber-600" />
                              )
                            ) : showConfirmPassword ? (
                              <FiEyeOff className="text-amber-600" />
                            ) : (
                              <FiEye className="text-amber-600" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Registering...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>

            <div className="mt-6 text-center lg:hidden">
              <p className="text-sm text-white-600">
                Already have an account?{" "}
                <a
                  href="/vendor/login"
                  className="text-white-700 font-semibold hover:underline"
                >
                  login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterVendor;
