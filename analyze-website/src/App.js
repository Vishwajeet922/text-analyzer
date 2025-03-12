import React, { useState } from 'react';
import './App.css';
import TextInput from './components/TextInput';
import AnalysisTabs from './components/AnalysisTabs';
import CountResult from './components/CountResult';
import SentimentResult from './components/SentimentResult';
import MeaningResult from './components/MeaningResult';
import EmailForm from './components/EmailForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { analyzeText, getWordMeaning } from './lib/api';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeTab, setActiveTab] = useState('count');
  const [isLoading, setIsLoading] = useState(false);
  const [countData, setCountData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [meaningData, setMeaningData] = useState(null);
  const [searchWord, setSearchWord] = useState('');
  const [error, setError] = useState(null);

  const handleAnalyze = async (text) => {
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'count' || activeTab === 'sentiment') {
        const result = await analyzeText(text, activeTab);

        if (activeTab === 'count') {
          setCountData(result);
        } else {
          setSentimentData(result);
        }
      } else if (activeTab === 'meaning') {
        // For meaning tab, use the input text as the word to look up
        const word = text.trim().split(/\s+/)[0]; // Get the first word only
        if (word) {
          setSearchWord(word);
          const result = await getWordMeaning(word);
          setMeaningData(result);
        } else {
          setError('Please enter a word to look up its definition.');
        }
      }
    } catch (err) {
      if (activeTab === 'meaning') {
        setError(`Could not find the definition for "${text.trim().split(/\s+/)[0]}".`);
        setMeaningData(null);
      } else {
        setError('An error occurred while analyzing the text. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
          <LoadingSpinner 
            size="large" 
            message={
              activeTab === 'meaning' 
                ? `Looking up the meaning of "${searchWord}"...` 
                : `Analyzing text for ${activeTab === 'count' ? 'statistics' : 'sentiment'}...`
            } 
          />
        </div>
      );
    }

    let resultComponent = null;
    let currentData = null;

    switch (activeTab) {
      case 'count':
        resultComponent = <CountResult data={countData} />;
        currentData = countData;
        break;
      case 'sentiment':
        resultComponent = <SentimentResult data={sentimentData} />;
        currentData = sentimentData;
        break;
      case 'meaning':
        resultComponent = <MeaningResult data={meaningData} searchWord={searchWord} />;
        currentData = meaningData;
        break;
      default:
        return null;
    }

    return (
      <>
        {resultComponent}
        <EmailForm 
          data={currentData} 
          activeTab={activeTab} 
          searchWord={searchWord} 
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Header />

          <TextInput 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            placeholder={
              activeTab === 'meaning' 
                ? "Enter a word to get its definition" 
                : "Type or paste your text here..."
            }
          />

          <AnalysisTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
