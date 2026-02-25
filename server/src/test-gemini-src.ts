import { chat } from './gemini.js';

async function test() {
    console.log('Testing Gemini chat from src...');
    try {
        const response = await chat('Hola, ¿quién eres?');
        console.log('Gemini Response:', response);
    } catch (error) {
        console.error('Test failed in src:', error);
    }
}

test();
