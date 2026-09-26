import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { ease } from '../lib/motion';
import Reveal from './Reveal';
import TiltCard from './ui/TiltCard';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

const filters = ['All', 'AI', 'Mobile', 'Web'] as const;
type Filter = (typeof filters)[number];

const isPlayStore = (url: string) => url.includes('play.google.com');

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#34A853" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1Z" />
      <path fill="#FBBC04" d="m17.1 8.7-3.3 3.3 3.3 3.3 3.7-2.1c1-.6 1-1.9 0-2.5l-3.7-2Z" />
      <path fill="#4285F4" d="M13.8 12 3.6 22.2c.4.2.9.2 1.3 0l12.2-6.9-3.3-3.3Z" />
      <path fill="#EA4335" d="M13.8 12 17.1 8.7 4.9 1.8c-.4-.2-.9-.2-1.3 0L13.8 12Z" />
    </svg>
  );
}

/** Media panel: opens like a window on enter, and the product image drifts against the scroll. */
function ProjectMedia({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [.92, 1, .96]);

  return (
    <motion.div
      ref={ref}
      className="project-media"
      initial={reduce ? false : { clipPath: 'inset(8% 8% 8% 8% round 1.2rem)' }}
      whileInView={reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0% round 0rem)' }}
      viewport={{ once: true, amount: .3 }}
      transition={{ duration: 1.1, ease }}
      data-cursor="View"
    >
      <div className="project-media-label" aria-hidden="true">CASE / 0{index + 1}</div>
      <motion.div className="project-media-inner" style={reduce ? undefined : { y, scale }}>
        <TiltCard max={7} glare={false}>
          <img src={project.mainImage} alt={`${project.title} product preview`} loading={index > 0 ? 'lazy' : 'eager'} decoding="async" />
        </TiltCard>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasDemo = project.demoUrl && project.demoUrl !== '#';
  return (
    <>
      <Link to={`/project/${project.id}`} className="contents" tabIndex={-1} aria-hidden="true"><ProjectMedia project={project} index={index} /></Link>
      <div className="project-copy">
        <div>
          <div className="project-meta-line"><p className="project-category">{project.label}</p><span>{project.techStack.slice(0, 2).join(' · ')}</span></div>
          <h3>{project.title}</h3>
          <p className="project-description">{project.shortDescription}</p>
          <div className="project-role"><span>My role</span><strong>{project.role}</strong></div>
          <ul className="flex flex-wrap gap-2 mt-6" aria-label="Tech stack">{project.techStack.slice(0, 5).map((tech) => <li key={tech} className="tag">{tech}</li>)}</ul>
        </div>
        <div className="project-actions">
          <Link to={`/project/${project.id}`} className="project-case-link">View case study <ArrowUpRight size={16} /><span className="sr-only">: {project.title}</span></Link>
          {hasDemo && isPlayStore(project.demoUrl) && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="play-badge" aria-label={`${project.title} on Google Play`}>
              <PlayIcon /><span><small>Get it on</small><strong>Google Play</strong></span>
            </a>
          )}
          {hasDemo && !isPlayStore(project.demoUrl) && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-live-link">Live product <ExternalLink size={14} /></a>}
          {project.codeUrl && project.codeUrl !== '#' && <a href={project.codeUrl} target="_blank" rel="noreferrer" className="project-live-link"><Github size={15} /> Source</a>}
        </div>
      </div>
    </>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');
  const visible = PROJECTS.filter((p) => filter === 'All' || p.category === filter);
  const count = (f: Filter) => f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Reveal>
        <Kicker>Selected work</Kicker>
        <div className="section-heading-row">
          <h2 className="section-title max-w-3xl"><SplitWords text="Products built around real business and user problems." inView stagger={0.045} /></h2>
          <p className="section-side-copy">Selected work across consumer AI, marketplaces, EdTech, fitness and business platforms — from architecture to production delivery.</p>
        </div>
      </Reveal>

      <div className="project-filter" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>
            {filter === f && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span>{f}<small>{count(f)}</small></span>
          </button>
        ))}
      </div>

      <LayoutGroup>
        <motion.div className="project-stack" layout={!reduce}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.article
                key={project.id}
                layout={!reduce}
                className="project-showcase"
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: .97, transition: { duration: .2 } }}
                viewport={{ once: true, amount: .12 }}
                transition={{ duration: .7, ease }}
              >
                <ProjectCard project={project} index={PROJECTS.indexOf(project)} />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
