import { motion, useReducedMotion } from 'motion/react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import Marquee from './ui/Marquee';
import SplitWords from './ui/SplitWords';
import Kicker from './ui/Kicker';

/**
 * Layout adapted from 21st.dev "Testimonials Marquee" (scrollxui): word-reveal heading
 * over an infinite, hover-pausable marquee of cards.
 */
export default function Testimonials() {
  const reduce = useReducedMotion();
  // Repeat the set so one marquee track is always wider than the viewport.
  const cards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6">
        <Kicker>Client perspective</Kicker>
        <div className="section-heading-row">
          <h2 className="section-title max-w-2xl"><SplitWords text="Trust earned through the work." inView stagger={0.07} /></h2>
          <motion.p
            className="section-side-copy"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: .5, delay: .4 }}
          >
            Selected feedback from clients and product users. The strongest signal is consistent delivery, clear communication and production quality.
          </motion.p>
        </div>
      </div>

      <Marquee duration={55} label="Client testimonials">
        {cards.map((t, index) => (
          <figure className="testimonial-card" key={`${t.id}-${index}`} aria-hidden={index >= TESTIMONIALS.length || undefined}>
            <div className="testimonial-top"><Quote size={22} aria-hidden="true" /><span>{t.company}</span></div>
            <blockquote className="testimonial-quote">“{t.content}”</blockquote>
            <figcaption className="testimonial-person">
              <span className="testimonial-avatar" aria-hidden="true">{t.name.slice(0, 1).toUpperCase()}</span>
              <span><strong>{t.name}</strong><small>{t.role}{t.company ? ` · ${t.company}` : ''}</small></span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </>
  );
}
