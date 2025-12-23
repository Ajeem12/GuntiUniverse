import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createHawker,
  fetchHawkerById,
  updateHawker,
} from "../../../redux/slices/hawkerSlice";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchLineData } from "../../../redux/slices/lineSlice";

const Add_hawker = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, singleHawker, error } = useSelector((state) => state.hawker);
  const {
    lineData,
    loading: lineloader,
    error: lineerror,
  } = useSelector((state) => state.line);

  useEffect(() => {
    dispatch(fetchLineData());
    if (id) {
      dispatch(fetchHawkerById(id)); 
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && singleHawker) {
      setFormData({
        name: singleHawker.name || "",
        mobile: singleHawker.mobile || "",
        address: singleHawker.address || "",
        line: singleHawker.line|| "", 
      });
    }
  }, [id, singleHawker]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    line: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let resultAction;

      if (id) {
        const updatedPayload = { ...formData };

        resultAction = await dispatch(
          updateHawker({ id, updatedData: updatedPayload })
        );

        if (updateHawker.fulfilled.match(resultAction)) {
          navigate(`/vendor/hawker/list`);
          toast.success("Hawker updated successfully!");
        } else {
          // Enhanced error handling
          if (resultAction.payload?.errors) {
            Object.values(resultAction.payload.errors)
              .flat()
              .forEach((msg) => {
                toast.error(msg);
              });
          } else if (resultAction.payload?.message) {
            toast.error(resultAction.payload.message);
          } else {
            toast.error("Failed to update hawker.");
          }
        }
      } else {
        // Create Mode
        resultAction = await dispatch(createHawker(formData));

        if (createHawker.fulfilled.match(resultAction)) {
          toast.success("Hawker created successfully!");
          setFormData({
            name: "",
            mobile: "",
            address: "",
            line: "",
          });
        } else {
          toast.error("Failed to create hawker.");
        }
      }
    } catch (err) {
      console.error("Hawker form error:", err);

      if (err?.errors) {
        Object.values(err.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  {
    loading && (
      <div className="text-center text-amber-600 font-medium mb-4">
        Saving hawker...
      </div>
    );
  }

  {
    error && (
      <div className="text-center text-red-600 font-medium mb-4">
        {typeof error === "string" ? error : "Failed to save hawker."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-bold text-amber-700 mb-6">
        {id ? "Edit Hawker" : "Add Hawker"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        {/* Select Box for Line */}
        <div className="mt-6">
          <label
            htmlFor="line"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Line
          </label>
          <select
            id="line"
            name="line"
            value={formData.line}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Select a line</option>
            {lineloader ? (
              <option>Loading...</option>
            ) : lineerror ? (
              <option>Error loading lines</option>
            ) : (
              lineData?.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.line_name} {/* Assuming line has an 'id' and 'name' */}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto bg-amber-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-amber-700 transition duration-300"
          >
            Save Hawker
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_hawker;
