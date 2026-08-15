import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';
import Reveal from './Reveal';

export default function Testimonials() {
  return (
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal><div className="section-kicker">Client perspective</div><div className="section-heading-row"><h2 className="section-title max-w-2xl">Trust earned through the work.</h2><p className="section-side-copy">Selected feedback from clients and product users. The strongest signal is consistent delivery, clear communication and production quality.</p></div></Reveal>
      <div className="testimonial-grid">
        {TESTIMONIALS.map((t,index) => <Reveal key={t.id} delay={index*.07}><article className="testimonial-card"><div className="testimonial-top"><Quote size={22}/><span>0{index+1}</span></div><p className="testimonial-quote">“{t.content}”</p><div className="testimonial-person"><div className="testimonial-avatar">{t.name.slice(0,1).toUpperCase()}</div><div><div className="font-semibold text-white">{t.name}</div><div className="text-sm text-zinc-500 mt-1">{t.role}{t.company ? ` · ${t.company}` : ''}</div></div></div></article></Reveal>)}
      </div>
    </div>
  );
}
