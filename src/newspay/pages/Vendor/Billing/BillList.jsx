import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Redux actions
import {
  fetchCreatedBills,
  updateParticularBill,
} from "../../../redux/slices/searchBillSlice";
import { publishBillAgency } from "../../../redux/slices/agencyBillSlice";

const BillList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { createdBills, loading } = useSelector((state) => state.searchBill);

  // State for editing
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [editedDays, setEditedDays] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch bills on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchCreatedBills({ main_tbl_id: id }));
    }
  }, [dispatch, id]);

  // Edit row handlers
  const startEditing = (bill) => {
    setEditingRowId(bill.id);
    setEditedAmount(bill.bill_amount ?? "");
    setEditedDays(bill.no_of_days ?? "");
  };

  const cancelEditing = () => {
    setEditingRowId(null);
    setEditedAmount("");
    setEditedDays("");
  };

  const saveEditing = async () => {
    if (!editingRowId) return;

    const payload = {
      bill_id: editingRowId,
      amount: Number(editedAmount),
      days: Number(editedDays),
    };

    try {
      const result = await dispatch(updateParticularBill(payload));

      if (updateParticularBill.fulfilled.match(result)) {
        dispatch(fetchCreatedBills({ main_tbl_id: id }));
      }
    } catch (error) {
      alert("Error updating bill.");
    } finally {
      cancelEditing();
    }
  };

  // Publish All Bills
  const handlePublishAll = async () => {
    if (!createdBills || createdBills.length === 0) {
      alert("No bills available to publish.");
      return;
    }

    const payload = {
      main_tbl_id: id,
     
    };

    try {
      setIsPublishing(true);
      const result = await dispatch(publishBillAgency(payload));

      if (publishBillAgency.fulfilled.match(result)) {
      
        dispatch(fetchCreatedBills({ main_tbl_id: id }));
      } else {
        alert("Failed to publish bills.");
      }
    } catch (error) {
      alert("An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Bill List for ID: <span className="text-blue-600">{id}</span>
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handlePublishAll}
          disabled={isPublishing}
          className={`${
            isPublishing ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
          } text-white px-4 py-2 rounded text-sm`}
        >
          {isPublishing ? "Publishing..." : "Publish All Bills"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Newspaper
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Amount (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                No. of Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {createdBills.map((bill) => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {bill.customer_details?.name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {bill.paper_details?.news_paper_name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                  {editingRowId === bill.id ? (
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-24"
                    />
                  ) : (
                    `₹${bill.bill_amount ?? 0}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                  {editingRowId === bill.id ? (
                    <input
                      type="number"
                      value={editedDays}
                      onChange={(e) => setEditedDays(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                  ) : (
                    bill.no_of_days ?? "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingRowId === bill.id ? (
                    <>
                      <button
                        onClick={saveEditing}
                        className="mr-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(bill)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillList;
