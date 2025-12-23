

// // import React, { useEffect, useState } from "react";
// // import DataTable from "react-data-table-component";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchNewspaperLanguageById,
// //   fetchNewspaperLanguages,
// // } from "../../../redux/slices/newspaperLanguageSlice";
// // import { fetchLineData } from "../../../redux/slices/lineSlice";
// // import { fetchRevenueReports } from "../../../redux/slices/revenueReportSlice";
// // import Select from "react-select";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   CartesianGrid,
// // } from "recharts";

// // const RevenueReports = () => {
// //   const dispatch = useDispatch();

// //   const { lineData, loading: lineLoading, error: lineError } = useSelector(
// //     (state) => state.line
// //   );
// //   const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
// //     useSelector((state) => state.newspaperLanguage);
// //   const { reports = [], loading, error } = useSelector((state) => state.revenue);

// //   const [selectedLanguage, setSelectedLanguage] = useState(null);
// //   const [selectedNewspaper, setSelectedNewspaper] = useState(null);
// //   const [line, setLine] = useState("All");
// //   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

// //   // Mock chart data (replace with API response if available)
// //   const chartData = [
// //     { month: "Jan", revenue: 12000 },
// //     { month: "Feb", revenue: 15000 },
// //     { month: "Mar", revenue: 18000 },
// //     { month: "Apr", revenue: 22000 },
// //     { month: "May", revenue: 19000 },
// //     { month: "Jun", revenue: 24000 },
// //     { month: "Jul", revenue: 26000 },
// //     { month: "Aug", revenue: 30000 },
// //     { month: "Sep", revenue: 28000 },
// //     { month: "Oct", revenue: 31000 },
// //     { month: "Nov", revenue: 27000 },
// //     { month: "Dec", revenue: 32000 },
// //   ];

// //   // Mock table data
// //   const tableData = chartData.map((item, i) => ({
// //     id: i + 1,
// //     month: item.month,
// //     revenue: item.revenue,
// //     growth:
// //       i === 0
// //         ? "-"
// //         : `${(((item.revenue - chartData[i - 1].revenue) /
// //           chartData[i - 1].revenue) *
// //           100).toFixed(1)}%`,
// //   }));

// //   const columns = [
// //     { name: "Month", selector: (row) => row.month, sortable: true },
// //     {
// //       name: "Revenue (₹)",
// //       selector: (row) => `₹${row.revenue.toLocaleString()}`,
// //       sortable: true,
// //     },
// //     { name: "Growth", selector: (row) => row.growth, sortable: true },
// //   ];

// //   useEffect(() => {
// //     dispatch(fetchLineData());
// //     dispatch(fetchNewspaperLanguages());
// //     dispatch(fetchRevenueReports({ year: selectedYear }));
// //   }, [dispatch]);

// //   const selectStyles = {
// //     control: (provided, state) => ({
// //       ...provided,
// //       minHeight: "40px",
// //       borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
// //       boxShadow: state.isFocused
// //         ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
// //         : provided.boxShadow,
// //       "&:hover": { borderColor: "#F59E0B" },
// //     }),
// //   };

// //   // Generate last 3 years
// //   const currentYear = new Date().getFullYear();
// //   const yearOptions = [
// //     { value: currentYear, label: `${currentYear}` },
// //     { value: currentYear - 1, label: `${currentYear - 1}` },
// //     { value: currentYear - 2, label: `${currentYear - 2}` },
// //   ];

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6 text-amber-600">
// //         Revenue Reports
// //       </h2>

// //       {/* Filters */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
// //         {/* Year */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Year
// //           </label>
// //           <Select
// //             options={yearOptions}
// //             value={yearOptions.find((y) => y.value === selectedYear)}
// //             onChange={(option) => setSelectedYear(option.value)}
// //             styles={selectStyles}
// //             isSearchable={false}
// //           />
// //         </div>

// //         {/* Language */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Language
// //           </label>
// //           <Select
// //             options={languages.map((l) => ({
// //               value: l.id,
// //               label: l.language_name,
// //             }))}
// //             value={selectedLanguage}
// //             onChange={(option) => {
// //               setSelectedLanguage(option);
// //               if (option) dispatch(fetchNewspaperLanguageById(option.value));
// //             }}
// //             isClearable
// //             isSearchable
// //             placeholder="Select Language"
// //             styles={selectStyles}
// //           />
// //         </div>

// //         {/* Newspaper */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Newspaper
// //           </label>
// //           <Select
// //             options={
// //               Array.isArray(selectedNewspaperLanguage)
// //                 ? selectedNewspaperLanguage.map((n) => ({
// //                   value: n.id,
// //                   label: n.news_paper_name,
// //                 }))
// //                 : []
// //             }
// //             value={selectedNewspaper}
// //             onChange={setSelectedNewspaper}
// //             isClearable
// //             isSearchable
// //             placeholder="Select Newspaper"
// //             styles={selectStyles}
// //           />
// //         </div>
// //         {/* Line */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Line
// //           </label>
// //           <select
// //             value={line}
// //             onChange={(e) => setLine(e.target.value)}
// //             className="w-full border border-gray-300 rounded-md px-3 py-2  focus:outline-none focus:ring-2 focus:ring-amber-500"
// //           >
// //             <option value="All">Select Line</option>
// //             {lineData?.map((lineItem) => (
// //               <option key={lineItem.id} value={lineItem.id}>
// //                 {lineItem.line_name}
// //               </option>
// //             ))}
// //           </select>
// //           {lineError && (
// //             <p className="text-red-600 text-sm mt-1">{lineError}</p>
// //           )}
// //         </div>
// //       </div>
// //       {/* Chart + Table */}
// //       <div className="grid grid-cols-1  gap-8">
// //         {/* Bar Chart */}
// //         <div className="w-full h-[350px] bg-gray-50 p-4 rounded-lg shadow-inner">
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">
// //             Monthly Revenue Overview ({selectedYear})
// //           </h3>
// //           <ResponsiveContainer width="100%" height="100%">
// //             <BarChart data={chartData}>
// //               <CartesianGrid strokeDasharray="3 3" vertical={false} />
// //               <XAxis dataKey="month" />
// //               <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
// //               <Tooltip
// //                 formatter={(value) => `₹${value.toLocaleString()}`}
// //                 cursor={{ fill: "rgba(245, 158, 11, 0.1)" }}
// //               />
// //               <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RevenueReports;


// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchNewspaperLanguageById,
//   fetchNewspaperLanguages,
// } from "../../../redux/slices/newspaperLanguageSlice";
// import { fetchLineData } from "../../../redux/slices/lineSlice";
// import { fetchRevenueReports } from "../../../redux/slices/revenueReportSlice";
// import Select from "react-select";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const RevenueReports = () => {
//   const dispatch = useDispatch();

//   const { lineData, error: lineError } = useSelector((state) => state.line);
//   const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
//     useSelector((state) => state.newspaperLanguage);
//   const { reports = [], loading } = useSelector((state) => state.revenue);
//   console.log("Reports:", reports);


//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [selectedNewspaper, setSelectedNewspaper] = useState(null);
//   const [line, setLine] = useState("All");
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // Fetch initial data
//   useEffect(() => {
//     dispatch(fetchLineData());
//     dispatch(fetchNewspaperLanguages());
//   }, [dispatch]);

//   // Fetch revenue reports when filters change
//   useEffect(() => {
//     const payload = {
//       year: selectedYear,
//       line_id: line !== "All" ? line : "",
//       language_id: selectedLanguage?.value || "",
//       newspaper_id: selectedNewspaper?.value || "",
//     };

//     dispatch(fetchRevenueReports(payload));
//   }, [selectedYear, line, selectedLanguage, selectedNewspaper, dispatch]);

//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: "40px",
//       borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
//       boxShadow: state.isFocused
//         ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
//         : provided.boxShadow,
//       "&:hover": { borderColor: "#F59E0B" },
//     }),
//   };

//   // Generate last 3 years
//   const currentYear = new Date().getFullYear();
//   const yearOptions = [
//     { value: currentYear, label: `${currentYear}` },
//     { value: currentYear - 1, label: `${currentYear - 1}` },
//     { value: currentYear - 2, label: `${currentYear - 2}` },
//   ];

//   // Example static chart data (replace with `reports` if API returns data)
//   const chartData =
//     reports?.data?.length > 0
//       ? reports.data
//       : [
//         { month: "Jan", revenue: 12000 },
//         { month: "Feb", revenue: 15000 },
//         { month: "Mar", revenue: 18000 },
//         { month: "Apr", revenue: 22000 },
//         { month: "May", revenue: 19000 },
//         { month: "Jun", revenue: 24000 },
//         { month: "Jul", revenue: 26000 },
//         { month: "Aug", revenue: 30000 },
//         { month: "Sep", revenue: 28000 },
//         { month: "Oct", revenue: 31000 },
//         { month: "Nov", revenue: 27000 },
//         { month: "Dec", revenue: 32000 },
//       ];

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-amber-600">
//         Revenue Reports
//       </h2>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//         {/* Year */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Year
//           </label>
//           <Select
//             options={yearOptions}
//             value={yearOptions.find((y) => y.value === selectedYear)}
//             onChange={(option) => setSelectedYear(option.value)}
//             styles={selectStyles}
//             isSearchable={false}
//           />
//         </div>

//         {/* Language */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Language
//           </label>
//           <Select
//             options={languages.map((l) => ({
//               value: l.id,
//               label: l.language_name,
//             }))}
//             value={selectedLanguage}
//             onChange={(option) => {
//               setSelectedLanguage(option);
//               setSelectedNewspaper(null);
//               if (option) dispatch(fetchNewspaperLanguageById(option.value));
//             }}
//             isClearable
//             isSearchable
//             placeholder="Select Language"
//             styles={selectStyles}
//           />
//         </div>

//         {/* Newspaper */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Newspaper
//           </label>
//           <Select
//             options={
//               Array.isArray(selectedNewspaperLanguage)
//                 ? selectedNewspaperLanguage.map((n) => ({
//                   value: n.id,
//                   label: n.news_paper_name,
//                 }))
//                 : []
//             }
//             value={selectedNewspaper}
//             onChange={setSelectedNewspaper}
//             isClearable
//             isSearchable
//             placeholder="Select Newspaper"
//             styles={selectStyles}
//           />
//         </div>

//         {/* Line */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Line
//           </label>
//           <select
//             value={line}
//             onChange={(e) => setLine(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//           >
//             <option value="All">Select Line</option>
//             {lineData?.map((lineItem) => (
//               <option key={lineItem.id} value={lineItem.id}>
//                 {lineItem.line_name}
//               </option>
//             ))}
//           </select>
//           {lineError && (
//             <p className="text-red-600 text-sm mt-1">{lineError}</p>
//           )}
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="w-full h-[350px] bg-gray-50 p-4 rounded-lg shadow-inner">
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">
//           Monthly Revenue Overview ({selectedYear})
//         </h3>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="month" />
//             <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
//             <Tooltip
//               formatter={(value) => `₹${value.toLocaleString()}`}
//               cursor={{ fill: "rgba(245, 158, 11, 0.1)" }}
//             />
//             <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default RevenueReports;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../../redux/slices/newspaperLanguageSlice";
import { fetchLineData } from "../../../redux/slices/lineSlice";
import { fetchRevenueReports } from "../../../redux/slices/revenueReportSlice";
import Select from "react-select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueReports = () => {
  const dispatch = useDispatch();

  const { lineData, error: lineError } = useSelector((state) => state.line);
  const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
    useSelector((state) => state.newspaperLanguage);
  const { reports = {}, loading } = useSelector((state) => state.revenue);

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [line, setLine] = useState("All");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchLineData());
    dispatch(fetchNewspaperLanguages());
  }, [dispatch]);

  // Fetch revenue reports when filters change
  useEffect(() => {
    const payload = {
      year: selectedYear,
      line: line !== "All" ? line : "",
      language: selectedLanguage?.value || "",
      newspaper_id: selectedNewspaper?.value || "",
    };

    dispatch(fetchRevenueReports(payload));
  }, [selectedYear, line, selectedLanguage, selectedNewspaper, dispatch]);

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
        : provided.boxShadow,
      "&:hover": { borderColor: "#F59E0B" },
    }),
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: currentYear, label: `${currentYear}` },
    { value: currentYear - 1, label: `${currentYear - 1}` },
    { value: currentYear - 2, label: `${currentYear - 2}` },
  ];

  // Create monthly chart data from revenuechart array
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData =
    reports?.revenuechart?.map((value, index) => ({
      month: months[index],
      revenue: value,
    })) || [];



  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-600">
        Revenue Reports
      </h2>
      {/* ✅ Filters (keep existing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <Select
            options={yearOptions}
            value={yearOptions.find((y) => y.value === selectedYear)}
            onChange={(option) => setSelectedYear(option.value)}
            styles={selectStyles}
            isSearchable={false}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <Select
            options={languages.map((l) => ({
              value: l.id,
              label: l.language_name,
            }))}
            value={selectedLanguage}
            onChange={(option) => {
              setSelectedLanguage(option);
              setSelectedNewspaper(null);
              if (option) dispatch(fetchNewspaperLanguageById(option.value));
            }}
            isClearable
            isSearchable
            placeholder="Select Language"
            styles={selectStyles}
          />
        </div>

        {/* Newspaper */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Newspaper
          </label>
          <Select
            options={
              Array.isArray(selectedNewspaperLanguage)
                ? selectedNewspaperLanguage.map((n) => ({
                  value: n.id,
                  label: n.news_paper_name,
                }))
                : []
            }
            value={selectedNewspaper}
            onChange={setSelectedNewspaper}
            isClearable
            isSearchable
            placeholder="Select Newspaper"
            styles={selectStyles}
          />
        </div>

        {/* Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Line
          </label>
          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">Select Line</option>
            {lineData?.map((lineItem) => (
              <option key={lineItem.id} value={lineItem.id}>
                {lineItem.line_name}
              </option>
            ))}
          </select>
          {lineError && (
            <p className="text-red-600 text-sm mt-1">{lineError}</p>
          )}
        </div>

      </div>
      {/* ✅ Top Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            ₹{reports?.total_r || 0}
          </p>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-green-700">
            Complete Settlement
          </h3>
          <p className="text-2xl font-bold text-green-900 mt-2">
            ₹{reports?.total_cs || 0}
          </p>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-900 mt-2">
            ₹{reports?.total_pending || 0}
          </p>
        </div>
      </div>

      {/* ✅ Bar Chart */}
      <div className="w-full h-[350px] bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Monthly Revenue Overview ({selectedYear})
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                formatter={(value) => `₹${value}`}
                cursor={{ fill: "rgba(245, 158, 11, 0.1)" }}
              />
              <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueReports;
