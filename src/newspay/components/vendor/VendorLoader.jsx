import React from 'react';

const VendorLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center py-10">
      <svg
        className="animate-spin h-10 w-10 text-amber-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <p className="text-gray-500 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default VendorLoader;
