import { ArrowUpRight, Check, Github, Linkedin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { LINKS } from '../constants';
import { ease } from '../lib/motion';
import Reveal from './Reveal';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

const focus = ['Mobile product engineering', 'AI product experiences', 'SaaS & marketplace systems', 'Firebase & cloud architecture'];
const pillars = [
  ['Founder & CEO', 'Korvenza'],
  ['Product Engineering', 'Mobile · SaaS · Marketplace'],
  ['AI Systems', 'LLMs · Vision · Conversational AI'],
  ['Cloud', 'Firebase · APIs · Real-time systems'],
  ['Global Delivery', 'Remote product collaboration'],
];
const principles = [
  'Understand the business problem before choosing the technology.',
  'Build the smallest architecture that can still scale with the product.',
  'Ship with production quality — not prototype excuses.',
];

export default function About() {
  const reduce = useReducedMotion();
  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Reveal><Kicker>About the founder</Kicker></Reveal>
      <div className="about-grid">
        <Reveal>
          <h2 className="section-title"><SplitWords text="Founder mindset." inView /><br /><span className="title-muted"><SplitWords text="Engineer execution." inView delay={0.15} /></span></h2>
          <p className="section-copy mt-7">I’m Muhammad Rashid, Founder & CEO of Korvenza and a software engineer focused on turning ambitious ideas into reliable digital products. My work sits at the intersection of product thinking, technical architecture, hands-on engineering and production delivery.</p>
          <p className="section-copy mt-5">I care about what happens after the prototype — maintainable architecture, performance, user experience, deployment, and the small decisions that make a product easier to evolve.</p>
          <div className="mt-9">
            {principles.map((text, i) => (
              <div className="founder-principle" key={text}><span>0{i + 1}</span><p>{text}</p></div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={.1}>
          <aside className="founder-snapshot" aria-label="Founder snapshot">
            <div className="snapshot-head"><div><p className="eyebrow">Founder snapshot</p><h3>Muhammad Rashid</h3><p>Founder & CEO, Korvenza · Software / Product Engineer</p></div><span className="founder-badge" aria-hidden="true">MR</span></div>
            <ul className="snapshot-focus">{focus.map((item) => <li key={item} className="flex items-center gap-3"><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
            <div className="snapshot-divider" />
            <p className="eyebrow">International delivery</p>
            <div className="flex flex-wrap gap-2 mt-3">{['United States', 'United Kingdom', 'UAE', 'Malaysia'].map((x) => <span key={x} className="tag">{x}</span>)}</div>
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <a className="mini-link" href={LINKS.korvenza} target="_blank" rel="noreferrer">Visit Korvenza <ArrowUpRight size={14} /></a>
              <a className="icon-link" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
              <a className="icon-link" href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a className="icon-link" href={LINKS.fiverr} target="_blank" rel="noreferrer" aria-label="Fiverr"><span className="fiverr-mark" aria-hidden="true">fi</span></a>
            </div>
          </aside>
        </Reveal>
      </div>

      <div className="credibility-strip">
        {pillars.map(([title, copy], index) => (
          <motion.div
            key={title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .4 }}
            transition={{ duration: .6, delay: index * .07, ease }}
          >
            <span>0{index + 1}</span><strong>{title}</strong><p>{copy}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
