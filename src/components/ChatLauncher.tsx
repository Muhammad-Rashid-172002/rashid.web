import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import AiOrb from './ui/AiOrb';
import { ease } from '../lib/motion';

const TEASER_KEY = 'rashid-ai-teaser-dismissed';

interface Props {
  open: boolean;
  onToggle: () => void;
  /** Number of messages so far, used to hide the teaser once someone has chatted. */
  messageCount: number;
}

/**
 * Floating entry point for Rashid AI: animated gradient border, living orb, and a one-time
 * teaser bubble that invites visitors to ask a question.
 */
export default function ChatLauncher({ open, onToggle, messageCount }: Props) {
  const reduce = useReducedMotion();
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(TEASER_KEY) === '1'; } catch { /* storage unavailable */ }
    if (dismissed || messageCount > 0) return;
    const id = window.setTimeout(() => setTeaser(true), 7000);
    return () => window.clearTimeout(id);
  }, [messageCount]);

  useEffect(() => { if (open) dismissTeaser(); }, [open]);

  function dismissTeaser() {
    setTeaser(false);
    try { sessionStorage.setItem(TEASER_KEY, '1'); } catch { /* storage unavailable */ }
  }

  return (
    <div className="chat-dock">
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            className="chat-teaser"
            role="status"
            initial={reduce ? false : { opacity: 0, y: 12, scale: .9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: .95, transition: { duration: .15 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <button className="chat-teaser-body" onClick={() => { dismissTeaser(); onToggle(); }}>
              <strong>Hi there, I'm Rashid AI</strong>
              <span>Ask me about Muhammad's apps, AI work or how to start a project.</span>
            </button>
            <button className="chat-teaser-close" onClick={dismissTeaser} aria-label="Dismiss"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onToggle}
        className={`chat-launcher ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close Rashid AI' : 'Ask Rashid AI'}
        aria-expanded={open}
        aria-controls="rashid-ai"
        initial={reduce ? false : { opacity: 0, y: 30, scale: .8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .7, delay: 1.2, ease }}
        whileHover={reduce ? undefined : { scale: 1.04 }}
        whileTap={{ scale: .95 }}
        data-cursor=""
      >
        <span className="chat-launcher-glow" aria-hidden="true" />
        <span className="chat-launcher-inner">
          <span className="chat-launcher-icon">
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="close" className="chat-launcher-x" initial={{ rotate: -90, scale: .4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: .4, opacity: 0 }} transition={{ duration: .2 }}>
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span key="orb" initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .4, opacity: 0 }} transition={{ duration: .2 }}>
                  <AiOrb size={30} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="chat-launcher-text">
            <strong>{open ? 'Close chat' : 'Ask Rashid AI'}</strong>
            <small><span className="pulse-dot" aria-hidden="true" /> AI assistant · online</small>
          </span>
        </span>
      </motion.button>
    </div>
  );
}
