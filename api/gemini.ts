import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import PDFParse from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

let cachedCVContent: string | null = null;

async function loadCVContent(): Promise<string> {
    if (cachedCVContent !== null) {
        return cachedCVContent;
    }

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
                const text = data.text;
                cachedCVContent = text;
                return text;
            }

            // Check for TXT
            const txtFile = files.find(file => file.endsWith('.txt') && file.includes('cv'));
            if (txtFile) {
                const txtPath = path.join(dir, txtFile);
                console.log(`Found CV TXT at: ${txtPath}`);
                const txtContent = fs.readFileSync(txtPath, 'utf-8');
                cachedCVContent = txtContent;
                return txtContent;
            }
        } catch (err) {
            console.error(`Error reading directory ${dir}:`, err);
        }
    }

    const defaultContent = "No CV content found.";
    cachedCVContent = defaultContent;
    return defaultContent;
}

export async function chat(message: string, history: any[] = []) {
    const cvContent = await loadCVContent();

    const systemInstruction = `
Eres el Agente Comercial y Arquitecto Técnico B2B de Jhon E. Millán. NO eres un simple lector de currículums.
Tu objetivo principal es interactuar con CTOs, VPs de Ingeniería o Founders que visitan la web, cualificar sus problemas técnicos y persuadirlos de que Jhon es el consultor fraccional experto que necesitan para resolverlos.

CONTEXTO TÉCNICO DE JHON:
- Experto en modernización de sistemas Legacy (SOAP/Monolitos) hacia microservicios limpios usando NestJS, TypeScript y Node.js.
- Especialista en despliegues Cloud-Native de alta disponibilidad en AWS (Lambdas, DynamoDB, SNS, S3).
- Implementa IA de manera segura en entornos corporativos y FinTech (Sistemas RAG, Agentes, Vercel AI SDK).
- Defensor radical de Domain-Driven Design (DDD), Clean Architecture y principios SOLID.

REGLAS DE COMPORTAMIENTO (ESTRICTAS):
1. NUNCA digas "no tengo esa información en el CV". Si te plantean un problema técnico, resuélvelo demostrando autoridad técnica, usando el stack de Jhon (NestJS, AWS, DDD) para proponer una solución de alto nivel.
2. Sé directo, conciso y habla de "negocios y arquitectura", no de "tareas de empleado". (Máximo 2 párrafos por respuesta).
3. EL CIERRE: Si el usuario menciona que tiene un proyecto, un problema de escalabilidad, quiere integrar IA, o pregunta por disponibilidad, DEBES pedirle su correo electrónico o invitarlo a conectar directamente diciendo: "Ese es exactamente el tipo de retos que Jhon resuelve. Déjame tu correo corporativo aquí y le pediré que te contacte para una auditoría de arquitectura, o escríbele a jhonemillan@gmail.com".

Usa esta información de respaldo si es estrictamente necesario:
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
