import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useBanner } from "../../hooks/useBanner";

const SponsoredBanner = ({ type }) => {


  const { data, isLoading } = useBanner(type);

  // Check loading state
  if (isLoading) {
    return <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl"></div>;
  }

  // Ensure unique banners (if necessary)
  const uniqueBanners = data
    ? data.filter((banner, index, self) =>
      index === self.findIndex((b) => b.id === banner.id)
    )
    : [];

  return (
    <div className="my-2 mx-auto max-w-7xl px-2 mb-26 md:mb-8">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, Pagination]}
        className="rounded-xl overflow-hidden"
      >
        {uniqueBanners.map((banner) => (
          <SwiperSlide key={banner.id}>

            <div className="aspect-w-16 aspect-h-7">
              <img
                src={`${import.meta.env.VITE_MEDIA_URL}/banners/${banner.image}`}
                alt={banner.title}
                className="w-full h-20 md:h-40 object-cover"
              />
            </div>


          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SponsoredBanner;
