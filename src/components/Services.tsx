import { ArrowUpRight, BrainCircuit, CloudCog, Layers3, Smartphone, type LucideIcon } from 'lucide-react';
import type { PointerEvent } from 'react';
import Reveal from './Reveal';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

const items: [string, string, LucideIcon, string][] = [
  ['Mobile Product Engineering', 'Production-grade iOS and Android products engineered around performance, maintainability and a polished user experience.', Smartphone, 'From MVP to store release'],
  ['AI Product Integration', 'LLMs, multimodal AI, conversational systems and intelligent workflows integrated where they create measurable product value.', BrainCircuit, 'From model to product UX'],
  ['SaaS & Marketplace Platforms', 'Role-based platforms, dashboards, payments, messaging and real-time marketplace flows designed as complete product systems.', Layers3, 'From workflow to platform'],
  ['Firebase & Cloud Systems', 'Authentication, Firestore, storage, APIs, notifications and cloud infrastructure designed for reliable production delivery.', CloudCog, 'From backend to scale'],
];

/** Cursor-following glow: position goes straight into CSS vars, so there is no re-render per pointer move. */
const trackPointer = (event: PointerEvent<HTMLElement>) => {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  el.style.setProperty('--my', `${event.clientY - rect.top}px`);
};

export default function Services() {
  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Reveal>
        <Kicker>Services</Kicker>
        <div className="section-heading-row">
          <h2 className="section-title max-w-2xl"><SplitWords text="Technical depth shaped around the product." inView stagger={0.045} /></h2>
          <p className="section-side-copy">I choose technology around the business model, user journey and expected scale — not around the trend of the month.</p>
        </div>
      </Reveal>
      <div className="service-grid">
        {items.map(([title, description, Icon, foot], i) => (
          <Reveal key={title} delay={i * .06} className="h-full">
            <article className="service-card" onPointerMove={trackPointer}>
              <div className="service-top"><span className="service-icon" aria-hidden="true"><Icon size={22} /></span><span className="service-number" aria-hidden="true">0{i + 1}</span></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="service-foot"><span>{foot}</span><ArrowUpRight size={15} aria-hidden="true" /></div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
