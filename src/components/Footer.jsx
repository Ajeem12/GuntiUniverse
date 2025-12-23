

import {
  Facebook,
  Instagram,
  LocationOn,
  MailOutline,
  Phone,
  Pinterest,
  Twitter,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import hashids from "../util/hashids";

const Footer = () => {

  return (
    <footer className="bg-[#363435] text-gray-300 mb-16 sm:mb-0 hidden md:block">
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h1 className="text-3xl font-bold text-[#FDBD3C] mb-4">
            GUNTI FOODS
          </h1>
          <p className="mb-4 text-sm text-gray-500">
            Gunti Foods is your trusted destination for premium-quality traditional foods and delicacies.
            We bring the authentic taste of Indian cuisine to your table — crafted with care, rooted in tradition, and delivered with excellence.
          </p>

          <div className="flex space-x-4 mt-6">
            <a href="#" className="w-8 h-8 rounded-full bg-[#FDBD3C]/20 hover:bg-[#FDBD3C]/40 text-white flex items-center justify-center transition-colors">
              <Facebook fontSize="small" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#FDBD3C]/20 hover:bg-[#FDBD3C]/40 text-white flex items-center justify-center transition-colors">
              <Instagram fontSize="small" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#FDBD3C]/20 hover:bg-[#FDBD3C]/40 text-white flex items-center justify-center transition-colors">
              <Twitter fontSize="small" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#FDBD3C]/20 hover:bg-[#FDBD3C]/40 text-white flex items-center justify-center transition-colors">
              <Pinterest fontSize="small" />
            </a>
          </div>
        </div>

        {/* Center Section */}

        {/* Useful Links Section */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-center">
            <li>
              <Link
                to="/about"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link
                to="refund-policy"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                Refund Policy
              </Link>
            </li>

            <li>
              <Link
                to="shipping-policy"
                className="hover:text-[#FDBD3C] transition-colors text-sm"
              >
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>


        {/* Right Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="flex items-start mb-4 text-sm">
            <Phone className="mr-3 mt-1 text-[#FDBD3C]" />
            <div>
              <p className="text-gray-400">Phone</p>
              <a
                href="tel:+917000045686"
                className="hover:text-[#FDBD3C] transition-colors"
              >
                +91 70000 45686
              </a>
            </div>
          </div>
          <div className="flex items-start mb-4 text-sm">
            <MailOutline className="mr-3 mt-1 text-[#FDBD3C]" />
            <div>
              <p className="text-gray-400">Email</p>
              <a
                href="mailto:GuntiUniverse@gmail.com"
                className="hover:text-[#FDBD3C] transition-colors"
              >
                GuntiUniverse@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start mb-4 text-sm">
            <LocationOn className="mr-3 mt-1 text-[#FDBD3C]" />
            <div>
              <p className="text-gray-400">Office</p>
              <a
                href="mailto:GuntiUniverse@gmail.com"
                className="hover:text-[#FDBD3C] transition-colors"
              >
                Ardente Office One, 2nd Building, 1st Floor, Hoodi Main Rd, Hoodi,
                Bengaluru, Karnataka 560048
              </a>
            </div>
          </div>

          <div className="flex items-start mb-4 text-sm">
            <LocationOn className="mr-3 mt-1 text-[#FDBD3C]" />
            <div>
              <p className="text-gray-400">House Of Gunti Food Pvt Ltd.</p>
              <a
                href="mailto:GuntiUniverse@gmail.com"
                className="hover:text-[#FDBD3C] transition-colors"
              >
                292, Corporate House,
                VTC Bhilai, Post Bhilai,
                Durg, Chhattisgarh – 490011, India.
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} HOUSE OF GUNTI FOODS AND DELICACIES PRIVATE LIMITED. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;