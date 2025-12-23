import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchHawkers } from "../../../redux/slices/hawkerSlice";
import { useNavigate } from "react-router-dom";
import VendorLoader from "../../../components/vendor/VendorLoader";

const customers = [
  {
    id: 1,
    name: "Ravi Sharma",
    mobile: "9876543210",
    address: "Tilak Nagar, Delhi",
    newspaper: "Dainik Jagran",
    duration: "1 Year",
    days: "All Days",
    remarks: "Morning only",
    status: "Active",
  },
  {
    id: 2,
    name: "Pooja Verma",
    mobile: "8765432109",
    address: "Laxmi Nagar, Delhi",
    newspaper: "The Times of India",
    duration: "6 Months",
    days: "Weekends",
    remarks: "N/A",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Amit Kumar",
    mobile: "7654321098",
    address: "Rajouri Garden",
    newspaper: "Hindustan Times",
    duration: "3 Months",
    days: "Mon-Fri",
    remarks: "Evening delivery",
    status: "Active",
  },
];

const List_Hawker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hawkers, loading, error } = useSelector((state) => state.hawker);

  useEffect(() => {
    dispatch(fetchHawkers());
  }, [dispatch]);

  const mappedHawkers = (hawkers || []).map((hawker) => ({
    id: hawker?.id || "N/A",
    name: hawker?.name || "Unnamed",
    mobile: hawker?.mobile || "N/A",
    address: hawker?.address || "Not provided",
    status: hawker?.status || "Active",
  }));

  const filteredCustomers = mappedHawkers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Mobile responsive columns
  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div className="py-2">{index + 1}</div>,
      minWidth: "30px",
      center: true,
    },
    {
      name: "Hawker",
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
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/vendor/hawker/add/${row.id}`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <FiEdit size={16} />
          </button>
        </div>
      ),
      minWidth: "120px",
    },
  ];

  // Custom styles for responsive table
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

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-lg font-semibold">
        Failed to load hawkers: {error.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-1 md:p-2">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Hawker List
            </h2>
            <p className="text-gray-500 mb-2">
              View and manage all your registered hawkers.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, mobile, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
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

export default List_Hawker;
