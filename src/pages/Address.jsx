import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiMapPin,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiNavigation,
  FiLoader,
  FiPlus,
} from "react-icons/fi";
import {
  useAddress,
  useAddAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "../hooks/useAddress";
import Loader from "../components/Loader";
import useGetProfile from "../hooks/useGetProfile";
import { useSocietyList } from "../guntiFast/hooks/useGetSocietyList";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TataNeuNavbar from "../components/TataNeuNavbar";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import { useRef } from "react";
import toast from "react-hot-toast";

const Address = () => {
  const navigate = useNavigate();
  const { data: addressData = [], isLoading, refetch } = useAddress();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const { address } = location.state || {};
  const formRef = useRef(null);
  const { profile } = useGetProfile();

  const {
    mutate: getSocietyList,
    data: societyData,
    isPending,
  } = useSocietyList();

  const addAddressMutation = useAddAddress();
  const deleteAddressMutation = useDeleteAddress();
  const updateAddressMutation = useUpdateAddress();

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    houseNo: "",
    landmark: "",
    area: "",
    addressType: "",
    colonyName: "",
    society_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const [locationError, setLocationError] = useState(null);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (addressData?.data) {
      setAddresses(addressData.data);
    }
  }, [addressData]);
  const fetchSocietiesByPincode = (pincode) => {
    if (!pincode || pincode.length !== 6) return;
    getSocietyList(pincode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pincode" && value.length === 6) {
      fetchSocietiesByPincode(value);
    }
  };

  useEffect(() => {
    // Prefill form when navigated with address in location.state
    if (address) {
      setNewAddress({
        name: address.name || "",
        address: address.address || "",
        phone: address.phone || "",
        pincode: address.pincode || "",
        houseNo: address.house_no || "",
        landmark: address.landmark || "",
        area: address.area || "",
        addressType: address.address_type || "",
        colonyName: address.colony_name || "",
        society_id: address.society_id || "",
      });
      setCoords({
        latitude: address.latitude ?? null,
        longitude: address.longitude ?? null,
      });
      setIsEditing(true);
      setEditId(address.id || null);
      // IMPORTANT: fetch societies on edit
      if (address.pincode && address.pincode.length === 6) {
        getSocietyList(address.pincode);
      }
    }
  }, [address]);

  const validateInputs = () => {
    const { name, phone, pincode, address, houseNo, colonyName, area } =
      newAddress;
    if (
      !name ||
      !phone ||
      !pincode ||
      !address ||
      !houseNo ||
      !colonyName ||
      !area
    ) {
      return "All fields marked with * are required.";
    }
    if (!/^[0-9]{10}$/.test(phone)) return "Phone number must be 10 digits.";
    if (!/^[0-9]{6}$/.test(pincode)) return "Pincode must be 6 digits.";
    return "";
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    setError("");

    const payload = {
      colony_name: newAddress.colonyName,
      house_no: newAddress.houseNo,
      landmark: newAddress.landmark,
      address_type: newAddress.addressType,
      latitude: coords.latitude ?? "",
      longitude: coords.longitude ?? "",
      area: newAddress.area,
      name: newAddress.name,
      phone: newAddress.phone,
      pincode: newAddress.pincode,
      address: newAddress.address,
      society_id: newAddress.society_id,
    };
    // useEffect(() => {
    //   if (societyData?.data?.length > 0 && newAddress.society_id) {
    //     setNewAddress((prev) => ({
    //       ...prev,
    //       society_id: String(prev.society_id),
    //     }));
    //   }
    // }, [societyData]);

    try {
      if (isEditing) {
        const response = await updateAddressMutation.mutateAsync({
          id: editId,
          payload,
        });
        toast(response?.message);
        setIsEditing(false);
        setEditId(null);
        if (isEdit) {
          setTimeout(() => {
            navigate("/gunti-pass?open=true");
          }, 400);
        }
      } else {
        await addAddressMutation.mutateAsync(payload);
      }

      resetForm();
      refetch();
    } catch (err) {
      setError("Failed to save address. Please try again.");
    }
  };

  const resetForm = () => {
    setNewAddress({
      name: "",
      address: "",
      phone: "",
      pincode: "",
      houseNo: "",
      landmark: "",
      area: "",
      addressType: "",
      colonyName: "",
      society_id: "",
    });
    setCoords({ latitude: null, longitude: null });
    setError("");
  };

  const handleEditAddress = (address) => {
    setNewAddress({
      name: address.name,
      address: address.address,
      phone: address.phone,
      pincode: address.pincode,
      houseNo: address.house_no,
      landmark: address.landmark,
      area: address.area,
      addressType: address.address_type,
      colonyName: address.colony_name,
      society_id: address.society_id ? String(address.society_id) : "",
    });
    setCoords({
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setIsEditing(true);
    setEditId(address.id);
    // SCROLL TO FORM
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };
  useEffect(() => {
    if (isEditing && newAddress.pincode?.length === 6) {
      fetchSocietiesByPincode(newAddress.pincode);
    }
  }, [isEditing]);

  // useEffect(() => {
  //   if (isEditing && societyData?.data?.length > 0 && newAddress.society_id) {
  //     const exists = societyData.data.some(
  //       (s) => String(s.id) === String(newAddress.society_id)
  //     );

  //     if (!exists) {
  //       setNewAddress((prev) => ({
  //         ...prev,
  //         society_id: "",
  //       }));
  //     }
  //   }
  // }, [societyData, isEditing]);
  useEffect(() => {
    if (isEditing && societyData?.data?.length > 0 && newAddress.society_id) {
      // only normalize type
      setNewAddress((prev) => ({
        ...prev,
        society_id: String(prev.society_id),
      }));
    }
  }, [societyData, isEditing]);

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddressMutation.mutateAsync(id);
      refetch();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const getLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    setTimeout(() => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser.");
        setGettingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGettingLocation(false);
        },
        (error) => {
          setLocationError(
            "Unable to retrieve your location. Please enter manually."
          );
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }, 3000);
  };
  console.log("society_id:", newAddress.society_id);
  console.log("societies:", societyData?.data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader />
          <p className="mt-3 text-gray-600">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TataNeuNavbar />

      {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 "> */}
      <div className="max-w-6xl mx-auto px-2 py-8 pb-20 md:pb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Addresses</h1>

        {!isEdit && (
          <>
            {/* Address List */}
            <div className="mb-10">
              {addressData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {addressData.map((address) => {
                    const addressHasEdit =
                      address?.package &&
                      typeof address.package === "object" &&
                      !Array.isArray(address.package);

                    return (
                      <div
                        key={address.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  address.address_type === "home"
                                    ? "bg-blue-100 text-blue-600"
                                    : address.address_type === "work"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <FiHome className="text-lg" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {address.name}
                                </h3>
                                <p className="text-sm text-gray-500 capitalize">
                                  {address.address_type || "Other"}
                                </p>
                              </div>
                            </div>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheck className="mr-1" /> Default
                              </span>
                            )}
                          </div>

                          <div className="ml-12 space-y-2 text-sm text-gray-700">
                            <div className="flex items-start gap-2">
                              <FiPhone className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <span>{address.phone}</span>
                            </div>

                            <div className="flex items-start gap-2">
                              <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <span>{address.pincode}</span>
                            </div>
                            {address?.society_add?.society_name && (
                              <p>
                                <span className="font-medium">Society:</span>{" "}
                                {address?.society_add?.society_name || "-"}
                              </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <p>
                                <span className="font-medium">House No:</span>{" "}
                                {address.house_no || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Colony:</span>{" "}
                                {address.colony_name || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Area:</span>{" "}
                                {address.area || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Landmark:</span>{" "}
                                {address.landmark || "-"}
                              </p>
                            </div>

                            <p className="mt-2">
                              <span className="font-medium">Address:</span>{" "}
                              {address.address}
                            </p>
                          </div>
                        </div>
                        {!addressHasEdit && (
                          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                            >
                              <FiEdit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
                            >
                              <FiTrash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiHome className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No Saved Addresses
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't saved any addresses yet. Add your first address
                    below.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Address Form */}
        <div
          ref={formRef}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                {isEditing ? (
                  <FiEdit2 className="text-yellow-600" />
                ) : (
                  <FiPlus className="text-yellow-600" />
                )}
              </div>
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <FiX className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleAddAddress}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Receiver's Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="560001"
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>

                {/* {societyData?.data?.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Select Society (Optional)
                    </label>
                    <select
                      name="society_id"
                      value={newAddress.society_id}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="">Select Society</option>
                      {societyData.data.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.society_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Society (Optional)
                  </label>

                  <select
                    name="society_id"
                    value={newAddress.society_id || ""}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">Select Society</option>

                    {societyData?.data?.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.society_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Flat/House No. *
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={newAddress.houseNo}
                    onChange={handleInputChange}
                    placeholder="A-1, Sunshine Apartments"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Colony Name *
                  </label>
                  <input
                    type="text"
                    name="colonyName"
                    value={newAddress.colonyName}
                    onChange={handleInputChange}
                    placeholder="Green Park"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Central Park"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={newAddress.area}
                    onChange={handleInputChange}
                    placeholder="Koramangala"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Address Type *
                  </label>
                  <select
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={newAddress.address}
                    onChange={handleInputChange}
                    placeholder="123, Main Street, Koramangala"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {locationError && (
                <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                  <FiMapPin className="flex-shrink-0" />
                  Location captured successfully
                </div>
              )}

              {coords.latitude && coords.longitude && (
                <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                  <FiMapPin className="flex-shrink-0" />
                  Location captured successfully
                </div>
              )}

              {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                type="button"
                onClick={getLocation}
                disabled={gettingLocation}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {gettingLocation ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <FiNavigation />
                    Use My Current Location
                  </>
                )}
              </button>
            </div> */}
              {/* <a
                href={`https://guntiuniverse.com/fetch_location?id=${profile?.id}`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                <FiMapPin />
                Fetch Location
              </a> */}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors shadow-sm"
                >
                  {isEditing ? (
                    <>
                      <FiCheck />
                      Update Address
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      Add Address
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                  >
                    <FiX />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <MobileBottomMenu />
    </>
  );
};

export default Address;
