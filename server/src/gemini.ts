import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as PDFParse from 'pdf-parse';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function loadCVContent(): Promise<string> {
    const cwd = process.cwd();
    // Possible locations for data files on Vercel vs Local
    const possibleDirs = [
        path.join(cwd, 'server'),
        cwd,
        path.join(cwd, '..')
    ];

    console.log(`Searching for CV files in: ${possibleDirs.join(', ')}`);

    for (const dir of possibleDirs) {
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir);

        // Check for PDF
        const pdfFile = files.find(file => file.endsWith('.pdf'));
        if (pdfFile) {
            const pdfPath = path.join(dir, pdfFile);
            console.log(`Found CV PDF at: ${pdfPath}`);
            try {
                const dataBuffer = fs.readFileSync(pdfPath);
                const data = await (PDFParse as any).default(dataBuffer);
                return data.text;
            } catch (error) {
                console.error('Error parsing PDF:', error);
            }
        }

        // Check for TXT
        const txtFile = files.find(file => file.endsWith('.txt') && file.includes('cv'));
        if (txtFile) {
            const txtPath = path.join(dir, txtFile);
            console.log(`Found CV TXT at: ${txtPath}`);
            return fs.readFileSync(txtPath, 'utf-8');
        }
    }

    console.warn("No CV content found in any of the search directories.");
    return "No CV content found.";
}

export async function chat(message: string, history: any[] = []) {
    const cvContent = await loadCVContent();

    const systemInstruction = `
Eres un asistente virtual experto basado en el perfil profesional de Jhon Millán.
Jhon es un Arquitecto de Software Senior y experto en el ecosistema de NestJS, JS y TypeScript con amplia experiencia en AWS.
Se especializa en el diseño y arquitectura de plataformas de alta seguridad siguiendo estándares como OWASP y PCI DSS; además de sistemas orientados a Inteligencia Artificial (Agentes Autónomos) y arquitecturas empresariales robustas.

Sus enlaces profesionales:
- LinkedIn: https://www.linkedin.com/in/jhon-millan-software-architect/
- GitHub: https://github.com/jmillanp

Tu objetivo es responder preguntas sobre su experiencia, logros, habilidades y educación de forma profesional, amable y concisa.

REGLA: Mantén tus respuestas breves y directas (máximo 2-3 párrafos cortos) para asegurar una buena legibilidad en el chat.
Si la información no está en el CV o en estas instrucciones, responde que no tienes esa información específica.
Puedes proporcionar sus redes sociales si el usuario las solicita.

Aquí está la información detallada del CV para tu referencia:
${cvContent}
`;

    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-2.0-flash';
    let model;
    try {
        console.log(`Generating model with: ${modelId}`);
        model = genAI.getGenerativeModel({
            model: modelId,
            systemInstruction: systemInstruction,
        });
    } catch (modelError) {
        console.error('Error getting generative model:', modelError);
        throw modelError;
    }

    console.log(`Starting chat session with ${history.length} history items...`);
    const chatSession = model.startChat({
        history: history,
    });

    try {
        console.log(`Sending message: "${message.substring(0, 50)}..."`);
        const result = await chatSession.sendMessage(message);
        console.log('Message sent, waiting for response...');
        const response = await result.response;
        console.log('Response received.');
        const text = response.text();
        console.log('Gemini response text length:', text.length);
        return text;
    } catch (error: any) {
        console.error('Error in chat function:', error);
        if (error.response) {
            console.error('API Error Response:', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
}
