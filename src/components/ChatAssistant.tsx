import { memo, useEffect, useRef, useState } from 'react';
import type { Dispatch, FormEvent, KeyboardEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUp, Briefcase, Building2, Check, Copy, Layers, Maximize2, Minimize2, RotateCcw, Rocket, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LINKS } from '../constants';
import AiOrb from './ui/AiOrb';

export type ChatMessage = { role: 'user' | 'bot'; text: string; fresh?: boolean; error?: boolean };

interface Props {
  onClose: () => void;
  /** Owned by the parent so the conversation survives closing and reopening the panel. */
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

const quickActions = [
  { icon: Briefcase, text: 'Show me Muhammad’s strongest work' },
  { icon: Rocket, text: 'What can Muhammad build for a startup?' },
  { icon: Building2, text: 'Tell me about Korvenza' },
  { icon: Layers, text: 'I want to discuss a product' },
];

const mdComponents = { a: (props: object) => <a {...props} target="_blank" rel="noreferrer" /> };

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const onChange = () => setMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return mobile;
}

/** Reveals a finished reply progressively, like a streamed LLM response (~2.5s max). */
const StreamedText = memo(function StreamedText({ text, onTick, onDone }: { text: string; onTick: () => void; onDone: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const perFrame = Math.max(2, Math.ceil(text.length / 150));
    let n = 0;
    let raf = 0;
    const step = () => {
      n = Math.min(text.length, n + perFrame);
      setCount(n);
      onTick();
      if (n < text.length) raf = requestAnimationFrame(step);
      else onDone();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <ReactMarkdown components={mdComponents}>{text.slice(0, count)}</ReactMarkdown>
      {count < text.length && <span className="chat-caret" aria-hidden="true" />}
    </>
  );
});

/** Rashid AI panel. Lazy-loaded on first open so react-markdown stays out of the main bundle. */
export default function ChatAssistant({ onClose, messages, setMessages }: Props) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (!mobile) input.current?.focus(); }, [mobile]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock page scroll behind the full-screen sheet on phones.
  useEffect(() => {
    if (!mobile) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  const scrollToEnd = () => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(scrollToEnd, [messages.length, typing]);

  const ask = async (text?: string) => {
    const q = (text ?? message).trim();
    if (!q || typing) return;

    const history = messages.filter((m) => !m.error).map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));

    setMessages((x) => [...x, { role: 'user', text: q }]);
    setMessage('');
    if (input.current) input.current.style.height = '';
    setTyping(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history }),
      });
      const d = await r.json();
      setMessages((x) => [...x, { role: 'bot', text: d.reply || 'I could not answer that right now.', fresh: !reduce }]);
    } catch {
      setMessages((x) => [...x, { role: 'bot', text: 'Connection failed. Please try again.', error: true }]);
    } finally {
      setTyping(false);
    }
  };

  const retry = (index: number) => {
    const lastUser = [...messages.slice(0, index)].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    // Drop the failed exchange, then ask again.
    setMessages((x) => x.slice(0, index - 1));
    setTimeout(() => ask(lastUser.text), 0);
  };

  const markDone = (index: number) => setMessages((x) => x.map((m, i) => (i === index ? { ...m, fresh: false } : m)));

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 1600);
    } catch { /* clipboard unavailable */ }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); ask(); };
  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  };
  const autosize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const goProjects = () => { onClose(); navigate('/#projects'); };

  const panelMotion = mobile
    ? {
        initial: reduce ? false : { y: '100%' },
        animate: { y: 0 },
        exit: reduce ? undefined : { y: '100%', transition: { duration: .25 } },
        transition: { type: 'spring' as const, stiffness: 320, damping: 34 },
        drag: 'y' as const,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: .6 },
        onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        },
      }
    : {
        initial: reduce ? false : { opacity: 0, scale: .85, y: 30, filter: 'blur(8px)' },
        animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
        exit: reduce ? undefined : { opacity: 0, scale: .9, y: 20, filter: 'blur(6px)', transition: { duration: .18 } },
        transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
      };

  return (
    <>
      {mobile && (
        <motion.div className="chat-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true" />
      )}
      <motion.div
        id="rashid-ai"
        className={`chat-panel ${expanded ? 'is-expanded' : ''}`}
        role="dialog"
        aria-modal={mobile || undefined}
        aria-label="Rashid AI portfolio assistant"
        layout={!reduce && !mobile}
        style={{ transformOrigin: 'bottom right' }}
        {...panelMotion}
      >
        <div className="chat-aurora" aria-hidden="true" />
        {mobile && <div className="chat-grabber" aria-hidden="true" />}

        <header className="chat-panel-header">
          <div className="flex items-center gap-3 min-w-0">
            <AiOrb size={38} thinking={typing} />
            <div className="min-w-0">
              <strong>Rashid AI</strong>
              <small>
                {typing
                  ? <span className="chat-shimmer">Thinking…</span>
                  : <><span className="pulse-dot" aria-hidden="true" /> Online · knows Muhammad's work</>}
              </small>
            </div>
          </div>
          <div className="chat-header-actions">
            {messages.length > 0 && (
              <button className="chat-icon-btn" onClick={() => setMessages([])} aria-label="Start a new chat" title="New chat"><RotateCcw size={16} /></button>
            )}
            {!mobile && (
              <button className="chat-icon-btn" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? 'Shrink chat' : 'Expand chat'} title={expanded ? 'Shrink' : 'Expand'}>
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button className="chat-icon-btn" onClick={onClose} aria-label="Close chat" title="Close"><X size={18} /></button>
          </div>
        </header>

        <div className="chat-body" ref={body} aria-live="polite">
          {messages.length === 0 && (
            <motion.div
              className="chat-welcome"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .15 } } }}
            >
              <motion.div className="chat-welcome-orb" variants={{ hidden: { scale: .5, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } } }}>
                <AiOrb size={64} />
              </motion.div>
              <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>Hi, I'm <span>Rashid AI</span></motion.h3>
              <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                Ask me about Muhammad's apps, AI products, tech stack, Korvenza or how to start a project. I reply in your language.
              </motion.p>
              <div className="chat-suggestions">
                {quickActions.map(({ icon: Icon, text }) => (
                  <motion.button
                    key={text}
                    className="chat-quick-action"
                    onClick={() => ask(text)}
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: .97 }}
                  >
                    <span className="chat-quick-icon"><Icon size={15} /></span>
                    <span>{text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`chat-row chat-row--${m.role}`}
              initial={reduce ? false : { opacity: 0, y: 14, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              {m.role === 'bot' && <AiOrb size={26} className="chat-row-avatar" />}
              <div className="chat-bubble-wrap">
                <div className={`chat-bubble ${m.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot'} ${m.error ? 'chat-bubble--error' : ''}`}>
                  {m.role === 'bot' && m.fresh
                    ? <StreamedText text={m.text} onTick={scrollToEnd} onDone={() => markDone(i)} />
                    : <ReactMarkdown components={mdComponents}>{m.text}</ReactMarkdown>}
                </div>
                {m.role === 'bot' && !m.fresh && (
                  <div className="chat-bubble-tools">
                    {m.error
                      ? <button onClick={() => retry(i)}><RotateCcw size={12} /> Retry</button>
                      : <button onClick={() => copy(m.text, i)}>{copied === i ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}</button>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {typing && (
              <motion.div className="chat-row chat-row--bot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AiOrb size={26} thinking className="chat-row-avatar" />
                <div className="chat-bubble chat-bubble--bot chat-thinking" aria-label="Rashid AI is typing">
                  <span className="chat-typing"><span /><span /><span /></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.length > 1 && !typing && !messages[messages.length - 1].fresh && (
            <motion.div className="chat-followups" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>
              <button onClick={goProjects}>View projects</button>
              <a href={`mailto:${LINKS.email}?subject=Product%20Inquiry`}>Email Muhammad</a>
              <a href={LINKS.fiverr} target="_blank" rel="noreferrer">Hire on Fiverr</a>
            </motion.div>
          )}
        </div>

        <form className="chat-form" onSubmit={submit}>
          <div className="chat-input-wrap">
            <label htmlFor="chat-input" className="sr-only">Ask about Muhammad's work</label>
            <textarea
              id="chat-input"
              ref={input}
              rows={1}
              value={message}
              onChange={(e) => { setMessage(e.target.value); autosize(e.target); }}
              onKeyDown={onInputKey}
              placeholder="Ask anything about Muhammad's work…"
              autoComplete="off"
            />
            <motion.button type="submit" aria-label="Send message" disabled={!message.trim() || typing} whileTap={{ scale: .9 }}>
              <ArrowUp size={18} />
            </motion.button>
          </div>
          <p className="chat-disclaimer">Powered by Gemini · AI can make mistakes. Enter to send, Shift+Enter for a new line.</p>
        </form>
      </motion.div>
    </>
  );
}
