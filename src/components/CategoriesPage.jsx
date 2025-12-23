import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TataNeuNavbar from "./TataNeuNavbar";
import MobileBottomMenu from "./landing/MobileBottomMenu";
import Guntiimg from "./Guntiimg";

// Dummy categories data
const staticMenuItems = [
  {
    id: 1,
    title: "Daily",
    subcategories: [
      { name: "GuntiMart", image: "/cat/gunti_mart_1.jpeg", url: "/home" },
      {
        name: "GuntiFast",
        image: "/gfast/gf.png",
        url: "/gunti-fast",
      },
      //  { name: "ChotaMart", image: "/cat/ChotaMart.jpg", url: "#" }
    ],
  },
  {
    id: 2,
    title: "My Bills",
    subcategories: [
      {
        name: "GuntiNewsPay",
        image: "/logo/logo.jpeg",
        url: "/news",
      },
    ],
  },
  // {
  //   id: 3,
  //   title: "Book",
  //   subcategories: [
  //     { name: "BookMyAppointment", image: "/cat/Book.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 4,
  //   title: "Education",
  //   subcategories: [
  //     { name: "Ramanujan Excellence Hub", image: "/cat/Education.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 5,
  //   title: "Entertainment",
  //   subcategories: [
  //     { name: "MT", image: "/cat/MT.jpeg", url: "#" },
  //     { name: "OTT", image: "/cat/OTT.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 6,
  //   title: "Food",
  //   subcategories: [
  //     { name: "GuntiEats", image: "/cat/GuntiEats.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 7,
  //   title: "Logistics",
  //   subcategories: [
  //     { name: "Jatayuconnect", image: "/cat/Jatayuconnect.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 8,
  //   title: "Travel",
  //   subcategories: [
  //     { name: "GuntiTravels", image: "/cat/GuntiTravels.jpeg", url: "#" }
  //   ]
  // },
  // {
  //   id: 9,
  //   title: "Non-Profit",
  //   subcategories: [
  //     { name: "DR Foundation", image: "/cat/DR Foundation.jpeg", url: "#" }
  //   ]
  // }
];

const CategoriesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCategories =
    activeFilter === "All"
      ? staticMenuItems
      : staticMenuItems.filter((cat) => cat.title === activeFilter);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 2,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 8 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <>
      <TataNeuNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs in Slider */}
        <div className="overflow-x-hidden pb-4 border-b border-gray-200 mb-6">
          <Slider {...sliderSettings}>
            <div>
              <button
                className={`px-4 py-1.5 rounded-full border text-sm ${
                  activeFilter === "All"
                    ? "bg-black text-white"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setActiveFilter("All")}
              >
                All
              </button>
            </div>

            {staticMenuItems.map((cat) => (
              <div key={cat.id}>
                <button
                  className={`px-4 py-1.5 rounded-full border text-sm ${
                    activeFilter === cat.title
                      ? "bg-black text-white"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(cat.title)}
                >
                  {cat.title}
                </button>
              </div>
            ))}
          </Slider>
        </div>

        {/* Category Sections */}
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {category.title}
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {category.subcategories.map((sub, index) => (
                <Link
                  key={index}
                  to={sub.url}
                  // className="flex flex-col items-center group"
                  className="flex flex-col items-center group
             border border-gray-200 rounded-xl p-3
             hover:shadow-md hover:border-purple-300
             transition bg-white"
                  onClick={() => {
                    if (sub.name === "GuntiMart") {
                      localStorage.setItem("store_type", "1");
                    }
                  }}
                >
                  {/* ROUND IMAGE */}
                  {/* <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center group-hover:shadow-md transition"> */}
                  {/* BOX IMAGE */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center group-hover:shadow-md transition">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover bg-black"
                    />
                  </div>
                  {/* <span className="mt-2 text-xs sm:text-sm text-gray-700 group-hover:text-purple-600 text-center truncate w-full"> */}
                  <span
                    className="mt-2 text-xs sm:text-sm font-medium text-gray-700
                 group-hover:text-purple-600 text-center w-full"
                  >
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <MobileBottomMenu />
      <Guntiimg />
    </>
  );
};

export default CategoriesPage;
