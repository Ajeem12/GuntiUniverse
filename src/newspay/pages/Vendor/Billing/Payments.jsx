import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import dayjs from "dayjs";
import { fetchLineData } from "../../../redux/slices/lineSlice";
import { fetchCustomers } from "../../../redux/slices/customerSlice";
import { fetchPaymentStatus } from "../../../redux/slices/paymentStatusSlice";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../../redux/slices/newspaperLanguageSlice";

const Payments = () => {
  const dispatch = useDispatch();

  // Redux state
  const { data, loading } = useSelector((state) => state.paymentStatus);
  const { customers = [] } = useSelector((state) => state.customer);
  const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
    useSelector((state) => state.newspaperLanguage);
  const { lineData, loading: lineloader, error: lineerror } = useSelector((state) => state.line);

  // Local states
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const [filters, setFilters] = useState({
    customer_id: "",
    language: "",
    news_paper_id: "",
    from_date: "",
    to_date: "",
    status: "",
    line: "",
  });

  // Initial load
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchNewspaperLanguages());
    dispatch(fetchLineData());
  }, [dispatch]);

  // Handle search
  const handleSearch = () => {
    const payload = {
      customer_id: filters.customer_id || "",
      language: filters.language || "",
      news_paper_id: filters.news_paper_id || "",
      from_date: filters.from_date || "",
      to_date: filters.to_date || "",
      status: filters.status || "",
      line: filters.line || "",
    };
    dispatch(fetchPaymentStatus(payload));
    setShowResults(true);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      customer_id: "",
      language: "",
      news_paper_id: "",
      from_date: "",
      to_date: "",
      status: "",
      line: "",
    });
    setSelectedLanguage(null);
    setSelectedCustomer(null);
    setSelectedNewspaper(null);
    setShowResults(false);
  };


  const flatData = useMemo(() => {
    if (!data) return [];
    const paid = data.paid || [];
    const unpaid = data.unpaid || [];
    const pending = data.pending || [];
    const partial = data.partial || [];

    return [...paid, ...unpaid, ...pending, ...partial].map((item) => ({
      id: item.id,
      customer_name: item.customer_details?.name || "-",
      news_paper_name: item.paper_details?.news_paper_name || "-",
      language_name: item.paper_details?.language_id ? "—" : "-",
      payable_month: item.payable_month,
      total_amount: item.bill_amount,
      status: item.show_status || "-",
      line: item.line || "-",

    }));
  }, [data]);

  // Table Columns
  const columns = useMemo(
    () => [
      { name: "S.No", selector: (row, index) => index + 1, sortable: true, width: "100px" },
      { name: "Customer", selector: (row) => row.customer_name, sortable: true },
      { name: "Newspaper", selector: (row) => row.news_paper_name, sortable: true },
      {
        name: "Month",
        selector: (row) => (row.payable_month ? dayjs(row.payable_month).format("MMM YYYY") : "-"),
        sortable: true,
      },
      { name: "Bill Amount", selector: (row) => row.total_amount || 0, sortable: true },
      {
        name: "Status",
        cell: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Paid"
              ? "bg-green-100 text-green-700"
              : row.status === "Unpaid"
                ? "bg-red-100 text-red-700"
                : row.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
          >
            {row.status}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-600 mb-6">Payment Status</h2>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Status */}
          <select
            className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400 outline-none"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Select Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
          </select>

          {/* Line */}
          <Select
            options={lineData?.map((l) => ({ value: l.id, label: l.line_name }))}
            value={selectedLine}
            onChange={(option) => {
              setSelectedLine(option);
              setFilters((prev) => ({ ...prev, line: option?.value || "" }));
            }}
            placeholder="Select Line"
            isClearable
            classNamePrefix="react-select"
          />

          {/* Customer */}
          <Select
            options={customers.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.mobile})`,
              searchableText: `${c.name} ${c.mobile}`.toLowerCase(),
            }))}
            value={selectedCustomer}
            onChange={(option) => {
              setSelectedCustomer(option);
              setFilters((prev) => ({ ...prev, customer_id: option?.value || "" }));
            }}
            placeholder="Select Customer"
            isClearable
            classNamePrefix="react-select"
            // Enable searching by both name and mobile
            filterOption={(option, inputValue) =>
              option.data.searchableText.includes(inputValue.toLowerCase())
            }
          />

          {/* Language */}
          <Select
            options={languages.map((l) => ({ value: l.id, label: l.language_name }))}
            value={selectedLanguage}
            onChange={(option) => {
              setSelectedLanguage(option);
              setFilters((prev) => ({ ...prev, language: option?.value || "" }));
              if (option) dispatch(fetchNewspaperLanguageById(option.value));
            }}
            placeholder="Select Language"
            isClearable
            classNamePrefix="react-select"
          />

          {/* Newspaper */}
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
            onChange={(option) => {
              setSelectedNewspaper(option);
              setFilters((prev) => ({ ...prev, news_paper_id: option?.value || "" }));
            }}
            placeholder="Select Newspaper"
            isClearable
            classNamePrefix="react-select"
          />

          {/* From Date */}
          <input
            type="date"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400 outline-none"
            value={filters.from_date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, from_date: e.target.value }))
            }
          />

          {/* To Date */}
          <input
            type="date"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400 outline-none"
            value={filters.to_date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, to_date: e.target.value }))
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSearch}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="border border-amber-500 text-amber-600 font-medium px-4 py-2 rounded-lg hover:bg-amber-50 transition"
          >
            Clear
          </button>
        </div>

        {/* Results */}
        {showResults ? (
          loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={flatData}
              pagination
              striped
              responsive
              highlightOnHover
              noDataComponent={
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg mb-2">
                    No payments found for selected filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear filters
                  </button>
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
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            Please apply filters and click <b>Search</b> to view payments.
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
