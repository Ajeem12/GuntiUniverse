
import {
  Add,
  Remove,
  Star,
  LocalShipping,
  Verified,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ZoomableImage from "./ZoomableImage";
import ProductTabs from "../components/ProductTabs";
import { useProductDetails } from "../hooks/useProductDetails";
import Loader from "../components/Loader";
import { Rating } from "@mui/material";
import hashids from "../util/hashids";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import { usePostalCode } from "../hooks/usePostalCode";
import { useAddCart } from "../hooks/useAddCart";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SimilarProducts from "../components/SimilarProducts";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import Breadcrumbs from "../components/Breadcrumb";
const ProductPage = () => {
  const { id: hashedId } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, setBuyNowProduct, decreaseQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();

  const decoded = hashids.decode(hashedId);
  const productId =
    Array.isArray(decoded) && decoded.length > 0 ? decoded[0] : null;

  const { data, isLoading, error } = useProductDetails(productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [submittedPincode, setSubmittedPincode] = useState(null);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const [pincodeAvailable, setPincodeAvailable] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { mutate: addToCartServer } = useAddCart();

  const isProductInCart = cart.some(
    (item) => (item.product_id || item.id) === productId
  );

  const handleBuyNow = () => {
    setBuyNowProduct({
      id: data.id,
      name: data.product_name,
      image: images[0],
      price: salesPrice,
      quantity,
    });

    if (isAuthenticated) {
      navigate("/order?buyNow=true");
    } else {
      openLoginModal();
    }
  };

  const { data: postalCodeData } = usePostalCode(submittedPincode);

  const handlePincodeCheck = () => {
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus("Please enter a valid 6-digit pincode.");
      setDeliveryCharge(null);
      return;
    }
    setSubmittedPincode(pincode);
  };

  useEffect(() => {
    if (!postalCodeData) return;

    if (postalCodeData.message === "aviliable") {
      setPincodeStatus("Delivery available to your location!");
      setDeliveryCharge(postalCodeData.data.delivery_charge);
      setPincodeAvailable(true);
    } else {
      setPincodeStatus("Delivery not available to this pincode");
      setDeliveryCharge(null);
      setPincodeAvailable(false);
    }
  }, [postalCodeData]);

  if (!productId) {
    return (
      <div className="p-6 text-red-600 text-lg font-semibold">
        Invalid product ID.
      </div>
    );
  }

  if (isLoading) return <Loader />;
  if (error || !data) {
    return (
      <div className="p-6 text-red-600 text-lg font-semibold">
        Failed to load product.
      </div>
    );
  }

  const images =
    data.image_details?.map(
      (img) => `${import.meta.env.VITE_MEDIA_URL}/products/${img.image}`
    ) || [];
  const variant = data.varient_details?.[0];
  const price = variant?.product_price || data.product_price;
  const salesPrice = variant?.sales_price || data.sales_price;


  const handleAddToCart = () => {
    const product = {
      product_id: data.id,
      name: data.product_name,
      image: images[0],
      price: salesPrice,
      quantity,
    };

    if (isAuthenticated) {
      addToCartServer(product, {
        onSuccess: () => {
          setIsAddedToCart(true);
          toast.success("Added to cart!");
        },
        onError: () => {
          toast.error("Failed to add to cart");
        },
      });
    } else {
      addToCart(
        {
          id: data.id,
          name: data.product_name,
          image: images[0],
          price: salesPrice,
        },
        quantity
      );
      setIsAddedToCart(true);
    }
  };

  const catId = data?.category_id;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-0">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="py-4 bg-white text-sm text-gray-500">
          {/* <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Breadcrumb">
    <ProductBreadcrumb catId={catId}  />
  </nav> */}
        </div>


        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-sm p-6">
          {/* Image Gallery */}
          <div className="flex-1">
            <div className="sticky top-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <ZoomableImage
                  src={images[selectedImage]}
                  alt="Product"
                  className="rounded-md object-contain h  w-full max-w-md mx-auto"
                />
                {price !== salesPrice && (
                  <span className="absolute top-2 right-2 bg-[#FDBD3C] text-black text-xs font-semibold px-2 py-1 rounded z-10">
                    {Math.round(((price - salesPrice) / price) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={`Thumb ${index + 1}`}
                        className={`w-20 h-20 object-contain rounded-md cursor-pointer border-2 transition-all duration-200 ${selectedImage === index
                          ? "border-red-500 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data.product_name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  {data.average_rating ? (
                    <>
                      <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
                        <Rating
                          value={data.average_rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          className="text-amber-400"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {data.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {data.rating_count} Ratings
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No ratings yet
                    </span>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{salesPrice.toLocaleString()}
                  </span>
                  {price !== salesPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        {Math.round(((price - salesPrice) / price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                {price !== salesPrice && (
                  <div className="mt-1 text-sm text-gray-500">
                    Inclusive of all taxes
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Highlights
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {data.description && (
                    <li
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  )}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Remove className="text-gray-600" />
                  </button>
                  <span className="w-12 h-12 border rounded-md flex items-center justify-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Add className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Delivery Check */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <LocalShipping className="text-yellow-500" />
                  Delivery Options
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    maxLength={6}
                  />
                  <button
                    onClick={handlePincodeCheck}
                    className="px-6 py-3 bg-[#3C3A3B] text-[#FDC754]  rounded-lg transition-colors font-medium"
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus && (
                  <div
                    className={`flex items-center gap-2 text-sm ${pincodeAvailable ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {pincodeAvailable ? (
                      <Verified className="text-green-500" />
                    ) : null}
                    {pincodeStatus}
                    {pincodeAvailable && deliveryCharge !== null && (
                      <span className="text-gray-600 ml-2">
                        (Delivery Charge: ₹{deliveryCharge})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="mb-4 border-t border-gray-200 pt-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Delivery Information
                </h3>
                <p className="text-xs text-gray-600">
                  {data.delivery_description &&
                    data.delivery_description.trim() !== ""
                    ? data.delivery_description
                    : "Standard Delivery: 3-5 business days"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {data.out_of_stock === 0 ? (
                  <>
                    {isProductInCart ? (
                      <button
                        onClick={() => navigate("/cart")}
                        className="flex-1 py-3 bg-red-600 text-white rounded-lg  transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        VIEW CART
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 py-3 bg-[#3C3A3B] text-[#FDC754] rounded-lg  transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        ADD TO CART
                      </button>
                    )}
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                    >
                      BUY NOW
                    </button>
                  </>
                ) : (
                  <div
                    className="flex items-center justify-center py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    OUT OF STOCK
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex gap-4 sm:hidden z-50 border-t border-gray-200">
          {data.out_of_stock === 0 ? (
            <>
              {isProductInCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 py-3 bg-[#3C3A3B] text-[#FDC754]  rounded-lg font-medium"
                >
                  VIEW CART
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-[#3C3A3B] text-[#FDC754] rounded-lg font-medium"
                >
                  ADD TO CART
                </button>
              )}
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-amber-500 text-white rounded-lg font-medium"
              >
                BUY NOW
              </button>
            </>
          ) : (
            <button
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium"
            >
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>

      {/* Product Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <ProductTabs
          longdes={data.long_description}
          id={data.id}
          specifications={data.specifications}
          reviews={data.reviews}
        />
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 mt-8">
        <SimilarProducts />
      </div>
    </div>
  );
};

export default ProductPage;



