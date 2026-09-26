import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail } from 'lucide-react';
import { LINKS } from '../constants';
import Reveal from './Reveal';
import Magnetic from './ui/Magnetic';
import SplitWords from './ui/SplitWords';
import Kicker from './ui/Kicker';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Reveal>
        <div className="contact-panel">
          <div className="contact-watermark" aria-hidden="true">BUILD / SHIP / SCALE</div>
          <div className="contact-grid">
            <div>
              <Kicker>Build with me</Kicker>
              <h2 className="contact-title"><SplitWords text="Have a product worth building?" inView stagger={0.06} /></h2>
              <p className="section-copy mt-6 max-w-2xl">Tell me what you're building, where you are today, and what needs to happen next. I work with selected teams on product engineering, AI integration and production delivery.</p>
              <p className="contact-trust"><span className="pulse-dot" aria-hidden="true" /> Available for selected product engagements.</p>
            </div>
            <div className="contact-actions">
              <Magnetic strength={.18}><a href={`mailto:${LINKS.email}?subject=Product%20Inquiry`} className="premium-btn w-full !py-4">Discuss your product <ArrowUpRight size={17} /></a></Magnetic>
              <a href={LINKS.fiverr} target="_blank" rel="noreferrer" className="secondary-btn w-full !py-4">Hire me on Fiverr <ArrowUpRight size={16} /></a>
              <a href={LINKS.korvenza} target="_blank" rel="noreferrer" className="secondary-btn w-full !py-4">Visit Korvenza <ArrowUpRight size={16} /></a>
              <div className="contact-email">
                <a href={`mailto:${LINKS.email}`}><Mail size={16} aria-hidden="true" /> {LINKS.email}</a>
                <button className="copy-btn" onClick={copyEmail} aria-label="Copy email address">
                  {copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Copy size={14} aria-hidden="true" /> Copy</>}
                </button>
              </div>
              <span className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
              <div className="flex gap-2 mt-2">
                <a className="icon-link" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
                <a className="icon-link" href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a className="icon-link" href={LINKS.fiverr} target="_blank" rel="noreferrer" aria-label="Fiverr"><span className="fiverr-mark" aria-hidden="true">fi</span></a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
