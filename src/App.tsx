import { Component, Suspense, lazy, useCallback, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Process from './components/Process';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import type { ChatMessage } from './components/ChatAssistant';
import CustomCursor from './components/ui/CustomCursor';
import ChatLauncher from './components/ChatLauncher';
import { ease } from './lib/motion';

// Code-split: case studies and the AI assistant (with react-markdown) load on demand.
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));

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
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-xl w-full rounded-2xl border border-red-400/30 bg-red-400/5 p-6">
            <h1 className="text-xl font-bold">The portfolio hit a runtime error.</h1>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>Open DevTools → Console and share the first red error if this screen appears.</p>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-black/40 p-4 text-sm text-red-200">{this.state.message}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

function Home() {
  const { hash } = useLocation();
  // Deep links such as /#projects (also used when returning from a case study).
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'auto' }), 60);
    return () => window.clearTimeout(id);
  }, [hash]);

  return (
    <>
      <Hero />
      <section id="about" className="section section--ruled"><About /></section>
      <section id="skills" className="section"><Skills /></section>
      <section id="projects" className="section section--ruled"><Projects /></section>
      <section id="services" className="section"><Services /></section>
      <section id="process" className="section section--ruled"><Process /></section>
      <section id="experience" className="section"><Experience /></section>
      <section id="testimonials" className="section section--ruled"><Testimonials /></section>
      <section id="contact" className="section"><Contact /></section>
    </>
  );
}

const CURTAIN = 0.5;

/** Accent panel that wipes up over the old page, then lifts off the new one. */
function RouteCurtain({ pathname }: { pathname: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="route-curtain"
        aria-hidden="true"
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0, transition: { duration: CURTAIN, ease: [0.76, 0, 0.24, 1], delay: .05 } }}
        exit={{ scaleY: 1, originY: 1, transition: { scaleY: { duration: CURTAIN, ease: [0.76, 0, 0.24, 1] }, originY: { duration: 0 } } }}
        style={{ scaleY: 0 }}
      />
    </AnimatePresence>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <>
    <RouteCurtain pathname={location.pathname} />
    <AnimatePresence mode="wait" onExitComplete={() => { if (!location.hash) window.scrollTo(0, 0); }}>
      <motion.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: .7, ease, delay: .15 } }}
        exit={reduce ? undefined : { opacity: 0, y: -24, transition: { duration: CURTAIN, ease: [0.76, 0, 0.24, 1] } }}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
    </>
  );
}

function PortfolioApp() {
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const closeChat = useCallback(() => setChat(false), []);

  return (
    <Router>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <AnimatedRoutes />
      </main>
      <Footer />

      <ChatLauncher open={chat} onToggle={() => setChat((v) => !v)} messageCount={messages.length} />

      <Suspense fallback={null}>
        <AnimatePresence>
          {chat && <ChatAssistant key="chat" onClose={closeChat} messages={messages} setMessages={setMessages} />}
        </AnimatePresence>
      </Suspense>
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
