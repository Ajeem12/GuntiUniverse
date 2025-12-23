import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";

// ✅ Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Priya R.",
    role: "Customer",
    message:
      "GuntiMart has made my shopping so much easier! The product quality is always fresh, and delivery is super quick. I love how convenient it is to find everything in one place.",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
  },
  {
    id: 2,
    name: "Anil K.",
    role: "Customer",
    message:
      "Excellent service and wide variety of products. Prices are affordable compared to local stores, and I really appreciate their timely delivery. Highly recommended!",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 5,
  },
  {
    id: 3,
    name: "Meena S.",
    role: "Customer",
    message:
      "Great experience overall. Customer support is friendly and responsive. The only thing I'd suggest is adding more organic products. Otherwise, everything is perfect.",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 4,
  },
  {
    id: 4,
    name: "Ramesh T.",
    role: "Customer",
    message:
      "This is my go-to store now. From groceries to daily essentials, everything is neatly packed and delivered without hassle. Smart shopping indeed!.",
    avatar: "https://i.pravatar.cc/100?img=4",
    rating: 5,
  },
  {
    id: 5,
    name: "Kavita M.",
    role: "Customer",
    message:
      "Shopping at GuntiMart saves me so much time. The app is user-friendly, and payment options are smooth. Just waiting for more regional products to be added.",
    avatar: "https://i.pravatar.cc/100?img=5",
    rating: 5,
  },
  {
    id: 6,
    name: "Sandeep J.",
    role: "Customer",
    message:
      "Shopping at GuntiMart saves me so much time. The app is user-friendly, and payment options are smooth. Just waiting for more regional products to be added.",
    avatar: "https://i.pravatar.cc/100?img=6",
    rating: 4,
  },
  {
    id: 8,
    name: "Neha P.",
    role: "Customer",
    message:
      "Absolutely satisfied! Packaging is neat, delivery staff are polite, and I always receive fresh items. GuntiMart truly stands by its motto – Smart Shopping.",
    avatar: "https://i.pravatar.cc/100?img=8",
    rating: 5,
  },
];

// Function to show at least 10 words, truncating if needed
const truncateMessage = (message, wordLimit = 15) => {
  const words = message.split(" ");

  // If the message has fewer than wordLimit words, return it as is
  if (words.length <= wordLimit) {
    return message;
  }

  // Otherwise, join the first `wordLimit` words and add '...'
  return words.slice(0, wordLimit).join(" ") + "...";
};

const FeedbackPage = () => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        size={14}
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      />
    ));

  return (
    <>
      <TataNeuNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-blue-50 relative ">
        {/* Section Header */}
        <div className="text-center lg:mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Happy Customers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Discover why thousands of users love our platform. Here's what they
            have to say about their experience.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".testimonial-pagination",
            bulletClass:
              "w-3 h-3 rounded-full bg-gray-300 mx-1 inline-block cursor-pointer",
            bulletActiveClass: "bg-blue-600",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="pb-16"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div
                className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 mb-4"
                style={{ minHeight: "320px" }}
              >
                {/* Quote Icon */}
                <div className="mb-4 text-blue-500 opacity-20">
                  <FaQuoteLeft size={28} />
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <div className="flex-grow mb-4">
                  <p
                    className="text-gray-700 italic"
                    style={{ minHeight: "96px" }}
                  >
                    "{truncateMessage(testimonial.message)}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-full object-cover border-2 border-blue-100">
                    <FaUserAlt className="text-blue-500 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <MobileBottomMenu />
    </>
  );
};

export default FeedbackPage;
