import React from 'react';

/**
 * Header component for the app
 */
const Header = () => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Analysis Tool</h1>
      <p className="text-gray-600 max-w-3xl mx-auto">
        A powerful tool to analyze your text. Get word count, character statistics, 
        readability metrics, sentiment analysis, and word definitions all in one place.
      </p>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Word Count
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Readability
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Sentiment
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Definitions
        </span>
      </div>
    </div>
  );
};

export default Header; 