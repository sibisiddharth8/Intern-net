import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="mt-6 text-blue-600 dark:text-blue-400 underline">
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
