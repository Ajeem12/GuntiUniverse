// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import TataNeuNavbar from "../components/TataNeuNavbar";
// import { useWallet } from "../hooks/useWallet";
// import MobileBottomMenu from "../components/landing/MobileBottomMenu";
// import Guntiimg from "../components/Guntiimg";
// import Loader from "../components/Loader";
// import { useAuthStore } from "../store/authStore";
// import {
//   useAddress,
//   useAddAddress,
//   useUpdateAddress,
// } from "../hooks/useAddress";
// import Login from "./Login";

// const PurchaseModal = ({ isOpen, onClose, packageId }) => {
//   const token = useAuthStore((state) => state.token);
//   const navigate = useNavigate();

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const { mutate: fetchWallet, data: walletData } = useWallet();
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     colony_name: "",
//     house_no: "",
//     landmark: "",
//     address_type: "",
//     area: "",
//     latitude: "",
//     longitude: "",
//   });

//   const { data: addressData, isLoading, refetch } = useAddress(token);
//   const addAddressMutation = useAddAddress();
//   const updateAddressMutation = useUpdateAddress();

//   useEffect(() => {
//     if (token) refetch();
//   }, [token]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSaveAddress = () => {
//     if (editingAddress) {
//       updateAddressMutation.mutate(
//         { id: editingAddress.id, ...form },
//         {
//           onSuccess: () => {
//             setShowForm(false);
//             setEditingAddress(null);
//             refetch();
//           },
//         }
//       );
//     } else {
//       addAddressMutation.mutate(form, {
//         onSuccess: () => {
//           setShowForm(false);
//           refetch();
//         },
//       });
//     }
//   };
//   // ⭐ NEW UPDATED MUTATION (WITH PAYMENT POST REDIRECT)
//   const redirectWithPost = (url, data = {}) => {
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = url;

//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         const input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = data[key];
//         form.appendChild(input);
//       }
//     }

//     document.body.appendChild(form);
//     form.submit();
//   };

//   const mutation = useMutation({
//     mutationFn: async () => {
//       if (!selectedAddress) throw new Error("Please select an address");

//       const res = await axios.post(
//         `${import.meta.env.VITE_PORT_URL}/buy_package`,
//         { package_id: packageId, address_id: selectedAddress },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return res.data;
//     },

//     onSuccess: (data) => {
//       // Example response: { success:true, data:6, message:"package buy successfully" }
//       if (data?.success && data?.data) {
//         const packageBuyId = data.data;

//         // Step 1 → Build the payment URL
//         const payURL = `${
//           import.meta.env.VITE_PAY_URL
//         }/pay-gunti-pass/${packageBuyId}`;

//         // Step 2 → If server expects POST fields, send empty POST
//         redirectWithPost(payURL, {});
//         return;
//       }

//       // Step 3 → If no payment redirection (rare case)
//       navigate("/thank-you-gunti-pass");
//     },

//     onError: (err) => {
//       alert(err?.response?.data?.message || "Failed to process purchase.");
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-3">
//       <div className="bg-white w-full max-w-md rounded-xl p-5 relative">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-600 text-xl"
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-semibold mb-4">Select Address</h2>

//         {isLoading ? (
//           <Loader />
//         ) : (
//           <>
//             {/* ADDRESS LIST */}
//             {!showForm && (
//               <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
//                 {addressData?.length > 0 ? (
//                   addressData.map((ad) => (
//                     <div
//                       key={ad.id}
//                       onClick={() => setSelectedAddress(ad.id)}
//                       className={`border p-3 rounded-lg cursor-pointer ${
//                         selectedAddress === ad.id
//                           ? "border-yellow-500 bg-yellow-50"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <p className="font-semibold">{ad.name || "No Name"}</p>
//                       <p className="text-sm">{ad.phone || "No Phone"}</p>
//                       <p className="text-sm text-gray-600">
//                         {ad.pincode || "No Pincode"}
//                       </p>
//                       <p className="text-sm">{ad.address}</p>

//                       <button
//                         // onClick={() => {
//                         //   setEditingAddress(ad);
//                         //   setForm(ad);
//                         //   setShowForm(true);
//                         // }}
//                         onClick={() =>
//                           navigate("/user/address?edit=true", {
//                             state: { address: ad },
//                           })
//                         }
//                         className="text-sm text-blue-500 mt-1"
//                       >
//                         Edit
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-600 text-sm">No address found.</p>
//                 )}
//               </div>
//             )}

//             {/* ADD / EDIT FORM */}
//             {showForm && (
//               <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                 {Object.keys(form).map((key) => (
//                   <input
//                     key={key}
//                     type="text"
//                     name={key}
//                     value={form[key]}
//                     placeholder={key.replace("_", " ")}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 ))}

//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleSaveAddress}
//                     className="flex-1 py-2 bg-yellow-500 rounded-lg"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="flex-1 py-2 bg-gray-300 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* PROCEED BUTTON */}
//             {!showForm && (
//               <button
//                 onClick={() => mutation.mutate()}
//                 disabled={!selectedAddress}
//                 className="w-full mt-6 bg-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-400 disabled:bg-gray-300"
//               >
//                 Proceed to Pay
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // MAIN PAGE
// const GuntiPassPage = () => {
//   const [selected, setSelected] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [selectedPass, setSelectedPass] = useState(null);
//   const [searchParams] = useSearchParams();
//   const isModOpen = searchParams.get("open") === "true";

//   const user = useAuthStore((state) => state.user);
//   const navigate = useNavigate();

//   // Restore modal after login
//   useEffect(() => {
//     const savedPass = JSON.parse(localStorage.getItem("selectedPass"));
//     if (savedPass) {
//       setSelected(savedPass);
//       setSelectedPass(savedPass);
//       setOpenModal(true);
//       localStorage.removeItem("selectedPass");
//     }
//   }, []);

//   const { data: passes, isLoading } = useQuery({
//     queryKey: ["guntiMasterPass"],
//     queryFn: async () => {
//       const res = await axios.get(
//         `${import.meta.env.VITE_PORT_URL}/package-master-list`
//       );
//       return res.data?.data || [];
//     },
//   });

//   useEffect(() => {
//     if (passes && passes.length > 0 && !selected) {
//       setSelected(passes[passes.length - 1]);
//       setSelectedPass(passes[passes.length - 1]);
//     }
//   }, [passes]);

//   const handleBuyPass = () => {
//     if (!selected) return;

//     if (!user) {
//       localStorage.setItem("selectedPass", JSON.stringify(selected));
//       setShowLoginModal(true);
//       return;
//     }

//     setSelectedPass(selected);
//     setOpenModal(true);
//   };

//   useEffect(() => {
//     if (isModOpen) {
//       setOpenModal(true);
//     }
//   }, [isModOpen]);

//   if (isLoading) {
//     return (
//       <>
//         <TataNeuNavbar />
//         <div className="w-full py-20 flex justify-center text-gray-600 text-xl">
//           <Loader />
//         </div>
//         <MobileBottomMenu />
//         <Guntiimg />
//       </>
//     );
//   }

//   return (
//     <>
//       <TataNeuNavbar />

//       <div className="min-h-screen w-full bg-[#ffffff] text-black px-4 mb-20">
//         <div className="max-w-5xl mx-auto">
//           <h1 className="text-center text-4xl font-bold mb-6">
//             GuntiUniverse <span className="text-yellow-400">Pass</span>
//           </h1>

//           <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
//             {[...(passes || [])]
//               .sort((a, b) => a.amount_package - b.amount_package)
//               .map((item) => (
//                 <div
//                   key={item.id}
//                   onClick={() => setSelected(item)}
//                   className={`min-w-[31%] sm:min-w-[30%] cursor-pointer px-1 py-1 rounded-2xl border-dashed transition-all duration-300 ${
//                     selected?.id === item.id
//                       ? "bg-yellow-500/20 border-yellow-400 shadow-yellow-400 shadow-lg scale-95"
//                       : "bg-yellow-500/5 border-yellow-400/10 hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-105"
//                   }`}
//                 >
//                   <h2 className="text-xl font-semibold text-center">
//                     {item.package_name}
//                   </h2>
//                   <p className="text-center text-yellow-400 text-2xl font-bold mt-2">
//                     ₹{item.amount_package}
//                   </p>
//                   <p className="mt-1 text-center text-sm text-gray-700">
//                     <small> Validity {item.duration_in_month} months </small>
//                   </p>
//                 </div>
//               ))}
//           </div>

//           {/* Details Section */}
//           {selected && (
//             <div className="mt-4 p-6 bg-white border border-gray-300 rounded-2xl w-full">
//               <h2 className="text-2xl font-semibold mb-4">
//                 {selected.package_name} Pass Details
//               </h2>
//               <div
//                 className="prose max-w-none text-gray-800"
//                 dangerouslySetInnerHTML={{ __html: selected.terms_condition }}
//               />
//               <div className="mt-8">
//                 <button
//                   onClick={handleBuyPass}
//                   className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold text-lg hover:bg-yellow-400 transition"
//                 >
//                   Buy {selected.package_name} Pass
//                 </button>
//               </div>
//             </div>
//           )}

//           {!selected && (
//             <p className="text-center text-gray-700 mt-6 text-sm">
//               Tap on a pass above to view full details.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* MODAL */}
//       <PurchaseModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//         packageId={selectedPass?.id}
//       />

//       <MobileBottomMenu />
//       <Guntiimg />

//       {showLoginModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Login onClose={() => setShowLoginModal(false)} />
//         </div>
//       )}
//     </>
//   );
// };

// export default GuntiPassPage;

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import TataNeuNavbar from "../components/TataNeuNavbar";
import { useWallet } from "../hooks/useWallet";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import Guntiimg from "../components/Guntiimg";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/authStore";
import {
  useAddress,
  useAddAddress,
  useUpdateAddress,
} from "../hooks/useAddress";
import Login from "./Login";

const PurchaseModal = ({ isOpen, onClose, packageId, amount }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const { mutate: fetchWallet, data: walletData } = useWallet();
  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const [passAmount, setPassAmount] = useState(amount || 0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    setPassAmount(amount || 0);
  }, [amount]);

  useEffect(() => {
    if (fetchWallet) fetchWallet();
  }, [fetchWallet]);

  const walletAvailable = walletData?.data ?? 0;
  console.log("walletAvailable", walletAvailable);

  const payableAfterWallet = useWalletAmount
    ? Math.max(0, passAmount - walletAvailable)
    : passAmount;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    colony_name: "",
    house_no: "",
    landmark: "",
    address_type: "",
    area: "",
    latitude: "",
    longitude: "",
  });

  const { data: addressData, isLoading, refetch } = useAddress(token);
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();

  useEffect(() => {
    if (token) refetch();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      updateAddressMutation.mutate(
        { id: editingAddress.id, ...form },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingAddress(null);
            refetch();
          },
        }
      );
    } else {
      addAddressMutation.mutate(form, {
        onSuccess: () => {
          setShowForm(false);
          refetch();
        },
      });
    }
  };
  // ⭐ NEW UPDATED MUTATION (WITH PAYMENT POST REDIRECT)
  const redirectWithPost = (url, data = {}) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddress) throw new Error("Please select an address");

      const walletToUse = useWalletAmount ? Math.min(walletAvailable) : 0;

      const res = await axios.post(
        `${import.meta.env.VITE_PORT_URL}/buy_package`,
        {
          package_id: packageId,
          address_id: selectedAddress,
          use_wallet: walletToUse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    },

    onSuccess: (data) => {
      // Example response: { success:true, data:6, message:"package buy successfully" }
      if (data?.success && data?.data) {
        const packageBuyId = data.data;

        // Step 1 → Build the payment URL
        const payURL = `${
          import.meta.env.VITE_PAY_URL
        }/pay-gunti-pass/${packageBuyId}`;

        console.log("Redirecting to:", payURL);
        // Step 2 → If server expects POST fields, send empty POST
        // redirectWithPost(payURL, {});
        // window.location.href = payURL;
        redirectWithPost(payURL, {
          package_buy_id: packageBuyId,
        });
        return;
      }

      // Step 3 → If no payment redirection (rare case)
      // navigate("/thank-you-gunti-pass");
      navigate("/thank-you-gunti-pass", {
        state: { packageBuyId: data?.data },
      });
    },

    onError: (err) => {
      alert(err?.response?.data?.message || "Failed to process purchase.");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-3">
      <div className="bg-white w-full max-w-md rounded-xl p-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Select Address</h2>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* ADDRESS LIST */}
            {!showForm && (
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {addressData?.length > 0 ? (
                  addressData.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => setSelectedAddress(ad.id)}
                      className={`border p-3 rounded-lg cursor-pointer ${
                        selectedAddress === ad.id
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                    >
                      <p className="font-semibold">{ad.name || "No Name"}</p>
                      <p className="text-sm">{ad.phone || "No Phone"}</p>
                      <p className="text-sm text-gray-600">
                        {ad.pincode || "No Pincode"}
                      </p>
                      <p className="text-sm">{ad.address}</p>

                      <button
                        // onClick={() => {
                        //   setEditingAddress(ad);
                        //   setForm(ad);
                        //   setShowForm(true);
                        // }}
                        onClick={() =>
                          navigate("/address?edit=true", {
                            state: { address: ad },
                          })
                        }
                        className="text-sm text-blue-500 mt-1"
                      >
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No address found.</p>
                )}
              </div>
            )}

            {/* ADD / EDIT FORM */}
            {showForm && (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {Object.keys(form).map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={form[key]}
                    placeholder={key.replace("_", " ")}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  />
                ))}

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 py-2 bg-yellow-500 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* WALLET SECTION */}
            <div className="mt-4 p-3 border rounded-lg">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useWalletAmount}
                  onChange={(e) => setUseWalletAmount(e.target.checked)}
                />
                <span className="text-sm">
                  Use Wallet (Available ₹
                  {Number(walletAvailable || 0).toLocaleString()})
                </span>
              </label>

              <div className="mt-2 text-sm flex justify-between">
                <span>Pass Amount</span>
                <span>₹{Number(passAmount || 0).toLocaleString()}</span>
              </div>

              {useWalletAmount && (
                <div className="mt-1 text-sm flex justify-between text-green-600">
                  <span>Wallet Used</span>
                  <span>
                    -₹
                    {Number(
                      Math.min(walletAvailable, passAmount) || 0
                    ).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="mt-1 text-sm flex justify-between font-semibold">
                <span>To Pay</span>
                <span>₹{Number(payableAfterWallet || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* PROCEED BUTTON */}
            {!showForm && (
              <button
                onClick={() => mutation.mutate()}
                disabled={!selectedAddress}
                className="w-full mt-6 bg-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-400 disabled:bg-gray-300"
              >
                Proceed to Pay
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// MAIN PAGE
const GuntiPassPage = () => {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const [searchParams] = useSearchParams();
  const isModOpen = searchParams.get("open") === "true";

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Restore modal after login
  useEffect(() => {
    const savedPass = JSON.parse(localStorage.getItem("selectedPass"));
    if (savedPass) {
      setSelected(savedPass);
      setSelectedPass(savedPass);
      setOpenModal(true);
      localStorage.removeItem("selectedPass");
    }
  }, []);

  const { data: passes, isLoading } = useQuery({
    queryKey: ["guntiMasterPass"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_PORT_URL}/package-master-list`
      );
      return res.data?.data || [];
    },
  });

  useEffect(() => {
    if (passes && passes.length > 0 && !selected) {
      setSelected(passes[passes.length - 1]);
      setSelectedPass(passes[passes.length - 1]);
    }
  }, [passes]);

  const handleBuyPass = () => {
    if (!selected) return;

    if (!user) {
      localStorage.setItem("selectedPass", JSON.stringify(selected));
      setShowLoginModal(true);
      return;
    }

    setSelectedPass(selected);
    setOpenModal(true);
  };

  useEffect(() => {
    if (isModOpen) {
      setOpenModal(true);
    }
  }, [isModOpen]);

  if (isLoading) {
    return (
      <>
        <TataNeuNavbar />
        <div className="w-full py-20 flex justify-center text-gray-600 text-xl">
          <Loader />
        </div>
        <MobileBottomMenu />
        <Guntiimg />
      </>
    );
  }

  return (
    <>
      <TataNeuNavbar />

      <div className="min-h-screen w-full bg-[#ffffff] text-black px-4 mb-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-6">
            GuntiUniverse <span className="text-yellow-400">Pass</span>
          </h1>

          <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
            {[...(passes || [])]
              .sort((a, b) => a.amount_package - b.amount_package)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`min-w-[31%] sm:min-w-[30%] cursor-pointer px-1 py-1 rounded-2xl border-dashed transition-all duration-300 ${
                    selected?.id === item.id
                      ? "bg-yellow-500/20 border-yellow-400 shadow-yellow-400 shadow-lg scale-95"
                      : "bg-yellow-500/5 border-yellow-400/10 hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-105"
                  }`}
                >
                  <h2 className="text-xl font-semibold text-center">
                    {item.package_name}
                  </h2>
                  <p className="text-center text-yellow-400 text-2xl font-bold mt-2">
                    ₹{item.amount_package}
                  </p>
                  <p className="mt-1 text-center text-sm text-gray-700">
                    <small> Validity {item.duration_in_month} months </small>
                  </p>
                </div>
              ))}
          </div>

          {/* Details Section */}
          {selected && (
            <div className="mt-4 p-6 bg-white border border-gray-300 rounded-2xl w-full">
              <h2 className="text-2xl font-semibold mb-4">
                {selected.package_name} Pass Details
              </h2>
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: selected.terms_condition }}
              />
              <div className="mt-8">
                <button
                  onClick={handleBuyPass}
                  className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold text-lg hover:bg-yellow-400 transition"
                >
                  Buy {selected.package_name} Pass
                </button>
              </div>
            </div>
          )}

          {!selected && (
            <p className="text-center text-gray-700 mt-6 text-sm">
              Tap on a pass above to view full details.
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      <PurchaseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        packageId={selectedPass?.id}
        amount={selectedPass?.amount_package}
      />

      <MobileBottomMenu />
      <Guntiimg />

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
};

export default GuntiPassPage;
