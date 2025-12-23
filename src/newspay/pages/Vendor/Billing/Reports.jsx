import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { FiFilter } from "react-icons/fi";
import Select from "react-select";
import { fetchLineData } from "../../../redux/slices/lineSlice";
import { fetchCustomers } from "../../../redux/slices/customerSlice";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../../redux/slices/newspaperLanguageSlice";
import { createLineWiseCollection } from "../../../redux/slices/lineWiseCollectionSlice";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const Reports = () => {
  const dispatch = useDispatch();

  const { lineData, loading: lineLoading, error: lineError } = useSelector(
    (state) => state.line
  );
  const { data, loading, error } = useSelector((state) => state.lineWise);

  const { customers = [] } = useSelector((state) => state.customer);
  const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
    useSelector((state) => state.newspaperLanguage);
  const reportData = data;



  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [line, setLine] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    dispatch(fetchLineData());
    dispatch(fetchCustomers());
    dispatch(fetchNewspaperLanguages());
  }, [dispatch]);



  const handleApplyFilters = async () => {
    if (!line || line === "All" || !fromDate || !toDate) {
      toast.error("Please select Line, From Date and To Date.");
      return;
    }
    const payload = {
      line: line,
      from_date: fromDate,
      to_date: toDate,
      customer_id: selectedCustomer?.value || "",
      language: selectedLanguage?.value || "",
      news_paper_id: selectedNewspaper?.value || "",
    };

    try {
      await dispatch(createLineWiseCollection(payload)).unwrap();
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
  };

  const columns = [
    { name: 'Sr.No.', selector: (row, index) => index + 1, sortable: true, width: '90px' },
    {
      name: "Customer",
      selector: (row) => row.customer_details?.name || "N/A",
      sortable: true,
      width: '120px'
    },
    {
      name: "Mobile",
      selector: (row) => row.customer_details?.mobile || "N/A",
      sortable: true,
      width: '120px'
    },
    {
      name: "Address",
      selector: (row) => row.customer_details?.address || "N/A",
      sortable: true,
    },
    {
      name: "NewsPaper",
      selector: (row) => row.newspaper_bill_pay_details?.newspaper_billgenerate_details?.paper_details?.news_paper_name || "N/A",
      sortable: true,
    },
    {
      name: "Line no",
      selector: (row) => row.customer_details?.line_master_details?.line_name || "N/A",
      sortable: true,
      width: '100px'
    },
    {
      name: "Paid Date",
      selector: (row) => (row.paid_date ? dayjs(row.paid_date).format("DD-MM-YYYY") : "-"),
      sortable: true,
    },
    {
      name: "Paid Amount (₹)",
      selector: (row) => `₹${row.paid_amount || 0}`,
      sortable: true,
      right: true,
    },
  ];

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
        : provided.boxShadow,
      "&:hover": { borderColor: "#F59E0B" },
    }),
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-600">
            Payment Collection Reports
          </h2>
          <FiFilter className="text-amber-500 text-xl" />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <Select
              options={customers.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.mobile})`,
                searchableText: `${c.name} ${c.mobile}`.toLowerCase(),
              }))}
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              isClearable
              isSearchable
              placeholder="Search by name or no."
              filterOption={(option, inputValue) =>
                option.data.searchableText.includes(inputValue.toLowerCase())
              }
              styles={selectStyles}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <Select
              options={languages.map((l) => ({
                value: l.id,
                label: l.language_name,
              }))}
              value={selectedLanguage}
              onChange={(option) => {
                setSelectedLanguage(option);
                if (option) dispatch(fetchNewspaperLanguageById(option.value));
              }}
              isClearable
              isSearchable
              placeholder="Select Language"
              styles={selectStyles}
            />
          </div>

          {/* Newspaper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Newspaper
            </label>
            <Select
              options={
                Array.isArray(selectedNewspaperLanguage)
                  ? selectedNewspaperLanguage.map((n) => ({
                    value: n.id,
                    label: n.news_paper_name,
                  }))
                  : []
              }
              value={selectedNewspaper}
              onChange={setSelectedNewspaper}
              isClearable
              isSearchable
              placeholder="Select Newspaper"
              styles={selectStyles}
            />
          </div>

          {/* Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line
            </label>
            <select
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              <option value="All">Select Line</option>
              {lineData?.map((lineItem) => (
                <option key={lineItem.id} value={lineItem.id}>
                  {lineItem.line_name}
                </option>
              ))}
            </select>
            {lineError && (
              <p className="text-red-600 text-sm mt-1">{lineError}</p>
            )}
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
        </div>

        {/* Apply Button */}
        <div className="mb-6">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className={`bg-amber-500 text-white px-6 py-2 rounded-md font-semibold transition hover:bg-amber-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Loading..." : "Get Report"}
          </button>
        </div>


        {/* Error */}
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={reportData}
          pagination
          striped
          highlightOnHover
          responsive
          noDataComponent={
            <p className="text-center text-gray-500 py-4">
              No records found. Please select filters and click "Get Report".
            </p>
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
            rows: {
              style: {
                fontSize: "14px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Reports;

