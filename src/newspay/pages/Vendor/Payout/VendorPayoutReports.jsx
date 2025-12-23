import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorPayoutReports } from "../../../redux/slices/vendorPayoutSlice";

// ✅ Columns based on real API data
const columns = [
  { name: "Agency ID", selector: (row) => row.agency_id, sortable: true },
  {
    name: "Bill IDs",
    selector: (row) => row.billIds,
    cell: (row) => (
      <div className="text-sm">
        {Object.entries(row.billIds).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">Bill {key}:</span> {value}
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Total Created Amount",
    selector: (row) => `₹${row.total_creat_amount.toFixed(2)}`,
  },
  {
    name: "Paid Amount",
    selector: (row) => `₹${row.bill_paid_amount.toFixed(2)}`,
  },
  {
    name: "Pay For",
    selector: (row) =>
      `${new Date(0, row.pay_for_month - 1).toLocaleString("default", {
        month: "long",
      })} ${row.pay_for_year}`,
  },
  
  {
    name: "Created At",
    selector: (row) =>
      new Date(row.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

const VendorPayoutReports = () => {
  const dispatch = useDispatch();
  const { reports = [], loading, error } = useSelector(
    (state) => state.vendorPayout
  );

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleFetchReports = () => {
    if (!month || !year)
      return alert("Please select both month and year");

    const payload = {
      month: month.toString(), 
      year,
    };

    dispatch(fetchVendorPayoutReports(payload));
  };

  // 🧠 Transform response data for display
  const formattedReports = reports.map((item) => ({
    ...item,
    billIds: item.bill_id ? JSON.parse(item.bill_id) : {},
  }));

  // 🗓️ Generate last 10 years
  const getLast10Years = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  return (
    <div className="p-2 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">
        Vendor Payout Reports
      </h2>

      {/* 🔍 Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Year</option>
          {getLast10Years().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetchReports}
          className="bg-amber-500 text-white px-4 py-2 rounded shadow"
        >
          Fetch Reports
        </button>
      </div>

      {/* 🧾 Data Table */}
      <DataTable
        columns={columns}
        data={formattedReports}
        pagination
        striped
        highlightOnHover
        responsive
        progressPending={loading}
        noDataComponent={loading ? "Loading..." : "No reports found"}
      />

      {/* 🔴 Error Display */}
      {error && (
        <p className="text-red-600 mt-4 font-medium">{error}</p>
      )}
    </div>
  );
};

export default VendorPayoutReports;
