import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import ScrollToTop from "../components/ScrollToTop";

// Lazy loaded components
const TataNeuNavbar = lazy(() => import("../components/TataNeuNavbar"));
const MobileBottomMenu = lazy(() =>
  import("../components/landing/MobileBottomMenu")
);

const LandingLayout = () => {
  return (
    <div className="relative mb-20 md:mb-0">
      <ScrollToTop />
      {/* Promo Navbar */}
      <Suspense
        fallback={
          <div className="text-center py-4">
            <Loader /> Loading Navbar...
          </div>
        }
      >
        <TataNeuNavbar />
      </Suspense>
      {/* Main Content */}
      <div>
        <Outlet />
      </div>

      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <Suspense
          fallback={
            <div className="text-center py-2">
              <Loader /> Loading Menu...
            </div>
          }
        >
          <MobileBottomMenu />
        </Suspense>
      </div>

      {/* Floating Animated Icon */}
      <motion.img
        src="/img/icon.png"
        alt="Floating Icon"
        className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-[999]"
        drag
        dragMomentum={false}
        dragElastic={0.2}
        animate={{
          y: [0, -10, 0],
        }}
        initial={{ y: 0 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default LandingLayout;
