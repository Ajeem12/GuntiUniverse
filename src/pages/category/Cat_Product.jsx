import React, { useState } from "react";
import { Link } from "react-router-dom";
import hashids from "../../util/hashids";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useAddCart } from "../../hooks/useAddCart";
import toast from "react-hot-toast";
import { FiPlus, FiMinus } from "react-icons/fi";

const Cat_Product = ({ product }) => {
  const outOfStock = product?.out_of_stock;

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No product available</div>
    );
  }

  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const addToCartServer = useAddCart();
  const cart = useCartStore((state) => state.cart);
  const isProductInCart = cart.some(
    (cartItem) => (cartItem.product_id || cartItem.id) === product.id
  );
  const encodedId = hashids.encode(product.id);
  const productImage = product.image_details?.[0]?.image
    ? `${import.meta.env.VITE_MEDIA_URL}/products/${
        product.image_details[0].image
      }`
    : "/img/Noimages.png";
  const price = parseFloat(product.varient_details?.[0]?.product_price || 0);
  const salePrice = parseFloat(product.varient_details?.[0]?.sales_price || 0);

  const handleAddToCart = () => {
    const productToAdd = {
      product_id: product.id,
      name: product.product_name,
      image: productImage,
      price: salePrice,
      quantity,
    };

    if (isAuthenticated) {
      addToCartServer.mutate(productToAdd, {
        onSuccess: () => {
          toast.success("Added to cart!");
        },
        onError: () => {
          toast.error("Failed to add to cart");
        },
      });
    } else {
      addToCart(
        {
          id: product.id,
          name: product.product_name,
          image: productImage,
          price: salePrice,
        },
        quantity
      );
      toast.success("Added to cart!");
    }
  };

  const averageRating = parseFloat(product?.average_rating || 0);
  const hasDiscount = price > 0 && salePrice > 0 && price > salePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-200 h-full flex flex-col hover:shadow-sm">
        {/* Image Container */}
        <div className="relative pt-[100%] bg-gray-50">
          <Link
            to={`/product/${product.product_slug}/${encodedId}`}
            className="block h-full"
          >
            <img
              src={productImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/Noimages.png";
              }}
              alt={product.product_name}
              className="absolute top-0 left-0 w-full h-full object-contain p-4"
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-sm">
                {discountPercentage}% OFF
              </div>
            )}
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-3 flex-1 flex flex-col">
          <h2 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
            {product.product_name}
          </h2>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center mb-2">
              <div className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded-sm flex items-center mr-2">
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <FiStar className="ml-0.5" size={10} />
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating_count || 0})
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-gray-900 flex items-center">
                <FaRupeeSign size={10} className="mr-0.5" />
                {salePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <del className="text-xs text-gray-500 flex items-center">
                  <FaRupeeSign size={8} className="mr-0.5" />
                  {price.toLocaleString()}
                </del>
              )}
            </div>
            {hasDiscount && (
              <div className="text-xs text-green-600 mt-1">
                Save <FaRupeeSign size={8} className="inline mr-0.5" />
                {(price - salePrice).toLocaleString()}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mt-3 flex flex-col gap-2">
              {/* <div className="flex items-center gap-2">
                <label
                  htmlFor={`qty-${product.id}`}
                  className="text-xs text-gray-500"
                >
                  Qty:
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value || "1")))
                  }
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                />
              </div> */}

              <div className="flex items-center gap-2">
                <label
                  htmlFor={`qty-${product.id}`}
                  className="text-xs text-gray-500"
                >
                  Qty:
                </label>

                <div className="flex items-center rounded-full border border-gray-300 bg-white overflow-hidden">
                  {/* Minus Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity((prev) => Math.max(1, prev - 1));
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
                  >
                    <FiMinus size={14} />
                  </button>

                  {/* Number Display/Input */}
                  <input
                    id={`qty-${product.id}`}
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value || "1")))
                    }
                    className="w-10 text-center text-sm font-medium text-gray-800 outline-none border-none 
      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none"
                  />

                  {/* Plus Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity((prev) => Math.min(99, prev + 1));
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {outOfStock === 0 ? (
                <>
                  {isProductInCart ? (
                    <Link
                      to="/cart"
                      className="w-full bg-green-600 text-white text-sm font-medium py-1.5 rounded hover:bg-green-700 transition text-center block"
                    >
                      Go to Cart
                    </Link>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-black text-white text-sm font-medium py-1.5 rounded hover:bg-gray-800 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full flex items-center justify-center bg-red-600 text-white text-sm font-medium py-1.5 rounded hover:bg-red-800 transition">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cat_Product;
