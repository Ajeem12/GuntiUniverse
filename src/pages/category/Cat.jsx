import React from "react";
import Cat_Product from "./Cat_Product";

const Cat = ({ products }) => {
  return (
    // <div>
    //   {products.length === 0 ? (
    //     <div className="flex flex-col items-center justify-center py-12  ">
    //       <img
    //         src="/img/no-data.gif"
    //         alt="No Data"
    //         className="w-40 h-40 mb-6 animate-bounce"
    //       />
    //       <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
    //         Oops! No Data Found.
    //       </h2>
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
    //       {products.map((product) => (
    //         <Cat_Product key={product.id} product={product} />
    //       ))}
    //     </div>
    //   )}
    // </div>

    <div>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-sm p-2 lg:p-4">
          <img
            src="/img/no-data.gif"
            alt="No Data"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <h2 className="text-lg font-medium text-gray-600">
            No products found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <Cat_Product key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cat;
