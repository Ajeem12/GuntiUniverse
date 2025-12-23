import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChangeRequests,
  updateChangeRequestStatus,
} from "../../../redux/slices/changePaperRequestSlice";

const PaperChangeRequests = () => {
  const dispatch = useDispatch();
  const {
    data: paperChange,
    loading,
    error,
  } = useSelector((state) => state.changePaperRequest);

  // Load all change requests on mount
  useEffect(() => {
    dispatch(fetchChangeRequests());
  }, [dispatch]);

  // Handle approve action
  const handleApprove = (row) => {
    // Send the correct payload directly with all necessary data
    const payload = {
      req_id: row.id,
      req_status: 1, // Approve status
    };

    dispatch(updateChangeRequestStatus(payload));
    dispatch(fetchChangeRequests());
  };

  // Handle reject action
  const handleReject = (row) => {
    // Send the correct payload directly with all necessary data
    const payload = {
      req_id: row.id,
      req_status: 2, // Reject status
    };

    dispatch(updateChangeRequestStatus(payload));
    dispatch(fetchChangeRequests());
  };

  const columns = [
    {
      name: "Customer ID",
      selector: (row) => row.customer_id,
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.old_rec_details?.agency_details?.owner_name || "-", // Assuming it's stored under agency_details
      grow: 1,
    },
    {
      name: "Customer Mobile No.",
      selector: (row) => row.old_rec_details?.agency_details?.mobile || "-", // Assuming it's stored under agency_details
      grow: 1,
    },
    {
      name: "Old Paper",
      selector: (row) =>
        row.old_rec_details?.paper_details?.news_paper_name || "-",
      grow: 1,
    },
    {
      name: "New Paper",
      selector: (row) => row.paper_details?.news_paper_name || "-",
      grow: 1,
    },
    {
      name: "Request Date",
      selector: (row) => row.starting_date,
      grow: 1,
    },
    {
      name: "Action",
      width: "160px",
      cell: (row) => (
        <div className="flex gap-2 whitespace-nowrap">
          {row.status === 0 ? (
            <>
              <button
                onClick={() => handleApprove(row)}
                className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(row)}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded transition"
              >
                Reject
              </button>
            </>
          ) : row.status === 1 ? (
            <span className="text-green-600 font-semibold">Approved</span>
          ) : row.status === 2 ? (
            <span className="text-red-600 font-semibold">Rejected</span>
          ) : null}
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
    <div className="bg-white rounded shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">
        Paper Change Requests
      </h2>
      {/* Show loading spinner if the data is loading */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {/* Show table if data is available */}
      <DataTable
        columns={columns}
        data={paperChange || []}
        pagination
        striped
        customStyles={customStyles}
        highlightOnHover
        responsive
        noHeader
        progressPending={loading}
        noDataComponent={
          <div className="text-center py-8 text-gray-500">
            No change requests found
          </div>
        }
      />
    </div>
  );
};

export default PaperChangeRequests;
