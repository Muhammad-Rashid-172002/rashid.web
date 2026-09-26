import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { ease } from '../lib/motion';

const links = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Work', '#projects'],
  ['Services', '#services'],
  ['Experience', '#experience'],
  ['Reviews', '#testimonials'],
  ['Contact', '#contact'],
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const loc = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (loc.pathname !== '/') { setActive(''); return; }
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .5] });
    // Sections mount after the page transition, so observe on the next frame.
    const id = requestAnimationFrame(() => links.forEach(([, hash]) => { const el = document.querySelector(hash); if (el) observer.observe(el); }));
    return () => { cancelAnimationFrame(id); observer.disconnect(); };
  }, [loc.pathname]);

  // Mobile menu: Esc closes, focus moves in on open and back to the toggle on close, body scroll is locked.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      menuButtonRef.current?.focus();
    };
  }, [open]);

  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !menuRef.current) return;
    const items = [menuButtonRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const go = (event: MouseEvent, hash: string) => {
    event.preventDefault();
    setOpen(false);
    if (loc.pathname !== '/') { navigate('/' + hash); return; }
    document.querySelector(hash)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', hash);
  };

  return (
    <nav className={`site-nav ${scrolled || open ? 'site-nav--scrolled' : ''}`} aria-label="Primary" onKeyDown={open ? trapFocus : undefined}>
      <div className="container mx-auto px-4 sm:px-6 nav-inner">
        <Link to="/" className="brand-lockup" aria-label="Muhammad Rashid — home">
          <span className="brand-mark" aria-hidden="true">MR</span>
          <span><strong>Muhammad Rashid</strong><small>Flutter & AI Developer · Founder, Korvenza</small></span>
        </Link>

        <div className="nav-links">
          {links.map(([name, hash]) => {
            const isActive = active === hash.slice(1);
            return (
              <a key={name} href={hash} onClick={(e) => go(e, hash)} className={`nav-link ${isActive ? 'nav-link--active' : ''}`} aria-current={isActive ? 'true' : undefined}>
                {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {name}
              </a>
            );
          })}
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .25 }} className="inline-flex">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <a href="#contact" onClick={(e) => go(e, '#contact')} className="nav-cta">Hire me <ArrowUpRight size={14} /></a>
          <button ref={menuButtonRef} className="nav-icon-btn nav-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: .98, transition: { duration: .15 } }}
            transition={{ duration: .28, ease }}
          >
            {links.map(([name, hash]) => <a key={name} href={hash} onClick={(e) => go(e, hash)}>{name}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
            <a href="#contact" onClick={(e) => go(e, '#contact')} className="premium-btn mt-2 w-full">Discuss a project <ArrowUpRight size={15} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
