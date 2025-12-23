import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchSettlementReports } from "../../../redux/slices/settlementReportSlice";

const columns = [
  {
    name: "Settlement ID",
    selector: (row) => row.id || "N/A",
    sortable: true,
  },
  {
    name: "Paid Date",
    selector: (row) => row.paid_date || "N/A",
    sortable: true,
  },
  {
    name: "Amount (₹)",
    selector: (row) => `₹${row.paid_amount || 0}`,
    sortable: true,
    right: true,
  },
  {
    name: "Status",
    selector: (row) => {
      if (row.settlement_clear_id > 0) return "Settled";
      if (row.settlement_clear_id === 0) return "Pending";
      return "Unknown";
    },
    sortable: true,
  },
  {
    name: "Customer Name",
    selector: (row) => row.customer_details?.name || "N/A",
    sortable: true,
  },
  {
    name: "Mobile",
    selector: (row) => row.customer_details?.mobile || "N/A",
  },
  {
    name: "Address",
    selector: (row) => row.customer_details?.address || "N/A",
  },

];


const SettlementReports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.settlement);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFetchReports = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);

    // Dispatch action with FormData
    dispatch(fetchSettlementReports(formData));
  };

  useEffect(() => {
    // Optionally load today's reports by default
    // dispatch(fetchSettlementReports());
  }, [dispatch]);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-7xl mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">Settlement Reports</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-700">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-amber-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-amber-500 focus:outline-none text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleFetchReports}
            disabled={loading}
            className={`w-full bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Loading..." : "Get Report"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm mb-4">
          Error: {error}
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={reports || []}
        pagination
        striped
        highlightOnHover
        responsive
        progressPending={loading}
        noDataComponent={<p className="py-4 text-center text-gray-500">No settlement reports found.</p>}
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
  );
};

export default SettlementReports;
