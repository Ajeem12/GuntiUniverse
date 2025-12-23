
import React from "react";

const SubCategory = ({ subCategories, selectedId, onSelect }) => {
  return (
    <div className="w-full">
      {subCategories.length === 0 ? (
        <p className="text-gray-500 italic text-center py-6">
          No categories available
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subCategories.map((category) => {
            const isSelected = selectedId === category.cat_id;

            return (
              <div
                key={category.cat_id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(category.cat_id, category.cat_name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSelect(category.cat_id, category.cat_name);
                  }
                }}
                className={`flex flex-col items-center bg-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                  isSelected ? "ring-2 ring-gray-800" : ""
                }`}
              >
                <div className="w-20 h-20 mb-2 rounded-lg overflow-hidden">
                  <img
                    src={
                      category.image
                        ? `${import.meta.env.VITE_MEDIA_URL}/categories/${category.image}`
                        : "/img/Nocat.png"
                    }
                    alt={category.cat_name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-center text-sm font-medium text-gray-800">
                  {category.cat_name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubCategory;
