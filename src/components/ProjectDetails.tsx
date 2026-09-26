import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { LINKS, PROJECTS } from '../constants';
import { ease } from '../lib/motion';
import Reveal from './Reveal';
import SplitWords from './ui/SplitWords';
import ScreenCarousel from './ui/ScreenCarousel';
import ScreenJourney from './ui/ScreenJourney';
import type { DeviceKind } from './ui/DeviceFrame';

const SITE_TITLE = document.title;
const SITE_DESCRIPTION = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

/** Per-page title/description/canonical for the SPA route; restored on leave. */
function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    const desc = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute('href');
    document.title = title;
    desc?.setAttribute('content', description);
    canonical?.setAttribute('href', `https://rashid.korvenzatech.com${path}`);
    return () => {
      document.title = SITE_TITLE;
      desc?.setAttribute('content', SITE_DESCRIPTION);
      if (prevCanonical) canonical?.setAttribute('href', prevCanonical);
    };
  }, [title, description, path]);
}

/** Cover image: clip-path "window opening" on enter, then slow zoom/parallax while scrolling past. */
function CaseCover({ src, title }: { src: string; title: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.12, 1, 1.06]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.section
      ref={ref}
      className="case-cover"
      aria-label="Product preview"
      initial={reduce ? false : { clipPath: 'inset(14% 10% 14% 10% round 2rem)', opacity: .4 }}
      whileInView={reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0% round 1.4rem)', opacity: 1 }}
      viewport={{ once: true, amount: .25 }}
      transition={{ duration: 1.2, ease }}
    >
      <div className="case-cover-label" aria-hidden="true">PRODUCT / EXPERIENCE</div>
      <motion.img src={src} alt={`${title} product preview`} fetchPriority="high" style={reduce ? undefined : { scale, y }} />
    </motion.section>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const project = PROJECTS.find((item) => item.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const images = useMemo(() => project ? (project.screenshots.length ? project.screenshots : [project.mainImage]) : [], [project]);
  const deviceKind: DeviceKind | undefined = project?.screenStyle === 'poster' ? 'poster' : project?.category === 'Web' ? 'browser' : undefined;
  const deviceLabel = project ? (project.demoUrl.startsWith('http') && !project.demoUrl.includes('play.google') ? new URL(project.demoUrl).host : project.title) : '';

  usePageMeta(
    project ? `${project.title} — Case Study · Muhammad Rashid` : 'Project not found · Muhammad Rashid',
    project?.shortDescription ?? SITE_DESCRIPTION,
    `/project/${id ?? ''}`,
  );

  const next = () => setActiveImage((v) => (v + 1) % images.length);
  const previous = () => setActiveImage((v) => (v - 1 + images.length) % images.length);
  const openViewer = (index?: number) => {
    openerRef.current = document.activeElement as HTMLElement;
    if (index !== undefined) setActiveImage(index);
    setLightbox(true);
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') previous();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const opener = openerRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus({ preventScroll: true });
    };
  }, [lightbox, images.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) {
    return (
      <div className="case-page">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="eyebrow">Case study</p>
          <h1 className="section-title mt-4">Project not found.</h1>
          <Link className="premium-btn mt-8" to="/">Back home</Link>
        </div>
      </div>
    );
  }

  const shipped = project.demoUrl !== '#';

  return (
    <div className="case-page">
      <div className="case-grid-bg" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <button onClick={() => navigate('/#projects')} className="back-link"><ArrowLeft size={16} /> Selected work</button>

        <section className="case-hero">
          <div className="max-w-5xl">
            <Reveal><div className="case-labels"><span className="case-label">Case study</span><span className="case-label">{project.label}</span><span className="case-label">Founder-led build</span></div></Reveal>
            <h1 className="case-title"><SplitWords text={project.title} stagger={.07} delay={.1} /></h1>
            <Reveal delay={.3}><p className="case-intro">{project.fullDescription}</p></Reveal>
          </div>
          <Reveal delay={.4}>
            <dl className="case-meta-grid">
              <div><dt><span>Role</span></dt><dd><strong>Product Engineer</strong></dd></div>
              <div><dt><span>Focus</span></dt><dd><strong>{project.role}</strong></dd></div>
              <div><dt><span>Core stack</span></dt><dd><strong>{project.techStack.slice(0, 3).join(' · ')}</strong></dd></div>
              <div><dt><span>Status</span></dt><dd><strong>{shipped ? 'Shipped product' : 'Product build'}</strong></dd></div>
            </dl>
          </Reveal>
        </section>

        <CaseCover src={project.mainImage} title={project.title} />

        <section className="case-gallery-section" aria-label="Product screens">
          <Reveal className="case-gallery-heading">
            <div><p className="eyebrow">Product screens</p><h2>A closer look at the experience.</h2></div>
            <div>{String(images.length).padStart(2, '0')} screens · drag, swipe or use ← →</div>
          </Reveal>
          <Reveal delay={.05}>
            <ScreenCarousel images={images} title={project.title} active={activeImage} onChange={setActiveImage} onOpen={() => openViewer()} kind={deviceKind} label={deviceLabel} captions={project.screenCaptions} />
          </Reveal>
        </section>

        <section className="case-story-grid">
          {[['01 · Challenge', 'The problem', project.problem], ['02 · Build', 'What I built', project.solution], ['03 · Outcome', 'Result', project.result]].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * .08} className="h-full"><article className={`case-story-card ${i === 2 ? 'case-story-card--accent' : ''}`}><span>{n}</span><h2>{t}</h2><p>{d}</p></article></Reveal>
          ))}
        </section>

        <section className="case-content-grid">
          <Reveal><div><p className="eyebrow">Product capabilities</p><h2 className="section-title case-capability-title">Built around the user journey, not a feature checklist.</h2><p className="section-copy mt-5">The product experience, backend behavior and technical decisions work as one system.</p></div></Reveal>
          <motion.ul
            className="feature-list"
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: .3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: .07 } } }}
          >
            {project.features.map((feature, index) => (
              <motion.li key={feature} className="feature-row" variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: .6, ease } } }}>
                <motion.span className="feature-check" aria-hidden="true" variants={{ hidden: { scale: 0, rotate: -90 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 18 } } }}><Check size={14} /></motion.span>
                <span>{feature}</span>
                <small aria-hidden="true">0{index + 1}</small>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </div>

      {images.length > 2 && <ScreenJourney images={images} title={project.title} kind={deviceKind} label={deviceLabel} captions={project.screenCaptions} onOpen={(i) => openViewer(i)} />}

      <div className="container mx-auto px-4 sm:px-6 relative">
        <Reveal><section className="case-tech-row"><div><p className="eyebrow">Technology</p><h2>Engineering stack</h2></div><ul className="flex flex-wrap gap-2 lg:justify-end">{project.techStack.map((tag) => <li key={tag} className="tag">{tag}</li>)}</ul></section></Reveal>

        <Reveal>
          <section className="case-cta">
            <div><p className="eyebrow">Have a similar product to build?</p><h2>Bring the problem. I’ll help shape the product and the system behind it.</h2></div>
            <div className="case-cta-actions">
              <a className="premium-btn" href={`mailto:${LINKS.email}?subject=Product%20Inquiry`}>Discuss a project <ArrowUpRight size={16} /></a>
              {shipped && <a className="secondary-btn" href={project.demoUrl} target="_blank" rel="noreferrer">{project.demoUrl.includes('play.google.com') ? 'Google Play' : 'Live product'} <ExternalLink size={15} /></a>}
              {project.codeUrl && project.codeUrl !== '#' && <a className="secondary-btn" href={project.codeUrl} target="_blank" rel="noreferrer">GitHub <Github size={15} /></a>}
            </div>
          </section>
        </Reveal>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} product gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .25 }}
            onClick={(e) => { if (e.target === e.currentTarget) setLightbox(false); }}
          >
            <button ref={closeRef} className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close gallery"><X size={22} /></button>
            {images.length > 1 && <button className="lightbox-nav lightbox-nav--left" onClick={previous} aria-label="Previous screen"><ChevronLeft /></button>}
            <div className="lightbox-stage">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={images[activeImage]}
                  src={images[activeImage]}
                  alt={`${project.title} screen ${activeImage + 1}`}
                  initial={reduce ? false : { opacity: 0, scale: .92, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                  transition={{ duration: .35, ease }}
                  drag={images.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={.35}
                  onDragEnd={(_, info) => { if (info.offset.x < -60) next(); else if (info.offset.x > 60) previous(); }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && <button className="lightbox-nav lightbox-nav--right" onClick={next} aria-label="Next screen"><ChevronRight /></button>}
            {images.length > 1 && (
              <div className="lightbox-thumbs">
                {images.map((image, index) => (
                  <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={activeImage === index ? 'active' : ''} aria-label={`View screen ${index + 1}`} aria-current={activeImage === index ? 'true' : undefined}>
                    <img src={image} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
            <div className="lightbox-count" aria-live="polite">
              {project.screenCaptions?.[activeImage] && <strong>{project.screenCaptions[activeImage][0]} · </strong>}
              {activeImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
