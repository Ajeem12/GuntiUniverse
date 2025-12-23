import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../redux/slices/customerSlice";
import hawkerReducer from "../redux/slices/hawkerSlice";
import billReducer from "../redux/slices/billSlice";
import vendorReducer from "../redux/slices/vendorSlice";
import newspaperReducer from "../redux/slices/newspaperSlice";
import authReducer from "../redux/slices/authSlice";
import changePaperReducer from "../redux/slices/changePaperSlice";
import languagesReducer from "../redux/slices/languageSlice";
import profileReducer from "../redux/slices/agencyProfileSlice";
import customerVerifyReducer from "../redux/slices/customerVerifySlice";
import ReportReducer from "../redux/slices/reportSlice";
import pauseReducer from "../redux/slices/pauseNStopSlice";
import changePaperRequestReducer from "../redux/slices/changePaperRequestSlice";
import pausedDeliveriesReducer from "../redux/slices/pausedDeliveriesSlice";
import customerComplaintsReducer from "../redux/slices/customerComplaintsSlice";
import CancellationRequestsReducer from "../redux/slices/cancellationRequestsSlice";
import changePasswordReducer from "../redux/slices/changePasswordSlice";
import CustomersByStatusReducer from "../redux/slices/customerStatusSlice";
import TransactionHistoryReducer from "../redux/slices/transactionHistorySlice";
import vendorPayoutReducer from "../redux/slices/vendorPayoutSlice";
import settlementReportReducer from "../redux/slices/settlementReportSlice";
import revenueReportReducer from "../redux/slices/revenueReportSlice";
import retentionAlertReducer from "../redux/slices/retentionAlertSlice";
import payOnBehalfReducer from "../redux/slices/payOnBehalfSlice";
import paymentStatusReducer from "../redux/slices/paymentStatusSlice";
import customerChangeStatusReducer from "../redux/slices/customerChangeStatusSlice";
import vendorNewspaperReducer from "../redux/slices/vendorNewspaperSlice";
import billPublishReducer from "../redux/slices/billPublishSlice";
import customerPaperRecReducer from "../redux/slices/customerPaperRecSlice";
import customerBillByNewspaperReducer from "../redux/slices/customerBillByNewspaperSlice";
import customerPayBillReducer from "../redux/slices/customerPayBillSlice";
import customerCareReducer from "../redux/slices/customerCareSlice";
import paperReducer from "../redux/slices/paperSlice";
import paperChangeRequestReducer from "../redux/slices/paperChangeRequestSlice";
import calendarReducer from "../redux/slices/calendarSlice";
import dashboardReducer from "../redux/slices/dashboardSlice";
import orderPaymentsReducer from "../redux/slices/orderPaymentsSlice";
import cityReducer from "../redux/slices/citySlice";
import lineReducer from "../redux/slices/lineSlice";
import newspaperLanguageReducer from "../redux/slices/newspaperLanguageSlice";
import searchBillReducer from "../redux/slices/searchBillSlice";
import agencyBillReducer from "../redux/slices/agencyBillSlice";
import searchCustomerBillReducer from "../redux/slices/searchCustomerBillSlice";
import linewiseCollectionReducer from "../redux/slices/lineWiseCollectionSlice";
import publishedBillToAgencyReducer from "../redux/slices/publishedBillToAgencySlice";
import customerChangePaperRecReducer from "../redux/slices/customerChangePaperRecSlice";
import genratedBillToAgencyReducer from "../redux/slices/genrateBillToAgency";
import payNewspaperBillReducer from "../redux/slices/payNewsbill";
import genrateCutomerInvoiceReducer from "../redux/slices/customerInvoice";
import dashboardCountReducer from "../redux/slices/dashboardCountSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    hawker: hawkerReducer,
    bill: billReducer,
    vendor: vendorReducer,
    newspaper: newspaperReducer,
    changePaper: changePaperReducer,
    languages: languagesReducer,
    agency: profileReducer,
    customerVerify: customerVerifyReducer,
    report: ReportReducer,
    pause: pauseReducer,
    changePaperRequest: changePaperRequestReducer,
    pausedDeliveries: pausedDeliveriesReducer,
    customerComplaints: customerComplaintsReducer,
    cancellationRequests: CancellationRequestsReducer,
    changePassword: changePasswordReducer,
    customerStatus: CustomersByStatusReducer,
    transactionHistory: TransactionHistoryReducer,
    vendorPayout: vendorPayoutReducer,
    settlement: settlementReportReducer,
    revenue: revenueReportReducer,
    retention: retentionAlertReducer,
    payOnBehalf: payOnBehalfReducer,
    paymentStatus: paymentStatusReducer,
    customerChangeStatus: customerChangeStatusReducer,
    vendorNewspaper: vendorNewspaperReducer,
    billPublish: billPublishReducer,
    customerPaperRec: customerPaperRecReducer,
    customerBillByNewspaper: customerBillByNewspaperReducer,
    customerPayBill: customerPayBillReducer,
    customerCare: customerCareReducer,
    papers: paperReducer,
    paperChangeRequest: paperChangeRequestReducer,
    calendar: calendarReducer,
    dashboard: dashboardReducer,
    orderPayments: orderPaymentsReducer,
    cities: cityReducer,
    line: lineReducer,
    newspaperLanguage: newspaperLanguageReducer,
    searchBill: searchBillReducer,
    agencyBill: agencyBillReducer,
    searchCustomerBill: searchCustomerBillReducer,
    lineWise: linewiseCollectionReducer,
    publishedBillToAgency: publishedBillToAgencyReducer,
    customerChangePaperRec: customerChangePaperRecReducer,
    genratedBillToAgency: genratedBillToAgencyReducer,
    payNewspaperBill: payNewspaperBillReducer,
    customerInvoice: genrateCutomerInvoiceReducer,
    dashcount: dashboardCountReducer,
  },
});

export default store;
