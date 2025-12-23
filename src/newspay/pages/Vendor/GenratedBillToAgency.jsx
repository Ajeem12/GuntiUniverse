
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenratedBillsToAgency } from "../../redux/slices/genrateBillToAgency";



const GenratedBillToAgency = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(
        (state) => state.genratedBillToAgency
    );
    const [filters, setFilters] = useState({
        customerNumber: "",
        month: "",
        year: ""
    });

    // Static filter options
    const months = [
        { value: "", label: "All Months" },
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ];

    const getCurrentYearAndPast5Years = () => {
        const currentYear = new Date().getFullYear();
        const years = [{ value: "", label: "All Years" }];

        for (let i = 0; i <= 5; i++) {
            const year = currentYear - i;
            years.push({
                value: year.toString(),
                label: year.toString()
            });
        }

        return years;
    };
    const years = getCurrentYearAndPast5Years();


    useEffect(() => {
        dispatch(fetchGenratedBillsToAgency());
    }, [dispatch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            customerNumber: "",
            month: "",
            year: ""
        });
    };

    // Filter data based on filter criteria
    const filteredData = data?.filter(item => {
        const matchesCustomer = filters.customerNumber === "" ||
            item.id?.toString().includes(filters.customerNumber) ||
            item.customer_number?.toString().includes(filters.customerNumber);

        const matchesMonth = filters.month === "" ||
            item.payable_month?.includes(`-${filters.month}-`) ||
            item.payable_month?.includes(`/${filters.month}/`);

        const matchesYear = filters.year === "" ||
            item.payable_month?.includes(filters.year);

        return matchesCustomer && matchesMonth && matchesYear;
    });

    const columns = [
        { name: "SL.No", selector: (row, index) => index + 1, sortable: true },
        {
            name: "Payable Month",
            selector: (row) => row.payable_month,
            sortable: true,
        },
        {
            name: "Amount (₹)",
            selector: (row) => `₹${row.amount}`,
            sortable: true,
        },
        {
            name: "Published",
            selector: (row) => (row.published === 1 ? "Yes" : "No"),
            sortable: true,
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.published === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {row.published === 1 ? "Yes" : "No"}
                </span>
            )
        },
        {
            name: "Paper Name",
            selector: (row) =>
                row.paper_details?.[0]?.news_paper_name || "N/A",
            sortable: true,
        },
    ];

    return (
        <div className="min-h-screen bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-amber-600 mb-6">
                Generated Bills to Agency
            </h2>
            {/* Filters Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Customer Number Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Number
                        </label>
                        <input
                            type="text"
                            name="customerNumber"
                            value={filters.customerNumber}
                            onChange={handleFilterChange}
                            placeholder="Enter customer number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    {/* Month Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Month
                        </label>
                        <select
                            name="month"
                            value={filters.month}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                        </label>
                        <select
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            {years.map(year => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Active Filters Info */}
                {(filters.customerNumber || filters.month || filters.year) && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                        <p className="text-sm text-amber-800">
                            <strong>Active Filters:</strong>
                            {filters.customerNumber && ` Customer: ${filters.customerNumber}`}
                            {filters.month && ` Month: ${months.find(m => m.value === filters.month)?.label}`}
                            {filters.year && ` Year: ${filters.year}`}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredData?.length || 0} of {data?.length || 0} bills
            </div>

            <DataTable
                columns={columns}
                data={filteredData || []}
                pagination
                striped
                responsive
                progressPending={loading}
                highlightOnHover
                noDataComponent={
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg mb-2">
                            {filters.customerNumber || filters.month || filters.year
                                ? "No bills match your filters"
                                : "No published bills found."
                            }
                        </p>
                        {(filters.customerNumber || filters.month || filters.year) && (
                            <button
                                onClick={clearFilters}
                                className="text-amber-600 hover:text-amber-700 font-medium"
                            >
                                Clear filters to see all bills
                            </button>
                        )}
                    </div>
                }
                customStyles={{
                    headCells: {
                        style: {
                            backgroundColor: "#FEF3C7",
                            color: "#92400E",
                            fontWeight: "bold",
                            fontSize: "14px",
                        },
                    },
                    rows: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                }}
            />
        </div>
    );
};

export default GenratedBillToAgency;