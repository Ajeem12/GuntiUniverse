// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { motion } from "framer-motion";
// import ScrollToTop from "../../components/ScrollToTop";
// import Login from "../../pages/Login";
// import { useModalStore } from "../../store/uiStore";
// import BottomNav from "../../guntiFast/components/BottomNav";

// const GFastLayout = () => {
//   const { showLoginModal, closeLoginModal } = useModalStore();
//   const [bgClass, setBgClass] = useState("from-yellow-100 to-yellow-100");

//   useEffect(() => {
//     const hour = new Date().getHours();

//     // MORNING (6–11 AM)
//     if (hour >= 6 && hour < 11) {
//       setBgClass("from-yellow-100 to-yellow-100");
//     }
//     // AFTERNOON (11 AM – 3 PM)
//     else if (hour >= 11 && hour < 15) {
//       setBgClass("from-orange-100 to-orange-100");
//     }
//     // EVENING (3 PM – 7 PM)
//     else if (hour >= 15 && hour < 19) {
//       setBgClass("from-amber-100 to-amber-100");
//     }
//     // NIGHT (7 PM – 6 AM)
//     else {
//       setBgClass("from-gray-200 to-gray-200 ");
//     }
//   }, []);

//   return (
//     <div
//       className={`min-h-screen bg-gradient-to-b ${bgClass} flex flex-col transition-all duration-500`}
//     >
//       <ScrollToTop />
//       <Navbar />

//       {/* Page Content */}
//       <main className="flex-1 mb-12">
//         <Outlet />
//       </main>

//       {/* Bottom navigation */}
//       <BottomNav />

//       <motion.img
//         src="/img/icon.png"
//         alt="Floating Icon"
//         className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-50"
//         drag
//         dragMomentum={false}
//         dragElastic={0.2}
//         animate={{
//           y: [0, -10, 0],
//         }}
//         initial={{ y: 0 }}
//         transition={{
//           duration: 3,
//           ease: "easeInOut",
//           repeat: Infinity,
//         }}
//       />

//       {/* Login Modal */}
//       {showLoginModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <Login onClose={closeLoginModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default GFastLayout;

// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import ScrollToTop from "../../components/ScrollToTop";
// import Login from "../../pages/Login";
// import BottomNav from "../../guntiFast/components/BottomNav";
// import { useModalStore } from "../../store/uiStore";
// import { motion } from "framer-motion";
// // import { getCMartSlot } from "../../guntiFast/api/slotApi";
// import { getCMartSlot } from "../../guntiFast/hooks/getCMartSlot";
// import SoftClosedCard from "../../guntiFast/components/SoftClosedCard";

// const GFastLayout = () => {
//   const { showLoginModal, closeLoginModal } = useModalStore();
//   const [bgClass, setBgClass] = useState("from-yellow-100 to-yellow-100");
//   const [isOpen, setIsOpen] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const slots = await getCMartSlot();
//         const hour = new Date().getHours();

//         // const activeSlot = slots.find(
//         //   (s) => hour >= Number(s.start) && hour < Number(s.end)
//         // );
//         const activeSlot = slots.find(
//           (s) =>
//             s.status === 0 && hour >= Number(s.start) && hour < Number(s.end)
//         );

//         setIsOpen(Boolean(activeSlot));

//         setIsOpen(!!activeSlot);

//         // background based on time
//         if (hour >= 6 && hour < 11) setBgClass("from-yellow-100 to-yellow-100");
//         else if (hour >= 11 && hour < 15)
//           setBgClass("from-orange-100 to-orange-100");
//         else if (hour >= 15 && hour < 19)
//           setBgClass("from-amber-100 to-amber-100");
//         else setBgClass("from-gray-200 to-gray-200");
//       } catch (err) {
//         console.error("Slot API error", err);
//         setIsOpen(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, []);

//   // ⛔ Block everything
//   if (loading) return null;
//   if (!isOpen) return <SoftClosedCard />;

//   return (
//     <div
//       className={`min-h-screen bg-gradient-to-b ${bgClass} flex flex-col transition-all duration-500`}
//     >
//       <ScrollToTop />
//       <Navbar />

//       <main className="flex-1 mb-12">
//         <Outlet />
//       </main>

//       <BottomNav />

//       <motion.img
//         src="/img/icon.png"
//         alt="Floating Icon"
//         className="fixed bottom-20 md:bottom-8 right-1 md:left-4 w-[90px] md:w-[150px] cursor-pointer z-50"
//         drag
//         dragMomentum={false}
//         dragElastic={0.2}
//         animate={{ y: [0, -10, 0] }}
//         transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
//       />

//       {showLoginModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <Login onClose={closeLoginModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default GFastLayout;
