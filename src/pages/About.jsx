

import React from "react";
import TataNeuNavbar from '../components/TataNeuNavbar';
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
const About = () => {
  return (
    <>
      <TataNeuNavbar />
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 text-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl font-bold mb-6 text-center uppercase tracking-wide text-[#EAA11E]">
            HOUSE OF GUNTI FOODS AND DELICACIES PRIVATE LIMITED
          </h1>

          {/* Intro */}
          <p className="text-lg mb-10 leading-relaxed text-center max-w-3xl mx-auto">
            Welcome to <span className="font-semibold text-[#EAA11E]">HOUSE OF GUNTI FOODS AND DELICACIES PRIVATE LIMITED</span>, where we combine rich culinary heritage with modern food standards. We specialize in high-quality delicacies rooted in tradition, designed to bring flavor and joy to every meal.
          </p>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-3 text-[#EAA11E]">Our Mission</h2>
              <p>
                To provide authentic, hygienic, and premium-quality food products that reflect the essence of Indian taste while prioritizing health, safety, and satisfaction.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-3 text-[#EAA11E]">Our Vision</h2>
              <p>
                To be a leading name in India’s food industry — delivering taste, tradition, and trust to households and businesses across the country.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-gray-50 rounded-lg shadow p-6 mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#EAA11E]">Why Choose Us?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Fresh, hygienically prepared delicacies with authentic flavors</li>
              <li>Commitment to quality and traditional recipes</li>
              <li>Trusted by families, retailers, and food service professionals</li>
              <li>Efficient logistics and transparent sourcing</li>
              <li>Continuous innovation with respect for tradition</li>
            </ul>
          </div>

          {/* Values and Address */}
          <div className="bg-gray-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#EAA11E]">Our Core Values</h2>
            <p className="mb-3">
              Integrity, trust, and passion for excellence drive everything we do at <strong>HOUSE OF GUNTI FOODS AND DELICACIES PRIVATE LIMITED</strong>. We believe food is not just nourishment — it’s an experience, a tradition, and a connection to home.
            </p>

            <p className="mb-4">
              From our kitchen to yours, we promise consistency, care, and craftsmanship in every product we deliver.
            </p>

            {/* Address */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#EAA11E]">Office</h3>
              <p>
                Ardente Office One, 2nd Building, 1st Floor, Hoodi Main Rd, Hoodi,
                Bengaluru, Karnataka 560048
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#EAA11E]">House Of Gunti Food Pvt Ltd.</h3>
              <p>
                292, Corporate House,
                VTC Bhilai, Post Bhilai,
                Durg, Chhattisgarh – 490011, India.
              </p>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomMenu />
    </>
  );
};

export default About;
