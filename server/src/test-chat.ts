import { chat } from './gemini.js';
import dotenv from 'dotenv';

dotenv.config();

async function testChat() {
    console.log('--- TESTING CHAT WITH CV CONTEXT ---');
    try {
        const question = '¿Quién es Jhon Millán y qué experiencia tiene?';
        console.log(`Pregunta: ${question}`);

        const response = await chat(question, []);
        console.log('--- RESPUESTA DE GEMINI ---');
        console.log(response);
        console.log('---------------------------');

        if (response.toLowerCase().includes('jhon') && response.length > 50) {
            console.log('SUCCESS: Gemini seems to have context.');
        } else {
            console.log('FAILURE: Gemini response seems generic or empty.');
        }
    } catch (error) {
        console.error('CHAT TEST ERROR:', error);
    }
}

testChat();
