import { ArrowRight, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { LINKS } from '../constants';
import { ease } from '../lib/motion';
import { Spotlight } from './ui/Spotlight';
import SplitWords from './ui/SplitWords';
import Magnetic from './ui/Magnetic';
import TiltCard from './ui/TiltCard';
import CountUp from './ui/CountUp';

const metrics = [
  ['15+', 'Projects built'],
  ['3+', 'Years engineering'],
  ['Global', 'Client delivery'],
  ['Founder', 'Korvenza'],
];

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Gentle parallax on the portrait as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const scrollTo = (selector: string) => document.querySelector(selector)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  const reveal = (delay: number) => reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: .75, delay, ease } };

  // Soft light that follows the cursor; written to CSS vars, so no re-render.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--hx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--hy', `${e.clientY - rect.top}px`);
  };

  return (
    <section className="hero-section" ref={sectionRef} aria-labelledby="hero-title" onPointerMove={onPointerMove}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-pointer-glow" aria-hidden="true" />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="hero-layout">
          <div className="hero-content">
            <motion.div {...reveal(0.04)}>
              <div className="availability"><span className="pulse-dot" aria-hidden="true" /> Available for selected product engagements</div>
            </motion.div>
            <motion.p className="hero-kicker" {...reveal(0.12)}>Muhammad Rashid · Flutter & AI App Developer · Founder of Korvenza</motion.p>
            <h1 className="hero-title" id="hero-title">
              <SplitWords text="Building AI products and digital platforms from" accent="idea to production." delay={0.18} />
            </h1>
            <motion.p className="hero-copy" {...reveal(0.55)}>I’m Muhammad Rashid, Founder & CEO of Korvenza and a software engineer building production-ready mobile apps, AI products, SaaS platforms, marketplaces and real-time systems for startups and growing businesses.</motion.p>

            <motion.div className="hero-actions" {...reveal(0.65)}>
              <Magnetic><button onClick={() => scrollTo('#projects')} className="premium-btn">Explore selected work <ArrowRight size={17} /></button></Magnetic>
              <Magnetic><button onClick={() => scrollTo('#contact')} className="secondary-btn">Discuss a project <ArrowUpRight size={16} /></button></Magnetic>
            </motion.div>

            <motion.div className="hero-meta" {...reveal(0.75)}>
              <span>Flutter · AI · Firebase · Cloud · Product Engineering</span>
              <span className="hero-divider" aria-hidden="true" />
              <span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden="true" /> Pakistan · Working globally</span>
              <span className="hero-socials">
                <a className="icon-link" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
                <a className="icon-link" href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a className="icon-link" href={LINKS.fiverr} target="_blank" rel="noreferrer" aria-label="Fiverr"><span className="fiverr-mark" aria-hidden="true">fi</span></a>
              </span>
            </motion.div>
          </div>

          <motion.div className="founder-visual" style={reduce ? undefined : { y: portraitY }} initial={reduce ? false : { opacity: 0, scale: .96 }} animate={reduce ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .3, ease }}>
            <div className="founder-halo" aria-hidden="true" />
            {[['flutter', 'Flutter'], ['gemini', 'Gemini AI'], ['firebase', 'Firebase']].map(([logo, name], i) => (
              <motion.span
                key={name}
                className={`float-badge-wrap float-badge--${i + 1}`}
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0, scale: .6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1 + i * .15 }}
              >
                <span className="float-badge"><img src={`/logos/${logo}.svg`} alt="" width={18} height={18} />{name}</span>
              </motion.span>
            ))}
            <TiltCard className="founder-card" max={5}>
              <div className="founder-card-topline" aria-hidden="true"><span>FOUNDER / OPERATOR</span><span>KORVENZA</span></div>
              <div className="founder-photo-wrap">
                <picture>
                  <source srcSet="/rashid.webp" type="image/webp" />
                  <img src="/rashid.jpg" alt="Muhammad Rashid, Flutter & AI app developer and founder of Korvenza" width={780} height={996} fetchPriority="high" decoding="async" />
                </picture>
                <div className="founder-photo-shade" aria-hidden="true" />
                <div className="founder-photo-note"><span aria-hidden="true">01</span><p>Technical founder building products hands-on.</p></div>
              </div>
              <div className="founder-card-caption">
                <div><strong>Muhammad Rashid</strong><span>Founder & CEO · Product Engineer</span></div>
                <span className="founder-badge" aria-hidden="true">MR</span>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        <motion.dl className="metric-strip" initial={reduce ? false : { opacity: 0, y: 16 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .8, delay: .85, ease }}>
          {metrics.map(([n, l], index) => (
            <div key={l}>
              <span className="metric-index" aria-hidden="true">0{index + 1}</span>
              <dt><span>{l}</span></dt>
              <dd><strong><CountUp value={n} /></strong></dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
