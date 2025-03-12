import React from 'react';

const SentimentResult = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Enter your text and click "Analyze Text" to get sentiment analysis.</p>
      </div>
    );
  }

  // Determine color based on sentiment
  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          accent: 'text-green-600',
          icon: '😊'
        };
      case 'negative':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          accent: 'text-red-600',
          icon: '😔'
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          accent: 'text-blue-600',
          icon: '😐'
        };
    }
  };

  const sentimentStyle = getSentimentColor(data.sentiment);

  // Format polarity and subjectivity as percentages
  const polarityPercentage = Math.abs(Math.round(data.polarity * 100));
  const subjectivityPercentage = Math.round(data.subjectivity * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Analysis</h2>
      
      <div className={`${sentimentStyle.bg} p-6 rounded-lg mb-6 text-center`}>
        <div className="text-5xl mb-4">{sentimentStyle.icon}</div>
        <h3 className={`text-2xl font-bold ${sentimentStyle.accent} mb-2`}>
          {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)} Sentiment
        </h3>
        <p className={`${sentimentStyle.text}`}>
          This text expresses a {data.sentiment.toLowerCase()} sentiment with {polarityPercentage}% intensity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Polarity</h3>
          <p className="text-3xl font-bold text-gray-900">{polarityPercentage}%</p>
          <p className="text-sm text-gray-600 mt-1">
            How positive or negative the text is, from -100% (very negative) to 100% (very positive)
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Subjectivity</h3>
          <p className="text-3xl font-bold text-gray-900">{subjectivityPercentage}%</p>
          <p className="text-sm text-gray-600 mt-1">
            How subjective the text is, from 0% (objective) to 100% (subjective)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentResult; 