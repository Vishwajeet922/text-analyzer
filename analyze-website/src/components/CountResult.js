import React from 'react';

const CountResult = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Enter your text and click "Analyze Text" to get text statistics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Word Count</h3>
          <p className="text-3xl font-bold text-blue-600">{data.word_count}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Reading Level</h3>
          <p className="text-3xl font-bold text-green-600">{data.reading_level.toFixed(1)}</p>
          <p className="text-sm text-green-700 mt-1">Flesch-Kincaid grade level</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium text-gray-700 text-sm">Characters (with spaces)</h3>
          <p className="text-xl font-semibold text-gray-900">{data.character_count.with_spaces}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium text-gray-700 text-sm">Characters (no spaces)</h3>
          <p className="text-xl font-semibold text-gray-900">{data.character_count.without_spaces}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium text-gray-700 text-sm">Sentences</h3>
          <p className="text-xl font-semibold text-gray-900">{data.sentence_count}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium text-gray-700 text-sm">Paragraphs</h3>
          <p className="text-xl font-semibold text-gray-900">{data.paragraph_count}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Most Frequent Words</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.frequent_words).map(([word, count]) => (
            <div key={word} className="px-3 py-1 bg-white border border-gray-200 rounded-full">
              <span className="font-medium text-gray-800">{word}</span>
              <span className="ml-1 text-sm text-gray-500">({count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountResult; 