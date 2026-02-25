import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

console.log('API KEY from env:', process.env.GEMINI_API_KEY ? 'FOUND' : 'MISSING');
console.log('API KEY length:', process.env.GEMINI_API_KEY?.length);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hola");
        console.log('Response:', result.response.text());
    } catch (e) {
        console.error('Error in bare test:', e);
    }
}

run();
