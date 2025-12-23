import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../newspay/components/Navbar";
import Footer from "../newspay/components/Footer";
import MobileFooter from "../newspay/components/MobileFooter";
import { motion } from "framer-motion";
import ScrollToTop from "../newspay/components/ScrollToTop";
import Login from "../pages/Login";
import { useModalStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
const NewspayLayout = () => {

  const { user } = useAuthStore();
  const { showLoginModal, closeLoginModal } = useModalStore();

  return (
    <div className="min-h-screen flex flex-col mb-20 md:mb-0">
      {/* Navbar (always visible) */}
      <ScrollToTop />
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Desktop Footer (hidden on mobile) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      <motion.img
        src="/img/icon.png"
        alt="Floating Icon"
        className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-50"
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

      {/* Mobile Footer (visible only on mobile) */}
      <MobileFooter />

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Login onClose={closeLoginModal} />
        </div>
      )}
    </div>
  );
};

export default NewspayLayout;
