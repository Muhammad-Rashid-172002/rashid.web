import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import Reveal from './Reveal';

export default function Contact() {
  return (
    <div className="container mx-auto px-5 sm:px-6">
      <Reveal>
        <div className="contact-panel">
          <div className="contact-glow" />
          <div className="contact-watermark">BUILD / SHIP / SCALE</div>
          <div className="relative contact-grid">
            <div><div className="section-kicker">Build with me</div><h2 className="contact-title">Have a product worth building?</h2><p className="section-copy mt-6 max-w-2xl">Tell me what you're building, where you are today, and what needs to happen next. I work with selected teams on product engineering, AI integration and production delivery.</p><p className="contact-trust"><span/> Available for selected product engagements.</p></div>
            <div className="contact-actions"><a href="mailto:ceo@korvenzatech.com?subject=Product%20Inquiry" className="premium-btn w-full !py-4">Discuss your product <ArrowUpRight size={17}/></a><a href="https://korvenzatech.com" target="_blank" rel="noreferrer" className="secondary-btn w-full !py-4">Visit Korvenza <ArrowUpRight size={16}/></a><a href="mailto:ceo@korvenzatech.com" className="contact-email"><Mail size={16}/> ceo@korvenzatech.com</a><div className="flex gap-2 mt-4"><a className="icon-link" href="https://github.com/Muhammad-Rashid-172002" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a><a className="icon-link" href="https://www.linkedin.com/in/muhammad-rashid-flutterdev/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a></div></div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
