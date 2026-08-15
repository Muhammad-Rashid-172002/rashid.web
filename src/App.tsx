import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sparkles, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import Testimonials from './components/Testimonials';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unknown application error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio runtime error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6">
          <div className="max-w-xl w-full rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <h1 className="text-xl font-bold">The portfolio hit a runtime error.</h1>
            <p className="text-zinc-400 mt-3">Open DevTools → Console and share the first red error if this screen appears.</p>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-black/40 p-4 text-sm text-red-200">{this.state.message}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function Process() {
  const steps = [
    ['01', 'Discover', 'Align on the business problem, user journey, constraints and definition of success.'],
    ['02', 'Architect', 'Translate the product into flows, data models, APIs and a maintainable technical system.'],
    ['03', 'Build', 'Execute in focused milestones with production-quality engineering and clear communication.'],
    ['04', 'Ship & Evolve', 'Test, optimize, deploy and leave the product ready for the next stage of growth.'],
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="section-kicker">Operating model</div>
        <div className="section-heading-row"><h2 className="section-title max-w-2xl">From idea to production, without losing the product thinking.</h2><p className="section-side-copy">A founder-led delivery process designed to keep strategy, architecture and execution connected.</p></div>
        <div className="process-grid">
          {steps.map(([n, t, d]) => (
            <div className="process-card" key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <Hero />
      <section id="projects" className="py-20 lg:py-28"><Projects /></section>
      <section id="about" className="py-20 lg:py-28 border-y border-white/5"><About /></section>
      <section id="services" className="py-20 lg:py-28"><Services /></section>
      <section id="skills" className="py-20 lg:py-28 border-y border-white/5"><Skills /></section>
      <Process />
      <section id="experience" className="py-20 lg:py-28 border-y border-white/5"><Experience /></section>
      <section id="testimonials" className="py-20 lg:py-28"><Testimonials /></section>
      <section id="contact" className="py-20 lg:py-28"><Contact /></section>
    </div>
  );
}

type ChatMessage = { role: 'user' | 'bot'; text: string };

function PortfolioApp() {
  const [chat, setChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const quickActions = ['Show me Muhammad’s strongest work', 'What can Muhammad build for a startup?', 'Tell me about Korvenza', 'I want to discuss a product'];

  const ask = async (text?: string) => {
    const q = (text ?? message).trim();
    if (!q) return;

    const history = messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));

    setMessages((x) => [...x, { role: 'user', text: q }]);
    setMessage('');
    setTyping(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history }),
      });
      const d = await r.json();
      setMessages((x) => [...x, { role: 'bot', text: d.reply || 'I could not answer that right now.' }]);
    } catch {
      setMessages((x) => [...x, { role: 'bot', text: 'Connection failed. Please try again later.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen site-shell text-zinc-100">
        <ScrollToTop />
        <Navbar isDarkMode={true} toggleTheme={() => {}} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </main>
        <Footer />

        <button
          onClick={() => setChat(!chat)}
          className="chat-launcher"
          aria-label="Ask Rashid AI"
          aria-expanded={chat}
        >
          <Sparkles size={17} /> <span>Ask Rashid AI</span>
        </button>

        {chat && (
          <div className="chat-panel" role="dialog" aria-label="Rashid AI portfolio assistant">
            <div className="chat-panel-header">
              <div className="flex items-center gap-3">
                <span className="chat-avatar"><Sparkles size={16} /></span>
                <div>
                  <div className="font-semibold text-white text-sm">Rashid AI</div>
                  <div className="text-xs text-zinc-500">Portfolio Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="chat-status"><span /> Online</span>
                <button onClick={() => setChat(false)} aria-label="Close chat"><X size={18} /></button>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="chat-welcome">
                <p>Hi — I'm Rashid AI. I can help you explore Muhammad's projects, technical expertise, experience and Korvenza.</p>
                <div className="grid gap-2 mt-4">
                  {quickActions.map((q) => (
                    <button key={q} onClick={() => ask(q)} className="chat-quick-action">{q}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot'}`}>
                  <ReactMarkdown components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}>{m.text}</ReactMarkdown>
                </div>
              ))}
              {typing && (
                <div className="chat-typing"><span /><span /><span /></div>
              )}
              <div ref={end} />
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask()}
                placeholder="Ask about my work..."
                className="flex-1 bg-white/5 rounded-xl px-3 outline-none text-sm"
              />
              <button onClick={() => ask()} className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shrink-0" aria-label="Send message"><Send size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <PortfolioApp />
    </AppErrorBoundary>
  );
}
