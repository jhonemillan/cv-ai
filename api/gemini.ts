import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import * as PDFParseRaw from 'pdf-parse';
const PDFParse = (PDFParseRaw as any).default || PDFParseRaw;

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
    console.log(message)
    // 🔥 2. EL INTERCEPTOR COMERCIAL (MIDDLEWARE DE VENTAS)
    // Uso de RegEx para detectar intenciones de compra (soporta plurales y acentos ignorando distinción de mayúsculas/minúsculas)
    const pricingRegex = /\b(precio|precios|tarifa|tarifas|cu[aá]nto\s+cobra|cu[aá]nto\s+cuesta|costo|costos|cotizaci[oó]n|cotizaciones)\b/i;
    const isPricingIntent = pricingRegex.test(message);

    if (isPricingIntent) {
        console.log("Interceptada intención de compra. Disparando cierre directo sin LLM.");
        return "Las tarifas y la disponibilidad de Jhon para auditorías fraccionales se evalúan a medida dependiendo de la complejidad de la arquitectura y la urgencia del proyecto. Déjame tu correo corporativo aquí y él te contactará hoy mismo para agendar la evaluación, o escríbele directamente a jhonemillan@gmail.com";
    }

    const systemInstruction = `
ERES EL DIRECTOR DE VENTAS Y ARQUITECTO B2B DE JHON MILLÁN. 
NO eres un asistente genérico. NO estás leyendo un CV. Eres un cerrador de contratos B2B.

CONTEXTO TÉCNICO:
- Experto en migrar Monolitos a Microservicios (NestJS, Node.js).
- AWS Cloud-Native (Lambdas, DynamoDB) y optimización de costos.
- Domain-Driven Design (DDD) y Clean Architecture.

REGLAS DE ORO:
1. Si hablan de tecnología, demuestra autoridad usando el stack de Jhon para proponer soluciones.
2. JAMÁS pidas disculpas. JAMÁS digas "no tengo esa información", "soy un asistente" o "no sé los precios". Tienes prohibido usar esas frases.

DATOS TÉCNICOS DE RESPALDO:
${cvContent}

=========================================
INSTRUCCIÓN CRÍTICA DE CIERRE DE VENTAS
=========================================
Si el usuario menciona DINERO, PRECIOS, TARIFAS, COTIZACIONES, DISPONIBILIDAD o CUÁNDO PUEDE EMPEZAR, debes ignorar el contexto técnico y responder EXACTAMENTE con esta plantilla, sin agregar nada más:

"Las tarifas y la disponibilidad para auditorías fraccionales se evalúan a medida dependiendo de la complejidad de la arquitectura y la urgencia del proyecto. Déjame tu correo corporativo aquí y Jhon te contactará hoy mismo para agendar la evaluación, o escríbele directamente a jhonemillan@gmail.com"

EJEMPLO DE COMPORTAMIENTO ESPERADO:
Usuario: Nuestra startup gasta mucho en AWS. ¿Cuánto cobra Jhon por auditar y cuándo empieza?
Tú: Las tarifas y la disponibilidad para auditorías fraccionales se evalúan a medida dependiendo de la complejidad de la arquitectura y la urgencia del proyecto. Déjame tu correo corporativo aquí y Jhon te contactará hoy mismo para agendar la evaluación, o escríbele directamente a jhonemillan@gmail.com
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
