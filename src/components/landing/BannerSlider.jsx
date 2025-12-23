

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useBanner } from "../../hooks/useBanner";

const BannerSlider = ({ type  }) => {
  const { data, isLoading } = useBanner(type);

  if (isLoading) {
    return <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl"></div>;
  }

  const uniqueBanners = data 
    ? data.filter((banner, index, self) => 
        index === self.findIndex((b) => b.id === banner.id)
      )
    : [];

  if (!uniqueBanners || uniqueBanners.length === 0) {
    return <div className="w-full h-48 bg-gray-100 rounded-xl"></div>;
  }

  const settings = {
    dots: true,
    infinite: uniqueBanners.length > 1,
    speed: 500,
    autoplay: uniqueBanners.length > 1,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: uniqueBanners.length > 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Slider {...settings} className="banner-slider">
        {uniqueBanners.map((banner) => (
          <div key={banner.id} className="px-2">
            <div className="rounded-xl overflow-hidden">
              <img
                src={`${import.meta.env.VITE_MEDIA_URL}/banners/${banner.image}`}
                alt={banner.title}
                className="w-full h-48 md:h-64 lg:h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .banner-slider .slick-dots {
          bottom: 10px;
        }
        .banner-slider .slick-dots li button:before {
          font-size: 10px;
          color: white;
          opacity: 0.8;
        }
        .banner-slider .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        .banner-slider .slick-prev:before,
        .banner-slider .slick-next:before {
          color: white;
          font-size: 24px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .banner-slider .slick-prev {
          left: 15px;
          z-index: 1;
        }
        .banner-slider .slick-next {
          right: 15px;
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;
