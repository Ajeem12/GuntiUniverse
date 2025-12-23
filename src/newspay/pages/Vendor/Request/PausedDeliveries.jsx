import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPausedDeliveries,
  rejectPausedDelivery,
  approvePausedDelivery,  // Import the approve action
} from "../../../redux/slices/pausedDeliveriesSlice";

const PausedDeliveries = () => {
  const dispatch = useDispatch();

  const { data: pause, loading, error } = useSelector(
    (state) => state.pausedDeliveries
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPausedDeliveries());
  }, [dispatch]);

  // Update a delivery's status
  

  // Approve the paused delivery
 const handleApprove = async (row) => {
  try {
    await dispatch(approvePausedDelivery(row.id));
    dispatch(fetchPausedDeliveries());
  } catch (err) {
    console.error("Approval failed", err);
  }
};

const handleReject = async (row) => {
  try {
    await dispatch(rejectPausedDelivery(row.id));
    dispatch(fetchPausedDeliveries());
  } catch (err) {
    console.error("Rejection failed", err);
  }
};

  // Columns configuration
  const columns = [
    {
      name: "Customer ID",
      cell: (row, index) => index + 1,
      sortable: true,
      grow: 1,
    },
    {
      name: "Cust Name",
      selector: (row) => row.customer_details?.name || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Cust Mobile",
      selector: (row) => row.customer_details?.mobile || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Cust Address",
      selector: (row) => row.customer_details?.address || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Newspaper",
      selector: (row) => row.paper_details?.news_paper_name || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "From Date",
      selector: (row) => row.from_date,
      sortable: true,
      grow: 1,
    },
    {
      name: "To Date",
      selector: (row) => row.to_date,
      sortable: true,
      grow: 1,
    },
    {
      name: "Remarks",
      selector: (row) => row.customer_details?.remarks || "N/A",
      sortable: true,
      grow: 2,
    },
    {
    name: "Action",
    width: "180px",
    cell: (row) => {
      if (row.status_rec === 0) {
        // Show both buttons when status_rec is 0
        return (
          <div className="flex gap-2 whitespace-nowrap">
            <button
              onClick={() => handleApprove(row)}
              className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded  transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(row)}
              className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded  transition"
            >
              Reject
            </button>
          </div>
        );
      } else if (row.status_rec === 1) {
        // Show "Accepted" text when status_rec is 1
        return (
          <span className="text-green-600 font-semibold">Accepted</span>
        );
      } else if (row.status_rec === 2) {
        // Show "Rejected" text when status_rec is 2
        return (
          <span className="text-red-600 font-semibold">Rejected</span>
        );
      }
      return null; // If status_rec is neither 0, 1, nor 2, do nothing
    },
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
  ]

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "15px",
        backgroundColor: "#FFFBEB", // amber-50
        color: "#B45309", // amber-700
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
          backgroundColor: "#FFF7D6", // subtle amber hover
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
    <div className="p-2 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">
        Paused Deliveries
      </h2>
      {/* Show loading state or error */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error.message}</div>
      ) : (
        <DataTable
          columns={columns}
          data={pause} // Use fetched pause data
          pagination
          striped
          customStyles={customStyles}
          highlightOnHover
          responsive
          noHeader
        />
      )}
    </div>
  );
};

export default PausedDeliveries;
