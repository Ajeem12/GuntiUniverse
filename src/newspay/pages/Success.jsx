// import React, { useEffect } from 'react';
// import { FiCheckCircle } from 'react-icons/fi';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchNewOrderPayments } from '../../newspay/redux/slices/orderPaymentsSlice';

// const PaySuccess = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { transaction_id: transactionId } = useParams();

//   const { data, loading, error } = useSelector((state) => state.orderPayments);

//   useEffect(() => {
//     if (transactionId) {
//       dispatch(fetchNewOrderPayments(transactionId));
//     }
//   }, [dispatch, transactionId]);

//   const handleGoHome = () => {
//     navigate('/news');
//   };

//   return (
//     <div className="flex items-center justify-center my-20 px-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-amber-200">
//         <FiCheckCircle className="text-amber-500 text-6xl mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
//         <p className="text-gray-600 mb-4">
//           Thank you for your payment. Your transaction has been completed successfully.
//         </p>

//         {loading && <p className="text-gray-500">Loading payment details...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {data && (
//           <div className="text-sm text-left text-gray-700 bg-gray-50 p-4 rounded mt-4 space-y-1">
//             <p><strong>Order ID:</strong> {data.orderId}</p>
//             <p><strong>Status:</strong> {data.state}</p>
//             <p><strong>Amount:</strong> ₹{data.amount}</p>
//             <p><strong>Payable Amount:</strong> ₹{data.payableAmount}</p>

//             {data.paymentDetails?.[0] && (
//               <>
//                 <p><strong>Transaction ID:</strong> {data.paymentDetails[0].transactionId}</p>
//                 <p><strong>Payment Mode:</strong> {data.paymentDetails[0].paymentMode}</p>
//               </>
//             )}
//           </div>
//         )}

//         <button
//           onClick={handleGoHome}
//           className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-md shadow-md mt-6 transition duration-300"
//         >
//           Go to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaySuccess;

import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewOrderPayments } from '../../newspay/redux/slices/orderPaymentsSlice';

const PaySuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { transaction_id: transactionId } = useParams();

  const { data, loading, error } = useSelector((state) => state.orderPayments);

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchNewOrderPayments(transactionId));
    }
  }, [dispatch, transactionId]);

  const handleGoHome = () => {
    navigate('/news');
  };

  return (
    <div className="flex items-center justify-center my-20 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-amber-200">
        {data?.state === "FAILED" ? (
          <>
            <FiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-red-600 mb-4">Please try again or contact support if the problem persists.</p>
          </>
        ) : (
          <>
            <FiCheckCircle className="text-amber-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </>
        )}

        {loading && <p className="text-gray-500">Loading payment details...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {data && data.state !== "FAILED" && (
          <div className="text-sm text-left text-gray-700 bg-gray-50 p-4 rounded mt-4 space-y-1">
            <p><strong>Order ID:</strong> {data.orderId}</p>
            <p><strong>Status:</strong> {data.state}</p>
            <p><strong>Amount:</strong> ₹{data.amount}</p>
            <p><strong>Payable Amount:</strong> ₹{data.payableAmount}</p>

            {data.paymentDetails?.[0] && (
              <>
                <p><strong>Transaction ID:</strong> {data.paymentDetails[0].transactionId}</p>
                <p><strong>Payment Mode:</strong> {data.paymentDetails[0].paymentMode}</p>
              </>
            )}
          </div>
        )}

        <button
          onClick={handleGoHome}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-md shadow-md mt-6 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaySuccess;

