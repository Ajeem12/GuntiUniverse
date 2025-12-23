import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiPhone,
  FiAlertCircle,
  FiSearch,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import "swiper/css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPaperRecs } from "../redux/slices/customerPaperRecSlice";
import { fetchCustomerBillsByNewspaper } from "../redux/slices/customerBillByNewspaperSlice";
import { payNewspaperBillByCustomer } from "../redux/slices/payNewsbill"
import toast from "react-hot-toast";
import VendorLoader from "../components/vendor/VendorLoader";
import {
  searchCustomerBill,
  clearSearchBillState,
} from "../redux/slices/searchCustomerBillSlice";

const BillSummary = ({ data, onPayAll }) => {
  const pendingAmount = data.pending?.reduce(
    (sum, bill) => sum + (bill.bill_amount || 0),
    0
  ) || 0;

  const unpaidAmount = parseFloat(data?.unpaid) || 0;
  const extraCahrges = parseFloat(2) || 0;
  const totalAmount = pendingAmount + unpaidAmount + extraCahrges;
  const billIds = data.billid || [];
  const paperIds = ((data.pending?.[0]))
  const paperId = paperIds?.id
  const agencyId = paperIds?.agency_id
  const customerId = paperIds?.customer_id
  console.log("customerId", customerId);





  return (
    <div className=" p-4 shadow rounded bg-gray-50 mt-4 text-gray-800 space-y-2">
      <p><strong>Current Month Balance:</strong> ₹{pendingAmount.toFixed(2)}</p>
      <p><strong>Previous Balance:</strong> ₹{unpaidAmount.toFixed(2)}</p>
      <p><strong>Other Charges:</strong> ₹{extraCahrges.toFixed(2)}</p>
      <p><strong>Total Amount to Pay:</strong> ₹{totalAmount.toFixed(2)}</p>
      {/* <p><strong>Bill IDs:</strong> {billIds.join(", ")}</p>
      <p><strong>Newspaper IDs:</strong> {paperIds.join(", ")}</p> */}

      <button
        onClick={() => onPayAll(totalAmount, billIds, paperId, agencyId)}
        className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Pay Total Amount ₹{totalAmount.toFixed(2)}
      </button>
    </div>
  );
};


const NewspaperCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: papers,
    loading: papersLoading,
    error: papersError,
  } = useSelector((state) => state.customerPaperRec);

  const {
    data: billData,
    loading: billLoading,
    error: billError,
  } = useSelector((state) => state.customerBillByNewspaper);




  const {
    loading: payLoading,
  } = useSelector((state) => state.customerPayBill);

  const { data: searchData, loading: searchLoading, error: searchError } = useSelector(
    (state) => state.searchCustomerBill
  );

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerPaperRecs());
  }, [dispatch]);

  useEffect(() => {
    if (papers && papers.length > 0) {
      setSelectedPaper(papers[0]);
      dispatch(fetchCustomerBillsByNewspaper(papers[0].news_paper_id));
    }
  }, [papers, dispatch]);

  useEffect(() => {
    if (searchData && searchData.length > 0) {
      setShowSearchResults(true);
    }
  }, [searchData]);

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    setShowSearchResults(false);
    dispatch(fetchCustomerBillsByNewspaper(paper.news_paper_id))
      .unwrap()
      .then((res) => console.log("Bill data:", res))
      .catch((err) => console.error("Failed to fetch bill:", err));
  };



  const handlePayAll = async (totalAmount, billIds, paperId, agencyId) => {
    const payLoad = {
      amount: totalAmount,
      bill_id: billIds,
      news_paper_id: paperId,
      agency_id: agencyId
    };

    try {
      const res = await dispatch(payNewspaperBillByCustomer(payLoad)).unwrap();
      toast.success("Payment successful!");
      navigate(`/news/pay/${res.data}`);
      console.log("Payment response:", res);
    } catch (err) {
      toast.error("Payment failed!");
      console.error(err);
    }
  };





  const handleSearch = () => {
    if (!searchTerm || searchTerm.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    dispatch(searchCustomerBill({ mobile: searchTerm }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    dispatch(clearSearchBillState());
    if (papers && papers.length > 0) {
      setSelectedPaper(papers[0]);
      dispatch(fetchCustomerBillsByNewspaper(papers[0].news_paper_id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isLoading = papersLoading || billLoading || payLoading || searchLoading;



  const BillCard = ({ bill }) => (
    <div
      key={bill.id}
      className="bg-white rounded-2xl overflow-hidden border border-amber-200 mt-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold"> {bill.paper_details.news_paper_name}</h2>
            <p className="text-amber-100">{bill.agency_details.agency_name}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 font-bold text-lg uppercase">
            {bill.paper_details.news_paper_name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Bill Info */}
      <div className="p-6">
        {/* Agency Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-800 flex items-center">
            <FiUser className="mr-2" /> Agency Information
          </h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex items-center">
              <FiUser className="text-amber-600 mr-3" />
              <span>{bill.agency_details.agency_name}</span>
            </div>
            <div className="flex items-start">
              <FiMapPin className="text-amber-600 mr-3 mt-1" />
              <span className="flex-1">
                {bill.agency_details.address}, {bill.agency_details.city}, {bill.agency_details.state}
              </span>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-amber-600 mr-3" />
              <span>{bill.agency_details.mobile}</span>
            </div>
          </div>
        </div>

        {/* Bill Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-800 flex items-center">
            <FiCalendar className="mr-2" /> Bill Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
            {/* <div className="text-gray-600">Bill Date:</div>
            <div className="font-medium">{formatDate(bill.bill_date)}</div> */}
            <div className="text-gray-600">Payable Month:</div>
            <div className="font-medium">{formatDate(bill.payable_month)}</div>
            <div className="text-gray-600">Per Day Rate:</div>
            <div className="font-medium">{formatCurrency(bill.per_paper_rate)}</div>
            <div className="text-gray-600">No. of Days:</div>
            <div className="font-medium">{bill.no_of_days}</div>
          </div>
        </div>

        {/* Payment Status */}
        <div className={`rounded-xl p-4 mb-4 ${bill.payment_status === 1 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex justify-between items-center">
            <span className={`font-semibold ${bill.payment_status === 1 ? "text-green-800" : "text-amber-800"}`}>
              Status: {bill.payment_status === 1 ? "Paid" : "Pending"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${bill.payment_status === 1 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
            >
              {bill.payment_status === 1 ? "Completed" : "Action Required"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-4xl mx-auto p-4">
      {isLoading && <VendorLoader />}

      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-amber-800">
          {showSearchResults ? "Search Results" : "Select Newspaper"}
        </h2>
        {!showSearchResults && (
          <div className="flex space-x-2">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <FiSearch className="text-amber-400 mr-3 flex-shrink-0" size={20} />
          <div className="flex-1 flex items-center space-x-3">
            <div className="w-[70%]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter mobile  number to search bills..."
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 font-medium"
                maxLength={10}
              />
            </div>
            {searchTerm && (
              <span className="text-amber-600 text-sm font-medium bg-amber-100 px-2 py-1 rounded-lg">
                {searchTerm.length}/10
              </span>
            )}
          </div>

          <div className="w-[30%] pl-3 flex space-x-2">
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                <FiX size={16} />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-amber-300 transition-all duration-200 font-medium shadow-sm"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Error */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center text-red-700">
            <FiAlertCircle className="mr-2" />
            <span>{searchError}</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showSearchResults && searchData && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Found {searchData.length} bill{searchData.length !== 1 ? "s" : ""} for mobile: {searchTerm}
            </h3>
            <button
              onClick={handleClearSearch}
              className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
            >
              <FiX className="mr-1" /> Clear Search
            </button>
          </div>
          {searchData.map((bill) => (
            <BillCard key={bill.id} bill={bill} payLoading={payLoading} handlePayNow={handlePayNow} />
          ))}
        </div>
      )}

      {/* Newspaper Carousel */}
      {!showSearchResults && (
        <Swiper
          spaceBetween={8}
          slidesPerView={2.2}
          breakpoints={{
            400: { slidesPerView: 2.5 },
            500: { slidesPerView: 3.2 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 4.5 },
            1024: { slidesPerView: 5.5 },
            1280: { slidesPerView: 6.5 },
          }}
          onSwiper={setSwiperInstance}
          centeredSlides={false}
          centerInsufficientSlides={true}
        >
          {papers?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center text-amber-700 py-10 px-4">
              <FiAlertCircle size={40} className="mb-3 text-amber-500" />
              <div className="text-2xl font-bold mb-2">No Newspaper Subscriptions</div>
              <p className="text-sm text-amber-600 max-w-md">
                You haven't subscribed to any newspapers yet. Explore our subscriptions to stay updated with the latest news!
              </p>
            </div>
          ) : (
            papers?.map((paper) => (
              <SwiperSlide key={paper.id}>
                <div
                  onClick={() => handlePaperSelect(paper)}
                  className={`cursor-pointer my-6 flex flex-col items-center p-3 rounded-xl border-2 mx-auto max-w-[120px] transition-all duration-300 ${selectedPaper?.id === paper.id
                    ? "bg-white border-amber-500 transform scale-105"
                    : "bg-amber-100 border-amber-200 hover:bg-amber-200 hover:border-amber-300"
                    }`}
                >
                  <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 font-bold text-lg uppercase">
                    {paper.paper_details.news_paper_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span className="text-xs font-medium text-amber-900 mt-2 text-center line-clamp-2">
                    {paper.paper_details.news_paper_name}
                  </span>
                  <span className="text-[10px] text-amber-600 mt-1 text-center">
                    {paper.agency_details.agency_name}
                  </span>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      )}

      {/* Pending and Unpaid Bills */}
      {!showSearchResults && billData && (
        <>
          {billData.pending?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Pending Bills</h3>
              {billData.pending.map((bill) => (
                <BillCard key={bill.id} bill={bill} payLoading={payLoading} />
              ))}
            </div>
          )}
          {billData?.pending?.length > 0 && (
            <BillSummary data={billData} onPayAll={handlePayAll} />
          )}
        </>
      )}
    </div>
  );
};

export default NewspaperCarousel;

























