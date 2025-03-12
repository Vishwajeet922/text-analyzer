const API_URL = "http://localhost:8080";

const API_ENDPOINTS = {
    COUNT: `${API_URL}/count`,
    SENTIMENT: `${API_URL}/sentiment`,
    MEANING: `${API_URL}/define`,
    EMAIL: 'https://8ho5gpem81.execute-api.eu-central-1.amazonaws.com/prod/send-email'
}

export { API_ENDPOINTS }; 