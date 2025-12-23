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
import { TbAbacus, TbCalendarTime, TbMapPin, TbRefresh } from "react-icons/tb";
import { MdOutlineVerified } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { TbCoinRupee, TbMapPinCode } from "react-icons/tb";
import useGetProfile from "../hooks/useGetProfile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/uiStore";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";
import Profile from "./Profile";
import { FaTrash } from "react-icons/fa";
import ShareButton from "../components/ShareButton";
import { useGetPackage, useChangePackage } from "../hooks/usePackageChange";
import { useAddress } from "../hooks/useAddress";
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

// const ProfileLink = ({ icon: Icon, text, showBadge, onClick }) => (
//   <div
//     onClick={onClick}
//     className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
//   >
//     <div className="flex items-center">
//       <div className="p-2 rounded-md bg-[#FDF2E6] mr-3">
//         <Icon className="text-[#EAA11E]" />
//       </div>
//       <span className="text-gray-700">{text}</span>
//     </div>
//     {showBadge && (
//       <span className="bg-[#FDF2E6] text-[#EAA11E] text-xs font-medium px-2 py-1 rounded-full">
//         New
//       </span>
//     )}
//   </div>
// );
const ProfileLink = ({ icon: Icon, image, text, showBadge, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
  >
    <div className="flex items-center">
      <div className="p-1 rounded-md bg-[#FDF2E6] mr-3 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={text}
            className="w-10   h-10 object-contain bg-black"
          />
        ) : (
          Icon && <Icon className="text-[#EAA11E] text-lg" />
        )}
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

const WalletCard = ({ balance, points, transactions, onGoToRewards }) => (
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

    <button
      onClick={onGoToRewards}
      className="relative w-full py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
    >
      {/* Button Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      <span className="relative z-10 flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>Explore Rewards & Benefits</span>
      </span>
    </button>
  </div>
);

const PackageCard = ({ pkg, onChangeAddress }) => {
  return (
    <div className="p-4 mb-3 border rounded-xl shadow-sm bg-white">
      {/* Package name & status */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {pkg?.package_details?.package_name}
        </h2>

        <span className="flex items-center text-green-600 text-sm font-medium">
          <MdOutlineVerified className="mr-1" size={18} />
          Active
        </span>
      </div>
      {/* Package Amount */}
      <div className="flex items-center mb-2 text-gray-700">
        <TbCoinRupee className="mr-2" size={20} />
        <span className="font-medium">Amount: ₹{pkg?.package_amount}</span>
      </div>
      {/* Duration */}
      <div className="flex items-center mb-2 text-gray-700">
        <TbCalendarTime className="mr-2" size={20} />
        <span className="font-medium">
          Duration: {pkg?.duration_month} Month
        </span>
      </div>
      {/* Expiry Date */}
      <div className="flex items-center mb-2 text-gray-700">
        <TbCalendarTime className="mr-2" size={20} />
        <span className="font-medium">
          Expiry:{" "}
          {pkg?.expiry_date
            ? new Date(pkg.expiry_date).toLocaleDateString("en-GB")
            : ""}
        </span>
      </div>
      {/* Address */}
      <div className="flex items-center mb-2 text-gray-700">
        <TbMapPinCode className="mr-2" size={20} />
        <span className="font-medium">
          Pincode: {pkg?.address_details?.pincode}
        </span>
      </div>
      <div className="flex items-center mb-2 text-gray-700">
        <TbMapPin className="mr-2" size={20} />
        <span className="font-medium">
          Address: {pkg?.address_details?.address}
        </span>
      </div>
      {/* address_change Limit */}
      <div className="flex items-center mb-2 text-gray-700">
        <TbAbacus className="mr-2" size={20} />
        <span className="font-medium">
          Address Change Limit: {pkg?.package_details?.address_change}
        </span>
      </div>
      {/* Address Change Count */}
      <div className="flex items-center text-gray-700">
        <TbRefresh className="mr-2" size={20} />
        <span className="font-medium">
          Address Change Count: {pkg?.address_change_count}
        </span>
      </div>
      {/* Change Adreess */}
      {pkg?.address_change_count < pkg?.package_details?.address_change && (
        <div className="flex items-center justify-end mt-4">
          <button
            onClick={onChangeAddress}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Change Address
          </button>
        </div>
      )}
    </div>
  );
};

const AllProfiles = () => {
  const [showModal, setShowModal] = useState(false);
  const token = useAuthStore.getState().token;
  const { profile, loading, error } = useGetProfile();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const { data, refetch } = useGetPackage();
  const { data: addressData, isLoading } = useAddress(token);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPkgId, setSelectedPkgId] = useState(null);

  const { mutate: changePackage, isPending } = useChangePackage();

  const handleNavigateToRewards = () => {
    navigate("/rewards");
  };

  useEffect(() => {
    if (error === "Unauthenticated.") {
      console.warn("Session expired — logging out...");
      logout();
      navigate("/");
    }
  }, [error, logout, navigate]);

  const handleLogout = async () => {
    const closeLoginModal = useModalStore.getState().closeLoginModal;
    await logout();
    closeLoginModal();
    setTimeout(() => navigate("/"), 0);
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

  const handleOpenAddressModal = (pkg) => {
    setSelectedPkgId(pkg.id);
    setSelectedAddress(pkg.address_id);
    setShowAddressModal(true);
  };

  const handleSubmitAddressChange = () => {
    if (!selectedAddress) return;

    changePackage(
      {
        packageId: selectedPkgId,
        address_id: selectedAddress,
      },
      {
        onSuccess: () => {
          setShowAddressModal(false);
          refetch();
        },
      }
    );
  };

  const handleEditProfileClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <TataNeuNavbar />

      <div className="bg-gradient-to-b from-[#FDF2E6] to-gray-50 py-8 px-4  mb-20">
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

          {/* Package Section */}
          {/* <Section title="Packages" icon={GoPackage}>
            {data?.data?.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onChangeAddress={() => handleOpenAddressModal(pkg)}
              />
            ))}
          </Section> */}
          <Section title="Packages" icon={GoPackage}>
            {data?.data && data.data.length > 0 ? (
              data.data.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onChangeAddress={() => handleOpenAddressModal(pkg)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-5xl mb-4">🎫</div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No Active Pass Found
                </h3>

                <p className="text-sm text-gray-600 mt-2 max-w-xs">
                  You haven’t subscribed to any pass yet. Subscribe now to enjoy
                  seamless rides and exclusive benefits.
                </p>

                <Link
                  to="/gunti-pass"
                  className="mt-5 inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                >
                  Subscribe Now →
                </Link>
              </div>
            )}
          </Section>

          {/* Wallet Section */}
          <Section
            title="Wallet & Payments"
            icon={TbCoinRupee}
            defaultExpanded={true}
          >
            <WalletCard
              balance={profile?.wallet_details || 0}
              onGoToRewards={handleNavigateToRewards}
            />
            <div className="mb-4">
              <ShareButton mobile={profile?.mobile} />
            </div>
          </Section>

          {/* Address Section */}
          <Section title="Address" icon={FiMapPin}>
            <ProfileLink
              icon={FiMapPin}
              text="Manage Address"
              // onClick={() => navigate("/user/address")}
              onClick={() => navigate("/address")}
            />
          </Section>

          {/* Orders Section */}
          {/* <Section title="Orders" icon={FiPackage}>
            <ProfileLink
              icon={FiPackage}
              text="GuntiMart Orders"
              onClick={() => navigate("/user/my-order")}
            />
            <ProfileLink
              icon={FiPackage}
              text="GuntiFast Orders"
              onClick={() => navigate("/gunti-fast/my-orders")}
            />
          </Section> */}
          <Section title="Orders" icon={FiPackage}>
            <ProfileLink
              image="cat/gunti_mart_1.jpeg"
              text="GuntiMart Orders"
              onClick={() => navigate("/user/my-order")}
            />

            <ProfileLink
              image="/gfast/gf.png"
              text="GuntiFast Orders"
              onClick={() => navigate("/gunti-fast/my-orders")}
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
              onClick={() => navigate("/ReferEarnFAQ")}
              icon={FiHelpCircle}
              text="Refer & Earn – FAQs"
            />
            <ProfileLink
              onClick={() => navigate("/contact-us")}
              icon={FiHelpCircle}
              text="Contact Support"
            />
            {/* <ProfileLink onClick={() => navigate("/feedback")} icon={FiHelpCircle} text="Feedback" /> */}
          </Section>

          <div className="">
            <Link
              to="/delete-account"
              className="w-full flex items-center justify-center py-3 px-4 text-red-500 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <FaTrash className="mr-2" />
              Delete Account
            </Link>
          </div>
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

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-11/12 max-w-md max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Select Address</h2>

            {addressData?.length > 0 ? (
              addressData.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => setSelectedAddress(ad.id)}
                  className={`border p-3 rounded-lg cursor-pointer mb-2 ${
                    selectedAddress === ad.id
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{ad.name}</p>
                  <p className="text-sm">{ad.phone}</p>
                  <p className="text-sm text-gray-600">{ad.pincode}</p>
                  <p className="text-sm">{ad.address}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No addresses found.</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={handleSubmitAddressChange}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Update Address
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomMenu />
    </>
  );
};

export default AllProfiles;
