import { useParams, Link } from "react-router-dom";
import { useOfferProducts } from "../hooks/useOfferProducts";
import hashids from "../util/hashids";
import { Rating } from "@mui/material";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useAddCart } from "../hooks/useAddCart";
import toast from "react-hot-toast";
import { useState } from "react";

import { FiPlus, FiMinus } from "react-icons/fi";
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

const OfferItem = () => {
  const { offerName } = useParams();
  const { data } = useOfferProducts();

  const offer = data?.find((o) => slugify(o.offer_name) === offerName);

  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToCartServer = useAddCart();

  const cart = useCartStore((state) => state.cart);
  const [quantities, setQuantities] = useState({});

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

  if (!offer?.products || offer.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 rounded-xl p-8 mx-4 ">
        <div className="w-48 h-48 bg-[#FDBD3C]/10 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-[#FDBD3C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          This offer doesn't contain any products at the moment. Check out our
          other amazing offers!
        </p>
        <Link
          to="/offers"
          className="px-6 py-3 bg-[#FDBD3C] text-gray-900 font-medium rounded-lg hover:bg-[#FDBD3C]/90 transition-all shadow-md hover:shadow-lg"
        >
          Browse All Offers
        </Link>
      </div>
    );
  }

  const offerImage = offer.link
    ? `${import.meta.env.VITE_MEDIA_URL}/offers/${offer.link}`
    : "/img/Noimages.png";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      {/* Offer Header with Gradient Background */}
      <div className="bg-gradient-to-r from-[#FDBD3C]/10 to-[#FDBD3C]/5 rounded-2xl p-6 mb-10 border border-[#FDBD3C]/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {offerImage && (
            <div className="w-full md:w-1/4 lg:w-1/5 rounded-xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={offerImage}
                alt={offer.offer_name}
                className="w-full h-full max-h-48 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/Noimages.png";
                }}
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {offer.offer_name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-4 py-1.5 bg-[#FDBD3C] text-gray-900 font-semibold rounded-full shadow-sm">
                Limited Time Offer
              </span>
              <span className="px-3 py-1 bg-white text-gray-700 font-medium rounded-full border border-gray-200">
                {offer.products.length}{" "}
                {offer.products.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-gray-700 max-w-2xl">
              Don't miss out on these exclusive deals! Special prices for a
              limited time only.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {offer.products.map((item) => {
          const isInCart = cart.some(
            (cartItem) => (cartItem.product_id || cartItem.id) === item.id
          );
          const encodedId = hashids.encode(item.id);
          const variant = item.varient_details?.[0];
          const originalPrice = parseFloat(variant?.product_price || 0);
          const salesPrice = parseFloat(variant?.sales_price || 0);
          const averageRating = parseFloat(item?.rating || 0);

          const calculatedDiscount =
            originalPrice > 0
              ? Math.round(((originalPrice - salesPrice) / originalPrice) * 100)
              : 0;

          const imageUrl = item.image_details?.[0]?.image
            ? `${import.meta.env.VITE_MEDIA_URL}/products/${
                item.image_details[0].image
              }`
            : "/img/Noimages.png";

          return (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FDBD3C]/30"
            >
              {/* Only Image wrapped with Link */}
              <Link
                to={`/product/${item.product_slug}/${encodedId}`}
                className="block relative aspect-square overflow-hidden"
              >
                <img
                  src={imageUrl}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/Noimages.png";
                  }}
                  alt={item.product_name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {calculatedDiscount > 0 && (
                  <span className="absolute top-3 right-3 bg-[#FDBD3C] text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {calculatedDiscount}% OFF
                  </span>
                )}
              </Link>
              {/* Product Details */}
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.product_name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {averageRating ? (
                    <>
                      <Rating
                        value={averageRating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <span className="text-xs text-gray-500 ml-1">
                        ({averageRating.toFixed(1)})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No ratings yet
                    </span>
                  )}
                </div>
                {/* Pricing */}
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{salesPrice.toLocaleString()}
                  </span>
                  {salesPrice < originalPrice && (
                    <del className="text-sm text-gray-400">
                      ₹{originalPrice.toLocaleString()}
                    </del>
                  )}
                </div>
                {/* Example Button - no navigation triggered */}
                <div className="flex flex-col gap-2">
                  {/* Quantity Input */}
                  {/* <div className="flex items-center gap-2">
                    <label className="text-gray-900">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={quantities[item.id] || 1}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                    />
                  </div> */}

                  <div className="flex items-center gap-2">
                    <label className="text-gray-900 text-sm font-medium">
                      Qty:
                    </label>

                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                      {/* Minus */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const current = quantities[item.id] || 1;
                          handleQuantityChange(
                            item.id,
                            Math.max(1, current - 1)
                          );
                        }}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        <FiMinus size={14} />
                      </button>

                      {/* Input */}
                      <input
                        type="number"
                        min={1}
                        value={quantities[item.id] || 1}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                        className="w-12 text-center text-sm outline-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />

                      {/* Plus */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const current = quantities[item.id] || 1;
                          handleQuantityChange(item.id, current + 1);
                        }}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart / Go to Cart Button */}
                  <div>
                    {item.out_of_stock === 0 ? (
                      <>
                        {isInCart ? (
                          <Link
                            to="/cart"
                            className="w-full bg-green-600 text-white text-sm font-medium py-1.5 rounded hover:bg-green-700 transition text-center block"
                          >
                            Go to Cart
                          </Link>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart({
                                product_id: item.id,
                                name: item.product_name,
                                image: imageUrl,
                                price: salesPrice,
                              });
                            }}
                            className="bg-[#FDBD3C] hover:bg-[#e6b631] text-gray-900 px-4  py-2  rounded font-medium transition w-full"
                          >
                            Add to Cart
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="bg-red-600 hover:bg-red-700 text-gray-100 px-4  py-2  rounded font-medium transition w-full">
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferItem;
