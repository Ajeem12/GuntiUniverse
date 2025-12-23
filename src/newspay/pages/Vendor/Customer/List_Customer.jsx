// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { FiSearch, FiEdit } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";
// import { fetchCustomers } from "../../../redux/slices/customerSlice";
// import VendorLoader from '../../../components/vendor/VendorLoader';
// import {
//   changeCustomerStatus,
//   resetStatusState,
// } from '../../../redux/slices/customerChangeStatusSlice';
// import {
//   fetchNewspaperLanguageById,
//   fetchNewspaperLanguages,
// } from "../../../redux/slices/newspaperLanguageSlice";
// import { fetchLineData } from "../../../redux/slices/lineSlice";
// import { useNavigate } from 'react-router-dom';
// const List_Customer = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [line, setLine] = useState("All");
//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [selectedNewspaper, setSelectedNewspaper] = useState(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { customers = [], loading, error } = useSelector((state) => state.customer);
//   const { loading: loader, success, error: errors } = useSelector((state) => state.customerChangeStatus);
//   const { lineData, loading: lineLoading, error: lineError } = useSelector(
//     (state) => state.line
//   );
//   const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
//     useSelector((state) => state.newspaperLanguage);


//   useEffect(() => {
//     dispatch(fetchCustomers());
//     dispatch(fetchLineData());
//     dispatch(fetchNewspaperLanguages());
//   }, [dispatch]);

//   // Map customers for the table including newspapers (multiple)
//   // const mappedCustomers = customers.map((cust) => ({
//   //   id: cust.id,
//   //   name: cust.name,
//   //   mobile: cust.mobile,
//   //   address: cust.address,
//   //   remarks: cust.remarks,
//   //   // Use the first subscription language as main language display (optional)
//   //   language:
//   //     cust.customer_paper_rec && cust.customer_paper_rec.length > 0
//   //       ? cust?.customer_paper_rec[0].language_details.language_name
//   //       : "N/A",
//   //   // Format newspapers with language like "Dainik Bhashkar - Hindi, Times Of India - English"
//   //   newspapers:
//   //     cust.customer_paper_rec && cust.customer_paper_rec.length > 0
//   //       ? cust.customer_paper_rec
//   //         .map(
//   //           (rec) =>
//   //             `${rec.paper_details.news_paper_name} - ${rec.language_details.language_name}`
//   //         )
//   //         .join(", ")
//   //       : "No subscription",
//   //   status: cust.status,
//   // }));


//   const mappedCustomers = customers.map((cust) => ({
//     id: cust.id,
//     name: cust.name,
//     mobile: cust.mobile,
//     address: cust.address,
//     remarks: cust.remarks,
//     line_id: cust.line, // 👈 add this line
//     language:
//       cust.customer_paper_rec && cust.customer_paper_rec.length > 0
//         ? cust?.customer_paper_rec[0].language_details.language_name
//         : "N/A",
//     newspapers:
//       cust.customer_paper_rec && cust.customer_paper_rec.length > 0
//         ? cust.customer_paper_rec
//           .map(
//             (rec) =>
//               `${rec.paper_details.news_paper_name} - ${rec.language_details.language_name}`
//           )
//           .join(", ")
//         : "No subscription",
//     status: cust.status,
//   }));


//   // Filter customers based on search term (including newspapers now)
//   // const filteredCustomers = mappedCustomers.filter((customer) => {
//   //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
//   //   return (
//   //     (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
//   //     (customer.mobile && customer.mobile.includes(searchTerm)) ||
//   //     (customer.address && customer.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
//   //     (customer.newspapers && customer.newspapers.toLowerCase().includes(lowerCaseSearchTerm))
//   //   );
//   // });

//   // Filter customers based on search term and line
//   const filteredCustomers = mappedCustomers.filter((customer) => {
//     const lowerCaseSearchTerm = searchTerm.toLowerCase();

//     const matchesSearch =
//       (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
//       (customer.mobile && customer.mobile.includes(searchTerm)) ||
//       (customer.address && customer.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
//       (customer.newspapers && customer.newspapers.toLowerCase().includes(lowerCaseSearchTerm));

//     // If "All" selected → show all customers
//     if (line === "All") return matchesSearch;

//     // Otherwise, check if the customer's line matches selected line ID
//     return matchesSearch && customer.line_id === Number(line);
//   });

//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: "44px",
//       borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
//       boxShadow: state.isFocused
//         ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
//         : provided.boxShadow,
//       "&:hover": { borderColor: "#F59E0B" },
//     }),
//   };


//   const handleClick = (customerId) => {
//     navigate(`/vendor/customer/add/${customerId}`);
//   };


//   useEffect(() => {
//     if (success) {
//       dispatch(resetStatusState());
//       dispatch(fetchCustomers());
//     }
//   }, [success, dispatch]);

//   const columns = [
//     {
//       name: "S.no",
//       cell: (row, index) => <div className="py-2">{index + 1}</div>,
//       minWidth: "80px",
//       center: true,
//     },
//     {
//       name: "Customer",
//       selector: (row) => row.name,
//       sortable: true,
//       cell: (row) => (
//         <div className="py-2">
//           <div className="font-medium text-gray-900">{row.name}</div>
//           <div className="text-sm text-gray-500">{row.mobile}</div>
//           <div className="text-xs text-gray-400">{row.address}</div>
//         </div>
//       ),
//       minWidth: "200px",
//     },
//     {
//       name: "Newspapers",
//       selector: (row) => row.newspapers,
//       cell: (row) => <div className="py-2">{row.newspapers}</div>,
//       minWidth: "180px",
//     },

//     {
//       name: "Remarks",
//       selector: (row) => row.remarks,
//       cell: (row) => <div className="py-2">{row.remarks || "-"}</div>,
//       minWidth: "150px",
//     },
//     {
//       name: "Status",
//       cell: (row) => (
//         <button

//           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-colors duration-200
//             ${row.status === 1
//               ? "bg-green-200 text-green-800 hover:bg-green-300"
//               : "bg-red-200 text-red-800 hover:bg-red-300"
//             }`}
//         >
//           <span
//             className={`h-2 w-2 rounded-full mr-2 ${row.status === 1 ? "bg-green-600" : "bg-red-600"
//               }`}
//           ></span>
//           {row.status === 1 ? "Active" : "Inactive"}
//         </button>
//       ),
//       minWidth: "140px",
//       center: true,
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="flex space-x-2">
//           <button
//             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//             onClick={() => handleClick(row.id)}
//           >
//             <FiEdit size={16} />
//           </button>
//         </div>
//       ),
//       minWidth: "120px",
//     },
//   ];

//   const customStyles = {
//     headRow: {
//       style: {
//         backgroundColor: "#f9fafb",
//         fontWeight: "bold",
//         fontSize: "0.875rem",
//       },
//     },
//     cells: {
//       style: {
//         padding: "0.5rem",
//       },
//     },
//   };

//   if (loading) return <VendorLoader />;

//   return (
//     <div className="max-w-7xl mx-auto p-1 md:p-2">
//       {/* Header Section */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
//             <p className="text-gray-500 text-sm mt-1">
//               View and manage all your registered customers
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search Input */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search customers by name, mobile, address, or newspapers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="grid  grid-cols-1 md:grid-cols-3 gap-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Line
//           </label>
//           <select
//             value={line}
//             onChange={(e) => setLine(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
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
//         {/* Newspaper Language */}
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
//       </div>
//       {/* Results Count */}
//       <div className="mb-4">
//         <p className="text-sm text-gray-600">
//           Showing {filteredCustomers.length} of {mappedCustomers.length} customers
//         </p>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
//         <DataTable
//           columns={columns}
//           data={filteredCustomers}
//           pagination
//           paginationPerPage={10}
//           paginationRowsPerPageOptions={[5, 10, 20, 50]}
//           highlightOnHover
//           striped
//           responsive
//           customStyles={customStyles}
//           noDataComponent={
//             <div className="text-center py-8 text-gray-500">
//               <FiSearch size={48} className="mx-auto mb-4 text-gray-300" />
//               <p className="text-lg font-medium">No customers found</p>
//               <p className="text-sm">Try adjusting your search or filters</p>
//             </div>
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default List_Customer;



import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FiSearch, FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCustomers } from "../../../redux/slices/customerSlice";
import VendorLoader from '../../../components/vendor/VendorLoader';
import {
  changeCustomerStatus,
  resetStatusState,
} from '../../../redux/slices/customerChangeStatusSlice';
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../../redux/slices/newspaperLanguageSlice";
import { fetchLineData } from "../../../redux/slices/lineSlice";
import { useNavigate } from 'react-router-dom';
const List_Customer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [line, setLine] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers = [], loading, error } = useSelector((state) => state.customer);
  const { loading: loader, success, error: errors } = useSelector((state) => state.customerChangeStatus);
  const { lineData, loading: lineLoading, error: lineError } = useSelector(
    (state) => state.line
  );
  const { languages = [], selectedLanguage: selectedNewspaperLanguage = [] } =
    useSelector((state) => state.newspaperLanguage);


  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchLineData());
    dispatch(fetchNewspaperLanguages());
  }, [dispatch]);

  // Map customers for the table including newspapers (multiple)
  // const mappedCustomers = customers.map((cust) => ({
  //   id: cust.id,
  //   name: cust.name,
  //   mobile: cust.mobile,
  //   address: cust.address,
  //   remarks: cust.remarks,
  //   // Use the first subscription language as main language display (optional)
  //   language:
  //     cust.customer_paper_rec && cust.customer_paper_rec.length > 0
  //       ? cust?.customer_paper_rec[0].language_details.language_name
  //       : "N/A",
  //   // Format newspapers with language like "Dainik Bhashkar - Hindi, Times Of India - English"
  //   newspapers:
  //     cust.customer_paper_rec && cust.customer_paper_rec.length > 0
  //       ? cust.customer_paper_rec
  //         .map(
  //           (rec) =>
  //             `${rec.paper_details.news_paper_name} - ${rec.language_details.language_name}`
  //         )
  //         .join(", ")
  //       : "No subscription",
  //   status: cust.status,
  // }));


  const mappedCustomers = customers.map((cust) => ({
    id: cust.id,
    name: cust.name,
    mobile: cust.mobile,
    address: cust.address,
    remarks: cust.remarks,
    line_id: cust.line, // 👈 add this line
    language:
      cust.customer_paper_rec && cust.customer_paper_rec.length > 0
        ? cust?.customer_paper_rec[0].language_details.language_name
        : "N/A",
    newspapers:
      cust.customer_paper_rec && cust.customer_paper_rec.length > 0
        ? cust.customer_paper_rec
          .map(
            (rec) =>
              `${rec.paper_details.news_paper_name} - ${rec.language_details.language_name}`
          )
          .join(", ")
        : "No subscription",
    status: cust.status,
  }));


  // Filter customers based on search term (including newspapers now)
  // const filteredCustomers = mappedCustomers.filter((customer) => {
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   return (
  //     (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
  //     (customer.mobile && customer.mobile.includes(searchTerm)) ||
  //     (customer.address && customer.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
  //     (customer.newspapers && customer.newspapers.toLowerCase().includes(lowerCaseSearchTerm))
  //   );
  // });

  // Filter customers based on search term and line
  // Filter customers based on search term, line, language, and newspaper
  const filteredCustomers = mappedCustomers.filter((customer) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // 🔍 Text search filter
    const matchesSearch =
      (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (customer.mobile && customer.mobile.includes(searchTerm)) ||
      (customer.address && customer.address.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (customer.newspapers && customer.newspapers.toLowerCase().includes(lowerCaseSearchTerm));

    // 🧭 Line filter
    const matchesLine = line === "All" || customer.line_id === Number(line);

    // 🗞️ Newspaper filter
    const matchesNewspaper =
      !selectedNewspaper ||
      (customer.newspapers &&
        customer.newspapers
          .toLowerCase()
          .includes(selectedNewspaper.label.toLowerCase()));

    // 🗣️ Language filter
    const matchesLanguage =
      !selectedLanguage ||
      (customer.language &&
        customer.language.toLowerCase().includes(selectedLanguage.label.toLowerCase()));

    // ✅ Final filter condition
    return matchesSearch && matchesLine && matchesNewspaper && matchesLanguage;
  });


  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderColor: state.isFocused ? "#F59E0B" : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(245, 158, 11, 0.3)"
        : provided.boxShadow,
      "&:hover": { borderColor: "#F59E0B" },
    }),
  };


  const handleClick = (customerId) => {
    navigate(`/vendor/customer/add/${customerId}`);
  };


  useEffect(() => {
    if (success) {
      dispatch(resetStatusState());
      dispatch(fetchCustomers());
    }
  }, [success, dispatch]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div className="py-2">{index + 1}</div>,
      minWidth: "80px",
      center: true,
    },
    {
      name: "Customer",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="py-2">
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.mobile}</div>
          <div className="text-xs text-gray-400">{row.address}</div>
        </div>
      ),
      minWidth: "200px",
    },
    {
      name: "Newspapers",
      selector: (row) => row.newspapers,
      cell: (row) => <div className="py-2">{row.newspapers}</div>,
      minWidth: "180px",
    },

    {
      name: "Remarks",
      selector: (row) => row.remarks,
      cell: (row) => <div className="py-2">{row.remarks || "-"}</div>,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <button

          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-colors duration-200
            ${row.status === 1
              ? "bg-green-200 text-green-800 hover:bg-green-300"
              : "bg-red-200 text-red-800 hover:bg-red-300"
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full mr-2 ${row.status === 1 ? "bg-green-600" : "bg-red-600"
              }`}
          ></span>
          {row.status === 1 ? "Active" : "Inactive"}
        </button>
      ),
      minWidth: "140px",
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => handleClick(row.id)}
          >
            <FiEdit size={16} />
          </button>
        </div>
      ),
      minWidth: "120px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        fontWeight: "bold",
        fontSize: "0.875rem",
      },
    },
    cells: {
      style: {
        padding: "0.5rem",
      },
    },
  };

  if (loading) return <VendorLoader />;

  return (
    <div className="max-w-7xl mx-auto p-1 md:p-2">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all your registered customers
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, mobile, address, or newspapers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>
      <div className="grid  grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Line
          </label>
          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-[11px] mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
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
        {/* Newspaper Language */}
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
      </div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {mappedCustomers.length} customers
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          noDataComponent={
            <div className="text-center py-8 text-gray-500">
              <FiSearch size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No customers found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default List_Customer;
