import React from 'react';

const AnalysisTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'count', label: 'Text Statistics' },
    { id: 'sentiment', label: 'Sentiment Analysis' },
    { id: 'meaning', label: 'Word Definitions' }
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        {tabs.map((tab) => (
          <li key={tab.id} className="mr-2">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisTabs; 