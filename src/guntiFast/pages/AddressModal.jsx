// AddressModal.jsx
import { Close } from "@mui/icons-material";

export default function AddressModal({
  isOpen,
  isEditing,
  newAddress,
  onChange,
  onClose,
  onSave,
  societyData,
  societyLoading,
  onSelectSociety,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-3 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <Close fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-sm">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={newAddress.name}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              value={newAddress.phone}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="10-digit mobile"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-700 mb-1">Pincode</label>
            <input
              name="pincode"
              value={newAddress.pincode}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              maxLength={6}
              placeholder="6-digit pincode"
            />
          </div>

          {/* Society list (from pincode) */}
          <div>
            <label className="block text-gray-700 mb-1">Society</label>
            {societyLoading ? (
              <p className="text-xs text-gray-500">Loading societies...</p>
            ) : (
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                onChange={(e) => onSelectSociety(e.target.value)}
                value={newAddress.society_id || ""}
              >
                <option value="">Select society</option>
                {societyData?.data?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.society_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* House / Colony / Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1">House No</label>
              <input
                name="house_no"
                value={newAddress.house_no}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Colony</label>
              <input
                name="colony_name"
                value={newAddress.colony_name}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Area</label>
            <input
              name="area"
              value={newAddress.area}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-gray-700 mb-1">Landmark</label>
            <input
              name="landmark"
              value={newAddress.landmark}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Nearby place or building"
            />
          </div>

          {/* Complete Address */}
          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Complete Address *
            </label>
            <textarea
              name="address"
              value={newAddress.address}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
              required
            ></textarea>
          </div>

          {/* Address type */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address Type *
            </label>
            <select
              name="address_type"
              value={newAddress.address_type}
              onChange={onChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EAA11E] focus:border-transparent text-sm sm:text-base"
              required
            >
              <option value="">Select Type</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm rounded-lg bg-[#EAA11E] text-white hover:bg-[#d99816]"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
