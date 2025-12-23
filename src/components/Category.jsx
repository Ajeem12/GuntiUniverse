import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import hashids from "../util/hashids";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const PopularCategories = () => {
  const { data } = useCategories();
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);



  const rawCategories = data?.data || [];
   const subCategories = rawCategories
  .filter((cat) => cat.type === 0 && cat.subcate1 && typeof cat.subcate1 === "object")
  .flatMap((cat) =>
    Object.values(cat.subcate1).map((sub) => ({
      id: sub.sub_cate_id,
      name: sub.sub_cate2,
      image: `${import.meta.env.VITE_MEDIA_URL}/categories/${sub.sub_cate_images}`,
    }))
  );
  const handleShopNow = (category) => {
    const encodedId = hashids.encode(Number(category.id));
    const formattedName = category.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${formattedName}?catId=${encodedId}`);
  };

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto relative px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Categories</h2>
          <p className="text-gray-500 text-sm">Swipe through top subcategories</p>
        </div>

        {/* Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute left-0 top-[40px] -translate-y-1/2 z-10 ml-1 bg-white border border-gray-300 rounded-full p-2 cursor-pointer shadow hover:scale-110 transition-all duration-200"
        >
          <FaChevronLeft className="text-gray-700" />
        </div>
        <div
          ref={nextRef}
          className="absolute right-0  top-[40px] -translate-y-1/2 z-10 mr-1 bg-white border border-gray-300 rounded-full p-2 cursor-pointer shadow hover:scale-110 transition-all duration-200"
        >
          <FaChevronRight className="text-gray-700" />
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2.5 },
            480: { slidesPerView: 3.5 },
            640: { slidesPerView: 4.5 },
            768: { slidesPerView: 5.5 },
            1024: { slidesPerView: 6.5 },
            1280: { slidesPerView: 7.5 },
          }}
          className="px-6 py-4"
        >
          {subCategories.map((category, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleShopNow(category)}
                className=" bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-800 truncate w-full">{category.name}</h3>
                <span className="text-[10px] text-blue-500 mt-1 font-semibold">Shop Now</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularCategories;
