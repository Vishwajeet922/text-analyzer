import React, { useState } from 'react';
import { sendEmail } from '../lib/api';
import { jsPDF } from 'jspdf';

const EmailForm = ({ data, activeTab, searchWord }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [result, setResult] = useState({ success: null, message: '' });

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatContent = () => {
    let content = '';
    
    if (activeTab === 'count' && data) {
      content = `Text Statistics:\n\n` +
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
      content = `Sentiment Analysis:\n\n` +
        `Sentiment: ${data.sentiment}\n` +
        `Polarity: ${data.polarity.toFixed(2)}\n` +
        `Subjectivity: ${data.subjectivity.toFixed(2)}`;
    } else if (activeTab === 'meaning' && data) {
      content = `Word Definition: ${searchWord}\n\n`;
      
      if (data.phonetic) {
        content += `Pronunciation: ${data.phonetic}\n\n`;
      }
      
      data.meanings.forEach((meaning, index) => {
        content += `${meaning.partOfSpeech}:\n`;
        meaning.definitions.forEach((def, i) => {
          content += `${i + 1}. ${def}\n`;
        });
        if (index < data.meanings.length - 1) content += '\n';
      });
    }
    
    return content;
  };

  const formatEmailBody = () => {
    return formatContent();
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    setResult({ success: null, message: '' });
    
    // Record start time
    const startTime = Date.now();
    
    try {
      const content = formatContent();
      const title = activeTab === 'count' 
        ? 'Text Statistics' 
        : activeTab === 'sentiment' 
          ? 'Sentiment Analysis' 
          : `Word Definition: ${searchWord}`;
      
      // Create the PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      
      // Add content
      doc.setFontSize(12);
      
      // Split text into lines to fit PDF width
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, 30);
      
      // Generate filename
      const filename = `text-analysis-${activeTab}-${new Date().toISOString().slice(0,10)}.pdf`;
      
      // Calculate how much time has elapsed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      // Ensure "Generating..." shows for at least 3 seconds
      // and delay the download as well
      setTimeout(() => {
        // Download PDF after delay
        doc.save(filename);
        
        setResult({ success: true, message: 'PDF generated successfully!' });
        setIsGeneratingPDF(false);
      }, remainingTime);
      
    } catch (error) {
      // For errors, calculate remaining time as well
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      setTimeout(() => {
        setResult({ success: false, message: 'Failed to generate PDF. Please try again.' });
        setIsGeneratingPDF(false);
      }, remainingTime);
      
      console.error('PDF generation error:', error);
    }
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
      <h3 className="text-lg font-medium text-gray-800 mb-3">Share Results</h3>
      
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
        
        <button
          type="button"
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className={`px-4 py-2 bg-green-600 text-white rounded-md ${
            isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
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