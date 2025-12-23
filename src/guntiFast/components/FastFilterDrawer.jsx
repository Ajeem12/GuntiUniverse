import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  maxPrice = 50000,
}) {
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  const priceRanges = [
    { label: "₹1 - ₹99", min: 1, max: 99 },
    { label: "₹100 - ₹499", min: 100, max: 499 },
    { label: "₹500 - ₹999", min: 500, max: 999 },
    { label: "₹1000 - ₹4999", min: 1000, max: 4999 },
    { label: "₹5000 & above", min: 5000, max: maxPrice },
  ];

  const isSelected = (min, max) =>
    filters.priceRanges?.some((r) => r.min === min && r.max === max);

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    const [min, max] = value.split("-").map(Number);

    if (checked) {
      setFilters((prev) => ({
        ...prev,
        priceRanges: [...prev.priceRanges, { min, max }],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        priceRanges: prev.priceRanges.filter(
          (r) => !(r.min === min && r.max === max)
        ),
      }));
    }
  };

  const selectedLabels = () =>
    filters.priceRanges?.map((range) => {
      const match = priceRanges.find(
        (p) => p.min === range.min && p.max === range.max
      );
      return match ? match.label : `₹${range.min} - ₹${range.max}`;
    });

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className={`absolute left-0 top-0 w-80 bg-white h-full p-5 shadow-xl transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="absolute top-4 right-4" onClick={onClose}>
          <CloseIcon />
        </button>

        <h2 className="text-xl font-bold mb-6">Filters</h2>

        {/* PRICE DROPDOWN */}
        <div className="mb-8">
          <button
            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Price Range
              </h3>

              {filters.priceRanges.length > 0 ? (
                <p className="text-xs text-gray-600 mt-1">
                  {selectedLabels().join(", ")}
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

          {isPriceDropdownOpen && (
            <div className="absolute mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
              <div className="p-3 space-y-2">
                {priceRanges.map((range, idx) => (
                  <label
                    key={idx}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      value={`${range.min}-${range.max}`}
                      checked={isSelected(range.min, range.max)}
                      onChange={handlePriceRangeChange}
                      className="mr-3 h-4 w-4 text-amber-400 border-gray-300 rounded"
                    />
                    {range.label}
                  </label>
                ))}
              </div>

              <div className="border-t p-3">
                <button
                  onClick={() => setIsPriceDropdownOpen(false)}
                  className="w-full py-2 bg-amber-400 rounded-lg font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SELECTED TAGS */}
        {filters.priceRanges.length > 0 && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded">
            <div className="flex justify-between mb-2">
              <p className="text-xs font-semibold text-amber-800">
                Selected Ranges:
              </p>
              <button
                onClick={() => setFilters((p) => ({ ...p, priceRanges: [] }))}
                className="text-xs underline text-amber-700"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {filters.priceRanges.map((range, idx) => {
                const match = priceRanges.find(
                  (p) => p.min === range.min && p.max === range.max
                );
                return (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded flex items-center"
                  >
                    {match ? match.label : `₹${range.min} - ₹${range.max}`}
                    <button
                      className="ml-1"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRanges: prev.priceRanges.filter(
                            (r) => !(r.min === range.min && r.max === range.max)
                          ),
                        }))
                      }
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* SORT */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((p) => ({ ...p, sort: e.target.value }))
            }
            className="w-full border p-3 rounded-md"
          >
            <option value="">Default</option>
            <option value="lowToHigh">Price Low → High</option>
            <option value="highToLow">Price High → Low</option>
            <option value="rating">Customer Ratings</option>
            <option value="new">Newest</option>
          </select>
        </div>

        {/* CLEAR ALL */}
        {(filters.priceRanges.length > 0 || filters.sort) && (
          <button
            onClick={() => setFilters({ priceRanges: [], sort: "" })}
            className="w-full mt-6 bg-gray-100 p-2 rounded-md font-medium"
          >
            Clear All Filters
          </button>
        )}

        {/* APPLY */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-amber-400 py-2 rounded-lg font-semibold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
