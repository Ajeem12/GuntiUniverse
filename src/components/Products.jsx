import React, { useMemo } from "react";
import { useHomeProducts } from "../hooks/useHomeProducts";
import ProductsSkeleton from "./ProductsSkeleton";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import hashids from "../util/hashids";
import useMediaQuery from "../util/mobile";
import { motion } from "framer-motion";

const Products = () => {
  // ============================================
  // HOOKS
  // ============================================
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const visibleCount = isSmallScreen ? 6 : 5;

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useHomeProducts();

  // ============================================
  // MERGE ALL PAGES DATA
  // ============================================
  const allProducts = useMemo(() => {
    if (!data?.pages) return {};

    const merged = {};

    data.pages.forEach((page) => {
      Object.entries(page || {}).forEach(([catName, catObj]) => {
        const [catId, products] = Object.entries(catObj)[0];

        if (!merged[catName]) {
          merged[catName] = { [catId]: [] };
        }

        // Avoid duplicates by checking product IDs
        const existingIds = new Set(
          merged[catName][catId]?.map((p) => p.id) || []
        );

        const newProducts = products.filter((p) => !existingIds.has(p.id));
        merged[catName][catId] = [
          ...(merged[catName][catId] || []),
          ...newProducts,
        ];
      });
    });

    return merged;
  }, [data]);

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return <ProductsSkeleton />;
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">Failed to load products</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (Object.keys(allProducts).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  // ============================================
  // RENDER PRODUCTS
  // ============================================
  return (
    <div className="p-2 space-y-6 mb-8">
      {Object.entries(allProducts).map(([categoryName, categoryObj], index) => {
        const [rawCatId, products] = Object.entries(categoryObj)[0];
        const encodedId = hashids.encode(Number(rawCatId));

        if (!products?.length) return null;

        return (
          <motion.section
            key={categoryName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-indigo-50 p-2 rounded-lg"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-800">
                {categoryName}
              </h2>
              <Link
                to={`/category/${categoryName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}?catId=${encodedId}`}
                className="bg-[#FDBD3C] text-black py-2 px-4 rounded-md font-medium hover:bg-[#ff7755] transition-colors duration-200"
                aria-label={`View all ${categoryName} products`}
              >
                View All
              </Link>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {products.slice(0, visibleCount).map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.1 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        );
      })}

      {/* Loading Skeleton */}
      {isFetchingNextPage && (
        <div className="mt-6">
          <ProductsSkeleton />
        </div>
      )}

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md hover:bg-gray-950  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Load More"
            )}
          </button>
        )}
      </div>

      {/* End of Results */}
      {!hasNextPage && Object.keys(allProducts).length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg font-medium">
            You've reached the end of the products
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
