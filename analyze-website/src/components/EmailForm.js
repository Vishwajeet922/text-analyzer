import React, { useState } from 'react';
import { sendEmail } from '../lib/api';

const EmailForm = ({ data, activeTab, searchWord }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState({ success: null, message: '' });

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatEmailBody = () => {
    let body = '';
    
    if (activeTab === 'count' && data) {
      body = `Text Statistics:\n\n` +
        `Word Count: ${data.word_count}\n` +
        `Reading Level: ${data.reading_level.toFixed(1)} (Flesch-Kincaid grade level)\n` +
        `Characters (with spaces): ${data.character_count.with_spaces}\n` +
        `Characters (no spaces): ${data.character_count.without_spaces}\n` +
        `Sentences: ${data.sentence_count}\n` +
        `Paragraphs: ${data.paragraph_count}\n\n` +
        `Most Frequent Words: ${Object.entries(data.frequent_words)
          .map(([word, count]) => `${word} (${count})`)
          .join(', ')}`;
    } else if (activeTab === 'sentiment' && data) {
      body = `Sentiment Analysis:\n\n` +
        `Sentiment: ${data.sentiment}\n` +
        `Polarity: ${data.polarity.toFixed(2)}\n` +
        `Subjectivity: ${data.subjectivity.toFixed(2)}`;
    } else if (activeTab === 'meaning' && data) {
      body = `Word Definition: ${searchWord}\n\n`;
      
      if (data.phonetic) {
        body += `Pronunciation: ${data.phonetic}\n\n`;
      }
      
      data.meanings.forEach((meaning, index) => {
        body += `${meaning.partOfSpeech}:\n`;
        meaning.definitions.forEach((def, i) => {
          body += `${i + 1}. ${def}\n`;
        });
        if (index < data.meanings.length - 1) body += '\n';
      });
    }
    
    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      setResult({ success: false, message: 'Please enter a valid email address.' });
      return;
    }
    
    if (!data) {
      setResult({ success: false, message: 'No analysis data to send.' });
      return;
    }
    
    setIsSending(true);
    setResult({ success: null, message: '' });
    
    try {
      const subject = `Text Analysis Results - ${
        activeTab === 'count' ? 'Text Statistics' : 
        activeTab === 'sentiment' ? 'Sentiment Analysis' : 
        `Word Definition: ${searchWord}`
      }`;
      
      const body = formatEmailBody();
      
      await sendEmail(email, subject, body, false);
      
      setResult({ success: true, message: 'Email sent successfully!' });
      setEmail('');
    } catch (error) {
      setResult({ success: false, message: 'Failed to send email. Please try again.' });
      console.error('Email sending error:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Share Results via Email</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <label htmlFor="email-input" className="sr-only">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSending}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSending || !email.trim()}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
            isSending || !email.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </button>
      </form>
      
      {result.message && (
        <div 
          className={`mt-3 px-3 py-2 rounded-md text-sm ${
            result.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
};

export default EmailForm; 