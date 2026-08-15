import { EXPERIENCES } from '../constants';
import Reveal from './Reveal';

export default function Experience() {
  return (
    <div className="container mx-auto px-5 sm:px-6">
      <div className="experience-layout">
        <Reveal className="experience-intro"><div className="section-kicker">Experience</div><h2 className="section-title">From engineering execution to founder leadership.</h2><p className="section-copy mt-6">My path has moved from hands-on mobile development into product ownership, technical architecture, international delivery and founder-led execution.</p><div className="experience-note"><span>Trajectory</span><strong>Engineering → Product → Architecture → Leadership</strong></div></Reveal>
        <div className="experience-list">
          {EXPERIENCES.map((experience, index) => (
            <Reveal key={experience.id} delay={index * .06}>
              <article className="experience-row">
                <div className="experience-number">0{index + 1}</div>
                <div><div className="experience-header"><div><h3>{experience.role}</h3><p>{experience.company}</p></div><span>{experience.period}</span></div><p className="experience-description">{experience.description}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
