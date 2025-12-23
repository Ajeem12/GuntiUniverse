// import {
//   FaBoxOpen,
//   FaMoneyBillWave,
//   FaUserPlus,
// } from "react-icons/fa";
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboardData, selectDashboardData, selectDashboardLoading, selectDashboardError } from '../../redux/slices/dashboardSlice';

// const Dashboard = () => {
//   const dispatch = useDispatch();

//   // Get data, loading, and error states from Redux store
//   const data = useSelector(selectDashboardData);
//   const loading = useSelector(selectDashboardLoading);
//   const error = useSelector(selectDashboardError);

//   // Fetch dashboard data when the component mounts
//   useEffect(() => {
//     dispatch(fetchDashboardData());
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Handle errors (uncomment to display errors)
//   // if (error) {
//   //   return <div>Error: {error}</div>;
//   // }

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       {/* Page Heading */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//             Welcome Back, Vendor!
//           </h1>
//           <p className="text-gray-500 text-sm sm:text-base">
//             Here's what’s happening with your deliveries today.
//           </p>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {/* Orders */}
//         <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition w-full">
//           <div className="p-3 bg-amber-100 text-amber-600 rounded-full text-xl">
//             <FaUserPlus />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500"> Hawker's</p>
//             {/* Display hawker data */}
//             <h3 className="text-lg font-semibold text-gray-800">{data?.hawker || 0}</h3>
//           </div>
//         </div>

//         {/* Revenue */}
//         <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition w-full">
//           <div className="p-3 bg-green-100 text-green-600 rounded-full text-xl">
//             <FaUserPlus />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Customer's</p>
//             {/* Placeholder, you can replace with actual revenue data once available */}
//             <h3 className="text-lg font-semibold text-gray-800">{data?.list_customer || 0}</h3>
//           </div>
//         </div>

//         {/* Subscribers */}
//         <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition w-full">
//           <div className="p-3 bg-blue-100 text-blue-600 rounded-full text-xl">
//             <FaUserPlus />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Records</p>
//             {/* Display papuserecord */}
//             <h3 className="text-lg font-semibold text-gray-800">{data?.papuserecord || 0}</h3>
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default Dashboard;


import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaUserPlus,
} from "react-icons/fa";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardCount } from '../../redux/slices/dashboardCountSlice';
import { fetchDashboardData, selectDashboardData, selectDashboardLoading, selectDashboardError } from '../../redux/slices/dashboardSlice';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Get data, loading, and error states from Redux store
  const count = useSelector((state) => state.dashcount);
  const Counter = count?.count?.data

  const data = useSelector(selectDashboardData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  // Fetch dashboard data when the component mounts
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(dashboardCount());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle errors (uncomment to display errors)
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome Back, Vendor!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Here's what’s happening with your deliveries today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
        {/*  Payouts & Finance */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/80 shadow-lg p-6 flex items-center gap-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Payouts & Finance
            </h1>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                  Total Revenue
                </p>
                <span className="text-amber-600 font-bold">₹{Counter?.total_r}</span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Cash Settlement
                </p>
                <span className="text-blue-600 font-bold">₹{Counter?.total_cs}</span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Pending
                </p>
                <span className="text-green-600 font-bold">₹{Counter?.total_pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Request Managment */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/80 shadow-lg p-6 flex items-center gap-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 w-full">

          <div className="w-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Request Managment
            </h1>
            <div className="space-y-3">
              <Link to={"/vendor/requests/paper-change"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-amber-600">
                  <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                  Paper Change Request
                </p>
                <span className="text-amber-600 font-bold">{Counter?.changepaper}</span>
              </Link>

              <Link to={"/vendor/requests/paused-deliveries"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-blue-600">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Pause Delivery
                </p>
                <span className="text-blue-600 font-bold">{Counter?.paused}</span>
              </Link>

              <Link to={"/vendor/requests/closing-requests"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-green-600">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Closing Request
                </p>
                <span className="text-green-600 font-bold">{Counter?.closed}</span>
              </Link>

              <Link to={"/vendor/requests/complaints"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-red-600">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Customer Complaints
                </p>
                <span className="text-red-600 font-bold">{Counter?.complain}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Billing Mgmt */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/80 shadow-lg p-6 flex items-center gap-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Billing Management
            </h1>
            <div className="space-y-3">
              <Link to={"/vendor/billing/createbill"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-amber-600">
                  <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                  Generate Bills
                </p>
                <span className="text-amber-600 font-bold">{Counter?.total_gen_bill}</span>
              </Link>
              <Link to={"/vendor/billing/customer-invoices"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-blue-600">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Customer Invoices
                </p>
                <span className="text-blue-600 font-bold">{Counter?.customer_invoice}</span>
              </Link>
              {/* <Link to={"/vendor/billing/payments"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-green-600">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  View Payment Status
                </p>
                <span className="text-green-600 font-bold">{Counter?.total_gen_bill}</span>
              </Link> */}
              <Link to={"/vendor/billing/reports"} className="flex justify-between items-center ">
                <p className="text-gray-700 font-semibold flex items-center gap-2 hover:text-red-600">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Payment Collection Report
                </p>
                <span className="text-red-600 font-bold">₹{Counter?.total_collection}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Distribution Network */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/80 shadow-lg p-6 flex items-center gap-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Distribution Network
            </h1>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                  Total Customers
                </p>
                <span className="text-amber-600 font-bold">{Counter?.total_customer}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Total Hawkers
                </p>
                <span className="text-blue-600 font-bold">{Counter?.total_hawker}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Total Line
                </p>
                <span className="text-green-600 font-bold">{Counter?.total_line}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
