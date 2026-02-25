import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);
    if (!apiKey) {
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        console.log('Fetching models from Google AI SDK...');
        // Try a simple content generation instead of listing models if listing fails
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('Error:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

listModels();
