import React from "react";
import {
  Newspaper,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ExternalLink,
  Shield,
  Truck,
  FileText,
  Users,
  MessageCircle,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-16">
    <div className="max-w-7xl mx-auto">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Company Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Gunti News</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Transforming the newspaper distribution industry with innovative
            solutions and reliable service delivery across communities.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-amber-500" />
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { label: "About Us", icon: Users, href: "/about" },
              { label: "Contact Us", icon: MessageCircle, href: "/contact" },
              {
                label: "Privacy Policy",
                icon: Shield,
                href: "/privacy-policy",
              },
              { label: "Terms & Conditions", icon: FileText, href: "/terms" },
              {
                label: "Refund Policy",
                icon: FileText,
                href: "/refund-policy",
              },
              {
                label: "Shipping Policy",
                icon: Truck,
                href: "/shipping-policy",
              },
            ].map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex items-center text-gray-400 hover:text-amber-500 transition-colors group text-sm"
                >
                  {label}
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-amber-500" />
            Contact Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Phone</p>
                <p className="text-gray-400 text-sm">+91 70000 45686</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Email</p>
                <p className="text-gray-400 text-sm">GuntiUniverse@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Address</p>
                <p className="text-gray-400 text-sm">
                  Bhilai, Durg-490011, Chhattisgarh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; 2025 GUNTI NEWS PRIVATE LIMITED. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
