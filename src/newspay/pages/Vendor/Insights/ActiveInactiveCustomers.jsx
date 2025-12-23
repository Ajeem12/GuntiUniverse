import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchInactiveClients, fetchActiveClients } from "../../../redux/slices/customerStatusSlice";

const ActiveInactiveCustomers = () => {
  const dispatch = useDispatch();

  const {
    activeClients = [],
    inactiveClients = [],
    loading,
    error,
  } = useSelector((state) => state.customerStatus);

  const [filter, setFilter] = useState("All");

  // Fetch both Active and Inactive clients on mount
  useEffect(() => {
    dispatch(fetchInactiveClients());
    dispatch(fetchActiveClients());
  }, [dispatch]);

  // Combine and transform API data into rows
  const customers = [...activeClients, ...inactiveClients].map((item) => {
    const status = item.customer_details?.status === 1 ? "Active" : "Inactive";

    return {
      id: item.id,
      customer: `CUST${item.customer_id.toString().padStart(3, "0")}`,
      name: item.customer_details?.name || "N/A",
      status,
      lastActive: item.customer_details?.updated_at
        ? new Date(item.customer_details.updated_at).toLocaleDateString()
        : "N/A",
    };
  });

  const filteredData =
    filter === "All" ? customers : customers.filter((c) => c.status === filter);

  const columns = [
    {
      name: "Customer ID",
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Last Active",
      selector: (row) => row.lastActive,
    },
  ];

  return (
    <div className="p-2 md:p-2 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-600 mb-6">
        Active vs Inactive Customers
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Active", "Inactive"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 text-sm font-medium rounded-full shadow transition duration-200 ${
              filter === status
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="rounded border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          striped
          highlightOnHover
          responsive
          progressPending={loading}
          noDataComponent={
            loading ? "Loading..." : "No customer records found."
          }
        />
      </div>
    </div>
  );
};

export default ActiveInactiveCustomers;
