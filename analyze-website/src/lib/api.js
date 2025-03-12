import { API_ENDPOINTS } from './constants';

export const analyzeText = async (text, endpoint) => {
    try {
        const endpointKey = endpoint.toUpperCase();
        const response = await fetch(API_ENDPOINTS[endpointKey], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error analyzing text with ${endpoint}:`, error);
        throw error;
    }
};

export const getWordMeaning = async (word) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.MEANING}/${encodeURIComponent(word)}`);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting word meaning:', error);
        throw error;
    }
};

export const sendEmail = async (recipient, subject, body, is_html = false) => {
    try {
        const response = await fetch(API_ENDPOINTS.EMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient,
                subject,
                body,
                is_html: String(is_html)
            }),
        });

        if (!response.ok) {
            throw new Error(`Email API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}; 