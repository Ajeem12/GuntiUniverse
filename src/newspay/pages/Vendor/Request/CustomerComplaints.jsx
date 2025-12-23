// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchCustomerComplaints,
//   updateComplaintStatus,
// } from '../../../redux/slices/customerComplaintsSlice';
// import {
//   rejectPausedDelivery,
//   approvePausedDelivery,  // Import the approve action
// } from "../../../redux/slices/pausedDeliveriesSlice";
// import { fetchLineData } from "../../../redux/slices/lineSlice";
// import { fetchCustomers } from "../../../redux/slices/customerSlice";
// import Select from "react-select";
// const CustomerComplaints = () => {
//   const dispatch = useDispatch();
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [selectedLine, setSelectedLine] = useState(null);

//   const [filters, setFilters] = useState({
//     customer_id: "",
//     from_date: "",
//     to_date: "",
//     line: "",
//   });
//   const { data: complaintResponse, loading, error } = useSelector((state) => state.customerComplaints);
//   const { data: pause, } = useSelector(
//     (state) => state.pausedDeliveries
//   );
//   const { customers = [] } = useSelector((state) => state.customer);
//   const { lineData, loading: lineloader, error: lineerror } = useSelector((state) => state.line);
//   // Fetch complaints on mount
//   useEffect(() => {
//     dispatch(fetchCustomerComplaints());
//     dispatch(fetchCustomers());
//     dispatch(fetchLineData());
//   }, [dispatch]);

//   //  Extract and format complaints from API data
//   const complaints = Array.isArray(complaintResponse?.data)
//     ? complaintResponse.data.map((item) => ({
//       id: item.id,
//       customer: `${(item.customer_id)}`,
//       complaint: item.remarks || "No remarks",
//       date: new Date(item.created_at).toLocaleDateString(),
//       mobile: item.customer_details?.mobile || "N/A", // Mobile number
//       address: item.customer_details?.address || "N/A", // Customer address
//       fromDate: item.from_date || "N/A", // Paper subscription start date
//       toDate: item.to_date || "N/A", // Paper subscription end date
//       paperName: item.paper_details?.news_paper_name || "N/A", // Newspaper name
//       paperPrice: item.paper_details?.per_day_price || "N/A", // Newspaper price per day
//       status_rec: item.status_rec
//     }))
//     : [];




//   const handleApprove = async (row) => {
//     try {
//       await dispatch(approvePausedDelivery(row.id));
//       dispatch(fetchCustomerComplaints());
//     } catch (err) {
//       console.error("Approval failed", err);
//     }
//   };

//   const handleReject = async (row) => {
//     try {
//       await dispatch(rejectPausedDelivery(row.id));
//       dispatch(fetchCustomerComplaints());
//     } catch (err) {
//       console.error("Rejection failed", err);
//     }
//   };


//   //  Table column definitions
//   const columns = [
//     {
//       name: "Customer ID",
//       selector: row => row.customer,
//       sortable: true,
//       width: "150px", // 👈 fixed width for customer ID
//     },
//     {
//       name: "Complaint",
//       selector: row => row.complaint,
//       width: "250px", // 👈 column width for longer complaints
//       wrap: true,     // 👈 enable text wrapping for readability
//     },
//     {
//       name: "Date",
//       selector: row => row.date,
//       width: "130px", //  compact column for date
//     },
//     {
//       name: "Mobile",
//       selector: row => row.mobile, // Customer mobile number
//       width: "150px", //  column width for mobile
//     },
//     {
//       name: "News Paper Name",
//       selector: row => row.paperName, // Newspaper name
//       width: "180px", //  space for newspaper name
//     },
//     {
//       name: "Address",
//       selector: row => row.address, // Customer address
//       width: "200px", //  column width for address
//       wrap: true,     //  enable text wrapping for readability
//     },
//     {
//       name: "From Date",
//       selector: row => row.fromDate, // Subscription start date
//       width: "150px",
//     },
//     {
//       name: "To Date",
//       selector: row => row.toDate, // Subscription end date
//       width: "150px",
//     },
//     {
//       name: "News Paper Name",
//       selector: row => row.paperName, // Newspaper name
//       width: "180px", //  space for newspaper name
//     },

//     {
//       name: "Action",
//       width: "180px",
//       cell: (row) => {
//         if (row.status_rec === 0) {
//           // Show both buttons when status_rec is 0
//           return (
//             <div className="flex gap-2 whitespace-nowrap">
//               <button
//                 onClick={() => handleApprove(row)}
//                 className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded  transition"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => handleReject(row)}
//                 className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded  transition"
//               >
//                 Reject
//               </button>
//             </div>
//           );
//         } else if (row.status_rec === 1) {
//           // Show "Accepted" text when status_rec is 1
//           return (
//             <span className="text-green-600 font-semibold">Accepted</span>
//           );
//         } else if (row.status_rec === 2) {
//           // Show "Rejected" text when status_rec is 2
//           return (
//             <span className="text-red-600 font-semibold">Rejected</span>
//           );
//         }
//         return null; // If status_rec is neither 0, 1, nor 2, do nothing
//       },
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//     }
//   ];


//   return (
//     <div className="p-4 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4 text-amber-600">Customer Complaints</h2>
//       {/* Filters */}
//       <div className="grid md:grid-cols-3 gap-4 mb-6">
//         {/* Line */}
//         <Select
//           options={lineData?.map((l) => ({ value: l.id, label: l.line_name }))}
//           value={selectedLine}
//           onChange={(option) => {
//             setSelectedLine(option);
//             setFilters((prev) => ({ ...prev, line: option?.value || "" }));
//           }}
//           placeholder="Select Line"
//           isClearable
//           classNamePrefix="react-select"
//         />
//         <input
//           type="date"
//           className="border rounded-[4px] p-2 focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
//           value={filters.from_date}
//           onChange={(e) =>
//             setFilters((prev) => ({ ...prev, from_date: e.target.value }))
//           }
//         />

//         {/* To Date */}
//         <input
//           type="date"
//           className="border rounded-[4px] p-2 focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
//           value={filters.to_date}
//           onChange={(e) =>
//             setFilters((prev) => ({ ...prev, to_date: e.target.value }))
//           }
//         />
//       </div>

//       {loading ? (
//         <p className="text-gray-600">Loading complaints...</p>
//       ) : error ? (
//         <p className="text-red-600">Failed to fetch complaints: {error.message}</p>
//       ) : (
//         <DataTable
//           columns={columns}
//           data={complaints}
//           pagination
//           striped
//           highlightOnHover
//           noDataComponent="No complaints found."
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerComplaints;




import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerComplaints,
} from "../../../redux/slices/customerComplaintsSlice";
import {
  rejectPausedDelivery,
  approvePausedDelivery,
} from "../../../redux/slices/pausedDeliveriesSlice";
import { fetchLineData } from "../../../redux/slices/lineSlice";
import Select from "react-select";

const CustomerComplaints = () => {
  const dispatch = useDispatch();
  const { data: complaintResponse, loading, error } = useSelector(
    (state) => state.customerComplaints
  );
  const { lineData } = useSelector((state) => state.line);

  const [selectedLine, setSelectedLine] = useState(null);
  const [filters, setFilters] = useState({
    line: "",
    from_date: "",
    to_date: "",
  });

  // Fetch data once on mount
  useEffect(() => {
    dispatch(fetchCustomerComplaints());
    dispatch(fetchLineData());
  }, [dispatch]);

  // Prepare data for table
  const complaints = Array.isArray(complaintResponse?.data)
    ? complaintResponse.data.map((item) => ({
      id: item.id,
      line: item.customer_details?.line || "N/A",
      customer: item.customer_details?.name || "N/A",
      complaint: item.remarks || "No remarks",
      date: new Date(item.created_at).toLocaleDateString(),
      mobile: item.customer_details?.mobile || "N/A",
      address: item.customer_details?.address || "N/A",
      fromDate: item.from_date || "N/A",
      toDate: item.to_date || "N/A",
      paperName: item.paper_details?.news_paper_name || "N/A",
      paperPrice: item.paper_details?.per_day_price || "N/A",
      status_rec: item.status_rec,
    }))
    : [];

  // Apply frontend filtering
  const filteredComplaints = complaints.filter((item) => {
    const fromDate = filters.from_date ? new Date(filters.from_date) : null;
    const toDate = filters.to_date ? new Date(filters.to_date) : null;
    const createdDate = new Date(item.date);

    const lineMatch =
      !filters.line || item.line?.toString() === filters.line?.toString();
    const fromMatch = !fromDate || createdDate >= fromDate;
    const toMatch = !toDate || createdDate <= toDate;

    return lineMatch && fromMatch && toMatch;
  });

  // Table columns

  //  Table column definitions
  const columns = [
    {
      name: "Customer ID",
      selector: row => row.customer,
      sortable: true,
      width: "150px", // 👈 fixed width for customer ID
    },
    {
      name: "Complaint",
      selector: row => row.complaint,
      width: "250px", // 👈 column width for longer complaints
      wrap: true,     // 👈 enable text wrapping for readability
    },
    {
      name: "Date",
      selector: row => row.date,
      width: "130px", //  compact column for date
    },
    {
      name: "Mobile",
      selector: row => row.mobile, // Customer mobile number
      width: "150px", //  column width for mobile
    },
    {
      name: "News Paper Name",
      selector: row => row.paperName, // Newspaper name
      width: "180px", //  space for newspaper name
    },
    {
      name: "Address",
      selector: row => row.address, // Customer address
      width: "200px", //  column width for address
      wrap: true,     //  enable text wrapping for readability
    },
    {
      name: "From Date",
      selector: row => row.fromDate, // Subscription start date
      width: "150px",
    },
    {
      name: "To Date",
      selector: row => row.toDate, // Subscription end date
      width: "150px",
    },
    {
      name: "News Paper Name",
      selector: row => row.paperName, // Newspaper name
      width: "180px", //  space for newspaper name
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
  ];


  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-amber-600">
        Customer Complaints
      </h2>

      {/* Filters Section */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Line Filter */}
        <Select
          options={lineData?.map((l) => ({ value: l.id, label: l.line_name }))}
          value={selectedLine}
          onChange={(option) => {
            setSelectedLine(option);
            setFilters((prev) => ({ ...prev, line: option?.value || "" }));
          }}
          placeholder="Select Line"
          isClearable
        />

        {/* From Date */}
        <input
          type="date"
          className="border rounded p-2"
          value={filters.from_date}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, from_date: e.target.value }))
          }
        />

        {/* To Date */}
        <input
          type="date"
          className="border rounded p-2"
          value={filters.to_date}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, to_date: e.target.value }))
          }
        />

        {/* Reset Button */}
        <button
          onClick={() => {
            setFilters({ line: "", from_date: "", to_date: "" });
            setSelectedLine(null);
          }}
          className="bg-gray-200 hover:bg-gray-300 rounded p-2 font-medium"
        >
          Reset
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-gray-600">Loading complaints...</p>
      ) : error ? (
        <p className="text-red-600">Failed to fetch complaints: {error.message}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredComplaints}
          pagination
          striped
          highlightOnHover
          noDataComponent="No complaints found."
        />
      )}
    </div>
  );
};

export default CustomerComplaints;
