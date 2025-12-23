import { useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  fetchCancellationRequests,
  updateCancellationStatus,
} from "../../../redux/slices/cancellationRequestsSlice";
import { approvePausedDelivery } from "../../../redux/slices/pausedDeliveriesSlice"
import { useDispatch, useSelector } from "react-redux";

const CancellationRequests = () => {
  const dispatch = useDispatch();
  const { data: cancel, loading, error } = useSelector(
    (state) => state.cancellationRequests
  );

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchCancellationRequests());
  }, [dispatch]);

  // Update status
  const handleStatusUpdate = (id) => {
    dispatch(approvePausedDelivery(id));
    dispatch(fetchCancellationRequests());
  };

  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.customer_details?.name || "N/A",
      sortable: true,
      width: "160px",
    },
    {
      name: "Mobile",
      selector: (row) => row.customer_details?.mobile || "-",
      width: "140px",
    },
    {
      name: "Closing Date",
      selector: (row) => row.closing_date || "-",
      wrap: true,
      width: "200px",
    },
    {
      name: "Newspaper",
      selector: (row) => row.paper_details?.news_paper_name || "N/A",
      width: "160px",
    },
    {
      name: "Reason",
      selector: (row) => row.remarks || "-",
      grow: 2,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status_rec === 1
          ? "Approved"
          : row.status_rec === -1
            ? "Rejected"
            : "Pending",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${row.status_rec === 1
            ? "bg-green-100 text-green-800"
            : row.status_rec === -1
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {row.status_rec === 1
            ? "Approved"
            : row.status_rec === -1
              ? "Rejected"
              : "Pending"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Action",
      width: "180px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusUpdate(row.id,)}
            disabled={row.status_rec === 1}
            className={`px-3 py-1 text-xs font-semibold text-white rounded transition ${row.status_rec === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Approve
          </button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "15px",
        backgroundColor: "#FFFBEB",
        color: "#B45309",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        minHeight: "44px",
        "&:hover": {
          backgroundColor: "#FFF7D6",
        },
      },
    },
    pagination: {
      style: {
        fontSize: "13px",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">
        Closing Requests
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error loading data.</p>
      ) : (
        <DataTable
          columns={columns}
          data={cancel || []}
          pagination
          striped
          customStyles={customStyles}
          highlightOnHover
          responsive
          noHeader
          noDataComponent="No cancellation requests found."
        />
      )}
    </div>
  );
};

export default CancellationRequests;
