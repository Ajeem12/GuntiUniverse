import React from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaGlobeAmericas,
} from 'react-icons/fa';

const Universe_Details = () => {
  const universeInfo = {
    name: "Gunti Universe",
    address: "Bhilai, Durg-490011, Chhattisgarh, India",
    phone: "+91 70000 45686",
    email: "GuntiUniverse@gmail.com",
    website: "www.guntiuniverse.com",
    about:
      "Gunti Universe is a visionary platform dedicated to building interstellar opportunities across industries. From tech solutions to educational services, Gunti Universe believes in expanding possibilities beyond boundaries.",
  };

  return (
    <div className="p-4  rounded-2xl mt-8 border border-amber-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white mb-4 shadow-md">
          <FaGlobeAmericas className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold text-amber-800">{universeInfo.name}</h2>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
      </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address */}
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaMapMarkerAlt className="text-amber-600 text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-700">Address</h3>
            <p className="text-amber-900">{universeInfo.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaPhone className="text-amber-600 text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-700">Phone</h3>
            <p className="text-amber-900">{universeInfo.phone}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaEnvelope className="text-amber-600 text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-700">Email</h3>
            <p className="text-amber-900">{universeInfo.email}</p>
          </div>
        </div>

        {/* Website */}
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaGlobeAmericas className="text-amber-600 text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-700">Website</h3>
            <p className="text-amber-900">{universeInfo.website}</p>
          </div>
        </div>

        {/* About Us (takes full width) */}
        <div className="lg:col-span-3 flex items-start pt-4 border-t border-amber-200">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaInfoCircle className="text-amber-600 text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">About Us</h3>
            <p className="text-amber-900 leading-relaxed">{universeInfo.about}</p>
          </div>
        </div>
      </div>

  
     
    </div>
  );
};

export default Universe_Details;
