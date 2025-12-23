import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewspapers } from "../redux/slices/newspaperSlice";
import { submitVendorNewspaperPrices,fetchVendorNewspaperPrices } from "../redux/slices/vendorNewspaperSlice";
import toast from "react-hot-toast";
import { FiBook, FiDollarSign, FiSave, FiLoader } from "react-icons/fi";
import DataTable from "react-data-table-component";
const NewspaperPriceInput = () => {
  const dispatch = useDispatch();
  const { newspapers = [], loading: newspapersLoading } = useSelector(
    (state) => state.newspaper
  );
  const { loading: submitting ,prices,error} = useSelector((state) => state.vendorNewspaper);
  const [selectedPrices, setSelectedPrices] = useState({});
  
  const mappedPrices = prices.map((item) => {
    const paper = item.paper_details[0] || {};
    return {
      id: item.id,
      newspaperName: paper.news_paper_name || "N/A",
      price: item.price,
      perDayPrice: paper.per_day_price || "N/A",
      createdAt: new Date(item.created_at).toLocaleString(),
      updatedAt: new Date(item.updated_at).toLocaleString(),
    };
  });

  const columns = [
    {
      name: "Newspaper",
      selector: (row) => row.newspaperName,
      sortable: true,
        minWidth: "30px",
    },
     
    {
      name: "Per Day Price",
      selector: (row) => row.perDayPrice,
      sortable: true,
      right: true,
        minWidth: "30px",
    },
    
  ];


  
  useEffect(() => {
    dispatch(fetchNewspapers());
     dispatch(fetchVendorNewspaperPrices());
  }, [dispatch]);

  const handleCheckboxChange = (id) => {
    setSelectedPrices((prev) => {
      if (prev[id]) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      } else {
        return { ...prev, [id]: "" };
      }
    });
  };

  const handlePriceChange = (id, price) => {
    // Allow only numbers and decimal point
    const validatedPrice = price.replace(/[^0-9.]/g, '');
    setSelectedPrices((prev) => ({
      ...prev,
      [id]: validatedPrice,
    }));
  };

  const handleSelectAll = () => {
    if (newspapers.length === 0) return;
    
    const allSelected = newspapers.length === Object.keys(selectedPrices).length;
    
    if (allSelected) {
      setSelectedPrices({});
    } else {
      const allPapers = {};
      newspapers.forEach(paper => {
        allPapers[paper.id] = "";
      });
      setSelectedPrices(allPapers);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const papersWithPrices = Object.entries(selectedPrices)
    .filter(([_, price]) => price !== "" && !isNaN(parseFloat(price)))
    .map(([id, price]) => ({
      paperId: parseInt(id),
      price: parseFloat(price),
    }));

  if (papersWithPrices.length === 0) {
    toast.error("Please select at least one newspaper and enter valid prices.");
    return;
  }

  const formData = new FormData();

  papersWithPrices.forEach((paper, index) => {
    formData.append(`new_papers_array[${index}][paperId]`, paper.paperId);
    formData.append(`new_papers_array[${index}][price]`, paper.price);
  });

  try {
    await dispatch(submitVendorNewspaperPrices(formData)).unwrap();
    toast.success("Prices submitted successfully!");
    setSelectedPrices({});
  } catch (err) {
    toast.error(err?.message || "Failed to submit prices");
  }
};


  const selectedCount = Object.keys(selectedPrices).length;
  const totalCount = newspapers.length;

  return (
    <div className=" bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FiBook className="mr-3" /> Newspaper Pricing
            </h1>
            <p className="text-amber-100 mt-1">Set prices for your newspaper distribution</p>
          </div>
          <div className="bg-amber-700 text-amber-100 px-3 py-1 rounded-full text-sm">
            {selectedCount} of {totalCount} selected
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {newspapersLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : newspapers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiBook className="mx-auto text-4xl text-gray-300 mb-3" />
            <p>No newspapers available.</p>
          </div>
        ) : (
          <>
            {/* Select All Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                <input
                  type="checkbox"
                  checked={selectedCount === totalCount && totalCount > 0}
                  onChange={handleSelectAll}
                  className="mr-2 h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
                />
                {selectedCount === totalCount ? "Deselect All" : "Select All"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newspapers.map((paper) => (
                  <div
                    key={paper.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      selectedPrices[paper.id] 
                        ? "border-amber-400 bg-amber-50 shadow-sm" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPrices.hasOwnProperty(paper.id)}
                        onChange={() => handleCheckboxChange(paper.id)}
                        className="mt-1 h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {paper.news_paper_name}
                        </span>
                        
                        {selectedPrices.hasOwnProperty(paper.id) && (
                          <div className="mt-3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             
                            </div>
                            <input
                              type="text"
                              placeholder="0.00"
                              className="pl-8 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                              value={selectedPrices[paper.id]}
                              onChange={(e) => handlePriceChange(paper.id, e.target.value)}
                              inputMode="decimal"
                              pattern="[0-9]*\.?[0-9]*"
                            />
                            <span className="absolute right-3 top-2 text-gray-500">₹</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting || selectedCount === 0}
                  className={`flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
                    submitting || selectedCount === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Saving Prices...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Prices ({selectedCount} newspaper{selectedCount !== 1 ? 's' : ''})
                    </>
                  )}
                </button>
                
                {selectedCount > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Remember to enter prices for all selected newspapers before saving.
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Vendor Newspaper Prices</h2>
      <DataTable
        columns={columns}
        data={mappedPrices}
        pagination
        highlightOnHover
        striped
        noDataComponent={
          <div className="text-center py-8 text-gray-500">
            <p>No prices found.</p>
          </div>
        }
      />
    </div>
    </div>
  );
};

export default NewspaperPriceInput;