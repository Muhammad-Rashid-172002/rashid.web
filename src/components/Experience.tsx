import { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { EXPERIENCES } from '../constants';
import Reveal from './Reveal';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

export default function Experience() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  // The accent rail "draws" down the timeline as it scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="experience-layout">
        <Reveal className="experience-intro">
          <Kicker>Experience</Kicker>
          <h2 className="section-title"><SplitWords text="From engineering execution to founder leadership." inView stagger={0.045} /></h2>
          <p className="section-copy mt-6">My path has moved from hands-on mobile development into product ownership, technical architecture, international delivery and founder-led execution.</p>
          <div className="experience-note"><span>Trajectory</span><strong>Engineering → Product → Architecture → Leadership</strong></div>
        </Reveal>
        <ol className="timeline" ref={listRef}>
          <span className="timeline-rail" aria-hidden="true" />
          <motion.span className="timeline-fill" aria-hidden="true" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
          {EXPERIENCES.map((experience, index) => (
            <li key={experience.id} className="experience-row">
              <Reveal delay={index * .06}>
                <span className="experience-dot" aria-hidden="true" />
                <div className="experience-header">
                  <div><h3>{experience.role}</h3><p>{experience.company}</p></div>
                  <span>{experience.period}</span>
                </div>
                <p className="experience-description">{experience.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
