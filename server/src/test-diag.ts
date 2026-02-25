import { PDFParse } from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
    console.log('--- START DIAGNOSTIC ---');
    try {
        const serverDir = path.join(__dirname, '../');
        const pdfFile = 'HojaVIda.pdf';
        const pdfPath = path.join(serverDir, pdfFile);

        console.log('1. Checking PDF file at:', pdfPath);
        if (fs.existsSync(pdfPath)) {
            console.log('2. Reading PDF file...');
            const dataBuffer = fs.readFileSync(pdfPath);
            const parser = new PDFParse({ data: dataBuffer });
            console.log('3. Extracting text from PDF...');
            const data = await parser.getText();
            console.log('4. PDF Text extracted length:', data.text.length);
            console.log('PDF Text snippet:', data.text.substring(0, 200));
        } else {
            console.log('ERROR: PDF file not found');
        }

        console.log('5. Testing Gemini API...');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            console.log('ERROR: GEMINI_API_KEY is not set correctly in .env');
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        console.log('6. Listing available models...');
        try {
            // @ts-ignore - listing models is not always in the types but exists in SDK
            const modelsResult = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).listModels();
            console.log('Available models:', modelsResult);
        } catch (e) {
            console.log('Could not list models (this is normal for some keys)');
        }

        const modelName = 'gemini-3.1-pro-preview';
        console.log('Using model:', modelName);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log('7. Sending request to Gemini...');
        const result = await model.generateContent('Say hello');
        console.log('8. Gemini response:', result.response.text());

    } catch (error: any) {
        console.error('DIAGNOSTIC ERROR:', error);
        if (error.response) {
            console.error('Response body:', await error.response.text());
        }
    }
    console.log('--- END DIAGNOSTIC ---');
}

test();
