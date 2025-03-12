import React from 'react';

/**
 * Footer component for the app
 */
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm">
          Text Analysis Tool © {new Date().getFullYear()} | All Rights Reserved
        </p>
        <div className="mt-2">
          <p className="text-gray-500 text-xs">
            Analyze your text with powerful NLP techniques
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 