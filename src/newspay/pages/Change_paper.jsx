import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPaperRecs } from "../redux/slices/customerPaperRecSlice";
import { createChangeRequest } from "../redux/slices/changePaperSlice";
import { getPaperChangeRequests } from "../redux/slices/paperChangeRequestSlice";
import {
  fetchNewspaperLanguageById,
  fetchNewspaperLanguages,
} from "../redux/slices/newspaperLanguageSlice";
import DataTable from "react-data-table-component";
import { fetchCustomerChangePaperRecs } from "../redux/slices/customerChangePaperRecSlice";
import toast from "react-hot-toast";
const Change_paper = () => {
  const dispatch = useDispatch();

  // from customerPaperRec slice
  const { data: papers, loading: papersLoading } = useSelector(
    (state) => state.customerPaperRec
  );

  const { data, loading, error } = useSelector(
    (state) => state.customerChangePaperRec
  );
  // console.log("hello", data);



  // from changePaper / request slice
  const { paperChangeRequests, loading: requestsLoading } = useSelector(
    (state) => state.paperChangeRequest // or changePaper slice depending on your design
  );

  // from newspaperLanguage slice
  const {
    languages,
    selectedLanguage,        // if you store the currently fetched language id or object
    newspapersByLanguage,     // e.g. result of fetchNewspaperLanguageById
    loading: languagesLoading,
    error: languagesError,
  } = useSelector((state) => state.newspaperLanguage);

  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [newPaperId, setNewPaperId] = useState("");
  const [newLanguageId, setNewLanguageId] = useState("");
  const [changeDate, setChangeDate] = useState("");

  // On mount: fetch initial data
  useEffect(() => {
    dispatch(fetchCustomerPaperRecs());
    dispatch(fetchNewspaperLanguages());
    dispatch(getPaperChangeRequests());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCustomerChangePaperRecs());
  }, [dispatch]);


  // When a new language is selected, fetch newspapers under that language
  useEffect(() => {
    if (newLanguageId) {
      dispatch(fetchNewspaperLanguageById(newLanguageId));
    }
  }, [dispatch, newLanguageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaperId || !newPaperId || !newLanguageId || !changeDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("paper_rec_id", selectedPaperId);
    formData.append("new_news_paper_id", newPaperId);
    formData.append("language_id", newLanguageId);
    formData.append("starting_date", changeDate);

    try {
      const result = await dispatch(createChangeRequest(formData)).unwrap();
      if (result.status === "success") {
        toast.success("Change request submitted successfully.");
        // reset fields
        setSelectedPaperId("");
        setNewPaperId("");
        setNewLanguageId("");
        setChangeDate("");
        dispatch(getPaperChangeRequests());
      } else {
        toast.error(result.message || "Failed to submit change request.");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  const columns = [
    {
      name: "Newspaper",
      selector: (row) => row.paper_details?.news_paper_name || "N/A",
      sortable: true,
    },
    // { name: "Language", selector: (row) => row.language_details?.language_name || "N/A", sortable: true, },
    {
      name: "Start Date",
      selector: (row) => row.starting_date || "N/A",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.closing_date || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${row.status === 1
            ? "bg-green-100 text-green-800"
            : row.status === 2
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {row.status === 1
            ? "Approved"
            : row.status === 2
              ? "Rejected"
              : "Pending"}
        </span>
      ),
      sortable: true,
    },
  ];


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-amber-600 mb-8 text-center">
        Change Newspaper Request
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Newspaper
          </label>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Language
          </label>
          <select
            value={newLanguageId}
            onChange={(e) => {
              setNewLanguageId(e.target.value);
              // Clear newPaperId when language changes
              setNewPaperId("");
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
          >
            <option value="">Select Language</option>
            {languages?.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.language_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Newspaper
          </label>
          <select
            value={newPaperId}
            onChange={(e) => setNewPaperId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
            disabled={!newLanguageId || selectedLanguage?.length === 0}
          >
            <option value="">Select New Paper</option>
            {selectedLanguage?.map((paper) => (
              <option key={paper.id} value={paper.id}>
                {paper.news_paper_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Date
          </label>
          <input
            type="date"
            value={changeDate}
            onChange={(e) => setChangeDate(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
          >
            Submit Change Request
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-amber-600 mb-4">
          Change Request History
        </h3>
        {requestsLoading ? (
          <p className="text-center text-gray-500">
            Loading change requests...
          </p>
        ) : (
          <DataTable
            columns={columns}
            data={paperChangeRequests || []}
            pagination
            responsive
            striped
            highlightOnHover
            persistTableHead
            noDataComponent="No change requests found."
          />
        )}
      </div>
    </div>
  );
};

export default Change_paper;
