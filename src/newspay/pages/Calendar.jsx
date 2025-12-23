import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchEvents } from "../redux/slices/calendarSlice";
import { getCustomerCareInfo } from "../redux/slices/customerCareSlice";
import { getPaperRecordsByAgency } from "../redux/slices/paperSlice";

// Setup the calendar localization
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

export default function BigCalendarExample() {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.papers);
  const { customerCareInfo } = useSelector((state) => state.customerCare);
  const { events, loading, error } = useSelector((state) => state.calendar);

  const [agency, setAgency] = useState("");
  const [currentPaper, setCurrentPaper] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data has been loaded

  useEffect(() => {
    dispatch(getCustomerCareInfo());
  }, [dispatch]);

  useEffect(() => {
    if (agency) {
      dispatch(getPaperRecordsByAgency(agency));
    }
  }, [agency, dispatch]);

  const filteredRecords = records.filter(
    (item) => item.agency_id === parseInt(agency)
  );

  const agencyOptions = customerCareInfo?.map((agency) => ({
    id: agency.id,
    name: agency.agency_name,
  }));

  const currentPaperOptions = filteredRecords.map((item) => ({
    id: item.id,
    name: item.papername,
  }));

  // Handle the event submission and fetch events
  const handleSubmit = () => {
    if (!agency || !currentPaper) {
      alert("Please select both an agency and a paper.");
      return;
    }

    const eventData = {
      agency_id: agency,
      paper_rec_id: currentPaper,
      month: month + 1,
      year: year,
    };

    setDataLoaded(false); // Reset data loaded state
    dispatch(fetchEvents(eventData));
  };

  // When events are loaded, set dataLoaded to true
  useEffect(() => {
    if (events && (events.not_rec || events.closed)) {
      setDataLoaded(true);
    }
  }, [events]);

  // Prepare the events to be displayed on the calendar
  const calendarEvents = [];

  if (dataLoaded && events) {
    let stopMarkingReceived = false; // Flag to stop marking "Received" after a "Closed" date
    let lastClosedDate = null; // Track the last "Closed" date

    // 1. Mark "Not Received" dates
    events.not_rec?.forEach((date) => {
      calendarEvents.push({
        title: "Not Received",
        start: new Date(date),
        end: new Date(date),
        type: "not_received",
      });
    });

    // 2. Mark "Closed" dates and determine the last "Closed" date in the month
    events.closed?.forEach((date) => {
      const closedDate = new Date(date);
      const currentMonthStart = new Date(year, month); // Start of the selected month
      const currentMonthEnd = new Date(year, month + 1, 0); // End of the selected month

      // Only mark "Closed" if it falls within the selected month
      if (closedDate >= currentMonthStart && closedDate <= currentMonthEnd) {
        calendarEvents.push({
          title: "Closed",
          start: closedDate,
          end: closedDate,
          type: "closed",
        });

        // Set the flag to stop marking "Received" after the "Closed" date
        lastClosedDate = closedDate;
      }
    });

    // 3. Mark "Received" dates, but only up until the first "Closed" date within the selected month
    const currentMonth = new Date(year, month); // Start of the selected month
    const lastDateOfMonth = new Date(year, month + 1, 0); // Last date of the selected month

    for (
      let date = new Date(currentMonth);
      date <= lastDateOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Check if the "Closed" date has been reached or passed
      if (lastClosedDate && date > lastClosedDate) {
        break; // Stop marking "Received" dates after the "Closed" date
      }

      // Only mark "Received" if the date is not in "Not Received" or "Closed"
      if (
        !events.closed?.includes(formattedDate) &&
        !events.not_rec?.includes(formattedDate)
      ) {
        calendarEvents.push({
          title: "Received",
          start: new Date(formattedDate),
          end: new Date(formattedDate),
          type: "received",
        });
      }
    }
  }

  console.log("Calendar Events:", calendarEvents);

  // Custom event styling
  const eventStyleGetter = (event) => {
    let style = {
      borderRadius: "4px",
      border: "none",
      display: "block",
      fontSize: "12px",
      fontWeight: "bold",
      padding: "2px 4px",
    };

    if (event.type === "not_received") {
      style.backgroundColor = "#FFEB3B";
      style.color = "#333";
    } else if (event.type === "closed") {
      style.backgroundColor = "#F44336";
      style.color = "white";
    } else if (event.type === "received") {
      style.backgroundColor = "#4CAF50";
      style.color = "white";
    }

    return {
      style: style,
    };
  };

  // Custom toolbar to add month/year navigation
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className="rbc-toolbar flex flex-wrap items-center justify-between mb-4">
        <span className="rbc-btn-group">
          <button
            type="button"
            onClick={goToBack}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToCurrent}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r"
          >
            ›
          </button>
        </span>

        <span className="rbc-toolbar-label text-lg font-semibold">
          {toolbar.label}
        </span>

        <span className="rbc-btn-group">
          <button
            type="button"
            className={`px-3 py-1 rounded-l ${
              toolbar.view === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => toolbar.onView("month")}
          >
            Month
          </button>
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Paper Delivery Calendar
        </h1>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-yellow-50 rounded-lg">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Select Paper
            </label>
            <select
              value={currentPaper}
              onChange={(e) => setCurrentPaper(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              disabled={!agency}
            >
              <option value="">Select Paper</option>
              {currentPaperOptions.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Select Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              {months.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Select Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              {years.map((yearItem) => (
                <option key={yearItem} value={yearItem}>
                  {yearItem}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="mt-7 ">
            <button
              onClick={handleSubmit}
              disabled={!agency || !currentPaper}
              className={`px-2 py-2 rounded font-semibold ${
                !agency || !currentPaper
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Loading..." : "Show Calendar"}
            </button>
          </div>
        </div>

        {/* Show loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64 mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Loading calendar data...</span>
          </div>
        )}

        {/* Legend - Only show when data is loaded */}
        {dataLoaded && !loading && (
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Received</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
              <span className="text-sm">Not Received</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Closed</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Calendar - Only show when data is loaded */}
        <div className="calendar-container bg-white p-4 rounded-lg border border-gray-200">
          {dataLoaded && !loading ? (
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              views={["month"]}
              style={{ height: "60vh" }}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          ) : (
            !loading && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-lg">
                  Select an agency and paper, then click "Show Calendar"
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
