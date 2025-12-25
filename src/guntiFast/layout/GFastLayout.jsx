import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../../guntiFast/components/BottomNav";
import ScrollToTop from "../../components/ScrollToTop";
import Login from "../../pages/Login";
import { useModalStore } from "../../store/uiStore";
import SoftClosedCard from "../../guntiFast/components/SoftClosedCard";
import axios from "axios";
import { motion } from "framer-motion";

const GFastLayout = () => {
  const { showLoginModal, closeLoginModal } = useModalStore();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bgClass, setBgClass] = useState("from-yellow-100 to-yellow-100");

  // Background based on hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setBgClass("from-yellow-100 to-yellow-100");
    else if (hour >= 11 && hour < 15)
      setBgClass("from-orange-100 to-orange-100");
    else if (hour >= 15 && hour < 19) setBgClass("from-amber-100 to-amber-100");
    else setBgClass("from-gray-200 to-gray-200");
  }, []);

  // Fetch slot status directly
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PORT_URL}/getcmartslot`
        );
        const slots = res.data?.data || []; // ✅ THIS IS THE KEY CHANGE

        const open = slots.some((slot) => Number(slot.status) === 1);
        setIsOpen(open);
      } catch (err) {
        console.error("Error fetching slot status:", err);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return null;

  if (!isOpen) {
    return (
      // <div className="min-h-screen bg-[#f6efe7] flex items-center justify-center">
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SoftClosedCard />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${bgClass} flex flex-col transition-all duration-500`}
    >
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 mb-12">
        <Outlet />
      </main>
      <BottomNav />
      <motion.img
        src="/img/icon.png"
        alt="Floating Icon"
        className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-50"
        drag
        dragMomentum={false}
        dragElastic={0.2}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Login onClose={closeLoginModal} />
        </div>
      )}
    </div>
  );
};

export default GFastLayout;
