import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiLock,
  FiChevronRight,
  FiFileText,
  FiPlus,
  FiList,
  FiEye,
  FiPieChart,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../newspay/redux/slices/authSlice';
import { fetchAgencyProfile } from "../../redux/slices/agencyProfileSlice";
import { useEffect } from "react";


const menuItems = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    to: "/vendor/dashboard",
  },
  {
    label: "Hawker Mgmt",
    icon: <FiUsers className="w-5 h-5" />,
    submenu: [
      {
        label: "Add Hawker",
        to: "/vendor/hawker/add",
        icon: <FiPlus className="w-4 h-4" />,
      },
      {
        label: "All Hawker",
        to: "/vendor/hawker/list",
        icon: <FiList className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Customer Mgmt",
    icon: <FiUsers className="w-5 h-5" />,
    submenu: [
      {
        label: "Add Customer",
        to: "/vendor/customer/add",
        icon: <FiPlus className="w-4 h-4" />,
      },
      {
        label: "All Customer",
        to: "/vendor/customer/list",
        icon: <FiList className="w-4 h-4" />,
      },
    ],
  },

  {
    label: "Billing Mgmt",
    icon: <FiFileText className="w-5 h-5" />,
    submenu: [
      {
        label: "Generate Bills",
        to: "/vendor/billing/createbill",
        icon: <FiFileText className="w-4 h-4" />,
      },
      // {
      //   label: "Genrated Bills",
      //   to: "/vendor/billing/generatelist",
      //   icon: <FiFileText className="w-4 h-4" />,
      // },
      {
        label: "View Customer Invoices",
        to: "/vendor/billing/customer-invoices",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "View Customer Payment Status",
        to: "/vendor/billing/payments",
        icon: <FiEye className="w-4 h-4" />,
      },
      {
        label: "Payments Collection Reports",
        to: "/vendor/billing/reports",
        icon: <FiPieChart className="w-4 h-4" />,
      },
      {
        label: "Pay Behalf Of Customer ",
        to: "/vendor/billing/pay-behalf",
        icon: <FiCreditCard className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Payouts & Finance",
    icon: <BiRupee className="w-5 h-5" />,
    submenu: [
      {
        label: "Revenue Reports",
        to: "/vendor/finance/revenue",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Vendor Payout Reports",
        to: "/vendor/finance/payout-reports",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Pending / Settlements",
        to: "/vendor/finance/settlements",
        icon: <FiFileText className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Requests Mgmt",
    icon: <FiFileText className="w-5 h-5" />,
    submenu: [
      {
        label: "Customer Complaints",
        to: "/vendor/requests/complaints",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Paper Change Request",
        to: "/vendor/requests/paper-change",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Paused Deliveries",
        to: "/vendor/requests/paused-deliveries",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Closing Requests",
        to: "/vendor/requests/closing-requests",
        icon: <FiFileText className="w-4 h-4" />,
      },

    ],
  },

  {
    label: "Customer Insights",
    icon: <FiPieChart className="w-5 h-5" />,
    submenu: [
      {
        label: "Inactive vs Retired",
        to: "/vendor/insights/inactive-retired",
        icon: <FiFileText className="w-4 h-4" />,
      },
      {
        label: "Retention Alerts",
        to: "/vendor/insights/retention-alerts",
        icon: <FiEye className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "My Profile",
    icon: <FiUser className="w-5 h-5" />,
    to: "/vendor/profile",
  },
  // {
  //   label: "Newspaper Price",
  //   icon: <BiRupee className="w-5 h-5" />,
  //   to: "/vendor/newspaper",
  // },
  {
    label: "Customer Care",
    icon: <FiUsers className="w-5 h-5" />,
    to: "/vendor/core/universe-details",
  },
  {
    label: "Change Password",
    icon: <FiLock className="w-5 h-5" />,
    to: "/vendor/change-password",
  },
];

const AppSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.agency);



  useEffect(() => {
    dispatch(fetchAgencyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.status === 0 && location.pathname !== "/vendor/profile") {
      navigate("/vendor/profile", { replace: true });
    }
  }, [profile, location.pathname, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/vendor/login');

  };

  return (
    <Sidebar
      collapsed={collapsed}
      collapsedWidth="80px"
      width="250px"
      rootStyles={{
        height: "100%",
        position: "relative",
        background: "#fff",
        transition: "all 0.3s ease",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-4 h-16 bg-amber-50 border-b border-amber-200">
        {collapsed ? (
          <button onClick={onToggle} className="rounded-md p-1">
            <FaUser className="text-amber-600 text-lg" />
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Link to="#" className="flex items-center">
              <FaUser className="text-amber-600 text-lg mr-2" />
              <span className="text-xl font-bold no-underline text-amber-800">
                Vendor
              </span>
            </Link>
            <button
              onClick={onToggle}
              className="text-amber-600 p-1 rounded hover:bg-amber-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Menu
          menuItemStyles={{
            button: ({ active, level }) => {
              const isSub = level > 0;
              return {
                padding: "10px 15px",
                backgroundColor: active ? "#FEF3C7" : "transparent",
                color: active ? "#92400E" : "#78350F",
                "&:hover": {
                  backgroundColor: "#FEF3C7",
                  color: "#92400E",
                },
                transition: "all 0.2s ease",
                paddingLeft: isSub ? "30px" : "15px",
                borderLeft: isSub && active ? "2px solid #F59E0B" : "none",
              };
            },
            icon: {
              marginRight: collapsed ? 0 : "10px",
              transition: "margin-right 0.3s ease",
              color: "#D97706", // Amber 600
            },
            label: ({ level }) => ({
              fontSize: "14px",
              fontWeight: level > 0 ? 400 : 500,
              opacity: collapsed && level === 0 ? 0 : 1,
              transition: "opacity 0.3s ease",
              color: "#78350F",
            }),
            subMenuContent: {
              backgroundColor: "#FFFBEB",
              borderLeft: "2px solid #F59E0B",
            },
          }}
        >
          {menuItems.map((item) => {
            const isRestricted = profile?.status === 0;
            const isProfile = item.to === "/vendor/profile";
            if (isRestricted && !isProfile) {
              return (
                <MenuItem
                  key={item.label}
                  icon={item.icon}
                  disabled
                  style={{ opacity: 0.5, pointerEvents: "none" }}
                >
                  {item.label}
                </MenuItem>
              );
            }

            if (item.isHeading) {
              return (
                <div
                  key={item.label}
                  className={`px-4 py-2 mt-4 mb-2 text-base font-semibold text-amber-700 tracking-wide uppercase ${collapsed ? "hidden" : ""
                    }`}
                >
                  {item.label}
                </div>
              );
            }

            if (item.submenu) {
              return (
                <SubMenu
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  defaultOpen={location.pathname.startsWith(
                    item.submenu[0].to.split("/")[1]
                  )}
                >
                  {item.submenu.map((sub) => (
                    <MenuItem
                      key={sub.label}
                      component={<Link to={sub.to} />}
                      active={location.pathname === sub.to}
                    >
                      {sub.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              );
            }

            return (
              <MenuItem
                key={item.label}
                icon={item.icon}
                component={<Link to={item.to} />}
                active={location.pathname === item.to}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </Menu>
      </div>

      {/* Bottom Menu */}
      <Menu
        menuItemStyles={{
          button: {
            padding: "10px 15px",
            color: "#78350F",
            "&:hover": {
              backgroundColor: "#FEF3C7",
              color: "#92400E",
            },
            transition: "all 0.2s ease",
          },
          icon: {
            marginRight: collapsed ? 0 : "10px",
            transition: "margin-right 0.3s ease",
            color: "#D97706", // Amber 600
          },
          label: {
            fontSize: "14px",
            fontWeight: 500,
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.3s ease",
            color: "#78350F",
          },
        }}
      >
        <MenuItem
          icon={<FaSignOutAlt className="w-5" />}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default AppSidebar;
