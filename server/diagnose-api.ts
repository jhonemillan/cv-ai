import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function diagnose() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('--- DIAGNOSTICS ---');
    console.log('Node Version:', process.version);

    try {
        console.log('1. Listing Models...');
        const result = await (genAI as any).listModels();
        console.log('Successfully listed models. Count:', result.models.length);
        result.models.forEach((m: any) => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (error: any) {
        console.error('Failed to list models:', error.message);
    }

    const testModels = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-3.1-pro-preview'];

    for (const modelName of testModels) {
        console.log(`\n2. Testing model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say Hi');
            console.log(`Success for ${modelName}:`, result.response.text());
        } catch (error: any) {
            console.log(`Failed for ${modelName}:`, error.message);
        }
    }
    console.log('\n--- END DIAGNOSTICS ---');
}

diagnose();
