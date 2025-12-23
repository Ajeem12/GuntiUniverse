import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import { useAuthStore } from "./store/authStore";
import { useModalStore } from "./store/uiStore";
import UpdatePass from "./pages/UpdatePass";
import SearchResult from "./pages/SearchResult";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import CategoriesPage from "./components/CategoriesPage";
import LandingPage from "./pages/LandingPage";
import CategorySection from "./components/landing/CategorySection";
import ShippingPolicy from "./pages/ShippingPolicy";
import Offers from "./components/Offers";
import ContactUs from "./pages/ContactUs";
import Rewards from "./pages/Rewards";
import Success from "./pages/Success";
import AllProfile from "./pages/AllProfile";
import AllProfiles from "./pages/AllProfiles";

import NewspayLayout from "./layout/NewspayLayout";

import Homee from "./newspay/pages/Home";
import Abouts from "./newspay/pages/About";
import NotFounds from "./newspay/pages/NotFound";
import Bill from "./newspay/pages/Bill";
import Pay from "./newspay/pages/Pay";
import Change_paper from "./newspay/pages/Change_paper";
import Stop from "./newspay/pages/Stop";
import Report from "./newspay/pages/Report";
import Customer from "./newspay/pages/Customer";
import Successs from "./newspay/pages/Success";
import Offer from "./newspay/pages/Offer";
import History from "./newspay/pages/History";
import VendorLayout from "./layout/VendorLayout";
import Dashboard from "./newspay/pages/Vendor/Dashboard";
import Add_Customer from "./newspay/pages/Vendor/Customer/Add_Customer";
import List_Customer from "./newspay/pages/Vendor/Customer/List_Customer";
import Add_hawker from "./newspay/pages/Vendor/Hawker/Add_hawker";
import List_hawker from "./newspay/pages/Vendor/Hawker/List_hawker";
import Generates from "./newspay/pages/Vendor/Billing/Generates";
import Payments from "./newspay/pages/Vendor/Billing/Payments";
import Reports from "./newspay/pages/Vendor/Billing/Reports";
import Paybehalf from "./newspay/pages/Vendor/Billing/Paybehalf";
import VendorLogin from "./newspay/pages/Vendor/Auth/Login";
import CancellationRequests from "./newspay/pages/Vendor/Request/CancellationRequests";
import CustomerComplaints from "./newspay/pages/Vendor/Request/CustomerComplaints";
import PaperChangeRequests from "./newspay/pages/Vendor/Request/PaperChangeRequests";
import PausedDeliveries from "./newspay/pages/Vendor/Request/PausedDeliveries";
import VendorPayoutReports from "./newspay/pages/Vendor/Payout/VendorPayoutReports";
import RevenueReports from "./newspay/pages/Vendor/Payout/RevenueReports";
import SettlementReports from "./newspay/pages/Vendor/Payout/SettlementReports";
import ActiveInactiveCustomers from "./newspay/pages/Vendor/Insights/ActiveInactiveCustomers";
import RetentionAlerts from "./newspay/pages/Vendor/Insights/RetentionAlerts";
import Universe_Details from "./newspay/pages/Vendor/Universe/Universe_Details";
import ChangePassword from "./newspay/pages/Vendor/Auth/ChangePassword";
import RegisterVendor from "./newspay/pages/Vendor/RegisterVendor";
import { Navigate } from "react-router-dom";
import AgencyProfile from "./newspay/pages/Vendor/AgencyProfile";
import NewspaperPriceInput from "./newspay/pages/NewspaperPriceInput";
import ProtectedVendorRoute from "./newspay/components/ProtectedVendorRoute";
import Calendar from "./newspay/pages/Calendar";
import Protected from "./newspay/components/ProtectedNewsRoute";
import PaySuccess from "./newspay/pages/Success";
import Test from "./pages/Test";
import FAQPage from "./pages/FAQPage";
import FeedbackPage from "./pages/FeedbackPage";
import BillList from "./newspay/pages/Vendor/Billing/BillList";
import PublishBillToAgency from "./newspay/pages/Vendor/PublishBillToAgency";
import GenratedBillToAgency from "./newspay/pages/Vendor/GenratedBillToAgency";
import DeleteAccount from "./pages/DeleteAccount";
import Download from "./pages/Download";
import GFastLayout from "./guntiFast/layout/GFastLayout";
import FastHome from "./guntiFast/pages/FastHome";
import CheckoutPage from "./guntiFast/pages/CheckoutPage";
import FastProductPage from "./guntiFast/pages/FastProductPage";
import GuntiPassPage from "./pages/GuntiPassPage";
import ThankYouGuntiPass from "./pages/ThankYouGuntiPass";
import FastCart from "./guntiFast/pages/FastCart";
import FastMyOrders from "./guntiFast/pages/FastMyOrder";
import FastOrderDetails from "./guntiFast/pages/FastOrderDetails";
import GuntifastSuccess from "./guntiFast/pages/GuntifastSuccess";
import FastThankYou from "./guntiFast/pages/FastThankYou";

// import GuntifastOrder from "./guntiFast/pages/GuntifastOrder";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CategoryProductList = lazy(() =>
  import("./pages/category/CategoryProductList")
);
const Terms = lazy(() => import("./pages/Terms"));
const Partner = lazy(() => import("./pages/Partner"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Login = lazy(() => import("./pages/Login"));
const User = lazy(() => import("./pages/User"));
const Profile = lazy(() => import("./pages/Profile"));
const MyOrders = lazy(() => import("./pages/orders/MyOrder"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));
const Address = lazy(() => import("./pages/Address"));
const Order = lazy(() => import("./pages/Order"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const OfferItem = lazy(() => import("./components/OfferItem"));
const ReferEarnFAQ = lazy(() => import("./pages/ReferEarnFAQ"));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  if (!token) {
    openLoginModal();
    return null;
  }
  return children;
};

// Suspense Wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
    {Component}
  </Suspense>
);

// Route Definitions
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "about",
    element: withSuspense(<About />),
  },
  {
    path: "categories",
    element: <CategoriesPage />,
  },
  {
    path: "contact-us",
    element: <ContactUs />,
  },
  {
    path: "rewards",
    element: withSuspense(<Rewards />),
  },
  {
    path: "my-profiles",
    element: withSuspense(<AllProfiles />),
  },
  {
    path: "/thank-you-gunti-pass/:id?",
    element: withSuspense(<ThankYouGuntiPass />),
  },
  {
    path: "faq",
    element: withSuspense(<FAQPage />),
  },
  {
    path: "ReferEarnFAQ",
    element: withSuspense(<ReferEarnFAQ />),
  },
  {
    path: "feedback",
    element: withSuspense(<FeedbackPage />),
  },
  {
    path: "profile",
    element: withSuspense(<Profile />),
  },
  {
    path: "download",
    element: withSuspense(<Download />),
  },
  {
    path: "gunti-pass",
    element: withSuspense(<GuntiPassPage />),
  },
  {
    path: "address",
    element: withSuspense(<Address />),
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: withSuspense(<Home />),
      },
      {
        path: "cart",
        element: withSuspense(<Cart />),
      },

      {
        path: "category",
        element: <CategorySection />,
      },
      {
        path: "delete-account",
        element: (
          <ProtectedRoute>{withSuspense(<DeleteAccount />)}</ProtectedRoute>
        ),
      },
      {
        path: "product/:slug/:id",
        element: withSuspense(<ProductPage />),
      },
      // {
      //   path: "my-profile",
      //   element: withSuspense(<AllProfile />),
      // },

      {
        path: "user",
        element: <ProtectedRoute>{withSuspense(<User />)}</ProtectedRoute>,
        children: [
          {
            path: "my-order",
            element: withSuspense(<MyOrders />),
          },

          // {
          //   path: "address",
          //   element: withSuspense(<Address />),
          // },
          {
            path: "update-pass",
            element: withSuspense(<UpdatePass />),
          },
          {
            path: "order-detail/:orderId",
            element: withSuspense(<OrderDetails />),
          },
        ],
      },

      {
        path: "contact",
        element: withSuspense(<Contact />),
      },
      {
        path: "refund-policy",
        element: withSuspense(<RefundPolicy />),
      },
      {
        path: "privacy-policy",
        element: withSuspense(<PrivacyPolicy />),
      },
      {
        path: "shipping-policy",
        element: withSuspense(<ShippingPolicy />),
      },
      {
        path: "terms",
        element: withSuspense(<Terms />),
      },
      {
        path: "order",
        element: withSuspense(<Order />),
      },
      {
        path: "search",
        element: withSuspense(<SearchResult />),
      },
      {
        path: "category/:slug/:subslug?",
        element: withSuspense(<CategoryProductList />),
      },
      {
        path: "offers/:offerName",
        element: withSuspense(<OfferItem />),
      },
      {
        path: "offers",
        element: withSuspense(<Offers />),
      },
      {
        path: "test",
        element: withSuspense(<Test />),
      },
      {
        path: "thank-you/:transaction_id",
        element: <ProtectedRoute>{withSuspense(<ThankYou />)}</ProtectedRoute>,
      },

      {
        path: "success",
        element: <ProtectedRoute>{withSuspense(<Success />)}</ProtectedRoute>,
      },
      {
        path: "seller-registration",
        element: withSuspense(<Partner />),
      },
      {
        path: "*",
        element: withSuspense(<NotFound />),
      },
    ],
  },
  {
    path: "/news",
    element: <NewspayLayout />,
    children: [
      { index: true, element: <Homee /> },
      // { path: "about", element: <Protected><Abouts /> </Protected> },
      {
        path: "calender",
        element: (
          <Protected>
            {" "}
            <Calendar />
          </Protected>
        ),
      },
      {
        path: "bill",
        element: (
          <Protected>
            {" "}
            <Bill />{" "}
          </Protected>
        ),
      },
      {
        path: "pay/:id",
        element: (
          <Protected>
            {" "}
            <Pay />{" "}
          </Protected>
        ),
      },
      {
        path: "change-paper",
        element: (
          <Protected>
            {" "}
            <Change_paper />
          </Protected>
        ),
      },
      {
        path: "pause-paper",
        element: (
          <Protected>
            {" "}
            <Stop />
          </Protected>
        ),
      },
      {
        path: "report",
        element: (
          <Protected>
            {" "}
            <Report />{" "}
          </Protected>
        ),
      },
      // { path: "success", element: <Successs /> },
      {
        path: "customer",
        element: (
          <Protected>
            {" "}
            <Customer />{" "}
          </Protected>
        ),
      },
      { path: "offer", element: <Offer /> },
      { path: "thank-you/:transaction_id", element: <PaySuccess /> },

      {
        path: "history",
        element: (
          <Protected>
            {" "}
            <History />{" "}
          </Protected>
        ),
      },
      { path: "*", element: <NotFounds /> },
    ],
  },
  { path: "/vendor/login", element: <VendorLogin /> },
  { path: "/vendor/register", element: <RegisterVendor /> },
  {
    path: "/vendor",

    element: (
      <ProtectedVendorRoute>
        <VendorLayout />
      </ProtectedVendorRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "newspaper", element: <NewspaperPriceInput /> },
      { path: "profile", element: <AgencyProfile /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "customer/add", element: <Add_Customer /> },
      { path: "customer/add/:id", element: <Add_Customer /> },
      { path: "customer/list", element: <List_Customer /> },
      { path: "hawker/add", element: <Add_hawker /> },
      { path: "hawker/add/:id", element: <Add_hawker /> },
      { path: "hawker/list", element: <List_hawker /> },
      {
        path: "billing",
        children: [
          { path: "createbill", element: <Generates /> },
          { path: "generatelist", element: <GenratedBillToAgency /> },
          { path: "customer-invoices", element: <PublishBillToAgency /> },
          { path: "billlist/:id", element: <BillList /> },
          { path: "payments", element: <Payments /> },
          { path: "reports", element: <Reports /> },
          { path: "pay-behalf", element: <Paybehalf /> },
        ],
      },
      {
        path: "requests",
        children: [
          { path: "paper-change", element: <PaperChangeRequests /> },
          { path: "paused-deliveries", element: <PausedDeliveries /> },
          { path: "closing-requests", element: <CancellationRequests /> },
          { path: "complaints", element: <CustomerComplaints /> },
        ],
      },
      {
        path: "finance",
        children: [
          { path: "payout-reports", element: <VendorPayoutReports /> },
          { path: "settlements", element: <SettlementReports /> },
          { path: "revenue", element: <RevenueReports /> },
        ],
      },
      {
        path: "insights",
        children: [
          { path: "inactive-retired", element: <ActiveInactiveCustomers /> },
          { path: "retention-alerts", element: <RetentionAlerts /> },
        ],
      },
      {
        path: "core",
        children: [{ path: "universe-details", element: <Universe_Details /> }],
      },
    ],
  },
  {
    path: "/gunti-fast",
    element: <GFastLayout />,
    children: [
      { index: true, element: <FastHome /> },
      { path: "product-list/:id", element: <FastProductPage /> },
      { path: "fast-cart", element: <FastCart /> },
      { path: "fast-checkout", element: <CheckoutPage /> },
      {
        path: "my-orders",
        element: <FastMyOrders />,
      },
      {
        path: "order-detail/:orderId",
        element: <FastOrderDetails />,
      },
      {
        path: "fast-success",
        element: (
          <ProtectedRoute>
            <GuntifastSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "thank-you/:transaction_id",
        element: (
          <ProtectedRoute>
            <FastThankYou />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
]);

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
        className="mobile-only"
      />
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            {/* Loading text with fade animation */}
            <div className="animate-pulse flex space-x-2">
              <img
                src="/loader/image(6).jpg"
                className="w-12 h-12 object-contain"
              ></img>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
