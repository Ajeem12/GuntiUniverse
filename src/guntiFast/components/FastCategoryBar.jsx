import React, { useEffect, useState } from "react";
import { GiCoffeeCup } from "react-icons/gi";
import { IoIosSunny } from "react-icons/io";
import { LuMoonStar } from "react-icons/lu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
const FAST_CATEGORY_IMAGES = {
  249: "/gfast/morning-removebg-preview.png",
  250: "/gfast/lunch-removebg-preview (1).png",
  253: "/gfast/evening-removebg-preview.png",
  255: "/gfast/dinner-preview.jpg",
};

export default function CategoryBar({
  categories,
  activeCat,
  onSelect,
  fastCategoryId,
  onOpenFilter,
}) {
  const [bgClass, setBgClass] = useState("from-yellow-100 to-yellow-100");

  useEffect(() => {
    const hour = new Date().getHours();

    // MORNING (6–11 AM)
    if (hour >= 6 && hour < 11) {
      setBgClass("from-yellow-100 to-yellow-100");
    }
    // AFTERNOON (11 AM – 3 PM)
    else if (hour >= 11 && hour < 15) {
      setBgClass("from-orange-100 to-orange-100");
    }
    // EVENING (3 PM – 7 PM)
    else if (hour >= 15 && hour < 19) {
      setBgClass("from-amber-100 to-amber-100");
    }
    // NIGHT (7 PM – 6 AM)
    else {
      setBgClass("from-gray-200 to-gray-200 ");
    }
  }, []);
  const FAST_CATEGORY_META = {
    249: {
      title: "Morning  Essentials",
      emojis: "🥛 🍞 ☕",
      icon: <IoIosSunny size={30} className="text-yellow-400" />,
      bg: "from-yellow-200 to-yellow-100",
      text: "text-gray-900",
    },
    250: {
      title: "Lunch Essentials",
      emojis: "🍪 🍯 ☕",
      icon: <IoIosSunny size={30} className="text-orange-500" />,
      bg: "from-orange-300 to-orange-200",
      text: "text-gray-900",
    },
    253: {
      title: "Evening Snacks",
      emojis: "🍟 🍪 🥤",
      icon: <GiCoffeeCup size={30} className="text-amber-500" />,
      bg: "from-amber-300 to-amber-100",
      text: "text-gray-900",
    },
    255: {
      title: "Dinner & Night Needs",
      emojis: "🥛 🧃 🍼",
      icon: <LuMoonStar size={30} className="text-blue-400" />,
      bg: "from-[#4b66aa] to-[#7286b8]",
      text: "text-white",
    },
  };

  const catMeta = FAST_CATEGORY_META[Number(fastCategoryId)];

  return (
    <div className="sticky top-[65px] z-40">
      {/* HEADER + FILTER */}
      <div className="relative">
        {/* FILTER BUTTON */}
        <button
          onClick={onOpenFilter}
          className="absolute top-5 right-2 z-[999] bg-[#FDBD3C] text-black w-10 h-10 rounded-full shadow-lg sm:hidden flex items-center justify-center"
        >
          <FilterAltIcon fontSize="small" />
        </button>

        {/* EXISTING HEADER */}
        {catMeta && (
          <div
            className={`w-full md:w-auto p-3 rounded-sm bg-gradient-to-b ${catMeta.bg}`}
          >
            <div
              className={`flex items-center gap-2 font-semibold ${catMeta.text}`}
            >
              {catMeta.icon}
              <div className="leading-tight md:max-w-[100px]">
                {catMeta.title}
              </div>
            </div>

            <div className={`flex gap-3 mt-2 text-2xl ${catMeta.text}`}>
              {catMeta.emojis}
            </div>
          </div>
        )}
      </div>

      <div
        className={` bg-gradient-to-b ${bgClass} pb-2 overflow-x-auto flex gap-3 px-2 rounded-lg `}
      >
        {/* ALL Button */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(null, "All")}
          className={`group my-3 flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow cursor-pointer min-w-[80px]
          ${
            activeCat === null
              ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
              : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
          }
        `}
        >
          <div className="w-12 h-12 mb-2 rounded-full bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
            <p className="font-bold text-sm">ALL</p>
          </div>
          <p className="text-[11px] md:text-sm font-medium text-center text-gray-800 truncate w-full px-1">
            All
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => {
          const isSelected = activeCat === category.id;

          return (
            <div
              key={category.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(category.id, category.cat_name)}
              onKeyDown={(e) =>
                e.key === "Enter" && onSelect(category.id, category.cat_name)
              }
              className={`group my-3 flex flex-col items-center justify-center bg-white p-2 rounded-xl border transition-all duration-300 shadow cursor-pointer min-w-[80px] ${
                isSelected
                  ? "ring-2 ring-amber-500 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md"
                  : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img
                  src={
                    category.image
                      ? `${import.meta.env.VITE_MEDIA_URL}/categories/${
                          category.image
                        }`
                      : "/img/Nocat.png"
                  }
                  alt={category.category_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] md:text-sm font-medium text-center text-gray-800 truncate w-[65px]">
                {category.category_name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
