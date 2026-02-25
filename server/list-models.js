import dotenv from 'dotenv';

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
        console.log('Available models:');
        data.models.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
