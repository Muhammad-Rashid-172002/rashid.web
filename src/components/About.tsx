import { ArrowUpRight, Check, Github, Linkedin } from 'lucide-react';
import Reveal from './Reveal';

export default function About() {
  const focus = ['Mobile product engineering', 'AI product experiences', 'SaaS & marketplace systems', 'Firebase & cloud architecture'];
  const pillars = [
    ['Founder & CEO', 'Korvenza'],
    ['Product Engineering', 'Mobile · SaaS · Marketplace'],
    ['AI Systems', 'LLMs · Vision · Conversational AI'],
    ['Cloud', 'Firebase · APIs · Real-time systems'],
    ['Global Delivery', 'Remote product collaboration'],
  ];
  return (
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal><div className="section-kicker">About the founder</div></Reveal>
      <div className="about-grid">
        <Reveal>
          <h2 className="section-title">Founder mindset.<br/><span className="title-muted">Engineer execution.</span></h2>
          <p className="section-copy mt-7">I’m Muhammad Rashid, Founder & CEO of Korvenza and a software engineer focused on turning ambitious ideas into reliable digital products. My work sits at the intersection of product thinking, technical architecture, hands-on engineering and production delivery.</p>
          <p className="section-copy mt-5">I care about what happens after the prototype — maintainable architecture, performance, user experience, deployment, and the small decisions that make a product easier to evolve.</p>
          <div className="founder-principle mt-9"><span>01</span><p>Understand the business problem before choosing the technology.</p></div>
          <div className="founder-principle"><span>02</span><p>Build the smallest architecture that can still scale with the product.</p></div>
          <div className="founder-principle"><span>03</span><p>Ship with production quality — not prototype excuses.</p></div>
        </Reveal>

        <Reveal delay={.1}>
          <aside className="founder-snapshot">
            <div className="snapshot-head"><div><p className="eyebrow">Founder snapshot</p><h3>Muhammad Rashid</h3><p>Founder & CEO, Korvenza · Software / Product Engineer</p></div><span className="founder-badge">MR</span></div>
            <div className="snapshot-focus">{focus.map((item) => <div key={item}><Check size={15} />{item}</div>)}</div>
            <div className="snapshot-divider" />
            <p className="eyebrow">International delivery</p>
            <div className="flex flex-wrap gap-2 mt-3">{['United States', 'United Kingdom', 'UAE', 'Malaysia'].map((x) => <span key={x} className="tag">{x}</span>)}</div>
            <div className="flex flex-wrap gap-3 mt-7">
              <a className="mini-link" href="https://korvenzatech.com" target="_blank" rel="noreferrer">Visit Korvenza <ArrowUpRight size={14} /></a>
              <a className="icon-link" href="https://github.com/Muhammad-Rashid-172002" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
              <a className="icon-link" href="https://www.linkedin.com/in/muhammad-rashid-flutterdev/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
            </div>
          </aside>
        </Reveal>
      </div>

      <Reveal className="credibility-strip">
        {pillars.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{copy}</p></div>)}
      </Reveal>
    </div>
  );
}
