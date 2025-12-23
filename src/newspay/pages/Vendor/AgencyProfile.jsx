import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgencyProfile,
  updateAgencyProfile,
  resetProfileStatus,
} from "../../redux/slices/agencyProfileSlice";
import { fetchCities } from "../../redux/slices/citySlice";
import toast from "react-hot-toast";
import { 
  FiEdit, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiHome, 
  FiMapPin, 
  FiBook, 
  FiHash,
  FiUpload,
  FiCamera,
  FiFile,
  FiCreditCard,
  FiBriefcase,
  FiDollarSign
} from "react-icons/fi";

const AgencyProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, success } = useSelector((state) => state.agency);
  const { cities, loading: cityloader, error: cityerror } = useSelector((state) => state.cities);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    agency_name: "",
    reg_no: "",
    owner_name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const [selectedState, setSelectedState] = useState("");
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState("");
  const [panCardFile, setPanCardFile] = useState(null);
  const [panCardPreview, setPanCardPreview] = useState("");
  const [bankCancellationFile, setBankCancellationFile] = useState(null);
  const [bankCancellationPreview, setBankCancellationPreview] = useState("");
  const [businessDocFile, setBusinessDocFile] = useState(null);
  const [businessDocPreview, setBusinessDocPreview] = useState("");

  useEffect(() => {
    dispatch(fetchAgencyProfile());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        agency_name: profile.agency_name || "",
        reg_no: profile.reg_no || "",
        owner_name: profile.owner_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      });
      
      setSelectedState(profile.state || "");
      
      if (profile.id_proof) setIdProofPreview(profile.id_proof);
      if (profile.pancard_pdf) setPanCardPreview(profile.pancard_pdf);
      if (profile.bank_cancellation) setBankCancellationPreview(profile.bank_cancellation);
      if (profile.bussiness_document) setBusinessDocPreview(profile.bussiness_document);
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully!");
      dispatch(fetchAgencyProfile());
      setIsEditing(false);
      resetFileStates();
      dispatch(resetProfileStatus());
    }

    if (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            toast.error(`${field}: ${msg}`);
          });
        });
      }
      dispatch(resetProfileStatus());
    }
  }, [success, error, dispatch]);

  const resetFileStates = () => {
    setIdProofFile(null);
    setPanCardFile(null);
    setBankCancellationFile(null);
    setBusinessDocFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "state") {
      setSelectedState(value);
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: "" }));
    }
  };

  const handleFileChange = (setFile, setPreview) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Append files if selected
    if (idProofFile) submitData.append('id_proof', idProofFile);
    if (panCardFile) submitData.append('pancard_pdf', panCardFile);
    if (bankCancellationFile) submitData.append('bank_cancellation', bankCancellationFile);
    if (businessDocFile) submitData.append('bussiness_document', businessDocFile);
    
    dispatch(updateAgencyProfile(submitData));
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        agency_name: profile.agency_name || "",
        reg_no: profile.reg_no || "",
        owner_name: profile.owner_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
      });
      
      setSelectedState(profile.state || "");
      setIdProofPreview(profile.id_proof || "");
      setPanCardPreview(profile.pancard_pdf || "");
      setBankCancellationPreview(profile.bank_cancellation || "");
      setBusinessDocPreview(profile.bussiness_document || "");
    }
    
    resetFileStates();
    setIsEditing(false);
  };

  // Get unique states from cities data
  const states = cities ? Object.keys(cities) : [];
  
  // Get cities for selected state
  const stateCities = selectedState && cities ? cities[selectedState] : [];

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No profile data found.</p>
      </div>
    );
  }

  const inputFields = [
    { label: "Agency Name", name: "agency_name", icon: <FiBook className="text-amber-600" /> },
    { label: "Registration Number", name: "reg_no", icon: <FiHash className="text-amber-600" /> },
    { label: "Owner Name", name: "owner_name", icon: <FiUser className="text-amber-600" /> },
    { label: "Mobile Number", name: "mobile", icon: <FiPhone className="text-amber-600" /> },
    { label: "Email Address", name: "email", icon: <FiMail className="text-amber-600" />, type: "email" },
    { label: "Address", name: "address", icon: <FiHome className="text-amber-600" /> },
    { label: "Pincode", name: "pincode", icon: <FiMapPin className="text-amber-600" /> },
  ];

  const mediaBaseUrl = import.meta.env.VITE_MEDIA_URL;

  const renderFileUpload = (title, icon, filePreview, handleFileChange, fileType, inputId) => (
  <div className="bg-amber-50 p-6 rounded-xl mb-6">
    <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>

    <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
      {/* Preview */}
      <div className="w-full md:w-1/2">
        {filePreview ? (
          <div className="border-2 border-amber-200 rounded-lg p-1 bg-white">
           <img
  src={filePreview.startsWith("data:") ? filePreview : `${mediaBaseUrl}/${filePreview}`}
  alt={title}
  className="h-40 w-full object-contain rounded"
/>

          </div>
        ) : (
          !isEditing && (
            <p className="text-amber-600">No document uploaded.</p>
          )
        )}
      </div>

      {/* Upload Input */}
      <div className="w-full md:w-1/2">
        {isEditing ? (
          <div className="space-y-4">
            <input
              id={inputId}
              type="file"
              onChange={handleFileChange}
              accept={fileType}
              className="hidden"
            />
            <label
              htmlFor={inputId}
              className="flex flex-col items-center justify-center border-2 border-dashed border-amber-400 rounded-lg p-6 text-center cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <FiUpload className="text-amber-600 text-2xl mb-2" />
              <span className="text-amber-700 font-medium">Upload {title}</span>
              <span className="text-amber-600 text-sm mt-1">Click to browse or drag and drop</span>
              <span className="text-amber-500 text-xs mt-2">Supports JPG, PNG, PDF - Max 2MB</span>
            </label>
          </div>
        ) : (
          <div className="text-amber-700">
            {filePreview ? (
              <p>Your {title.toLowerCase()} document is uploaded.</p>
            ) : (
              <p>No {title.toLowerCase()} document uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);


  return (
    <div className="p-1 md:p-2">
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.agency_name}</h1>
              <p className="text-amber-100">Agency Profile</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-white text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center bg-white text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
                >
                  <FiSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Agency Information */}
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-6 flex items-center">
                <FiUser className="mr-2" /> Agency Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map(({ label, name, icon, type = "text" }) => (
                  <div key={name} className={name === "address" ? "md:col-span-2" : ""}>
                    <label className="text-sm font-medium text-amber-700 mb-2 flex items-center">
                      {icon}
                      <span className="ml-2">{label}</span>
                    </label>
                    {isEditing ? (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                        disabled={name === "email"}
                      />
                    ) : (
                      <div className="px-4 py-2 bg-amber-50 rounded-lg min-h-[42px] flex items-center">
                        <span className="text-amber-900">{profile[name] || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* State Dropdown */}
                <div>
                  <label className="text-sm font-medium text-amber-700 mb-2 flex items-center">
                    <FiMapPin className="text-amber-600 mr-2" /> State
                  </label>
                  {isEditing ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-amber-50 rounded-lg min-h-[42px] flex items-center">
                      <span className="text-amber-900">{profile.state || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* City Dropdown */}
                <div>
                  <label className="text-sm font-medium text-amber-700 mb-2 flex items-center">
                    <FiMapPin className="text-amber-600 mr-2" /> City
                  </label>
                  {isEditing ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      disabled={!selectedState}
                    >
                      <option value="">Select City</option>
                      {stateCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-amber-50 rounded-lg min-h-[42px] flex items-center">
                      <span className="text-amber-900">{profile.city || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
          {renderFileUpload(
  "ID Proof (Aadhar)",
  <FiCreditCard className="mr-2" />,
  idProofPreview,
  handleFileChange(setIdProofFile, setIdProofPreview),
  "image/*,.pdf",
  "id-proof"
)}

{renderFileUpload(
  "PAN Card",
  <FiFile className="mr-2" />,
  panCardPreview,
  handleFileChange(setPanCardFile, setPanCardPreview),
  "image/*,.pdf",
  "pan-card"
)}

{renderFileUpload(
  "Bank Cancellation Cheque",
  <FiDollarSign className="mr-2" />,
  bankCancellationPreview,
  handleFileChange(setBankCancellationFile, setBankCancellationPreview),
  "image/*,.pdf",
  "bank-cancel"
)}

{renderFileUpload(
  "Business Document",
  <FiBriefcase className="mr-2" />,
  businessDocPreview,
  handleFileChange(setBusinessDocFile, setBusinessDocPreview),
  "image/*,.pdf",
  "business-doc"
)}

            {profile.status === 0 && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-yellow-800 font-medium">Verification Pending</h3>
        <p className="text-yellow-700 text-sm mt-1">
          Your account is currently under review. This process usually takes 24-48 hours.
        </p>
      </div>
    </div>
  </div>
)}

{profile.status === 1 && (
  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-green-800 font-medium">Account Verified</h3>
        <p className="text-green-700 text-sm mt-1">
          Your account has been successfully verified. You now have full access to all features.
        </p>
      </div>
    </div>
  </div>
)}

{profile.status === 2 && (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-red-800 font-medium">Verification Rejected</h3>
        
        {profile.remark && (
          <div className="mt-2 bg-red-100 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm font-medium">Reason:</p>
            <p className="text-red-600 text-sm mt-1">{profile.remark}</p>
          </div>
        )}
        
        <div className="mt-3">
          <p className="text-red-700 text-sm font-medium">Please:</p>
          <ul className="text-red-600 text-sm mt-1 list-disc list-inside space-y-1">
            <li>Review the provided documents</li>
            <li>Update any incorrect information</li>
            <li>Resubmit for verification</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

            {/* Save/Cancel Buttons for Mobile */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-amber-100 lg:hidden">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  <FiSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfile;