import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { PROJECTS } from '../constants';
import { motion, useReducedMotion } from 'motion/react';

const meta = [
  ['AI / Consumer', 'Product Engineering · AI Integration'],
  ['Marketplace / Services', 'Product Architecture · Real-time Systems'],
  ['AI / EdTech', 'AI Integration · Mobile Engineering'],
  ['Mobile / Fitness', 'Mobile Engineering · UX'],
  ['Business / Web', 'Web Product · Responsive Engineering'],
];

export default function Projects() {
  const reduce = useReducedMotion();
  return (
    <div className="container mx-auto px-5 sm:px-6">
      <div className="section-kicker">Selected work</div>
      <div className="section-heading-row">
        <h2 className="section-title max-w-3xl">Products built around real business and user problems.</h2>
        <p className="section-side-copy">Selected work across consumer AI, marketplaces, EdTech, fitness and business platforms — from architecture to production delivery.</p>
      </div>

      <div className="project-stack">
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.id}
            className="project-showcase group"
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .14 }}
            transition={{ duration: .72, delay: Math.min(index * .06, .22), ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="project-media">
              <div className="project-media-label">CASE / 0{index + 1}</div>
              <img src={project.mainImage} alt={`${project.title} product preview`} loading={index > 1 ? 'lazy' : 'eager'} />
              <div className="project-media-glow" />
            </div>
            <div className="project-copy">
              <div>
                <div className="project-meta-line"><p className="project-category">{meta[index]?.[0] || 'Product engineering'}</p><span>{meta[index]?.[1] || 'Product Engineering'}</span></div>
                <h3>{project.title}</h3>
                <p className="project-description">{project.shortDescription}</p>
                <div className="project-role"><span>My role</span><strong>{meta[index]?.[1] || 'Product Engineering'}</strong></div>
                <div className="flex flex-wrap gap-2 mt-6">{project.techStack.slice(0, 5).map((tech) => <span key={tech} className="tag">{tech}</span>)}</div>
              </div>
              <div className="project-actions">
                <Link to={`/project/${project.id}`} className="project-case-link">View case study <ArrowUpRight size={16} /></Link>
                {project.demoUrl !== '#' && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-live-link">Live product <ExternalLink size={14} /></a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
