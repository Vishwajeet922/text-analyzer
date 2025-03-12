# Text Analysis Tool

A powerful web application that helps you analyze text in various ways:

- **Text Statistics**: Get word count, character count, sentence count, paragraph count, reading level, and frequently used words
- **Sentiment Analysis**: Understand the emotional tone of your text
- **Word Definitions**: Look up the meaning of any word

## Features

- Clean, modern user interface
- Detailed text statistics with visualization
- Sentiment analysis with polarity and subjectivity scores
- Word definitions with part of speech categorization
- Responsive design for mobile, tablet, and desktop

## Getting Started

### Prerequisites

You need to have Node.js and npm installed on your system.

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   
The app will be running at [http://localhost:3000](http://localhost:3000)

### Backend API

This app requires a backend API to be running. The API endpoints are configured in `src/lib/constants.js`. By default, it expects the backend to be running at `http://localhost:8080`.

Backend API endpoints used:
- `/count` - For text statistics analysis
- `/sentiment` - For sentiment analysis
- `/define/:word` - For word definitions

## Technologies Used

- React 
- Create React App
- CSS for styling
- Fetch API for API requests

## License

This project is licensed under the MIT License.

## Acknowledgments

- Dictionary API for word definitions
- NLP tools for text analysis
