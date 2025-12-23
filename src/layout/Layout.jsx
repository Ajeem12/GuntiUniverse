import React, { lazy, Suspense } from "react";
import { useAuthStore } from "../store/authStore";
import { Outlet } from "react-router-dom";
const Navbar = lazy(() => import("../components/Navbar"));
const CategoryMenu = lazy(() => import("../components/CategoryMenu"));
const Footer = lazy(() => import("../components/Footer"));
const BottomNavigate = lazy(() => import("../components/BottumNavigate"));
import ScrollToTop from "../components/ScrollToTop";
import Login from "../pages/Login";
import { useModalStore } from "../store/uiStore";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import PromoHeader from "../components/PromoHeader";
import { useState } from "react";
import MobileFooterMenu from "../components/MobileFooterMenu";
import Draggable from "react-draggable";
const Layout = () => {
  const { user } = useAuthStore();
  const { showLoginModal, closeLoginModal } = useModalStore();
  const [mobileMenuOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative mb-20 md:mb-0">
      <PromoHeader />
      <Navbar onOpenMobileMenu={() => setMobileOpen(true)} />
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="text-center py-4">
            <Loader />
            Loading menu...
          </div>
        }
      >
        <CategoryMenu
          isMobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileOpen}
        />
      </Suspense>

      <div>
        <Outlet />
      </div>

      <Footer />

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <BottomNavigate />
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Login onClose={closeLoginModal} />
        </div>
      )}

      {/* Bottom Right Fixed Image */}
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
    </div>
  );
};

export default Layout;
