import React, { useState, useEffect, useRef } from "react";
import BannerSlider from "../components/landing/BannerSlider";
import Menu from "../components/landing/Menu";
import TataNeuNavbar from "../components/TataNeuNavbar";
import Sponsored_banner from "../components/landing/Sponsored_banner";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TestimonialSlider from "../components/TestimonialSlider";
import Guntiimg from "../components/Guntiimg";
import InstallButton from "../components/InstallButton";
import hashmobile from "../util/hashmobile";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaInfinity } from "react-icons/fa";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location?.search === "?re=true") {
      // Remove ?re=true from URL before reloading
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      window.location.reload();
    }
  }, [location?.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (!ref) return;

    const decoded = hashmobile.decode(ref);
    if (decoded.length === 0) return;

    const mobile = decoded[0];
    localStorage.setItem("referredMobile", mobile);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        {/* Loading text with fade animation */}
        <div className="animate-pulse flex space-x-2">
          <img
            src="/loader/image(6).jpg"
            className="w-12 h-12 object-contain"
          ></img>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mb-20">
      <div className="px-2 sm:px-6 lg:px-8 space-y-3">
        <div className="w-full">
          <TataNeuNavbar />
        </div>
        <InstallButton />
        <div className="w-full">
          <BannerSlider type={0} />
        </div>
        <div className="w-full">
          <Menu />
        </div>
        {/* gunti pass banner */}
        <div>
          {/* Gunti Pass Offer Section */}
          <div className="w-full">
            <div className="max-w-7xl mx-auto">
              <div
                className="bg-gradient-to-r from-yellow-500/20 to-yellow-300/10 
      border border-yellow-400/30 rounded-2xl px-6 py-10 mt-10 
      shadow-lg backdrop-blur-md"
              >
                <div
                  className="flex flex-col md:flex-row items-center 
        justify-between gap-6"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div
                      className="p-4 rounded-full bg-yellow-500/20 
              border border-yellow-400/40 shadow-yellow-500/30 shadow-md"
                    >
                      <FaInfinity className="text-4xl text-yellow-400" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-600">
                        GuntiUniverse Pass is Now Available!
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Grab exclusive benefits, unlimited deliveries & premium
                        perks.
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    to="/gunti-pass"
                    className="px-6 py-3 bg-yellow-500 text-black 
            rounded-xl font-bold text-lg hover:bg-yellow-400 
            transition-all shadow-md hover:scale-105"
                  >
                    Explore Passes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <TestimonialSlider />
        </div>

        <div className="w-full mb-20 md:mb-0">
          <Sponsored_banner type={2} />
        </div>
        <MobileBottomMenu />
        <Guntiimg />
      </div>
    </div>
  );
};

export default LandingPage;
