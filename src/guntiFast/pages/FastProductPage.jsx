import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams } from "react-router-dom";
import useFastCatProducts from "../hooks/useFastCatProduct";
import { useCMartCartStore } from "../store/cmartCartStore";
import CategoryBar from "../components/FastCategoryBar";
import FilterDrawer from "../components/FastFilterDrawer";
import { IoAdd, IoFilter, IoRemove } from "react-icons/io5";
import { GiCoffeeCup } from "react-icons/gi";
import { IoIosSunny } from "react-icons/io";
import { LuMoonStar } from "react-icons/lu";

export default function ProductPage() {
  const { id } = useParams();
  const { data, isLoading } = useFastCatProducts(id);

  const categories = data?.categories || [];
  const allProducts = data?.data || [];

  const [activeCat, setActiveCat] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    priceRanges: [],
    sort: "",
  });

  const { cart, addToCart, updateQty, removeFromCart } = useCMartCartStore();

  if (isLoading) return <div>Loading…</div>;

  let filteredProducts = activeCat
    ? allProducts.filter((p) =>
        p.c_martvarient_details?.some(
          (variant) => variant.category_id === activeCat
        )
      )
    : allProducts;

  // Price Filters
  if (filters.priceRanges.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      filters.priceRanges.some(
        (range) => p.c_mart_price >= range.min && p.c_mart_price <= range.max
      )
    );
  }

  // Sort
  if (filters.sort === "new") {
    filteredProducts = filteredProducts.sort((a, b) => b.id - a.id);
  } else if (filters.sort === "lowToHigh") {
    filteredProducts = filteredProducts.sort(
      (a, b) => a.c_mart_price - b.c_mart_price
    );
  } else if (filters.sort === "highToLow") {
    filteredProducts = filteredProducts.sort(
      (a, b) => b.c_mart_price - a.c_mart_price
    );
  }

  const getCartQty = (prodId) =>
    cart.find((item) => item.id === prodId)?.quantity || 0;

  return (
    <div className="min-h-screen">
      <CategoryBar
        categories={categories}
        activeCat={activeCat}
        onSelect={(id) => setActiveCat(id)}
        fastCategoryId={id}
        onOpenFilter={() => setDrawerOpen(true)}
      />

      {/* Product List */}
      <div className="mt-4 space-y-4 p-2 pb-32">
        {filteredProducts.map((item) => {
          const qty = getCartQty(item.id);

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl flex justify-between items-center border"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_MEDIA_URL}/products/${
                    item.image_details?.[0]?.image
                  }`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold max-w-[140px] line-clamp-2">
                    {item.product_name}
                  </h3>
                  <p className="text-gray-600">₹{item.c_mart_price}</p>
                </div>
              </div>

              {/* Qty */}
              {qty === 0 ? (
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.product_name,
                      price: item.c_mart_price,
                      image: item.image_details?.[0]?.image,
                    })
                  }
                  className="bg-amber-400 px-5 py-2 rounded-xl shadow"
                >
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      qty === 1
                        ? removeFromCart(item.id)
                        : updateQty(item.id, qty - 1)
                    }
                    className="bg-red-200 w-7 h-7 rounded-full flex justify-center items-center"
                  >
                    <IoRemove />
                  </button>
                  <span className="w-6 text-center">{qty}</span>
                  <button
                    onClick={() => updateQty(item.id, qty + 1)}
                    className="bg-green-200 w-7 h-7 rounded-full flex justify-center items-center"
                  >
                    <IoAdd />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
