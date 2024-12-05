import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

export const sendHandData = async (handData) => {
    try {
        const response = await fetch(`${API_URL}/hands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(handData)
        });
        
        if (!response.ok) {
            throw new Error("Something went wrong", response)
        }
        
        return await response.json();
    }
    catch (error) {
        console.error("failed to post", error);
        throw error;
    }
}