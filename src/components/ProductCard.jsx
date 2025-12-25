import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRupeeSign, FaHeart, FaPlus } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";
import hashids from "../util/hashids";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useAddCart } from "../hooks/useAddCart";
import toast from "react-hot-toast";

const ProductCard = ({ item }) => {
  if (!item?.price_details || item.price_details.length === 0) return null;
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const addToCartServer = useAddCart();

  const cart = useCartStore((state) => state.cart);
  const isProductInCart = cart.some(
    (cartItem) => (cartItem.product_id || cartItem.id) === item.product_id
  );

  const encodedId = hashids.encode(item.product_id);
  const priceInfo = item.price_details[0];
  const originalPrice = parseFloat(priceInfo?.price || 0);
  const salesPrice = parseFloat(priceInfo?.sales_price || 0);
  const discount =
    originalPrice > 0
      ? Math.round(((originalPrice - salesPrice) / originalPrice) * 100)
      : 0;

  const productImage = item.images?.[0]?.image
    ? `${import.meta.env.VITE_MEDIA_URL}/products/${item.images[0].image}`
    : "/img/Noimages.png";

  const handleAddToCart = () => {
    const product = {
      product_id: item.product_id,
      name: item.name,
      image: productImage,
      price: salesPrice,
      quantity,
    };

    if (isAuthenticated) {
      addToCartServer.mutate(product, {
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
          id: item.product_id,
          name: item.name,
          image: productImage,
          price: salesPrice,
        },
        quantity
      );
      toast.success("Added to cart!");
    }
  };

  return (
    <div className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-[#FDBD3C] text-black text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center">
          <MdLocalOffer className="mr-1" size={12} />
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      {/* <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10">
        <FaHeart className="text-gray-600 hover:text-red-500" size={14} />
      </button> */}

      {/* Product Image */}
      <Link to={`/product/${item.slug}/${encodedId}`} className="block flex-1">
        <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
          <img
            src={productImage}
            alt={item.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {item.stock_status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {item.category && (
          <span className="inline-block text-xs text-gray-500 mb-1">
            {item.category}
          </span>
        )}

        <Link to={`/product/${item.slug}/${encodedId}`}>
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {item.name}
          </h2>
        </Link>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 flex items-center">
              <FaRupeeSign size={12} className="mr-0.5" />
              {salesPrice.toLocaleString("en-IN")}
            </span>
            {salesPrice < originalPrice && (
              <del className="text-sm text-gray-500 flex items-center">
                <FaRupeeSign size={10} className="mr-0.5" />
                {originalPrice.toLocaleString("en-IN")}
              </del>
            )}
          </div>

          {discount > 0 && (
            <div className="mt-1 text-xs text-green-600 font-medium">
              Save ₹{(originalPrice - salesPrice).toLocaleString("en-IN")}
            </div>
          )}
        </div>
        {/* Quantity & Add to Cart */}
        <div className="mt-3 flex flex-col gap-2">
          {/* <div className="flex items-center gap-2">
            <label htmlFor={`qty-${item.id}`} className="text-xs text-gray-500">
              Qty:
            </label>
            <input
              id={`qty-${item.id}`}
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
            <label className="text-xs text-gray-500">Qty:</label>

            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
              {/* Decrease Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity((q) => Math.max(1, q - 1));
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
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  setQuantity(val);
                }}
                className="w-10 text-center text-sm font-medium text-gray-800 outline-none border-none
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none"
              />

              {/* Increase Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity((q) => Math.min(99, q + 1));
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 active:scale-90 transition"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {item.out_of_stock === 0 ? (
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
            <button
              disabled
              className="w-full bg-red-600 text-white text-sm font-medium py-1.5 rounded hover:bg-red-700 transition cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
