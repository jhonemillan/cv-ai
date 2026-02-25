import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('API Key missing');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const modelNames = data.models.map(m => `- ${m.name} (${m.displayName})`).join('\n');
        fs.writeFileSync('all-models-list.txt', modelNames);
        console.log('List saved to all-models-list.txt');
    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
