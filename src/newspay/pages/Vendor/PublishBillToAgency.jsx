
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCustomers } from "../../redux/slices/customerSlice";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../redux/slices/newspaperLanguageSlice";
import { fetchCustomerInvoice } from "../../redux/slices/customerInvoice";

const PublishBillToAgency = () => {
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Redux data
  const {
    data: invoiceData = [],
    loading: invoiceLoading,
    error: invoiceError,
  } = useSelector((state) => state.customerInvoice);

  const { customers = [] } = useSelector((state) => state.customer);
  const {
    languages = [],
    selectedLanguage: selectedNewspaperLanguage,
  } = useSelector((state) => state.newspaperLanguage);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchNewspaperLanguages());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    customerNumber: "",
    from_date: "",
    to_date: "",
    language: "",
    newspaperId: "",
  });

  const handleSearch = () => {
    const payload = {
      language: filters.language || "",
      news_paper_id: filters.newspaperId || "",
      customer_id: filters.customerNumber || "",
      from_date: filters.from_date,
      to_date: filters.to_date,
    };
    dispatch(fetchCustomerInvoice(payload));
  };

  const clearFilters = () => {
    setFilters({
      customerNumber: "",
      from_date: "",
      to_date: "",
      language: "",
      newspaperId: "",
    });
    setSelectedLanguage(null);
    setSelectedNewspaper(null);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_details?.name,
      sortable: true,
      width: "190px",
    },
    {
      name: "Customer No.",
      selector: (row) => row.customer_details?.mobile,
      sortable: true,
      width: "160px",
    },
    {
      name: "Payable Month",
      selector: (row) => row.payable_month,
      sortable: true,
      width: "150px",
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.bill_amount}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Published",
      selector: (row) => (row.published === 1 ? "Yes" : "No"),
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.published === 1
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {row.published === 1 ? "Yes" : "No"}
        </span>
      ),
    },
    {
      name: "Paper Name",
      selector: (row) => row.paper_details?.news_paper_name || "N/A",
      sortable: true,
      width: "150px",
    },
  ];

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
        : provided.boxShadow,
      "&:hover": {
        borderColor: "#F59E0B",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-amber-600 mb-6">
          View Customer Invoices
        </h2>

        {/* Filter Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-400 outline-none h-12"
                value={filters.from_date}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    from_date: e.target.value,
                  }))
                }
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-400 outline-none h-12"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    to_date: e.target.value,
                  }))
                }
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Language
              </label>
              <Select
                options={languages.map((l) => ({
                  value: l.id,
                  label: l.language_name,
                }))}
                value={selectedLanguage}
                onChange={(option) => {
                  setSelectedLanguage(option);
                  setFilters((prev) => ({
                    ...prev,
                    language: option ? option.value : "",
                  }));
                  if (option) dispatch(fetchNewspaperLanguageById(option.value));
                }}
                isClearable
                isSearchable
                placeholder="Search language..."
                styles={selectStyles}
              />
            </div>

            {/* Newspaper */}
            {selectedLanguage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Newspaper
                </label>
                <Select
                  options={
                    selectedNewspaperLanguage?.map((n) => ({
                      value: n.id,
                      label: n.news_paper_name,
                    })) || []
                  }
                  value={selectedNewspaper}
                  onChange={(option) => {
                    setSelectedNewspaper(option);
                    setFilters((prev) => ({
                      ...prev,
                      newspaperId: option ? option.value : "",
                    }));
                  }}
                  isClearable
                  isSearchable
                  placeholder="Search newspaper..."
                  styles={selectStyles}
                />
              </div>
            )}

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Customer
              </label>
              <Select
                options={customers.map((c) => ({
                  value: c.id,
                  label: `${c.name} (${c.mobile})`,
                  searchableText: `${c.name} ${c.mobile}`.toLowerCase(),
                }))}
                value={selectedCustomer}
                onChange={(option) => {
                  setSelectedCustomer(option);
                  setFilters((prev) => ({
                    ...prev,
                    customerNumber: option ? option.value : "",
                  }));
                }}
                isClearable
                isSearchable
                placeholder="name or mobile..."
                filterOption={(option, inputValue) =>
                  option.data.searchableText.includes(inputValue.toLowerCase())
                }
                styles={selectStyles}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleSearch}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Search
            </button>
            <button
              onClick={clearFilters}
              className="border border-amber-500 text-amber-600 font-medium px-6 py-2 rounded-lg hover:bg-amber-50 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error */}
        {invoiceError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {invoiceError}
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {invoiceData.length} invoice(s)
        </div>

        <DataTable
          columns={columns}
          data={invoiceData}
          pagination
          striped
          responsive
          progressPending={invoiceLoading}
          highlightOnHover
          noDataComponent={
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">
                No invoices found for selected filters.
              </p>
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                fontWeight: "bold",
                fontSize: "14px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PublishBillToAgency;
