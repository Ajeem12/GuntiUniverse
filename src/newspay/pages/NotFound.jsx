import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-amber-100 via-white to-amber-100 px-6">
      <div className="bg-white rounded-3xl p-12 max-w-md text-center">
        <FiAlertTriangle className="mx-auto text-amber-500 mb-6" size={96} />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn’t find the page you’re looking for. It might have been removed, renamed, or did not exist in the first place.
        </p>
        <a
          href="/"
          className="inline-block bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-amber-700 transition"
          aria-label="Go back to homepage"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
