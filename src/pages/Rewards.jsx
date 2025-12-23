import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiDollarSign, FiCreditCard, FiLogIn } from "react-icons/fi";
import { MdPendingActions, MdOutlineSavings } from "react-icons/md";
import DataTable from "react-data-table-component";
import TataNeuNavbar from "../components/TataNeuNavbar";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import { useCashbackOrder } from "../hooks/useCashbackOrder";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import Login from "../pages/Login";
import Guntiimg from "../components/Guntiimg";

const Rewards = () => {
  const {
    mutate: fetchCashback,
    data,
    isLoading,
    isError,
  } = useCashbackOrder();

  const token = useAuthStore((state) => state.token);
  const { openLoginModal, showLoginModal, closeLoginModal } = useModalStore();

  // Local state to control fade for modal
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCashback();
      setModalVisible(false);
      closeLoginModal();
    }
  }, [token]);

  // Close modal handler with fade out
  const handleCloseModal = () => {
    setModalVisible(false);
    // Wait for fade-out animation before actually closing modal
    setTimeout(() => {
      closeLoginModal();
    }, 300); // duration matches CSS transition duration
  };

  // Open login modal
  const handleOpenLogin = () => {
    setModalVisible(true);
    openLoginModal();
  };

  const cashbackData = data?.data || {};
  const totalCashback = cashbackData.total_cashback_get ?? 0;
  const usedCashback = cashbackData.used ?? 0;
  const availableCashback = cashbackData.avl ?? 0;
  const pendingCashback = cashbackData.pending ?? 0;

  const type=cashbackData.type 
  
  
  const transactions = cashbackData.transaction || [];

  // Columns and SkeletonCard remain the same...
  const columns = [
    {
      name: "DATE",
      selector: (row) =>
        new Date(row.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "2-digit"
        }),
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "DESCRIPTION",
      selector: (row) =>
        row.order_id !== 0
          ? `Order #${row.order_id}`
          : `Cashback ${row.tran_status}`,
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.order_id !== 0 ? `Order #${row.order_id}` : "Cashback Added"}
          </div>
         
        </div>
      ),
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "AMOUNT",
      selector: (row) => `₹${row.amount.toFixed(2)}`,
      cell: (row) => (
        <div className={`font-semibold ${row.tran_status === "Used" ? "text-red-600" : "text-green-600"}`}>
          {row.tran_status === "Used" ? "-" : "+"}₹{row.amount.toFixed(2)}
        </div>
      ),
      sortable: true,
      right: true,
      minWidth: "120px",
    },
    {
  name: "TYPE",
  selector: (row) => (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
        row.tran_status === "Used"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {row.tran_status === "Used" ? (
        <>
          <FiCreditCard size={12} className="mr-1" />
          {row.type || "Used"}
        </>
      ) : (
        <>
          <MdPendingActions size={12} className="mr-1" />
          {row.type || "Available"}
        </>
      )}
    </span>
  ),
  sortable: true,
  minWidth: "200px",
  center: true,
}
  ];

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  return (
    <>
      {/* Login Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          modalVisible && showLoginModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Login onClose={handleCloseModal} />
      </div>

      {/* Main app UI */}
      <TataNeuNavbar />

      <div className="max-w-6xl mx-auto px-4 py-8 pb-20 md:pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Rewards</h1>
            <p className="text-gray-600 mt-2">Track and manage your cashback rewards</p>
          </div>
        </div>

        {!token ? (
          /* Login Prompt for non-authenticated users */
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center mb-10">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogIn className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Your Rewards</h2>
              <p className="text-gray-600 mb-6">
                Login to view your cashback earnings, track rewards, and redeem them for exciting benefits.
              </p>
              <button
                onClick={handleOpenLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto"
              >
                <FiLogIn className="mr-2" />
                Login to View Rewards
              </button>
            </div>
          </div>
        ) : (
          /* Content for authenticated users */
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {/* Total Earnings */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Total Earnings</h3>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MdOutlineSavings className="text-blue-600" size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{totalCashback.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">Lifetime cashback earnings</p>
                  </div>

                  {/* Available */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Available</h3>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <FiCheckCircle className="text-green-600" size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700">₹{availableCashback.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">Ready to redeem</p>
                  </div>

                  {/* Redeemed */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Redeemed</h3>
                      <div className="p-2 bg-red-50 rounded-lg">
                        <span className="text-red-600 text-xl font-bold">₹</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-600">₹{usedCashback.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">Already used</p>
                  </div>

                  {/* Pending */}
                  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-600 text-xl font-bold"><MdPendingActions/></span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">₹{pendingCashback.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">In process</p>
                  </div>
                </>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiClock className="mr-2 text-blue-600" />
                  Transaction History
                </h3>
              </div>

              {isLoading ? (
                <div className="p-6">
                  {/* Skeleton loader for table */}
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-2">Failed to load cashback data</div>
                  <button
                    onClick={() => fetchCashback()}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Try again
                  </button>
                </div>
              ) : transactions.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={transactions}
                  pagination
                  responsive
                  highlightOnHover
                  striped
                  customStyles={{
                    headCells: {
                      style: {
                        backgroundColor: '#f9fafb',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      },
                    },
                    cells: {
                      style: {
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                      },
                    },
                    rows: {
                      highlightOnHoverStyle: {
                        backgroundColor: '#f3f4f6',
                      },
                    },
                  }}
                  progressPending={isLoading}
                  progressComponent={
                    <div className="p-6">
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="h-16 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                />
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span> ₹</span>
                  </div>
                  <div className="text-gray-500 font-medium mb-1">No transactions yet</div>
                  <div className="text-gray-400 text-sm">
                    Your cashback rewards will appear here after your purchases
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <MobileBottomMenu />
      <Guntiimg/>
    </>
  );
};

export default Rewards;