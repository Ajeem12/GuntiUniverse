import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const Filter = ({
  filterCriteria,
  onFilterChange,
  isCollapsed,
  toggleCollapse,
  minPrice = 1,
  maxPrice = 50000,
  isBulk,
  onBulkFilterChange,
}) => {
  // Define price ranges
  const priceRanges = [
    { label: "₹1 - ₹99", min: 1, max: 99 },
    { label: "₹100 - ₹499", min: 100, max: 499 },
    { label: "₹500 - ₹999", min: 500, max: 999 },
    { label: "₹1000 - ₹4999", min: 1000, max: 4999 },
    { label: "₹5000 & above", min: 5000, max: maxPrice },
  ];

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    const updatedCategories = filterCriteria.categories.includes(value)
      ? filterCriteria.categories.filter((category) => category !== value)
      : [...filterCriteria.categories, value];
    onFilterChange({ categories: updatedCategories });
  };

  const handlePriceRangeChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add this price range to selected ranges
      const [min, max] = value.split("-").map(Number);
      const updatedRanges = [...filterCriteria.priceRanges, { min, max }];
      onFilterChange({ priceRanges: updatedRanges });
    } else {
      // Remove this price range from selected ranges
      const [min, max] = value.split("-").map(Number);
      const updatedRanges = filterCriteria.priceRanges.filter(
        (range) => !(range.min === min && range.max === max)
      );
      onFilterChange({ priceRanges: updatedRanges });
    }
  };

  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value });
  };

  // Check if a price range is selected
  const isPriceRangeSelected = (min, max) => {
    return filterCriteria.priceRanges?.some(
      (range) => range.min === min && range.max === max
    );
  };

  // Get selected price ranges labels
  const getSelectedPriceRangesLabels = () => {
    return filterCriteria.priceRanges?.map((range) => {
      const priceRange = priceRanges.find(
        (r) => r.min === range.min && r.max === range.max
      );
      return priceRange
        ? priceRange.label
        : `₹${range.min} - ₹${
            range.max === maxPrice ? `${range.max}+` : range.max
          }`;
    });
  };

  return (
    <>
      {!isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed bottom-24 left-6 z-30 bg-[#FDBD3C] text-black p-2 rounded-full shadow-md sm:hidden"
        >
          <span aria-label="Open Filters" className="flex items-center gap-1">
            <FilterAltIcon /> Filter
          </span>
        </button>
      )}

      <div
        className={`fixed sm:sticky top-0 left-0 z-50 md:z-30 sm:top-36 sm:left-6 h-full w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 sm:transform-none sm:w-full sm:shadow-none sm:bg-transparent sm:h-auto ${
          isCollapsed ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <button
          onClick={toggleCollapse}
          className="absolute top-8 right-4 z-50 text-black sm:hidden"
          aria-label="Close Filters"
        >
          <CloseIcon className="text-black" />
        </button>

        <div className="bg-white p-6 sm:shadow-lg sm:rounded-lg sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>

          {/* Price Range Section - Dropdown Style */}
          <div className="mb-8">
            <div className="relative">
              <button
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Price Range
                  </h3>
                  {filterCriteria.priceRanges?.length > 0 ? (
                    <p className="text-xs text-gray-600 mt-1">
                      {getSelectedPriceRangesLabels().join(", ")}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Select price ranges
                    </p>
                  )}
                </div>
                {isPriceDropdownOpen ? (
                  <ArrowDropUpIcon className="text-gray-400" />
                ) : (
                  <ArrowDropDownIcon className="text-gray-400" />
                )}
              </button>

              {/* Dropdown Content */}
              {isPriceDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-3 space-y-2">
                    {priceRanges.map((range, index) => (
                      <label
                        key={index}
                        className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          value={`${range.min}-${range.max}`}
                          checked={isPriceRangeSelected(range.min, range.max)}
                          onChange={handlePriceRangeChange}
                          className="mr-3 h-4 w-4 text-[#FDBD3C] focus:ring-[#FDBD3C] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div className="border-t border-gray-200 p-3">
                    <button
                      onClick={() => setIsPriceDropdownOpen(false)}
                      className="w-full py-2 bg-[#FDBD3C] text-gray-800 rounded-md hover:bg-amber-400 transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Show selected price ranges as tags */}
            {filterCriteria.priceRanges?.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-amber-800">
                    Selected Ranges:
                  </p>
                  <button
                    onClick={() => onFilterChange({ priceRanges: [] })}
                    className="text-xs text-amber-700 hover:text-amber-900 underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {filterCriteria.priceRanges.map((range, index) => {
                    const priceRange = priceRanges.find(
                      (r) => r.min === range.min && r.max === range.max
                    );
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded"
                      >
                        {priceRange
                          ? priceRange.label
                          : `₹${range.min} - ₹${
                              range.max === maxPrice
                                ? `${range.max}+`
                                : range.max
                            }`}
                        <button
                          onClick={() => {
                            const updatedRanges =
                              filterCriteria.priceRanges.filter(
                                (r) =>
                                  !(r.min === range.min && r.max === range.max)
                              );
                            onFilterChange({ priceRanges: updatedRanges });
                          }}
                          className="ml-1 text-amber-600 hover:text-amber-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sort By Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Sort By</h3>
            <select
              value={filterCriteria.sort}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FDBD3C] focus:border-transparent"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Ratings</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Bulk Offers Section */}
          <div className="mb-4 flex justify-start">
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-[#FDBD3C] focus:ring-[#FDBD3C] border-gray-300 rounded"
                checked={isBulk === 1}
                onChange={(e) =>
                  onBulkFilterChange(e.target.checked ? 1 : null)
                }
              />
              <span className="text-sm font-medium text-gray-700">
                Bulk offers
              </span>
            </label>
          </div>

          {/* Clear Filters Button */}
          {(filterCriteria.priceRanges?.length > 0 ||
            filterCriteria.sort ||
            isBulk === 1) && (
            <button
              onClick={() => {
                onFilterChange({ priceRanges: [], sort: "" });
                onBulkFilterChange(null);
                setIsPriceDropdownOpen(false);
              }}
              className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleCollapse}
        ></div>
      )}
    </>
  );
};

export default Filter;
