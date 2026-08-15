import { ArrowRight, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { MouseEvent } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;
const metrics = [
  ['15+', 'Projects built'],
  ['3+', 'Years engineering'],
  ['Global', 'Client delivery'],
  ['Founder', 'Korvenza'],
];

export default function Hero() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 110, damping: 20, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 110, damping: 20, mass: 0.7 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-2.6, 2.6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [2.2, -2.2]);

  const scrollTo = (selector: string) => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };
  const reveal = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: .75, delay, ease } };

  return (
    <section className="hero-section">
      <div className="hero-grid absolute inset-0 -z-10" />
      <motion.div className="hero-orb hero-orb-one" animate={reduce ? undefined : { x: [0, 36, 0], y: [0, -24, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="hero-orb hero-orb-two" animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 28, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="container mx-auto px-5 sm:px-6">
        <div className="hero-layout">
          <div className="hero-content">
            <motion.div {...reveal(0.04)}>
              <div className="availability"><span /> Available for selected product engagements</div>
            </motion.div>
            <motion.p className="hero-kicker" {...reveal(0.12)}>Muhammad Rashid · Founder & CEO of Korvenza</motion.p>
            <motion.h1 className="hero-title" {...reveal(0.2)}>Building AI products and digital platforms from <span>idea to production.</span></motion.h1>
            <motion.p className="hero-copy" {...reveal(0.28)}>I’m Muhammad Rashid, Founder & CEO of Korvenza and a software engineer building production-ready mobile apps, AI products, SaaS platforms, marketplaces and real-time systems for startups and growing businesses.</motion.p>

            <motion.div className="hero-actions" {...reveal(0.36)}>
              <button onClick={() => scrollTo('#projects')} className="premium-btn">Explore selected work <ArrowRight size={17} /></button>
              <button onClick={() => scrollTo('#contact')} className="secondary-btn">Discuss a project <ArrowUpRight size={16} /></button>
            </motion.div>

            <motion.div className="hero-meta" {...reveal(0.43)}>
              <span>Flutter · AI · Firebase · Cloud · Product Engineering</span>
              <span className="hero-divider" />
              <span className="inline-flex items-center gap-2"><MapPin size={14} /> Pakistan · Working globally</span>
              <a href="https://github.com/Muhammad-Rashid-172002" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>
              <a href="https://www.linkedin.com/in/muhammad-rashid-flutterdev/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
            </motion.div>
          </div>

          <motion.div className="founder-visual" {...reveal(0.34)} onMouseMove={onMove} onMouseLeave={reset} style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}>
            <div className="founder-halo" />
            <div className="founder-card">
              <div className="founder-card-topline"><span>FOUNDER / OPERATOR</span><span>KORVENZA</span></div>
              <div className="founder-photo-wrap">
                <img src="/rashid.jpg" alt="Muhammad Rashid, Founder and CEO of Korvenza" fetchPriority="high" />
                <div className="founder-photo-shade" />
                <div className="founder-photo-note"><span>01</span><p>Technical founder building products hands-on.</p></div>
              </div>
              <div className="founder-card-caption">
                <div><strong>Muhammad Rashid</strong><span>Founder & CEO · Product Engineer</span></div>
                <span className="founder-badge">MR</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="metric-strip" initial={reduce ? false : { opacity: 0, y: 16 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .8, delay: .54, ease }}>
          {metrics.map(([n, l], index) => (
            <div key={l}><span className="metric-index">0{index + 1}</span><strong>{n}</strong><span>{l}</span></div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
