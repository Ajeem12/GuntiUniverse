import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { FaQuoteLeft } from "react-icons/fa";
import {
  FaGlobeAsia,
  FaShoppingCart,
  FaNetworkWired,
  FaLightbulb,
  FaFlag,
  FaInfinity,
} from "react-icons/fa";

// Roadmap Data + Icon styling
export const roadmap = [
  {
    id: 1,
    icon: (
      <FaGlobeAsia className="text-blue-600 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "🌍 Phase 1: Foundation & Core Development",
    time: "Q1 – Q2 2025",
    goal: "Build the base structure of GuntiUniverse and set up core systems.",
    points: ["✅ Finalized brand identity"],
  },
  {
    id: 2,
    icon: (
      <FaShoppingCart className="text-green-600 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "🛒 Phase 2: Product Launch & Market Entry",
    time: "Q3 – Q4 2025",
    goal: "Launch core mini-apps and establish district vendors.",
    points: ["🚀 Launch of GuntiMart (Smart Commerce marketplace)"],
  },
  {
    id: 3,
    icon: (
      <FaNetworkWired className="text-purple-600 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "🌐 Phase 3: Expansion & Ecosystem Growth",
    time: "Q1 – Q2 2026",
    goal: "Expand across services and deepen ecosystem integration.",
    points: ["📰 Launch of GuntiNewsPay (Hyperlocal news & infotainment)"],
  },
  {
    id: 4,
    icon: (
      <FaLightbulb className="text-yellow-500 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "💡 Phase 4: Smart Features & AI Integration",
    time: "Q3 – Q4 2026",
    goal: "Introduce intelligence, personalization & automation.",
    points: ["🧠 AI-powered recommendation engine (cross-app personalization)"],
  },
  {
    id: 5,
    icon: (
      <FaFlag className="text-red-600 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "🌟 Phase 5: National Scale & Monetization",
    time: "2027 & Beyond",
    goal: "Scale India-wide and unlock major revenue streams.",
    points: ["Expansion to 100+ districts", "🔁 API ecosystem for developers"],
  },
  {
    id: 6,
    icon: (
      <FaInfinity className="text-indigo-600 text-2xl group-hover:scale-125 duration-300" />
    ),
    phase: "📈 Long-Term Vision",
    time: "Beyond 2027",
    goal: "Become the digital backbone of every Indian home & business.",
    points: ["One app connecting commerce, content & community"],
  },
];

const TestimonialSlider = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
          🚀 GuntiUniverse Roadmap
        </h1>
        <h3 className="text-lg text-gray-600 italic mt-2">
          One App. Every Need. Your Universe.
        </h3>
        <p className="mt-2 text-gray-700 font-medium">
          Vision: Build India’s most powerful Super-App ecosystem
        </p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        loop={true}
        grabCursor={true}
        speed={750}
        spaceBetween={26}
        className="pb-10 [&_.swiper-pagination]:mt-20 "
        breakpoints={{
          0: { slidesPerView: 1.1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {roadmap.map((phase) => (
          <SwiperSlide key={phase.id} className="py-3">
            <div className="group bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md rounded-xl p-6 h-64 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
              <span className="absolute left-0 top-0 w-1 bg-blue-500 h-full rounded-l-md opacity-70"></span>

              <div className="mb-2 text-blue-500 opacity-20">
                <FaQuoteLeft size={20} />
              </div>

              <div className="flex flex-row items-center justify-center gap-2 mb-2">
                {/* <div>{phase.icon}</div> */}
                <div>
                  <h3 className="font-bold text-base text-gray-800">
                    {phase.phase}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-blue-600 font-semibold mb-2">
                {phase.time}
              </p>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                <strong>Goal:</strong> {phase.goal}
              </p>

              <ul className="text-sm text-gray-600 space-y-1 ">
                {phase.points.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-500 font-bold">●</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;
