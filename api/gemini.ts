import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import PDFParse from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function loadCVContent(): Promise<string> {
    const cwd = process.cwd();
    // Vercel project structure: CV files are in root or server/
    const possibleDirs = [
        path.join(cwd, 'server'),
        cwd,
        path.join(cwd, 'api')
    ];

    console.log(`Searching for CV files in: ${possibleDirs.join(', ')}`);

    for (const dir of possibleDirs) {
        if (!fs.existsSync(dir)) continue;

        try {
            const files = fs.readdirSync(dir);

            // Check for PDF
            const pdfFile = files.find(file => file.endsWith('.pdf'));
            if (pdfFile) {
                const pdfPath = path.join(dir, pdfFile);
                console.log(`Found CV PDF at: ${pdfPath}`);
                const dataBuffer = fs.readFileSync(pdfPath);
                const data = await PDFParse(dataBuffer);
                return data.text;
            }

            // Check for TXT
            const txtFile = files.find(file => file.endsWith('.txt') && file.includes('cv'));
            if (txtFile) {
                const txtPath = path.join(dir, txtFile);
                console.log(`Found CV TXT at: ${txtPath}`);
                return fs.readFileSync(txtPath, 'utf-8');
            }
        } catch (err) {
            console.error(`Error reading directory ${dir}:`, err);
        }
    }

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

    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: systemInstruction,
    });

    console.log(`Starting chat session with ${history.length} items...`);
    const chatSession = model.startChat({
        history: history,
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();
}
