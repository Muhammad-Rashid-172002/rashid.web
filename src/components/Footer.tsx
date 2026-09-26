import { ArrowUp } from 'lucide-react';
import { LINKS } from '../constants';

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return (
    <footer className="footer-shell">
      <div className="container mx-auto px-4 sm:px-6 footer-inner">
        <div>
          <strong>Muhammad Rashid</strong>
          <span>Founder & CEO · Korvenza · Product Engineering · AI · Mobile · Cloud</span>
          <span>© {new Date().getFullYear()} Muhammad Rashid</span>
        </div>
        <nav className="footer-links" aria-label="Social and contact">
          <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={LINKS.fiverr} target="_blank" rel="noreferrer">Fiverr</a>
          <a href={LINKS.korvenza} target="_blank" rel="noreferrer">Korvenza</a>
          <a href={`mailto:${LINKS.email}`}>Email</a>
          <button onClick={toTop} className="gap-1">Back to top <ArrowUp size={14} aria-hidden="true" /></button>
        </nav>
      </div>
    </footer>
  );
}
