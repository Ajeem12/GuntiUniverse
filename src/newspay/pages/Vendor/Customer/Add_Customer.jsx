import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { createCustomer, fetchCustomerById, updateCustomer } from "../../../redux/slices/customerSlice";
import { verifyCustomer, resetVerifyState } from "../../../redux/slices/customerVerifySlice";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { fetchNewspaperLanguageById, fetchNewspaperLanguages } from "../../../redux/slices/newspaperLanguageSlice";
import { fetchLineData } from "../../../redux/slices/lineSlice";

const Add_Customer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, singleCustomer } = useSelector((state) => state.customer);
  const {
    languages = [],
    loading: newspaperLanguageLoading
  } = useSelector((state) => state.newspaperLanguage);

  const {
    lineData = [],
    loading: lineloader,
    error: lineerror,
  } = useSelector((state) => state.line);

  const { data, loading: VerifyLoading, error: Verifyerror } = useSelector((state) => state.customerVerify);

  const [hasVerified, setHasVerified] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    numbers_of_days: "",
    remarks: "",
    starting_date: "",
    city: "",
    pincode: "",
    state: null,
    district: null,
    line: null,
  });

  // Store newspaper options for each language
  const [newspaperOptionsByLanguage, setNewspaperOptionsByLanguage] = useState({});
  const [selectedPairs, setSelectedPairs] = useState([{ newspaperId: null, languageId: null }]);

  useEffect(() => {
    // Fetch all languages and lines
    dispatch(fetchNewspaperLanguages());
    dispatch(fetchLineData());

    if (id) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  // Auto-fill name when verification data is available
  useEffect(() => {
    if (data && data.exists && data.data) {
      // Extract name from verification data
      const fullName = data.data.first_name && data.data.last_name
        ? `${data.data.first_name} ${data.data.last_name}`
        : data.data.name || "";

      // Only auto-fill if the name field is empty
      if (fullName && !formData.name) {
        setFormData(prev => ({
          ...prev,
          name: fullName
        }));
      }
    }
  }, [data, formData.name]);

  // Handle line selection
  const handleLineSelect = (selectedOption) => {
    const lineId = selectedOption ? selectedOption.value : null;
    setSelectedLineId(lineId);

    if (lineId && lineData) {
      const selectedLine = lineData.find(line => line.id === lineId);
      if (selectedLine) {
        setFormData(prev => ({
          ...prev,
          city: selectedLine.city || "",
          pincode: selectedLine.pincode || "",
          state: null,
          district: null,
        }));
      }
    }
  };

  // Handle language selection for a specific pair
  const handleLanguageSelect = (index, selectedOption) => {
    const languageId = selectedOption ? selectedOption.value : null;

    setSelectedPairs(prev => {
      const newPairs = [...prev];
      newPairs[index].languageId = languageId;
      newPairs[index].newspaperId = null; // Reset newspaper when language changes

      // If language is selected and we haven't fetched its newspapers yet
      if (languageId && !newspaperOptionsByLanguage[languageId]) {
        dispatch(fetchNewspaperLanguageById(languageId))
          .unwrap()
          .then((newspapers) => {
            setNewspaperOptionsByLanguage(prev => ({
              ...prev,
              [languageId]: newspapers.map(n => ({
                value: n.id,
                label: n.news_paper_name,
              }))
            }));
          })
          .catch(error => {
            console.error("Failed to fetch newspapers for language:", error);
          });
      }

      return newPairs;
    });
  };

  // Handle input changes for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "mobile") {
      setIsExistingCustomer(false);
      setHasVerified(false);
      dispatch(resetVerifyState());
    }
  };

  // Handle newspaper selection for a specific pair
  const handleNewspaperChange = (index, selectedOption) => {
    setSelectedPairs((prev) => {
      const newPairs = [...prev];
      newPairs[index].newspaperId = selectedOption ? selectedOption.value : null;
      return newPairs;
    });
  };

  // Add new empty pair
  const addPair = () => {
    setSelectedPairs((prev) => [...prev, {
      newspaperId: null,
      languageId: null
    }]);
  };

  // Remove pair by index
  const removePair = (index) => {
    setSelectedPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMobileBlur = () => {
    if (formData.mobile && formData.mobile.length >= 10) {
      setHasVerified(false);
      dispatch(verifyCustomer({ mobile: formData.mobile }))
        .unwrap()
        .then(() => {
          setHasVerified(true);
        })
        .catch(() => {
          toast.error("Failed to verify mobile number");
        });
    }
  };

  useEffect(() => {
    if (!data) return;

    if (data.exists === true || (data.message && data.message.includes("exists"))) {
      setIsExistingCustomer(true);
    } else {
      setIsExistingCustomer(false);
    }
  }, [data]);

  useEffect(() => {
    if (singleCustomer && id) {
      setFormData({
        name: singleCustomer.name || "",
        mobile: singleCustomer.mobile || "",
        address: singleCustomer.address || "",
        remarks: singleCustomer.remarks || "",
        starting_date: singleCustomer.customer_paper_rec?.[0]?.starting_date || "",
        numbers_of_days: singleCustomer.customer_paper_rec?.[0]?.type || "",
        city: singleCustomer.city || "",
        pincode: singleCustomer.pincode || "",
        state: null,
        district: null,

      });

      // Set line if available
      if (singleCustomer.line) {
        setSelectedLineId(singleCustomer.line);
      }

      // Pre-fetch newspapers for each language in the customer data
      const pairs = singleCustomer.customer_paper_rec?.map((rec) => ({
        newspaperId: rec.news_paper_id,
        languageId: rec.language,
      })) || [{ newspaperId: null, languageId: null }];

      setSelectedPairs(pairs);

      // Fetch newspapers for each language
      pairs.forEach(pair => {
        if (pair.languageId && !newspaperOptionsByLanguage[pair.languageId]) {
          dispatch(fetchNewspaperLanguageById(pair.languageId))
            .unwrap()
            .then((newspapers) => {
              setNewspaperOptionsByLanguage(prev => ({
                ...prev,
                [pair.languageId]: newspapers.map(n => ({
                  value: n.id,
                  label: n.news_paper_name,
                }))
              }));
            })
            .catch(error => {
              console.error("Failed to fetch newspapers for language:", error);
            });
        }
      });
    }
  }, [singleCustomer, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate line selection
    if (!selectedLineId) {
      toast.error("Please select a line");
      return;
    }

    // Validate newspaper-language pairs
    for (const pair of selectedPairs) {
      if (!pair.newspaperId || !pair.languageId) {
        toast.error("Please select both newspaper and language in all pairs");
        return;
      }
    }

    const newspaperArray = selectedPairs.map(({ newspaperId, languageId }) => ({
      paper_id: newspaperId,
      language: languageId,
    }));

    const payload = {
      ...formData,
      newspaper: newspaperArray,
      type: isExistingCustomer ? 1 : 0,
      line: selectedLineId,
      state: null,
      district: null,
    };

    if (id) {
      dispatch(updateCustomer({ id, payload }))
        .unwrap()
        .then(() => {
          toast.success("Customer updated successfully");
          navigate("/vendor/customer/list");
        })
        .catch((error) => {
          console.error("Update customer error:", error);
          handleError(error);
        });
    } else {
      dispatch(createCustomer(payload))
        .unwrap()
        .then(() => {
          toast.success("Customer created successfully");
          setFormData({
            name: "",
            mobile: "",
            address: "",
            numbers_of_days: "",
            remarks: "",
            starting_date: "",
            city: "",
            pincode: "",
            state: null,
            district: null,
          });
          setSelectedLineId(null);
          setSelectedPairs([{ newspaperId: null, languageId: null }]);
          setIsExistingCustomer(false);
          setHasVerified(false);
          dispatch(resetVerifyState());
        })
        .catch((error) => {
          console.error("Create customer error:", error);
          handleError(error);
        });
    }
  };

  const handleError = (error) => {
    if (error?.errors) {
      Object.values(error.errors)
        .flat()
        .forEach((msg) => {
          toast.error(msg);
        });
    } else if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  // Prepare options for react-select
  const languageOptions = languages.map((l) => ({
    value: l.id,
    label: l.language_name,
  }));

  return (
    <div className="bg-white shadow p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-amber-700 mb-6">
        {id ? "Edit Customer" : "Add Customer"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Basic Information Fields */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              placeholder={VerifyLoading ? "Verifying..." : "Enter name"}
            />
            {data && data.exists && data.data && (
              <p className="text-xs text-red-600 mt-1">
                Name auto-filled from existing customer data
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onBlur={handleMobileBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              maxLength={10}
              readOnly={!!id}
            />
            {VerifyLoading && <p className="text-xs text-amber-600 mt-1">Verifying...</p>}
            {hasVerified && isExistingCustomer && (
              <p className="text-xs text-red-600 mt-1">Customer already registered with vendor </p>
            )}
            {hasVerified && !isExistingCustomer && (
              <p className="text-xs text-blue-600 mt-1">New customer - will be created</p>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date</label>
            <input
              type="date"
              name="starting_date"
              value={formData.starting_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Line Selection */}
          <div className="">
            <label
              htmlFor="line_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Line
            </label>
            <select
              id="line_id"
              name="line_id"
              value={selectedLineId || ""}
              onChange={(e) => handleLineSelect({ value: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
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
                    {line.line_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* City (auto-filled from line) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 "

            />
          </div>

          {/* Pincode (auto-filled from line) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 "

            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Newspaper-Language Pairs */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Newspaper & Language Pairs
          </label>

          {selectedPairs.map((pair, index) => {
            // Get newspaper options for the selected language in this pair
            const currentNewspaperOptions = pair.languageId
              ? newspaperOptionsByLanguage[pair.languageId] || []
              : [];

            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <Select
                    options={languageOptions}
                    value={languageOptions.find(opt => opt.value === pair.languageId) || null}
                    onChange={(selected) => handleLanguageSelect(index, selected)}
                    placeholder="Select Language"
                    isClearable
                    isLoading={newspaperLanguageLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Newspaper</label>
                  <div className="flex gap-2">
                    <Select
                      options={currentNewspaperOptions}
                      value={currentNewspaperOptions.find(opt => opt.value === pair.newspaperId) || null}
                      onChange={(selected) => handleNewspaperChange(index, selected)}
                      placeholder="Select Newspaper"
                      isClearable
                      isLoading={newspaperLanguageLoading}
                      isDisabled={!pair.languageId}
                      className="flex-1"
                    />

                    {selectedPairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePair(index)}
                        className="text-red-600 font-bold px-3 py-2 rounded hover:bg-red-100 self-center"
                        title="Remove Pair"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addPair}
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          >
            + Add Another Newspaper-Language Pair
          </button>
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-3 flex justify-end mt-6">
          <button
            type="submit"
            className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 disabled:opacity-50"
            disabled={loading || data?.exists === true}
          >
            {loading ? "Processing..." : (id ? "Update Customer" : "Create Customer")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_Customer;