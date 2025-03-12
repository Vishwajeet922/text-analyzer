import React from 'react';

const MeaningResult = ({ data, searchWord }) => {
  const partOfSpeechColors = {
    noun: { bg: 'bg-blue-100', text: 'text-blue-800' },
    verb: { bg: 'bg-green-100', text: 'text-green-800' },
    adjective: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    adverb: { bg: 'bg-purple-100', text: 'text-purple-800' },
    pronoun: { bg: 'bg-pink-100', text: 'text-pink-800' },
    preposition: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    conjunction: { bg: 'bg-red-100', text: 'text-red-800' },
    interjection: { bg: 'bg-orange-100', text: 'text-orange-800' },
    determiner: { bg: 'bg-teal-100', text: 'text-teal-800' },
    exclamation: { bg: 'bg-orange-100', text: 'text-orange-800' },
  };

  const getPartOfSpeechStyle = (pos) => {
    const posKey = pos.toLowerCase();
    return partOfSpeechColors[posKey] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Word Definitions</h2>
      
      {!data && !searchWord && (
        <div className="text-center py-8 text-gray-600">
          Enter a word above to look up its definition.
        </div>
      )}
      
      {!data && searchWord && (
        <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
          <p className="text-red-700 font-medium">
            Sorry, we couldn't find a definition for "{searchWord}".
          </p>
          <p className="text-red-600 text-sm mt-2">
            Please check the spelling or try another word.
          </p>
        </div>
      )}
      
      {data && (
        <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
          <div className="mb-4 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{data.word}</h3>
              {data.phonetic && (
                <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded-md">{data.phonetic}</span>
              )}
            </div>
            
            {data.audio && (
              <button 
                className="mt-3 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors duration-200 text-sm font-medium"
                onClick={() => {
                  const audio = new Audio(data.audio);
                  audio.play();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Listen to Pronunciation
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {data.meanings.map((meaning, index) => {
              const style = getPartOfSpeechStyle(meaning.partOfSpeech);
              
              return (
                <div key={index} className="border-b border-gray-200 last:border-0 pb-5 last:pb-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${style.bg} ${style.text}`}>
                    {meaning.partOfSpeech}
                  </span>
                  
                  <ol className="list-decimal list-inside space-y-3">
                    {meaning.definitions.map((definition, defIndex) => (
                      <li key={defIndex} className="text-gray-800 pl-1">
                        <span className="font-medium">{definition}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeaningResult; 