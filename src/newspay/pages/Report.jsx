// import React, { useState, useEffect } from 'react';
// import DataTable from 'react-data-table-component';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchReport, createReport } from '../redux/slices/reportSlice';
// import { fetchChangeRequests } from "../redux/slices/changePaperSlice";
// import { FiUser, FiLoader } from 'react-icons/fi';
// import { getPaperRecordsByAgency } from '../redux/slices/paperSlice';
// import { getCustomerCareInfo } from "../redux/slices/customerCareSlice";
// import { fetchCustomerChangePaperRecs } from '../redux/slices/customerChangePaperRecSlice';
// import toast from 'react-hot-toast';
// const Report = () => {
//   const dispatch = useDispatch();
//   const { data: reportResponse, loading, error } = useSelector((state) => state.report);
//   const { requests = [], loading: loadingRequests } = useSelector((state) => state.changePaper);
//   const { records, loading: loadingAgencyPapers, error: errorAgencyPapers } = useSelector((state) => state.papers);
//   const { customerCareInfo, success } = useSelector(
//     (state) => state.customerCare
//   );
//   const rawData = Array.isArray(reportResponse?.data) ? reportResponse.data : [];

//   const reports = rawData.map((item) => ({
//     id: item.id,
//     serviceName: item.paper_details?.news_paper_name || 'N/A',
//     from: item.from_date,
//     to: item.to_date,
//     createDate: new Date(item.created_at).toLocaleDateString(),
//     status: item.status_rec === 1 ? 'Resolved' : 'Pending',
//     remarks: item.remarks || '-',
//   }));

//   const { data } = useSelector(
//     (state) => state.customerChangePaperRec
//   );

//   const agncyId = data?.data.map((item) => item.agency_id)
//   let agency_Id = agncyId?.[0]

//   const [currentPaper, setCurrentPaper] = useState('');

//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [dateError, setDateError] = useState('');
//   const [agency, setAgency] = useState("");

//   useEffect(() => {
//     dispatch(fetchReport());
//     dispatch(fetchChangeRequests());
//     dispatch(getCustomerCareInfo());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchCustomerChangePaperRecs());
//   }, [dispatch]);


//   useEffect(() => {
//     if (agency) {
//       dispatch(getPaperRecordsByAgency(agency));
//     }
//   }, [agency, dispatch]);

//   // Helper function unchanged
//   const isSameCurrentMonth = (from, to) => {
//     if (!from || !to) return false;
//     const fromDateObj = new Date(from);
//     const toDateObj = new Date(to);
//     const now = new Date();
//     return (
//       fromDateObj.getMonth() === now.getMonth() &&
//       fromDateObj.getFullYear() === now.getFullYear() &&
//       toDateObj.getMonth() === now.getMonth() &&
//       toDateObj.getFullYear() === now.getFullYear()
//     );
//   };

//   const handleSubmit = async () => {
//     if (!fromDate || !toDate || !currentPaper) {

//       return;
//     }

//     if (!isSameCurrentMonth(fromDate, toDate)) {
//       setDateError('Dates must be within the current month.');
//       return;
//     }

//     const newReport = {
//       agency_id: agency_Id,
//       customer_paper_rec_id: currentPaper,
//       from_date: fromDate,
//       to_date: toDate,
//       remarks: remarks || '-',
//       status: 2,
//     };
//     try {
//       const result = await dispatch(createReport(newReport)).unwrap();
//       if (result.status === true) {
//         toast.success("Report submitted successfully.");
//         dispatch(fetchReport());
//         setFromDate('');
//         setToDate('');
//         setRemarks('');
//         setDateError('');
//         setCurrentPaper('');
//       } else {
//         toast.error(result.message || "Report submission failed.");
//       }
//     } catch (error) {
//       toast.error(error?.message);
//       setDateError(typeof error === "string" ? error : error?.message || "Submission failed");
//     }

//   };

//   useEffect(() => {
//     if (fromDate && toDate && !isSameCurrentMonth(fromDate, toDate)) {
//       setDateError('Dates must be within the current month.');
//     } else {
//       setDateError('');
//     }
//   }, [fromDate, toDate]);

//   // Columns for the table (unchanged)
//   const columns = [
//     { name: 'VN', selector: row => row.id, sortable: true },
//     { name: 'NewsPaper Name', selector: row => row.serviceName, sortable: true },
//     { name: 'From', selector: row => row.from },
//     { name: 'To', selector: row => row.to },
//     { name: 'Create Date', selector: row => row.createDate },
//     {
//       name: "Status",
//       selector: (row) => row.status,
//       sortable: true,
//       cell: (row) => (
//         <span
//           className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Resolved"
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-700"
//             }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     { name: 'Remarks', selector: row => row.remarks, wrap: true },
//   ];

//   // Custom loading and error handling for the DataTable
//   const customNoDataComponent = () => (
//     <div className="flex justify-center items-center text-gray-600">
//       {loading ? (
//         <div className="flex items-center">
//           <FiLoader className="animate-spin text-amber-600 text-4xl mr-2" />
//           <span>Loading Data...</span>
//         </div>
//       ) : error ? (
//         <div className="text-red-600 flex items-center">
//           <FiUser className="text-4xl mr-2" />
//           <span>Error: {error}</span>
//         </div>
//       ) : (
//         <span>No data available.</span>
//       )}
//     </div>
//   );

//   // Filtered records based on selected agency
//   const filteredRecords = records.filter((item) => item.agency_id === parseInt(agency));

//   const agencyOptions = customerCareInfo?.map((agency) => ({
//     id: agency.id,
//     name: agency.agency_name,
//   }));

//   const currentPaperOptions = filteredRecords.map((item) => ({
//     id: item.id,
//     name: item.papername,
//   }));



//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-6">
//       <h2 className="text-xl font-bold text-amber-700 mb-4">
//         Didn’t receive your paper? <br className="sm:hidden" /> Report it here
//       </h2>

//       {/* Inline Report Form */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

//         <div>
//           <label className="block font-semibold text-amber-800">
//             Current Paper
//           </label>
//           <select
//             value={currentPaper}
//             onChange={(e) => setCurrentPaper(e.target.value)}
//             className="w-full border border-amber-400 rounded p-2"
//           >
//             <option value="">Select Current Paper</option>
//             {data?.data?.map((item) => (
//               <option key={item.id} value={item.id}>
//                 {`${item.paper_details?.news_paper_name || "N/A"} - ${item.paper_details?.language_details?.language_name || "Unknown"
//                   }`}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-amber-700 mb-1">From (Date)</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-amber-700 mb-1">To (Date)</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
//           />
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-amber-700 mb-1">Remarks</label>
//         <textarea
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//           placeholder="Add remarks (optional)"
//           className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
//           rows={3}
//         />
//       </div>

//       {dateError && <p className="text-red-600 mb-4">{dateError}</p>}

//       <button
//         onClick={handleSubmit}
//         disabled={!fromDate || !toDate || !currentPaper || !!dateError}
//         className={`px-6 py-2 rounded text-white font-semibold transition ${!fromDate || !toDate || !currentPaper || !!dateError
//           ? 'bg-amber-300 cursor-not-allowed'
//           : 'bg-amber-600 hover:bg-amber-700'
//           }`}
//       >
//         Submit Report
//       </button>

//       {/* Report Table */}
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-amber-700 mb-4">Reported Issues</h3>
//         <DataTable
//           columns={columns}
//           data={reports}
//           pagination
//           striped
//           highlightOnHover
//           noDataComponent={customNoDataComponent()}
//         />
//       </div>
//     </div>
//   );
// };

// export default Report;



import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReport, createReport } from '../redux/slices/reportSlice';
import { fetchChangeRequests } from "../redux/slices/changePaperSlice";
import { FiUser, FiLoader } from 'react-icons/fi';
import { getPaperRecordsByAgency } from '../redux/slices/paperSlice';
import { getCustomerCareInfo } from "../redux/slices/customerCareSlice";
import { fetchCustomerChangePaperRecs } from '../redux/slices/customerChangePaperRecSlice';
import toast from 'react-hot-toast';

const Report = () => {
  const dispatch = useDispatch();
  const { data: reportResponse, loading, error } = useSelector((state) => state.report);
  const { requests = [], loading: loadingRequests } = useSelector((state) => state.changePaper);
  const { records, loading: loadingAgencyPapers, error: errorAgencyPapers } = useSelector((state) => state.papers);
  const { customerCareInfo, success } = useSelector((state) => state.customerCare);
  const rawData = Array.isArray(reportResponse?.data) ? reportResponse.data : [];

  const reports = rawData.map((item) => ({
    id: item.id,
    serviceName: item.paper_details?.news_paper_name || 'N/A',
    from: item.from_date,
    to: item.to_date,
    createDate: new Date(item.created_at).toLocaleDateString(),
    status: item.status_rec === 1 ? 'Resolved' : 'Pending',
    remarks: item.remarks || '-',
  }));

  const { data } = useSelector((state) => state.customerChangePaperRec);
  const agncyId = data?.data?.map((item) => item.agency_id);
  let agency_Id = agncyId?.[0];

  const [currentPaper, setCurrentPaper] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [dateError, setDateError] = useState('');
  const [agency, setAgency] = useState("");

  useEffect(() => {
    dispatch(fetchReport());
    dispatch(fetchChangeRequests());
    dispatch(getCustomerCareInfo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCustomerChangePaperRecs());
  }, [dispatch]);

  useEffect(() => {
    if (agency) {
      dispatch(getPaperRecordsByAgency(agency));
    }
  }, [agency, dispatch]);

  const isSameCurrentMonth = (from, to) => {
    if (!from || !to) return false;
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);
    const now = new Date();
    return (
      fromDateObj.getMonth() === now.getMonth() &&
      fromDateObj.getFullYear() === now.getFullYear() &&
      toDateObj.getMonth() === now.getMonth() &&
      toDateObj.getFullYear() === now.getFullYear()
    );
  };

  // Check if new date range overlaps with existing reports for current paper & agency
  const isOverlap = (newFrom, newTo) => {
    return rawData.some(item =>
      item.customer_paper_rec_id === currentPaper &&
      item.agency_id === agency_Id &&
      Math.max(new Date(newFrom), new Date(item.from_date)) <= Math.min(new Date(newTo), new Date(item.to_date))
    );
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !currentPaper) {
      return;
    }

    if (!isSameCurrentMonth(fromDate, toDate)) {
      setDateError('Dates must be within the current month.');
      return;
    }

    if (isOverlap(fromDate, toDate)) {
      setDateError("These dates overlap with an existing report.");
      return;
    }

    const newReport = {
      agency_id: agency_Id,
      customer_paper_rec_id: currentPaper,
      from_date: fromDate,
      to_date: toDate,
      remarks: remarks || '-',
      status: 2,
    };

    try {
      const result = await dispatch(createReport(newReport)).unwrap();
      if (result.status === true) {
        toast.success("Report submitted successfully.");
        dispatch(fetchReport());
        setFromDate('');
        setToDate('');
        setRemarks('');
        setDateError('');
        setCurrentPaper('');
      } else {
        toast.error(result.message || "Report submission failed.");
      }
    } catch (error) {
      toast.error(error?.message || "Submission failed");
      setDateError(typeof error === "string" ? error : error?.message || "Submission failed");
    }
  };

  useEffect(() => {
    if (fromDate && toDate && !isSameCurrentMonth(fromDate, toDate)) {
      setDateError('Dates must be within the current month.');
    } else {
      setDateError('');
    }
  }, [fromDate, toDate]);

  const columns = [
    { name: 'VN', selector: row => row.id, sortable: true },
    { name: 'NewsPaper Name', selector: row => row.serviceName, sortable: true },
    { name: 'From', selector: row => row.from },
    { name: 'To', selector: row => row.to },
    { name: 'Create Date', selector: row => row.createDate },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Resolved"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    { name: 'Remarks', selector: row => row.remarks, wrap: true },
  ];

  const customNoDataComponent = () => (
    <div className="flex justify-center items-center text-gray-600">
      {loading ? (
        <div className="flex items-center">
          <FiLoader className="animate-spin text-amber-600 text-4xl mr-2" />
          <span>Loading Data...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 flex items-center">
          <FiUser className="text-4xl mr-2" />
          <span>Error: {error}</span>
        </div>
      ) : (
        <span>No data available.</span>
      )}
    </div>
  );

  const filteredRecords = records.filter((item) => item.agency_id === parseInt(agency));

  const agencyOptions = customerCareInfo?.map((agency) => ({
    id: agency.id,
    name: agency.agency_name,
  }));

  const currentPaperOptions = filteredRecords.map((item) => ({
    id: item.id,
    name: item.papername,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-6">
      <h2 className="text-xl font-bold text-amber-700 mb-4">
        Didn’t receive your paper? <br className="sm:hidden" /> Report it here
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-amber-800">
            Current Paper
          </label>
          <select
            value={currentPaper}
            onChange={(e) => setCurrentPaper(e.target.value)}
            className="w-full border border-amber-400 rounded p-2"
          >
            <option value="">Select Current Paper</option>
            {data?.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {`${item.paper_details?.news_paper_name || "N/A"} - ${item.paper_details?.language_details?.language_name || "Unknown"
                  }`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">From (Date)</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">To (Date)</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-amber-700 mb-1">Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks (optional)"
          className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
          rows={3}
        />
      </div>

      {dateError && <p className="text-red-600 mb-4">{dateError}</p>}

      <button
        onClick={handleSubmit}
        disabled={!fromDate || !toDate || !currentPaper || !!dateError}
        className={`px-6 py-2 rounded text-white font-semibold transition ${!fromDate || !toDate || !currentPaper || !!dateError
          ? 'bg-amber-300 cursor-not-allowed'
          : 'bg-amber-600 hover:bg-amber-700'
          }`}
      >
        Submit Report
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-amber-700 mb-4">Reported Issues</h3>
        <DataTable
          columns={columns}
          data={reports}
          pagination
          striped
          highlightOnHover
          noDataComponent={customNoDataComponent()}
        />
      </div>
    </div>
  );
};

export default Report;
