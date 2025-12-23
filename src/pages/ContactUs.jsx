import React from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import TataNeuNavbar from '../components/TataNeuNavbar';
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import Guntiimg from '../components/Guntiimg';
const ContactUs = () => {
  return (
    <><TataNeuNavbar />
   <div className="max-w-5xl mx-auto px-4 py-12 mb-10">
        <h1 className="text-3xl font-bold text-[#EAA11E] mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          We're here to help. Reach out to us for any support, queries, or business collaborations.
        </p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">HOUSE OF GUNTI FOODS AND DELICACIES PRIVATE LIMITED</h2>
              <p className="text-sm text-gray-600">
                Bringing authentic delicacies and trusted food products with passion and quality.
              </p>
            </div>
  
            <div className="space-y-4 text-sm text-gray-700">
              
  
              <div className="flex items-start gap-3">
                <FiPhone className="text-[#EAA11E] mt-1" size={18} />
                <p>
                  <strong>Phone:</strong><br />
                  <a href="tel:+917000045686" className="text-[#EAA11E] hover:underline">
                    +91 70000 45686
                  </a>
                </p>
              </div>
  
              <div className="flex items-start gap-3">
                <FiMail className="text-[#EAA11E] mt-1" size={18} />
                <p>
                  <strong>Email:</strong><br />
                  <a href="mailto:GuntiUniverse@gmail.com" className="text-[#EAA11E] hover:underline">
                    GuntiUniverse@gmail.com
                  </a>
                </p>
              </div>
  
              {/* Uncomment and update if you want working hours */}
              {/* <div className="flex items-start gap-3">
                <FiClock className="text-[#EAA11E] mt-1" size={18} />
                <p>
                  <strong>Working Hours:</strong><br />
                  Monday – Saturday | 9:00 AM – 6:00 PM
                </p>
              </div> */}
            </div>
          </div>
  
          {/* Contact Form */}
          <form className="bg-white border border-gray-200 p-6 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Send a Message</h2>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-yellow-300"
            />
            <button
              type="submit"
              className="w-full bg-[#EAA11E] text-gray-800 py-2 px-4 rounded-md hover:bg-yellow-400 transition text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

        <MobileBottomMenu />
        <Guntiimg/>
      </>
  )
}

export default ContactUs