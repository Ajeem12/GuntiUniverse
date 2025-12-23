import { useState } from "react";
import { Link } from "react-router-dom";
import { useOfferProducts } from "../hooks/useOfferProducts";
import hashids from "../util/hashids";
import { Rating } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../components/Loader";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useAddCart } from "../hooks/useAddCart";
import toast from "react-hot-toast";
import { FiPlus, FiMinus } from "react-icons/fi";

// Arrows component
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 border border-gray-200 rounded-full shadow-md p-2 z-10 hover:bg-gray-100"
    onClick={onClick}
  >
    <FaChevronLeft size={18} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 border border-gray-200 rounded-full shadow-md p-2 z-10 hover:bg-gray-100"
    onClick={onClick}
  >
    <FaChevronRight size={18} />
  </button>
);

const OfferSlider = () => {
  const { data: offers, isLoading, error } = useOfferProducts();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToCartServer = useAddCart();

  const [quantities, setQuantities] = useState({});
  const cart = useCartStore((state) => state.cart);

  const handleQuantityChange = (productId, value) => {
    if (value < 1) value = 1;
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.product_id] || 1;

    if (isAuthenticated) {
      addToCartServer.mutate(
        { ...product, quantity },
        {
          onSuccess: () => {
            toast.success("Added to cart!");
          },
          onError: () => {
            toast.error("Failed to add to cart");
          },
        }
      );
    } else {
      addToCart(
        {
          id: product.product_id,
          name: product.name,
          image: product.image,
          price: product.price,
        },
        quantity
      );
      toast.success("Added to cart!");
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">Error loading offers</div>
    );
  if (!offers || offers.length === 0)
    return (
      <div className="text-center py-10 text-gray-600">No offers available</div>
    );

  return (
    <div className="p-4 sm:p-6">
      {offers.map((offer) => (
        <div key={offer.offer_name} className="mb-12">
          {/* Offer Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {offer.offer_name}
            </h1>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Product Slider */}
          {offer.products && offer.products.length > 0 ? (
            <div className="relative">
              <Slider {...sliderSettings}>
                {offer.products.map((item) => {
                  const encodedId = hashids.encode(item.id);
                  const variant = item.varient_details?.[0];
                  const originalPrice = parseFloat(variant?.product_price || 0);
                  const salesPrice = parseFloat(variant?.sales_price || 0);
                  const averageRating = parseFloat(item?.rating || 0);

                  const discount =
                    originalPrice > 0
                      ? Math.round(
                          ((originalPrice - salesPrice) / originalPrice) * 100
                        )
                      : 0;

                  const imageUrl = item.image_details?.[0]?.image
                    ? `${import.meta.env.VITE_MEDIA_URL}/products/${
                        item.image_details[0].image
                      }`
                    : "/img/Noimages.png";

                  const quantity = quantities[item.id] || 1;
                  const isProductInCart = cart.some(
                    (cartItem) =>
                      (cartItem.product_id || cartItem.id) === item.id
                  );
                  const product = {
                    product_id: item.id,
                    name: item.product_name,
                    image: imageUrl,
                    price: salesPrice,
                  };

                  return (
                    <div key={item.id} className="px-2 py-5">
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300">
                        {/* Only Image wrapped in Link */}
                        <Link
                          to={`/product/${item.product_slug}/${encodedId}`}
                          className="block relative"
                        >
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/img/Noimages.png";
                            }}
                            className="w-full h-[160px] object-contain rounded-t-lg"
                          />
                          {discount > 0 && (
                            <span className="absolute top-2 left-2 bg-[#FDBD3C] text-black text-xs px-2 py-0.5 rounded shadow">
                              {discount}% OFF
                            </span>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-800 truncate mb-1">
                            {item.product_name}
                          </h3>

                          <div className="flex items-center gap-1 mb-1">
                            {averageRating ? (
                              <Rating
                                value={averageRating}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">
                                No ratings
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{salesPrice}
                            </span>
                            {salesPrice < originalPrice && (
                              <del className="text-sm text-gray-500">
                                ₹{originalPrice}
                              </del>
                            )}
                          </div>

                          {/* Quantity selector and Add to Cart button */}

                          <div className="flex flex-col gap-2">
                            {/* Quantity Row */}
                            {/* <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-500">
                                Qty:
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                              />
                            </div> */}

                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-500">
                                Qty:
                              </label>

                              <div className="flex items-center rounded-full border border-gray-300 bg-white overflow-hidden">
                                {/* Minus Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(
                                      item.id,
                                      Math.max(1, quantity - 1)
                                    );
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
                                >
                                  <FiMinus size={14} />
                                </button>

                                {/* Quantity Input */}
                                <input
                                  type="number"
                                  min={1}
                                  value={quantity}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const val = Math.max(
                                      1,
                                      Number(e.target.value)
                                    );
                                    handleQuantityChange(item.id, val);
                                  }}
                                  className="w-10 text-center text-sm font-medium text-gray-800 outline-none border-none 
      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none"
                                />

                                {/* Plus Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item.id, quantity + 1);
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Button Row */}
                            <div>
                              {item.out_of_stock === 0 ? (
                                <>
                                  {isProductInCart ? (
                                    <Link
                                      to="/cart"
                                      className="bg-green-600  w-full text-center hover:bg-green-700 text-white px-3 py-2  rounded font-semibold text-sm inline-block"
                                    >
                                      Go to Cart
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleAddToCart({
                                          ...product,
                                          quantity,
                                        })
                                      }
                                      className="bg-yellow-400 w-full text-center hover:bg-yellow-500 text-black px-3  py-2  rounded font-semibold text-sm"
                                    >
                                      Add to Cart
                                    </button>
                                  )}
                                </>
                              ) : (
                                <div className="bg-red-600 w-full text-center hover:bg-red-700 text-white px-3  py-2  rounded font-semibold text-sm">
                                  Out of Stock
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No products available in this offer
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OfferSlider;
