import React from "react";
import { motion } from "framer-motion";

const ProductsSkeleton = () => {
  const skeletonArray = Array.from({ length: 5 });

  return (
    <div className="p-2 space-y-6 mb-5">
      {skeletonArray.map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 p-2 rounded-lg"
        >
          {/* Category Header Skeleton */}
          <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
            <div className="w-32 h-6 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-20 h-8 bg-gray-300 animate-pulse rounded"></div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {skeletonArray.map((__, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-2 animate-pulse"
              >
                <div className="w-full h-32 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 w-full bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsSkeleton;
