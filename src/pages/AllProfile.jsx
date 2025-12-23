import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiMapPin,
  FiPackage,
  FiBell,
  FiHeart,
  FiCreditCard,
  FiShield,
  FiHelpCircle,
  FiLogOut,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { TbCoinRupee } from "react-icons/tb";
import useGetProfile from "../hooks/useGetProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";
import Profile from "./Profile";
const Section = ({ title, icon: Icon, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-[#FDF2E6] mr-3">
            <Icon className="text-[#EAA11E] text-lg" />
          </div>
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        {expanded ? (
          <FiChevronUp className="text-gray-400" />
        ) : (
          <FiChevronDown className="text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};

const ProfileLink = ({ icon: Icon, text, showBadge, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
  >
    <div className="flex items-center">
      <div className="p-2 rounded-md bg-[#FDF2E6] mr-3">
        <Icon className="text-[#EAA11E]" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
    {showBadge && (
      <span className="bg-[#FDF2E6] text-[#EAA11E] text-xs font-medium px-2 py-1 rounded-full">
        New
      </span>
    )}
  </div>
);

const WalletCard = ({ balance, points, transactions }) => (
  <div className="bg-gradient-to-br from-[#EAA11E] to-[#F5C271] rounded-xl p-5 text-white shadow-lg mb-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <h3 className="font-semibold">Wallet Balance</h3>
      </div>
      <span className="text-xl"> ₹ </span>
    </div>

    <div className="mb-4">
      <div className="text-3xl font-bold">
        ₹{balance?.toLocaleString() || "0.00"}
      </div>
      <p className="text-orange-100 text-sm">Available Balance</p>
    </div>
  </div>
);

const AllProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const { profile, loading, error } = useGetProfile();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    const closeLoginModal = useModalStore.getState().closeLoginModal;
    await logout();
    closeLoginModal();
    setTimeout(() => navigate("/home"), 0);
  };

  const [formUser, setFormUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (profile) {
      setFormUser({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.name) {
      return profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.name || "User";
  };

  const getMemberSince = () => {
    if (profile?.created_at) {
      const date = new Date(profile.created_at);
      return `Member since ${date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`;
    }
    return "Member";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF2E6] to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAA11E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF2E6] to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading profile</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  const handleEditProfileClick = () => {
    console.log("Edit profile clicked");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#FDF2E6] to-gray-50 py-8 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EAA11E] to-[#F5C271] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {getInitials()}
                </div>
                <button className="absolute bottom-0 right-0 bg-[#EAA11E] text-white p-1 rounded-full text-xs shadow-md">
                  <FiEdit size={10} />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {getFullName()}
                </h2>
                <p className="text-sm text-gray-600">{profile?.email}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {getMemberSince()}
                  </span>
                </div>
                {profile?.mobile && (
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Mobile: {profile.mobile}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleEditProfileClick}
              className="w-full py-2.5 bg-[#FDF2E6] text-[#EAA11E] rounded-lg font-medium text-sm hover:bg-[#F9E3CB] transition-colors duration-150"
            >
              Edit Profile
            </button>
          </div>

          {/* Wallet Section */}
          <Section
            title="Wallet & Payments"
            icon={TbCoinRupee}
            defaultExpanded={true}
          >
            <WalletCard balance={profile?.wallet_details || 0} />
          </Section>

          {/* Address Section */}
          <Section title="Address" icon={FiMapPin}>
            <ProfileLink
              icon={FiMapPin}
              text="Manage Address"
              onClick={() => navigate("/address")}
            />
          </Section>

          {/* Orders Section */}
          <Section title="Orders" icon={FiPackage}>
            <ProfileLink
              icon={FiPackage}
              text="My Orders"
              onClick={() => navigate("/user/my-order")}
            />
          </Section>

          {/* Newspaper Subscription Section */}
          {profile?.news_paper_user === 1 && (
            <Section title="Newspaper Subscription" icon={FiBell}>
              <ProfileLink
                icon={FiBell}
                text="My Subscriptions"
                onClick={() => navigate("/news/bill")}
              />
              <ProfileLink
                icon={FiBell}
                text="Subscription History"
                onClick={() => navigate("/news/history")}
              />
            </Section>
          )}

          {/* Additional Sections */}
          <Section title="Help & Support" icon={FiHelpCircle}>
            <ProfileLink
              onClick={() => navigate("/faq")}
              icon={FiHelpCircle}
              text="FAQs"
            />
            <ProfileLink
              onClick={() => navigate("/contact-us")}
              icon={FiHelpCircle}
              text="Contact Support"
            />
            <ProfileLink
              onClick={() => navigate("/feedback")}
              icon={FiHelpCircle}
              text="Feedback"
            />
          </Section>

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-3 px-4 text-gray-500 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div onClick={(e) => e.stopPropagation()}>
            <Profile onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default AllProfile;
