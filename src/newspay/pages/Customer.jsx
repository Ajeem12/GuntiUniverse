import React, { useEffect } from "react";
import { FiUser, FiHome, FiMapPin, FiPhone, FiLoader} from "react-icons/fi";
import { getCustomerCareInfo } from "../redux/slices/customerCareSlice";
import { useDispatch, useSelector } from "react-redux";

const Customer = () => {
  const dispatch = useDispatch();

  // Access customer care information from Redux store
  const { customerCareInfo, loading, error, success } = useSelector(
    (state) => state.customerCare
  );

  // Fetch customer care info on component mount
  useEffect(() => {
    dispatch(getCustomerCareInfo());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FiLoader className="animate-spin text-amber-600 text-4xl mb-4" />
          <p className="text-lg text-amber-600 font-semibold">Loading customer care information...</p>
        </div>
      </div>
    );
  }

  // Error state with an icon
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FiUser className="text-red-600 text-4xl mb-4" />
          <p className="text-lg text-red-600 font-semibold">{`Error: ${error}`}</p>
          <p className="text-sm text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white rounded-2xl">
      <div>
        <h2 className="text-3xl font-extrabold text-center text-amber-700 mb-8 flex items-center justify-center gap-2">
          Customer Care
        </h2>

        {/* Check if the customer care info is available */}
        {success && customerCareInfo && customerCareInfo.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            {customerCareInfo.map((agency) => (
              <div key={agency.id} className="space-y-4">
                {/* Vendor Name */}
                

                {/* Agency Name */}
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg shadow-sm border border-amber-100">
                  <FiHome className="text-amber-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Agency Name</p>
                    <p className="text-lg font-semibold">{agency.agency_name}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg shadow-sm border border-amber-100 md:col-span-2">
                  <FiMapPin className="text-amber-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Address</p>
                    <p className="text-lg">
                      {agency.address}, {agency.city}, {agency.state} - {agency.pincode}
                    </p>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg shadow-sm border border-amber-100 md:col-span-2">
                  <FiPhone className="text-amber-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Mobile Number</p>
                    <a
                      href={`tel:${agency.mobile}`}
                      className="text-lg text-amber-800 font-semibold hover:underline"
                    >
                      {agency.mobile}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
         <div className="text-center text-gray-700 font-medium p-4">
  No customer care agencies available.<br />
  Please subscribe to access customer care contact numbers.
</div>

        )}
      </div>
    </div>
  );
};

export default Customer;
