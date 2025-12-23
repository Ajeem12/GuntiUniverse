import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../../../redux/slices/newspaperLanguageSlice";
import {
  searchBillGenerate,
  updateCreatedBill,
} from "../../../redux/slices/searchBillSlice";
import { fetchGenratedBillsToAgency } from "../../../redux/slices/genrateBillToAgency";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Generates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Redux state
  const { languages, selectedLanguage } = useSelector(
    (state) => state.newspaperLanguage
  );
  const { data, loading: searchLoading } = useSelector(
    (state) => state.searchBill
  );



  const { data: genratedBills, loading } = useSelector(
    (state) => state.genratedBillToAgency
  );

  // Local state
  const [form, setForm] = useState({
    month: "",
    year: "",
    langId: "",
    newsPaperId: "",
    amount: "",
    discount_amount: "",
    discount_per: "",
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchNewspaperLanguages());
    dispatch(fetchGenratedBillsToAgency());
  }, [dispatch]);

  useEffect(() => {
    if (form.langId) {
      dispatch(fetchNewspaperLanguageById(form.langId));
    }
  }, [form.langId, dispatch]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear].map(String);
  const currentMonth = new Date().getMonth() + 1;

  const months = [
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
    { value: "12", label: "December" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "discount_amount") {
        return { ...prev, discount_amount: value, discount_per: "" };
      }
      if (name === "discount_per") {
        return { ...prev, discount_per: value, discount_amount: "" };
      }
      return { ...prev, [name]: value };
    });
  };


  const handleSearch = () => {
    if (!form.month || !form.year || !form.newsPaperId || !form.amount) {
      alert("Please fill all fields.");
      return;
    }
    if (form.discount_amount && form.discount_per) {
      alert("Please enter only one: Discount Amount OR Discount %.");
      return;
    }

    const payload = {
      month: form.month,
      year: form.year,
      newspaper_id: form.newsPaperId,
      amount: form.amount,
    };
    if (form.discount_amount) {
      payload.discount_amount = form.discount_amount;
    }
    if (form.discount_per) {
      payload.discount_per = form.discount_per;
    }
    dispatch(searchBillGenerate(payload)).unwrap().then(() => {
      dispatch(fetchGenratedBillsToAgency());
    });

  };

  // Compute discounted value
  const originalAmount = Number(form.amount) || 0;
  const discountAmount = Number(form.discount_amount) || 0;
  const discountPercent = Number(form.discount_per) || 0;
  let discountedValue = originalAmount;

  if (discountAmount) {
    discountedValue = originalAmount - discountAmount;
  } else if (discountPercent) {
    discountedValue = originalAmount - (originalAmount * discountPercent) / 100;
  }
  if (discountedValue < 0) discountedValue = 0;


  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditedAmount(row.bill_amount || row.amount || "");
  };

  const handleSaveEdit = () => {
    dispatch(updateCreatedBill({ main_tbl_id: editingRowId, amount: editedAmount }))
      .unwrap()
      .then(() => {
        dispatch(fetchGenratedBillsToAgency());
      });
    setEditingRowId(null);
    setEditedAmount("");
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditedAmount("");
  };

  const handlePublish = (row) => {
    navigate(`/vendor/billing/billlist/${row.id}`);
  };

  // Combine and sort (latest generated first)
  const allBills = [
    ...(Array.isArray(data) ? data : []),
    ...(Array.isArray(genratedBills) ? genratedBills : []),
  ].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  // Columns definition
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Newspaper",
      selector: (row) => row.paper_details?.[0]?.news_paper_name || "-",
      sortable: true,
      // width: "160px",
    },
    {
      name: "Payable Month",
      selector: (row) => row.payable_month ? dayjs(row.payable_month).format("MMMM") : "-",
      // width: "130px",
    },
    {
      name: "Amount",
      selector: (row) =>
        editingRowId === row.id ? (
          <input
            type="number"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
        ) : (
          `₹${row.bill_amount || row.amount || 0}`
        ),
      // width: "100px",
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "-",
      // width: "120px",
    },
    {
      name: "Published",
      selector: (row) => (row.published === 1 ? "Yes" : "No"),
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.published === 1
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {row.published === 1 ? "Yes" : "No"}
        </span>
      ),
      // width: "100px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-2 ">
          {editingRowId === row.id ? (
            <>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <>

              {row.published === 0 && (
                <button
                  className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 text-sm"
                  onClick={() => handlePublish(row)}
                >
                  Publish
                </button>
              )}
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                onClick={() => handleEdit(row)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "180px",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Search & Bill Generate
      </h2>

      {/* Search form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Month</option>
            {months
              .filter((m) =>
                form.year === String(currentYear)
                  ? Number(m.value) <= currentMonth
                  : true
              )
              .map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            name="langId"
            value={form.langId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.language_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Newspaper</label>
          <select
            name="newsPaperId"
            value={form.newsPaperId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            disabled={!selectedLanguage?.length}
          >
            <option value="">Select Newspaper</option>
            {selectedLanguage?.map((paper) => (
              <option key={paper.id} value={paper.id}>
                {paper.news_paper_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
          <input
            type="number"
            name="discount_amount"
            value={form.discount_amount}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter discount amount"
            disabled={!!form.discount_per}
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Discount %</label>
          <input
            type="number"
            name="discount_per"
            value={form.discount_per}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter discount percentage"
            disabled={!!form.discount_amount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discounted Amount</label>
          <input
            type="text"
            value={form.amount ? `₹${discountedValue.toFixed(2)}` : "--"}
            className="w-full mt-1 p-2 border rounded bg-gray-100"
            readOnly
            tabIndex={-1}
          />
        </div>
      </div>

      <button
        onClick={() => setShowConfirm(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
        disabled={searchLoading}
      >
        {searchLoading ? "Generating..." : "Generate Bill"}
      </button>

      {/* DataTable */}
      <div className="mt-8">
        <DataTable
          title={`Generated Bills (${allBills.length})`}
          columns={columns}
          data={allBills}
          pagination
          responsive
          striped
          highlightOnHover
        />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm flex flex-col items-center">
            <h3 className="text-lg font-bold mb-3 text-gray-800">
              Confirm Generation
            </h3>
            <p className="mb-5 text-gray-600 text-center">
              Are you sure you want to generate?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleSearch();
                  setShowConfirm(false);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
              >
                Yes, Generate
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generates;

