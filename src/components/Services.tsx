import { Smartphone, BrainCircuit, Layers3, CloudCog, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
const items=[
 ['Mobile Product Engineering','Production-grade iOS and Android products engineered around performance, maintainability and a polished user experience.',Smartphone,'From MVP to store release'],
 ['AI Product Integration','LLMs, multimodal AI, conversational systems and intelligent workflows integrated where they create measurable product value.',BrainCircuit,'From model to product UX'],
 ['SaaS & Marketplace Platforms','Role-based platforms, dashboards, payments, messaging and real-time marketplace flows designed as complete product systems.',Layers3,'From workflow to platform'],
 ['Firebase & Cloud Systems','Authentication, Firestore, storage, APIs, notifications and cloud infrastructure designed for reliable production delivery.',CloudCog,'From backend to scale']
];
export default function Services(){return <div className="container mx-auto px-5 sm:px-6"><Reveal><div className="section-kicker">Expertise</div><div className="section-heading-row"><h2 className="section-title max-w-2xl">Technical depth shaped around the product.</h2><p className="section-side-copy">I choose technology around the business model, user journey and expected scale — not around the trend of the month.</p></div></Reveal><div className="service-grid">{items.map(([t,d,I,foot]:any,i)=><Reveal key={t} delay={i*.06}><article className="service-card"><div className="service-top"><span className="service-icon"><I size={22}/></span><span className="service-number">0{i+1}</span></div><h3>{t}</h3><p>{d}</p><div className="service-foot"><span>{foot}</span><ArrowUpRight size={15}/></div></article></Reveal>)}</div></div>}
