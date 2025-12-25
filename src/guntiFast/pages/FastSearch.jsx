import React from "react";
import { useLocation } from "react-router-dom";
import { IoAdd, IoRemove } from "react-icons/io5";
import { useCMartCartStore } from "../store/cmartCartStore"; // adjust path

const FastSearchPage = () => {
  const { state } = useLocation();

  const query = state?.query || "";
  const products = state?.results?.data || [];
  const { cart, addToCart, updateQty, removeFromCart } = useCMartCartStore();

  return (
    <div className="p-4">
      {/* HEADING */}
      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-6">
        Search Results for <span className="text-primary">"{query}"</span>
      </h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-2">
          <img
            src="/img/no-data.gif"
            alt="No results"
            className="w-52 h-52 opacity-70 mb-6"
          />
          <p className="text-gray-500 text-lg">
            No products found for "<strong>{query}</strong>"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((prod) => {
            const cartItem = cart.find((item) => item.id === prod.id);

            return (
              <div key={prod.id} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex gap-2 items-start">
                  {/* PRODUCT IMAGE */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={
                        prod?.image_details?.[0]?.image
                          ? `${import.meta.env.VITE_MEDIA_URL}/products/${
                              prod.image_details[0].image
                            }`
                          : "/placeholder.png"
                      }
                      alt={prod.product_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* PRODUCT NAME */}
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-3">
                    {prod.product_name}
                  </h3>
                </div>

                {/* PRICE */}
                <p className="text-gray-700 text-sm font-medium mt-2">
                  ₹{prod.c_mart_price}
                </p>

                {/* CART ACTIONS */}
                {cartItem ? (
                  <div className="mt-2 flex items-center justify-between px-6 text-sm font-medium">
                    <button
                      onClick={() => {
                        if (cartItem.quantity === 1) removeFromCart(prod.id);
                        else updateQty(prod.id, cartItem.quantity - 1);
                      }}
                      className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-lg"
                    >
                      <IoRemove />
                    </button>

                    <span>{cartItem.quantity}</span>

                    <button
                      onClick={() => updateQty(prod.id, cartItem.quantity + 1)}
                      className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-lg"
                    >
                      <IoAdd />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      addToCart({
                        id: prod.id,
                        name: prod.product_name,
                        price: prod.c_mart_price,
                        image: prod?.image_details?.[0]?.image,
                      })
                    }
                    className="mt-2 w-full bg-black text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FastSearchPage;
