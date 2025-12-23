import React from 'react';
import { FiTag, FiInfo, FiGift } from 'react-icons/fi';

const offers = [
  {
    id: 1,
    title: '20% Off on Annual Subscription',
    description: 'Subscribe for a year and save 20% on your total bill.',
    validity: 'Valid till Dec 31, 2025',
    icon: <FiTag className="text-amber-500 w-6 h-6" />
  },
  {
    id: 2,
    title: 'Refer & Earn',
    description: 'Refer a friend and get ₹100 off on your next payment.',
    validity: 'No expiry',
    icon: <FiGift className="text-amber-500 w-6 h-6" />
  },
  {
    id: 3,
    title: 'Early Payment Discount',
    description: 'Pay your bill before 5th of every month and get ₹50 off.',
    validity: 'Monthly offer',
    icon: <FiInfo className="text-amber-500 w-6 h-6" />
  }
];

const Offer = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-amber-700 mb-6 text-center">Exclusive Offers</h2>
      
      <div className="space-y-6">
        {offers.map(({ id, title, description, validity, icon }) => (
          <div key={id} className="border border-amber-200 rounded-lg p-5 flex items-start space-x-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-amber-800">{title}</h3>
              <p className="text-gray-700 mt-1">{description}</p>
              <p className="text-sm text-amber-600 mt-2">{validity}</p>
              <button
                className="mt-4 px-5 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition"
                onClick={() => alert(`Offer '${title}' claimed!`)}
              >
                Claim Offer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offer;
