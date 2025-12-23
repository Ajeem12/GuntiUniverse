import DataTable from "react-data-table-component";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionHistory } from "../redux/slices/transactionHistorySlice";
import { FiInbox, FiLoader } from "react-icons/fi";

// Add a custom loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-amber-500" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const columns = [
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => `₹${row.amount}`,
    sortable: true,
    right: true,
  },
  {
    name: "NewsPaper Name",
    selector: (row) => row.currentPaper,
    sortable: true,
  },
  {
    name: "Agency Name",
    selector: (row) => row.agencyName,
    sortable: true,
  },

  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === "Success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

const History = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.transactionHistory
  );

  useEffect(() => {
    dispatch(fetchTransactionHistory());
  }, [dispatch]);

  // Map the API data to the structure expected by the table
  const formattedData = data.map((item) => ({
    id: item.id,
    date: item.created_at?.split("T")[0], // Format date as yyyy-mm-dd
    action: item.bill_amount ? "Payment" : "Change Paper", // Example of action; adapt based on real data
    amount: item.bill_amount || 0, // Assuming "bill_amount" represents the amount
    currentPaper: item.paper_details?.news_paper_name || "N/A", // Paper name
    agencyName: item.agency_details?.agency_name || "N/A", // Agency name
    agencyOwner: item.agency_details?.owner_name || "N/A", // Agency owner
    status: item.status === 1 ? "Success" : "Pending", // Adjust based on actual status logic
  }));

  return (
    <div className="max-w-4xl mx-auto mt-2 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-amber-700 mb-4">
        Transaction History
      </h2>

      {/* Show loading spinner if data is loading */}
      {loading && <LoadingSpinner />}

      {/* Show error message if there is an error */}
      {error && (
        <div className="text-center py-4 text-red-500">{`Error: ${error}`}</div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={formattedData}
        pagination
        highlightOnHover
        striped
      

noDataComponent={
  !loading ? (
    <div className="flex flex-col items-center justify-center py-8 text-gray-600 space-y-2">
      <FiInbox size={40} className="text-amber-500" />
      <p className="text-lg font-semibold">No transaction history available</p>
      <p className="text-sm text-gray-400">It looks like you haven't made any transactions yet.</p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2 animate-spin">
      <FiLoader size={40} className="text-amber-400" />
      <p className="text-lg font-semibold">Loading transaction history...</p>
      <p className="text-sm">Please wait a moment</p>
    </div>
  )
}

        progressPending={loading} // This ensures the spinner is shown when loading
      />
    </div>
  );
};

export default History;
