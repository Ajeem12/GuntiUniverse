// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { useDispatch, useSelector } from "react-redux";
// import { pauseNStop, getReports } from "../redux/slices/pauseNStopSlice";
// import toast from "react-hot-toast";
// import { fetchChangeRequests } from "../redux/slices/changePaperSlice";
// import { getPaperRecordsByAgency } from "../redux/slices/paperSlice";
// import { getCustomerCareInfo } from "../redux/slices/customerCareSlice";
// import { fetchCustomerPaperRecs } from "../redux/slices/customerPaperRecSlice";

// const Stop = () => {
//   const [stopType, setStopType] = useState("complete");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [stopDate, setStopDate] = useState("");
//   const [currentPaper, setCurrentPaper] = useState(""); 
//   const [agency, setAgency] = useState("");

//   const dispatch = useDispatch();
//   const { reports, loading, error } = useSelector((state) => state.pause);
//   const { requests = [], loading: loadingRequests } = useSelector(
//     (state) => state.changePaper
//   );
//   const {
//     records: newRwcords,
//     loading: loadingAgencyPapers,
//     error: errorAgencyPapers,
//   } = useSelector((state) => state.papers);
//   const { customerCareInfo, success } = useSelector(
//     (state) => state.customerCare
//   );
  
//   const { data: papers, loading: papersLoading } = useSelector(
//       (state) => state.customerPaperRec
//     );
  

//   useEffect(() => {
//     dispatch(getReports());
//      dispatch(fetchCustomerPaperRecs());
//     dispatch(fetchChangeRequests());
//     dispatch(getCustomerCareInfo());
//   }, [dispatch]);

//   useEffect(() => {
//     if (agency) {
//       dispatch(getPaperRecordsByAgency(agency)); // Dispatch the action with agencyId
//     }
//   }, [agency, dispatch]);

//   // Filter records based on the selected agency
//   const filteredRecords = newRwcords.filter(
//     (item) => item.agency_id === parseInt(agency)
//   );

//   // Get newspaper options based on filtered records
//   const currentPaperOptions = filteredRecords.map((item) => ({
//     id: item.id, // Use the correct field for the paper ID
//     name: item.papername,
//   }));
//   console.log("curr", currentPaperOptions);

//   const agencyOptions = Array.isArray(customerCareInfo)
//     ? customerCareInfo.map((agency) => ({
//         id: agency.id,
//         name: agency.agency_name,
//       }))
//     : []; // Default to empty array if customerCareInfo is not an array

//   const formattedRecords =
//     reports?.map((item, index) => ({
//       sno: index + 1,
//       id: item.id,
//       vn: item.paper_details?.news_paper_name || "-",
//       from: item.from_date || "-",
//       to: item.to_date || "-",
//       createdDate: item.created_at?.split("T")[0] || "-",
//       closingDate: item.closing_date || "-",
//       status: item.type === 1 ? "Complete Stop" : "Partial Pause",
//       approvalStatus:
//         item.status_rec === 0
//           ? "Pending"
//           : item.status_rec === 1
//           ? "Approved"
//           : item.status_rec === 2
//           ? "Rejected"
//           : "Unknown",
//     })) || [];

//   const columns = [
//     {
//       name: "S.No",
//       selector: (row) => row.sno,
//       sortable: false,
//       width: "80px",
//     },
//     {
//       name: "NewsPaperName",
//       selector: (row) => row.vn,
//       sortable: true,
//     },
//     {
//       name: "From",
//       selector: (row) => row.from || "-",
//       sortable: true,
//     },
//     {
//       name: "To",
//       selector: (row) => row.to || "-",
//       sortable: true,
//     },
//     {
//       name: "Closing Date",
//       selector: (row) => row.closingDate,
//       sortable: true,
//     },
//     {
//       name: "Created Date",
//       selector: (row) => row.createdDate,
//       sortable: true,
//     },
//     {
//       name: "Status",
//       selector: (row) => row.status,
//       sortable: true,
//       cell: (row) => {
//         let badgeClass = "";
//         if (row.status === "Complete Stop") {
//           badgeClass = "bg-red-100 text-red-700";
//         } else if (row.status === "Partial Pause") {
//           badgeClass = "bg-yellow-100 text-yellow-700";
//         } else {
//           badgeClass = "bg-gray-100 text-gray-700";
//         }

//         return (
//           <span
//             className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
//           >
//             {row.status}
//           </span>
//         );
//       },
//     },
//     {
//       name: "Approval",
//       selector: (row) => row.approvalStatus,
//       sortable: true,
//       cell: (row) => {
//         let badgeClass = "";
//         switch (row.approvalStatus) {
//           case "Approved":
//             badgeClass = "bg-green-100 text-green-700";
//             break;
//           case "Pending":
//             badgeClass = "bg-yellow-100 text-yellow-700";
//             break;
//           case "Rejected":
//             badgeClass = "bg-red-100 text-red-700";
//             break;
//           default:
//             badgeClass = "bg-gray-100 text-gray-700";
//         }

//         return (
//           <span
//             className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
//           >
//             {row.approvalStatus}
//           </span>
//         );
//       },
//     },
//   ];

//   const handleSave = async () => {
//     let payload = new FormData();

//     // Ensure the selected paper ID is valid
   
  

//     // Add the paper ID and agency ID to the payload
//     payload.append("customer_paper_rec_id", currentPaper);
 
//     payload.append("news_paper_id", currentPaper); // Include newspaper ID

//     // Validate stop type and dates
//     if (stopType === "complete") {
//       if (!stopDate) {
//         toast.error("Please select a stop date.");
//         return;
//       }
//       payload.append("stop_date", stopDate);
//       payload.append("status", 1); // Complete stop
//     }

//     if (stopType === "partial") {
//       if (!fromDate || !toDate) {
//         toast.error("Please select both from and to dates.");
//         return;
//       }
//       payload.append("from_date", fromDate);
//       payload.append("to_date", toDate);
//       payload.append("status", 0); // Partial pause
//     }

//     try {
//       const resultAction = await dispatch(pauseNStop(payload));

//       if (pauseNStop.fulfilled.match(resultAction)) {
//         const response = resultAction.payload;

//         if (response?.status) {
//           toast.success("Request saved successfully!");

//           // Refresh reports table
//           dispatch(getReports());

//           // Reset form
//           setFromDate("");
//           setToDate("");
//           setStopDate("");
//           setStopType("complete");
//           setCurrentPaper("");
//         } else {
//           if (response?.error === "Customer not found") {
//             toast.error("Customer not found. Please check your information.");
//           } else {
//             toast.error(response?.message || "Something went wrong.");
//           }
//         }
//       } else {
//         const errorMessage =
//           resultAction.payload?.message || "Unknown error occurred";
//         toast.error(errorMessage);
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to save request. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
     

//       <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Current Newspaper
//           </label>
//           <select
//             value={currentPaper}
//             onChange={(e) => setCurrentPaper(e.target.value)}
//             className="w-full border border-gray-300 px-4 py-2 rounded-md"
//             required
//           >
//             <option value="">Select Current Paper</option>
//             {papers?.map((item) => (
//               <option key={item.id} value={item.news_paper_id}>
//                 {`${item.paper_details?.news_paper_name || "N/A"} - ${
//                   item.paper_details?.language_details?.language_name || "Unknown"
//                 }`}
//               </option>
//             ))}
//           </select>
//         </div>


//       <legend className="text-lg font-semibold text-amber-700 mb-4">
//         Select Stop / Pause Paper
//       </legend>

//       {/* Radio Buttons */}
//       <fieldset className="mb-4">
//         <div className="flex space-x-6">
//           <label className="flex items-center space-x-2 text-amber-800">
//             <input
//               type="radio"
//               name="stopType"
//               value="complete"
//               checked={stopType === "complete"}
//               onChange={() => setStopType("complete")}
//               className="form-radio text-amber-600 focus:ring-amber-500"
//             />
//             <span>Complete Stop</span>
//           </label>
//           <label className="flex items-center space-x-2 text-amber-800">
//             <input
//               type="radio"
//               name="stopType"
//               value="partial"
//               checked={stopType === "partial"}
//               onChange={() => setStopType("partial")}
//               className="form-radio text-amber-600 focus:ring-amber-500"
//             />
//             <span>Partial Pause</span>
//           </label>
//         </div>
//       </fieldset>

//       {/* Date Inputs */}
//       {stopType === "partial" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-amber-700 mb-1">
//               From <span className="text-gray-400">(Future Date)</span>
//             </label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500"
//               min={new Date().toISOString().split("T")[0]}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-amber-700 mb-1">
//               To <span className="text-gray-400">(Future Date)</span>
//             </label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500"
//               min={new Date().toISOString().split("T")[0]}
//             />
//           </div>
//         </div>
//       )}

//       {stopType === "complete" && (
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-amber-700 mb-1">
//             Stop Date <span className="text-gray-400">(Future Date)</span>
//           </label>
//           <input
//             type="date"
//             value={stopDate}
//             onChange={(e) => setStopDate(e.target.value)}
//             className="w-full px-3 py-2 border border-amber-300 rounded-md focus:ring-amber-500"
//             min={new Date().toISOString().split("T")[0]}
//           />
//         </div>
//       )}

//       {/* Save Button */}
//       <button
//         onClick={handleSave}
//         className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg transition duration-300 ${
//           (stopType === "partial" && (!fromDate || !toDate)) ||
//           (stopType === "complete" && !stopDate) ||
//           !currentPaper ||
//           !agency
//             ? "bg-amber-400 cursor-not-allowed"
//             : "bg-amber-600 hover:bg-amber-700"
//         }`}
//         disabled={
//           (stopType === "partial" && (!fromDate || !toDate)) ||
//           (stopType === "complete" && !stopDate) ||
//           !currentPaper ||
//           !agency
//         }
//       >
//         Save
//       </button>

//       {/* Table */}
//       <div className="mt-8">
//         {loading ? (
//           <p className="text-center text-amber-600 font-semibold">
//             Loading data...
//           </p>
//         ) : error ? (
//           <p className="text-center text-red-500 font-semibold">
//             {error && <p>{error.message || error.error}</p>}
//           </p>
//         ) : (
//           <DataTable
//             columns={columns}
//             data={formattedRecords}
//             pagination
//             highlightOnHover
//             striped
//             noHeader
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stop;

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { pauseNStop, getReports } from "../redux/slices/pauseNStopSlice";
import toast from "react-hot-toast";
import { fetchCustomerPaperRecs } from "../redux/slices/customerPaperRecSlice";

const Stop = () => {
  const [stopType, setStopType] = useState("complete");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [stopDate, setStopDate] = useState("");
  const [currentPaper, setCurrentPaper] = useState("");

  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.pause);
  const { data: papers = [], loading: papersLoading } = useSelector(
    (state) => state.customerPaperRec
  );

  useEffect(() => {
    dispatch(getReports());
    dispatch(fetchCustomerPaperRecs());
  }, [dispatch]);

  const handleSave = async () => {
    const selectedPaper = papers.find((p) => p.id == currentPaper);
    if (!selectedPaper) {
      toast.error("Please select a valid paper.");
      return;
    }

    const newspaperId = selectedPaper.news_paper_id;

    const payload = new FormData();
    payload.append("customer_paper_rec_id", selectedPaper.id);
    payload.append("news_paper_id", newspaperId);

    if (stopType === "complete") {
      if (!stopDate) {
        toast.error("Please select a stop date.");
        return;
      }
      payload.append("stop_date", stopDate);
      payload.append("status", 1); // 1 = complete stop
    }

    if (stopType === "partial") {
      if (!fromDate || !toDate) {
        toast.error("Please select both from and to dates.");
        return;
      }
      payload.append("from_date", fromDate);
      payload.append("to_date", toDate);
      payload.append("status", 0); // 0 = partial pause
    }

    try {
      const resultAction = await dispatch(pauseNStop(payload));
      if (pauseNStop.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        if (response?.status) {
          toast.success("Request saved successfully!");
          dispatch(getReports());
          setFromDate("");
          setToDate("");
          setStopDate("");
          setStopType("complete");
          setCurrentPaper("");
        } else {
          toast.error(response?.message || "Failed to save request.");
        }
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save request.");
    }
  };

  const formattedRecords =
    reports?.map((item, index) => ({
      sno: index + 1,
      id: item.id,
      vn: item.paper_details?.news_paper_name || "-",
      from: item.from_date || "-",
      to: item.to_date || "-",
      createdDate: item.created_at?.split("T")[0] || "-",
      closingDate: item.closing_date || "-",
      status: item.type === 1 ? "Complete Stop" : "Partial Pause",
      approvalStatus:
        item.status_rec === 0
          ? "Pending"
          : item.status_rec === 1
          ? "Approved"
          : item.status_rec === 2
          ? "Rejected"
          : "Unknown",
    })) || [];

  const columns = [
    { name: "S.No", selector: (row) => row.sno, sortable: false, width: "80px" },
    { name: "NewsPaperName", selector: (row) => row.vn, sortable: true },
    { name: "From", selector: (row) => row.from || "-", sortable: true },
    { name: "To", selector: (row) => row.to || "-", sortable: true },
    { name: "Closing Date", selector: (row) => row.closingDate, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        const statusColor =
          row.status === "Complete Stop"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";
        return (
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {row.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Approval",
      selector: (row) => row.approvalStatus,
      cell: (row) => {
        const colorMap = {
          Approved: "bg-green-100 text-green-700",
          Pending: "bg-yellow-100 text-yellow-700",
          Rejected: "bg-red-100 text-red-700",
        };
        return (
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorMap[row.approvalStatus] || "bg-gray-100 text-gray-700"}`}>
            {row.approvalStatus}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-700 mb-4 text-center">
        Pause / Stop Newspaper
      </h2>

      {/* Newspaper Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Newspaper
        </label>
        <select
          value={currentPaper}
          onChange={(e) => setCurrentPaper(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
          required
        >
          <option value="">Select Current Paper</option>
          {papers?.map((item) => (
            <option key={item.id} value={item.id}>
              {`${item.paper_details?.news_paper_name || "N/A"} - ${
                item.paper_details?.language_details?.language_name || "Unknown"
              }`}
            </option>
          ))}
        </select>
      </div>

      {/* Stop Type Selection */}
      <fieldset className="mb-4">
        <legend className="text-sm font-medium text-amber-700 mb-2">Select Type</legend>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="complete"
              checked={stopType === "complete"}
              onChange={() => setStopType("complete")}
              className="form-radio text-amber-600"
            />
            <span>Complete Stop</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="partial"
              checked={stopType === "partial"}
              onChange={() => setStopType("partial")}
              className="form-radio text-amber-600"
            />
            <span>Partial Pause</span>
          </label>
        </div>
      </fieldset>

      {/* Date Fields */}
      {stopType === "complete" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-amber-700 mb-1">Stop Date</label>
          <input
            type="date"
            value={stopDate}
            onChange={(e) => setStopDate(e.target.value)}
            className="w-full border px-3 py-2 border-gray-300 rounded-md"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      )}

      {stopType === "partial" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border px-3 py-2 border-gray-300 rounded-md"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border px-3 py-2 border-gray-300 rounded-md"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg transition duration-300 ${
          (stopType === "partial" && (!fromDate || !toDate)) ||
          (stopType === "complete" && !stopDate) ||
          !currentPaper
            ? "bg-amber-400 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700"
        }`}
        disabled={
          (stopType === "partial" && (!fromDate || !toDate)) ||
          (stopType === "complete" && !stopDate) ||
          !currentPaper
        }
      >
        Save
      </button>

      {/* Data Table */}
      <div className="mt-8">
        {loading ? (
          <p className="text-center text-amber-600 font-semibold">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">
            {error.message || error.error}
          </p>
        ) : (
          <DataTable
            columns={columns}
            data={formattedRecords}
            pagination
            highlightOnHover
            striped
            noHeader
          />
        )}
      </div>
    </div>
  );
};

export default Stop;
