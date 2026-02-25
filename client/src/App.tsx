import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {
  const projects = [
    {
      title: "@kiwicredito/banking-holidays",
      desc: "Librería NPM open-source para cálculo de festivos bancarios en EE. UU. y PR. Optimizó validaciones críticas en apps financieras.",
      tags: ["Node.js", "TypeScript", "NPM", "Fintech"]
    },
    {
      title: "Greenstand Tree Tracker",
      desc: "Plataforma global para verificación de plantación de árboles mediante pagos a cultivadores. Impacto social y ambiental a gran escala.",
      tags: ["Backend", "Sustainability", "Global Impact"]
    },
    {
      title: "PetsConnect",
      desc: "Plataforma para conectar personas con refugios de mascotas, facilitando la adopción responsable con filtros avanzados.",
      tags: ["React", "Matching", "Social Good"]
    }
  ];

  // Elegant SVG Icons for Tech Stack
  const icons = {
    nestjs: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.11 12.067c-1.3-.393-2.126-.411-2.108-.946.035-.865 1.705-.881 1.74-2.155C11.751 8.513 11 7.424 9.172 7.15c-1.396-.15-2.617.202-3.414.93-.41.375-.68.857-.84 1.357-.168.64-.186 1.157-.186 1.714v5.6c0 .8.2 1.4.6 1.8.4.4 1 .6 1.8.6h2.2c.8 0 1.4-.2 1.8-.6.4-.4.6-1 .6-1.8v-2.2c.4-.2.903-.314 1.343-.45.92-.284 3.023-.74 3.023-3.001 0-2.31-1.372-3.692-4.102-4.043-2.152-.276-4.085.344-5.18 1.442-.64.63-1.04 1.43-1.2 2.29-.27 1.44-.067 2.6.51 3.513.626.99 1.724 1.63 3.1 1.956.344.08.76.155 1.15.195l1.04.144c.465.111.7.203.7.464 0 .343-.544.401-.84.401h-1.63c-1.2 0-2-.4-2.4-1.2l-2 2.8c.8 1 2.2 1.6 4.4 1.6h2c2.4 0 4.2-1.2 5.023-3.23.177-.433.277-.899.277-1.383 0-2.583-1.577-3.834-4.223-4.134zM12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" /></svg>,
    nodejs: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L2.3 5.6v11.2L12 22.4l9.7-5.6V5.6L12 0zm-1.8 15.6c-.4 0-.8-.1-1.1-.3-.3-.2-.6-.5-.8-.9-.2-.4-.3-.9-.3-1.5v-1.9h2V13c0 .3.1.5.2.7.1.1.2.2.4.2s.3-.1.4-.2c.1-.1.1-.3.1-.5V8.8h2.1v4.3c0 .8-.1 1.4-.4 1.9s-.7.8-1.2 1.1-1 .5-1.4.5zm5 0c-.8 0-1.4-.2-1.9-.7s-.8-1.1-1-1.9l1.8-.4c.1.5.3.9.5 1.2.3.2.6.3.9.3.4 0 .6-.1.8-.3.2-.2.3-.5.3-.9v-4.1h2.1V13c0 .8-.2 1.4-.5 1.9s-.7.8-1.2 1.1-1.2.6-1.8.6z" /></svg>,
    typescript: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.434 20.368L21.05 12.06l-1.344 1.346c.162.771.216 1.442.216 2.016 0 2.268-1.35 3.186-3.888 3.186-2.538 0-4.05-1.25-4.05-3.348v-2.16H10.16v2.32c0 3.024 2.16 4.968 6.048 4.968 3.84 0 5.184-2.16 5.184-4.8 0-.972-.216-2.214-.54-2.916l-1.404-.756.986-1.026.966-2.1L24 10.152V24h-1.566zm-10.74-6.426v-1.134h-2.16V9.12h4.32v-1.62H7.454v1.62h2.214v3.682h2.026z" /></svg>,
    aws: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.96 0C5.36 0 0 5.36 0 11.96c0 6.6 5.36 11.96 11.96 11.96s11.96-5.36 11.96-11.96C23.92 5.36 18.56 0 11.96 0zm0 21.92c-5.5 0-9.96-4.46-9.96-9.96s4.46-9.96 9.96-9.96 9.96 4.46 9.96 9.96-4.46 9.96-9.96 9.96zm4.4-12.8c-1.44 0-2.6 1.16-2.6 2.6 0 1.44 1.16 2.6 2.6 2.6 1.44 0 2.6-1.16 2.6-2.6 0-1.44-1.16-2.6-2.6-2.6zm-8.8 0c-1.44 0-2.6 1.16-2.6 2.6 0 1.44 1.16 2.6 2.6 2.6 1.44 0 2.6-1.16 2.6-2.6 0-1.44-1.16-2.6-2.6-2.6z" /></svg>,
    postgresql: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.11 17.5l-4.11-1.32c-.14-.04-.26-.14-.3-.28L11.5 12l-1.2.39-1.32-4.11c-.04-.14-.14-.26-.28-.3l-4.11-1.32-.39 1.2 1.32 4.11c.04.14.14.26.28.3l4.11 1.32.39-1.2-1.32-4.11c-.04-.14-.14-.26-.28-.3L4.39 6.5l4.11 1.32c.14.04.26.14.3.28l1.2 3.61 1.01-.33 1.32 4.11c.04.14.14.26.28.3l4.11 1.32.39-1.2z" /></svg>,
    docker: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897v-1.794zm-2.69 0c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897v-1.794zm-2.69 0c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897v-1.794zm-2.69 0c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897H5.81a.896.896 0 0 1-.897-.897v-1.794zM13.983 8.388c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897V8.388zm-2.69 0c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897V8.388zm-2.69 0c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897V8.388zm2.69-2.689c0-.495.402-.897.897-.897h1.794c.495 0 .897.402.897.897v1.794c0 .495-.402.897-.897.897h-1.794a.896.896 0 0 1-.897-.897V5.699z" /></svg>,
    ai: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 13.5l-3.5 1.5 3.5-8.5 3.5 8.5-3.5-1.5z" /></svg>
  };

  const techStack = [
    { name: "NestJS", icon: icons.nestjs },
    { name: "Node.js", icon: icons.nodejs },
    { name: "TypeScript", icon: icons.typescript },
    { name: "AWS", icon: icons.aws },
    { name: "PostgreSQL", icon: icons.postgresql },
    { name: "Docker", icon: icons.docker },
    { name: "GenAI / LLMs", icon: icons.ai },
    { name: "Agentic Systems", icon: icons.ai }
  ];

  const clients = ["Kiwi Crétido Financial", "Qrvey Inc.", "Tyba", "Foodology", "Smurfit Kappa", "Parmac Inc", "Punto Red"];

  return (
    <div className="app-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="profile-image-container">
          <img
            src="/profile.jpg"
            alt="Jhon E. Millán A."
            className="profile-photo"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              const formats = ['jpg', 'png', 'webp'];
              const currentSrc = img.src.split('.').pop()?.toLowerCase() || '';
              const currentIndex = formats.indexOf(currentSrc);

              if (currentIndex !== -1 && currentIndex < formats.length - 1) {
                img.src = `/profile.${formats[currentIndex + 1]}`;
              } else {
                img.style.display = 'none';
                img.nextElementSibling?.classList.remove('hidden');
              }
            }}
          />
          <div className="profile-image-placeholder hidden">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <span className="hero-tagline">Software Architect & AI Engineer</span>
        <h1>Hola, soy<br />Jhon E. Millán A.</h1>
        <p className="hero-intro">
          Arquitecto de software y experto en el ecosistema de <strong>NestJS, Node.js y TypeScript</strong>.
          Especialista en el diseño de plataformas de alta seguridad y sistemas orientados a <strong>IA y Agentes Autónomos</strong> sobre <strong>AWS</strong>.
          Líder de equipos de ingeniería de alto rendimiento.
        </p>
        <div className="social-links">
          <a href="https://linkedin.com/in/jhonemillan" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            LinkedIn
          </a>
          <a href="https://github.com/jhonemillan" target="_blank" rel="noopener noreferrer" className="social-btn github">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </a>
        </div>
      </section>

      {/* AI & Agentic Section */}
      <section id="ai-focus">
        <h2 className="section-title">AI & Agentic Systems</h2>
        <div className="grid">
          <div className="card ai-card">
            <h3>Soluciones de IA Generativa</h3>
            <p>
              Integración de LLMs (Gemini, GPT) para potenciar aplicaciones con capacidades cognitivas. Desarrollo de sistemas RAG (Retrieval-Augmented Generation) optimizados.
            </p>
          </div>
          <div className="card ai-card">
            <h3>Agentes Autónomos</h3>
            <p>
              Arquitectura de agentes capaces de ejecutar tareas complejas, interactuar con APIs y razonar sobre flujos de trabajo en producción.
            </p>
          </div>
        </div>
      </section>

      {/* Software Architecture Section */}
      <section id="architecture">
        <h2 className="section-title">Software Architecture</h2>
        <div className="grid">
          <div className="card arch-card">
            <h3>Clean Architecture & DDD</h3>
            <p>
              Diseño de sistemas desacoplados y testeables utilizando Domain-Driven Design y Arquitectura Hexagonal. Enfoque en la lógica de negocio como el núcleo del sistema.
            </p>
          </div>
          <div className="card arch-card">
            <h3>Seguridad & Estándares</h3>
            <p>
              Arquitectura de sistemas de <strong>alta seguridad</strong> bajo estándares internacionales (OWASP, PCI DSS). Implementación de patrones de cifrado, identidad y protección de datos.
            </p>
          </div>
          <div className="card arch-card">
            <h3>Microservicios & Escalabilidad</h3>
            <p>
              Especialista en arquitecturas de microservicios resilientes, comunicación asíncrona (Event-Driven) y optimización de sistemas distribuidos sobre AWS.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack">
        <h2 className="section-title">Tecnologías Core</h2>
        <div className="grid tech-grid">
          {techStack.map(tech => (
            <div key={tech.name} className="tech-item card">
              <div className="tech-icon-container">{tech.icon}</div>
              <h4>{tech.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <h2 className="section-title">Proyectos Destacados</h2>
        <div className="grid">
          {projects.map((p, i) => (
            <div key={i} className="card project-card">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tags">
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <h2 className="section-title">Sobre Mí</h2>
        <div className="grid">
          <div className="card">
            <h3>Experiencia y Liderazgo</h3>
            <p>
              Más de 10 años construyendo productos digitales. Experto en liderar equipos diversos y remotos (+10 personas), fomentando culturas de alto rendimiento y excelencia técnica.
            </p>
          </div>
          <div className="card">
            <h3>Arquitectura & Cloud</h3>
            <p>
              Especialista en diseñar sistemas escalables y resilientes en AWS. Enfoque sólido en principios SOLID, arquitecturas limpias y entrega de valor real al negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients">
        <h2 className="section-title">Clientes & Experiencia</h2>
        <div className="grid">
          <div className="card">
            <p style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'white', fontWeight: 600 }}>
              {clients.map(c => <span key={c} style={{ borderBottom: '1px solid var(--accent)' }}>{c}</span>)}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Jhon E. Millán A. | Software Architect</p>
          <div className="footer-links">
            <a href="https://linkedin.com/in/jhonemillan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/jhonemillan" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <Chat />
    </div>
  );
};

export default App;
