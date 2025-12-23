import React, { useState, useEffect } from "react";
import { Close, LocationOn, Check } from "@mui/icons-material";
import { useSocietyList } from "../hooks/useGetSocietyList";

export default function AddAddressModal({
  isOpen,
  onClose,
  onSaved,
  isEditing,
  initialData = {},
  addAddressMutate,
  updateAddressMutate,
  getLocation,
  locationError,
  gettingLocation,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    colony_name: "",
    house_no: "",
    landmark: "",
    address_type: "",
    area: "",
    latitude: "",
    longitude: "",
    society_id: "",
  });

  const {
    mutate: getSocietyList,
    data: societyData,
    isPending,
  } = useSocietyList();

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        pincode: initialData.pincode || "",
        colony_name: initialData.colony_name || "",
        house_no: initialData.house_no || "",
        landmark: initialData.landmark || "",
        address_type: initialData.address_type || "",
        area: initialData.area || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        society_id: initialData.society_id || "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      getSocietyList(value, {
        onSuccess: (res) => {
          console.log("Society List:", res);
        },
      });
    }
  };

  const validate = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.pincode ||
      !form.house_no ||
      !form.colony_name ||
      !form.area
    ) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = { ...form };

    if (isEditing && initialData.id) {
      updateAddressMutate(
        { id: initialData.id, payload },
        {
          onSuccess: (res) => {
            onSaved && onSaved(payload);
            onClose();
          },
          onError: (err) => {
            console.error("Failed to update address", err);
            alert("Failed to update address");
          },
        }
      );
    } else {
      addAddressMutate(payload, {
        onSuccess: (res) => {
          onSaved && onSaved(payload);
          onClose();
        },
        onError: (err) => {
          console.error("Failed to add address", err);
          alert("Failed to add address");
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close />
          </button>
        </div>

        {/* body */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Complete Address *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              House No *
            </label>
            <input
              name="house_no"
              value={form.house_no}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Colony Name *
            </label>
            <input
              name="colony_name"
              value={form.colony_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Area/Locality *
            </label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              maxLength={6}
            />

            {isPending && (
              <p className="text-blue-500 text-xs mt-1">Checking pincode...</p>
            )}

            {societyData?.data?.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Society (Optional)
                </label>
                <select
                  name="society_id"
                  value={form.society_id}
                  onChange={handleChange}
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
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Landmark (optional)
            </label>
            <input
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address Type *
            </label>
            <select
              name="address_type"
              value={form.address_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* loaction */}
          {/* <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => {
                getLocation && getLocation();
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              {gettingLocation ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Locating...
                </>
              ) : (
                <>
                  <LocationOn />
                  Use Current Location
                </>
              )}
            </button>

            {locationError && (
              <p className="text-xs text-red-600 mt-2">{locationError}</p>
            )}

            {form.latitude && form.longitude && (
              <p className="text-xs text-green-600 mt-2">Location captured</p>
            )}
          </div> */}
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-amber-400"
          >
            {isEditing ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
