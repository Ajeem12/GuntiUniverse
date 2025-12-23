
// import { FiCreditCard, FiSmartphone, FiGift } from "react-icons/fi";
// import { useParams } from "react-router-dom";




// const Pay = () => {
//   const id = useParams();
//   console.log(id?.id);

//   const handlePayAll = () => {
//     const formData = new FormData();
//     const url =
//       "https://guntiuniverse.com/payment/public/api/pay-newspaper-bill/" + id.id;
//     formData.append("amount", 1);
//     // Create a form element
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = url;
//     document.body.appendChild(form);
//     form.submit();
//   };
//   return (
//     <>
//       <button
//         className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition-shadow shadow-md"
//         type="button"
//         onClick={handlePayAll}
//       >
//         Pay Now
//       </button>

//     </>
//   );
// };

// export default Pay;


import { FiCreditCard, FiSmartphone, FiGift } from "react-icons/fi";
import { useParams } from "react-router-dom";

const Pay = () => {
  const { id } = useParams();

  const handlePayAll = () => {
    const formData = new FormData();
    const url =
      "https://guntiuniverse.com/payment/public/api/pay-newspaper-bill/" + id;
    formData.append("amount", 1);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="flex items-center justify-center p-4 mt-14">
      <div className="max-w-md w-full bg-amber-50 rounded-2xl shadow-md p-8 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="p-4 rounded-full bg-amber-200 mb-3 shadow">
            <FiCreditCard size={38} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-amber-700 mb-2">Pay Newspaper Bill</h1>
          <p className="text-gray-500 text-center max-w-xs text-base">
            You're just one step away from completing your bill payment.
            Click below to proceed securely.
          </p>
        </div>

        <button
          className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-2"
          type="button"
          onClick={handlePayAll}
        >
          <FiCreditCard className="mr-2" size={22} /> Pay Now
        </button>
      </div>
    </div>
  );
};

export default Pay;
