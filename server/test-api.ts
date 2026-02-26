import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        console.log('Fetching models...');
        const result = await (genAI as any).listModels();
        console.log('Available models:');
        result.models.forEach((model: any) => {
            console.log(`- ${model.name} (${model.displayName})`);
        });
    } catch (error: any) {
        console.error('Error listing models:', error);
    }
}

listModels();
