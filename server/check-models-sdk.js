import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('API Key missing');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const models = await genAI.listModels();
        console.log('Available models from SDK:');
        for (const model of models.models) {
            console.log(`- ${model.name}`);
        }
    } catch (error) {
        console.error('Error listing models via SDK:', error.message);
        console.log('Falling back to direct REST check for gemini-1.5-flash...');
        try {
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=${apiKey}`);
            console.log(`Direct check gemini-1.5-flash: ${resp.status} ${resp.statusText}`);
            const data = await resp.json();
            console.log('Response content:', JSON.stringify(data).substring(0, 100));
        } catch (e) {
            console.error('REST check failed:', e.message);
        }
    }
}

listModels();
