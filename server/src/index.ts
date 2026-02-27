import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { chat } from '../../api/gemini.js';

dotenv.config({ path: '.env', silent: true } as any);

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

// Global error handler for uncaught exceptions in the app
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Uncaught Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.get('/api/status', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    const modelId = process.env.GEMINI_MODEL_ID;

    console.log(`Status check: hasKey=${hasKey}, modelId=${modelId}`);

    res.json({
        status: 'online',
        gemini: hasKey ? 'available' : 'missing_api_key',
        config: {
            hasApiKey: hasKey,
            modelId: modelId || 'default'
        }
    });
});

// Export the app for Vercel serverless functions
export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
