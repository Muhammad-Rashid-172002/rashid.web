import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface Props { isDarkMode: boolean; toggleTheme: () => void }

export default function Navbar(_: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('projects');
  const loc = useLocation();
  const links = [['Work', '#projects'], ['Expertise', '#services'], ['About', '#about'], ['Experience', '#experience'], ['Testimonials', '#testimonials'], ['Contact', '#contact']];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (loc.pathname !== '/') return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .2, .5] });
    links.forEach(([, hash]) => { const el = document.querySelector(hash); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [loc.pathname]);

  const go = (hash: string) => {
    setOpen(false);
    if (loc.pathname !== '/') { window.location.assign('/' + hash); return; }
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <div className="container mx-auto px-5 sm:px-6 nav-inner">
        <Link to="/" className="brand-lockup" aria-label="Muhammad Rashid home">
          <span className="brand-mark">MR</span>
          <span><strong>Muhammad Rashid</strong><small>Founder & CEO · Korvenza</small></span>
        </Link>
        <div className="hidden xl:flex items-center gap-6">
          {links.map(([name, hash]) => <button key={name} onClick={() => go(hash)} className={`nav-link ${active === hash.slice(1) ? 'nav-link--active' : ''}`}>{name}</button>)}
          <button onClick={() => go('#contact')} className="nav-cta">Discuss a project <ArrowUpRight size={14} /></button>
        </div>
        <button className="xl:hidden nav-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && (
        <div className="mobile-menu xl:hidden">
          {links.map(([name, hash]) => <button key={name} onClick={() => go(hash)}>{name}<span>↗</span></button>)}
          <button onClick={() => go('#contact')} className="premium-btn mt-2 w-full">Discuss a project <ArrowUpRight size={15} /></button>
        </div>
      )}
    </nav>
  );
}
