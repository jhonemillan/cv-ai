import React, { useState, useEffect, useRef } from 'react';

const Chat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                setIsOnline(data.status === 'online' && data.gemini === 'available');
            } catch (error) {
                setIsOnline(false);
            }
        };

        checkStatus();
        // Removed the setInterval polling to save Vercel Serverless invocations
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history })
            });

            const data = await response.json();
            if (data.error) {
                setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.details || data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
            }
        } catch (error: any) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, hubo un error al conectar con mi cerebro artificial. Por favor, revisa tu conexión.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Launcher Button */}
            <div className="chat-launcher" onClick={() => setIsOpen(!isOpen)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>

            {/* Chat Widget */}
            <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className={`status ${isOnline ? 'online' : 'offline'}`} style={{
                        backgroundColor: isOnline ? '#10b981' : '#6b7280',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        marginRight: 10
                    }}></div>
                    <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>Chat con Jhon AI</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {isOnline ? 'En línea ahora' : 'Fuera de línea'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', padding: 4, color: 'var(--text-dim)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="messages" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡️</div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '1rem' }}>
                                Soy el Agente de Arquitectura de Jhon.
                            </p>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                ¿Estás lidiando con deuda técnica en un monolito, necesitas escalar tu backend en AWS, o buscas integrar agentes de IA en tu empresa de forma segura? Cuéntame tu desafío técnico.
                            </p>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`message ${m.role}`}>
                            {m.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot" style={{ display: 'flex', gap: 4 }}>
                            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                        </div>
                    )}
                </div>

                <div className="chat-input-container">
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Escribe tu pregunta..."
                        />
                        <button onClick={sendMessage}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
