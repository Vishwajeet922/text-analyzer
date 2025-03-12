import React, { useState } from 'react';

const TextInput = ({ onAnalyze, isLoading, placeholder = "Type or paste your text here..." }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="text-input" className="block text-gray-700 text-sm font-medium mb-2">
          Enter your text for analysis
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={5}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
          isLoading || !text.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        Analyze Text
      </button>
    </form>
  );
};

export default TextInput; 