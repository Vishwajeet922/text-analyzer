import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import re
from collections import Counter
from textblob import TextBlob
import requests

app = Flask(__name__, static_folder='analyze-website/build')
CORS(app)

def count_words(text):
    words = [word for word in text.split() if word]  
    return len(words)

def count_characters(text):
    return len(text.replace(" ", "")), len(text)  

def count_sentences(text):
    sentences = re.split(r'[.!?]+', text)
    return len([s for s in sentences if s.strip()])

def count_paragraphs(text):
    paragraphs = [p for p in text.split('\n\n') if p.strip()]
    return len(paragraphs)

def calculate_reading_level(text):
    sentences = count_sentences(text)
    words = count_words(text)
    
    # Count syllables (basic implementation)
    def count_syllables(word):
        word = word.lower()
        count = 0
        vowels = "aeiouy"
        if word[0] in vowels:
            count += 1
        for index in range(1, len(word)):
            if word[index] in vowels and word[index - 1] not in vowels:
                count += 1
        if word.endswith("e"):
            count -= 1
        return max(1, count)
    
    total_syllables = sum(count_syllables(word) for word in text.split())
    
    # Flesch-Kincaid Grade Level formula
    if sentences == 0 or words == 0:
        return 0
    
    grade_level = 0.39 * (words / sentences) + 11.8 * (total_syllables / words) - 15.59
    return round(grade_level, 1)

def get_frequent_words(text, top_n=5):
    # Remove punctuation and convert to lowercase
    clean_text = re.sub(r'[^\w\s]', '', text.lower())
    
    # Common English stop words to exclude
    stop_words = {'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
                  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'}
    
    words = [word for word in clean_text.split() if word not in stop_words]
    word_counts = Counter(words)
    return dict(word_counts.most_common(top_n))

def analyze_sentiment(text):
    analysis = TextBlob(text)
    
    # Get polarity (-1 to 1) and subjectivity (0 to 1)
    polarity = analysis.sentiment.polarity
    subjectivity = analysis.sentiment.subjectivity
    
    # Determine sentiment category
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return {
        "sentiment": sentiment,
        "polarity": round(polarity, 2),
        "subjectivity": round(subjectivity, 2)
    }

def get_word_definition(word):
    """Fetch word definition from Dictionary API"""
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()[0]  # Get first result
            
            # Extract relevant information
            result = {
                "word": data["word"],
                "phonetic": data.get("phonetic", ""),
                "audio": next((p["audio"] for p in data.get("phonetics", []) 
                             if p.get("audio")), ""),
                "meanings": []
            }
            
            # Process each meaning
            for meaning in data.get("meanings", []):
                meaning_info = {
                    "partOfSpeech": meaning["partOfSpeech"],
                    "definitions": [d["definition"] for d in meaning.get("definitions", [])]
                }
                result["meanings"].append(meaning_info)
                
            return result
            
        elif response.status_code == 404:
            return {"error": "Word not found"}
        else:
            return {"error": f"API request failed with status code: {response.status_code}"}
            
    except Exception as e:
        return {"error": f"Failed to fetch definition: {str(e)}"}

@app.route('/count', methods=['POST'])
def analyze_text():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data['text']

    return jsonify({
        "word_count": count_words(text),
        "character_count": {
            "with_spaces": count_characters(text)[1],
            "without_spaces": count_characters(text)[0]
        },
        "sentence_count": count_sentences(text),
        "paragraph_count": count_paragraphs(text),
        "average_word_length": round(
            sum(len(word) for word in text.split()) / max(1, count_words(text)), 2
        ),
        "reading_level": calculate_reading_level(text),
        "frequent_words": get_frequent_words(text)
    })

@app.route('/sentiment', methods=['POST'])
def analyze_text_sentiment():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = data['text']
    
    try:
        sentiment_analysis = analyze_sentiment(text)
        return jsonify(sentiment_analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/define/<word>', methods=['GET'])
def define_word(word):
    """API endpoint to get word definition"""
    if not word:
        return jsonify({"error": "No word provided"}), 400
        
    # Clean the word (remove special characters, spaces)
    word = re.sub(r'[^a-zA-Z]', '', word.lower())
    if not word:
        return jsonify({"error": "Invalid word"}), 400
        
    result = get_word_definition(word)
    
    if "error" in result:
        return jsonify(result), 404 if "not found" in result["error"] else 500
        
    return jsonify(result)

    
    

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=8080)
