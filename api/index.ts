import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { chat } from './gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    console.log('Chat request received');
    try {
        const response = await chat(message, history);
        res.json({ response });
    } catch (error: any) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            error: 'Failed to communicate with Gemini',
            details: error.message
        });
    }
});

app.get('/api/status', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    const modelId = process.env.GEMINI_MODEL_ID;

    res.json({
        status: 'online',
        gemini: hasKey ? 'available' : 'missing_api_key',
        config: {
            hasApiKey: hasKey,
            modelId: modelId || 'gemini-2.5-flash'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Uncaught Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Export the app for Vercel
export default app;

// Listen only if running locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
