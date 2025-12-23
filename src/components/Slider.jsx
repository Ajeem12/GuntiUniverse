// import React from "react";
// import { useBanner } from "../hooks/useBanner";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/pagination";

// const Slider = ( type ) => {
//   const { data, isLoading } = useBanner();

//   const bannerItems =
//     data?.map((item) => ({
//       id: item.id,
//       img: `${import.meta.env.VITE_MEDIA_URL}/banners/${item.image}`,
//       title: item.title,
//       desc: item.description || "",
//       cta: "Shop Now",
//       link: item.link,
//     })) || [];

//   if (bannerItems.length === 0) {
//     return <div className="w-full" />;
//   }

//   return (
//     <div className="w-full  overflow-hidden relative ">
//       <Swiper
//         modules={[Autoplay, Pagination]}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         loop={true}
//         pagination={{ clickable: true }}
//         slidesPerView={1}
//         className="w-full  custom-swiper"
//       >
//         {bannerItems.map((item, index) => (
//           <SwiperSlide key={index}>
//             <a href={item.link} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={item.img}
//                 alt={item.title}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "/img/Noimages.png";
//                 }}
//                 className="w-full  object-contain"
//               />
//               <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white px-4 pb-16 ">
//                 <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
//                   {item.title}
//                 </h1>
//                 <p className="mt-2 sm:mt-4 text-base sm:text-xl drop-shadow-sm">
//                   {item.desc}
//                 </p>

//                 {/* <p className="mt-2 sm:mt-4 text-base sm:text-xl drop-shadow-sm bg-red-700 text-white px-4 py-2 rounded-md">
//   {item.cta}
// </p> */}

//               </div>
//             </a>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default Slider;


// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

// const HeroSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const slides = [
//     {
//       id: 1,
//       title: "Premium Hydraulic Equipment",
//       subtitle: "Industrial Strength Solutions",
//       description: "High-performance hydraulic systems for demanding industrial applications",
//       image: "https://www.hydrofitme.com/wp-content/uploads/2022/05/Hydraulic-Equipment.jpg",
//       cta: "Explore Products",
//       link: "/products/hydraulic"
//     },
//     {
//       id: 2,
//       title: "Custom Engineering Solutions",
//       subtitle: "Tailored to Your Needs",
//       description: "Bespoke engineering solutions designed for your specific requirements",
//       image: "https://www.hydrofitme.com/wp-content/uploads/2022/05/Hydraulic-Equipment.jpg",
//       cta: "Get a Quote",
//       link: "/services/custom-engineering"
//     },
//     {
//       id: 3,
//       title: "Reliable Maintenance Services",
//       subtitle: "Maximize Your Uptime",
//       description: "Proactive maintenance programs to keep your operations running smoothly",
//       image: "https://www.hydrofitme.com/wp-content/uploads/2022/05/Hydraulic-Equipment.jpg",
//       cta: "Schedule Service",
//       link: "/services/maintenance"
//     }
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="relative w-full h-[80vh] max-h-[800px] overflow-hidden">
//       {/* Slides */}
//       <div 
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {slides.map((slide) => (
//           <div 
//             key={slide.id} 
//             className="w-full flex-shrink-0 relative h-[80vh] max-h-[800px]"
//           >
//             {/* Background Image */}
//             <div 
//               className="absolute inset-0 bg-cover bg-center z-0"
//               style={{ backgroundImage: `url(${slide.image})` }}
//             >
//               <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//             </div>

//             {/* Content */}
//             <div className="relative z-10 h-full flex items-center">
//               <div className="container mx-auto px-6 lg:px-8">
//                 <div className={`max-w-2xl ${isMobile ? 'text-center' : 'text-left'}`}>
//                   <span className="text-red-500 font-semibold tracking-wider mb-2 block">
//                     {slide.subtitle}
//                   </span>
//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
//                     {slide.title}
//                   </h1>
//                   <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg">
//                     {slide.description}
//                   </p>
//                   <a 
//                     href={slide.link}
//                     className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
//                   >
//                     {slide.cta}
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button 
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
//         aria-label="Previous slide"
//       >
//         <ChevronLeft fontSize="large" />
//       </button>
//       <button 
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
//         aria-label="Next slide"
//       >
//         <ChevronRight fontSize="large" />
//       </button>

//       {/* Pagination Dots */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`w-3 h-3 rounded-full transition ${currentSlide === index ? 'bg-red-500 w-6' : 'bg-white bg-opacity-50'}`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default HeroSlider;

import React from "react";
import { useBanner } from "../hooks/useBanner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const Slider = ({ type }) => {  // Default to type 0 if not provided
  const { data, isLoading } = useBanner(type);  // Pass the type to useBanner

  const bannerItems =
    data?.map((item) => ({
      id: item.id,
      img: `${import.meta.env.VITE_MEDIA_URL}/banners/${item.image}`,
      title: item.title,
      desc: item.description || "",
      cta: "Shop Now",
      link: item.link.includes('-') ? '/home' : item.link,
    })) || [];

  if (isLoading) {
    return <div className="w-full h-64 bg-gray-100 animate-pulse"></div>;
  }

  if (bannerItems.length === 0) {
    return <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
      No banners available
    </div>;
  }

  return (
    <div className="w-full overflow-hidden relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full"
      >
        {bannerItems.map((item, index) => (
          <SwiperSlide key={index}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img
                src={item.img}
                alt={item.title}

                className="w-full h-auto object-contain"
              />

            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;