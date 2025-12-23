import React from 'react';
import Slider from 'react-slick';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CardGarden = () => {
  // Banner data
  const banner = {
    title: "Summer Collection",
    subtitle: "Discover our new arrivals",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.1.0&auto=format&fit=crop&w=1350&q=80",
    cta: "Shop Now"
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Card data
  const cards = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60",
      rating: 4.5
    },
    {
      id: 2,
      title: "Smart Watch",
      price: "$199.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60",
      rating: 4.2
    },
    {
      id: 3,
      title: "Camera Lens",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60",
      rating: 4.7
    },
    {
      id: 4,
      title: "Bluetooth Speaker",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60",
      rating: 4.3
    },
    {
      id: 5,
      title: "Gaming Mouse",
      price: "$59.99",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=60",
      rating: 4.8
    }
  ];

  // Custom arrows for slider
  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Next"
      >
        <FiChevronRight className="h-5 w-5 text-gray-700" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Previous"
      >
        <FiChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
    );
  }

  return (
    <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-6">
      {/* Banner Header */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-64 md:h-80 lg:h-96">
        <img 
          src={banner.image} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex items-center px-10">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">{banner.title}</h2>
            <p className="text-lg text-white mb-6">{banner.subtitle}</p>
            <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors">
              {banner.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products Slider */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h3>
        <div className="relative">
          <Slider {...sliderSettings}>
            {[1, 2].map((slide) => (
              <div key={slide} className="px-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cards.slice(0, 4).map((card) => (
                    <ProductCard key={card.id} card={card} />
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Card Grid */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Items</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {cards.map((card) => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Product Card Component
const ProductCard = ({ card }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="relative pt-[100%] overflow-hidden">
        <img 
          src={card.image} 
          alt={card.title}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-1 truncate">{card.title}</h4>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(card.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({card.rating})</span>
        </div>
        <p className="font-bold text-gray-900">{card.price}</p>
      </div>
    </div>
  );
};

export default CardGarden;