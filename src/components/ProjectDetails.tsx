import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import Reveal from './Reveal';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find((item) => item.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = useMemo(() => project ? (project.screenshots.length ? project.screenshots : [project.mainImage]) : [], [project]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false); if (e.key === 'ArrowRight') setActiveImage((v) => (v + 1) % images.length); if (e.key === 'ArrowLeft') setActiveImage((v) => (v - 1 + images.length) % images.length); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!project) return <main className="min-h-screen pt-36 pb-20"><div className="container mx-auto px-5 sm:px-6"><p className="eyebrow">Case study</p><h1 className="section-title mt-4">Project not found.</h1><Link className="premium-btn mt-8" to="/">Back home</Link></div></main>;

  const next = () => setActiveImage((v) => (v + 1) % images.length);
  const previous = () => setActiveImage((v) => (v - 1 + images.length) % images.length);
  const shipped = project.demoUrl !== '#';

  return (
    <main className="case-page">
      <div className="case-grid-bg" />
      <div className="container mx-auto px-5 sm:px-6 relative">
        <button onClick={() => navigate('/#projects')} className="back-link"><ArrowLeft size={16}/> Selected work</button>

        <section className="case-hero">
          <Reveal className="max-w-5xl">
            <div className="case-labels"><span className="case-label">Case study</span><span className="case-label">Product engineering</span><span className="case-label">Founder-led build</span></div>
            <h1 className="case-title">{project.title}</h1>
            <p className="case-intro">{project.fullDescription}</p>
          </Reveal>
          <Reveal className="case-meta-grid" delay={.08}>
            <div><span>Role</span><strong>Product Engineer</strong></div>
            <div><span>Focus</span><strong>Product · Mobile · AI</strong></div>
            <div><span>Core stack</span><strong>{project.techStack.slice(0,3).join(' · ')}</strong></div>
            <div><span>Status</span><strong>{shipped ? 'Shipped product' : 'Product build'}</strong></div>
          </Reveal>
        </section>

        <Reveal><section className="case-cover"><div className="case-cover-label">PRODUCT / EXPERIENCE</div><img src={project.mainImage} alt={`${project.title} product preview`}/></section></Reveal>

        <section className="case-story-grid">
          {[['01 · Challenge','The problem',project.problem],['02 · Build','What I built',project.solution],['03 · Outcome','Result',project.result]].map(([n,t,d],i)=><Reveal key={n} delay={i*.06}><article className={`case-story-card ${i===2?'case-story-card--accent':''}`}><span>{n}</span><h2>{t}</h2><p>{d}</p></article></Reveal>)}
        </section>

        <section className="case-content-grid">
          <Reveal><div><p className="eyebrow">Product capabilities</p><h2 className="section-title case-capability-title">Built around the user journey, not a feature checklist.</h2><p className="section-copy mt-5">The product experience, backend behavior and technical decisions work as one system.</p></div></Reveal>
          <Reveal delay={.08}><div className="feature-list">{project.features.map((feature,index)=><div key={feature} className="feature-row"><span className="feature-check"><Check size={14}/></span><span>{feature}</span><small>0{index+1}</small></div>)}</div></Reveal>
        </section>

        <section className="case-gallery-section">
          <Reveal className="case-gallery-heading"><div><p className="eyebrow">Product screens</p><h2>A closer look at the experience.</h2></div><div>{String(images.length).padStart(2,'0')} screens</div></Reveal>
          <Reveal delay={.05}><button className="gallery-featured" onClick={() => setLightbox(true)} aria-label="Open product screen"><img src={images[activeImage]} alt={`${project.title} screen ${activeImage+1}`}/><span>Open screen <ArrowUpRight size={14}/></span></button></Reveal>
          {images.length>1 && <div className="gallery-controls"><button onClick={previous} aria-label="Previous screen"><ChevronLeft size={18}/></button><div className="gallery-thumbs">{images.map((image,index)=><button key={`${image}-${index}`} onClick={()=>setActiveImage(index)} className={activeImage===index?'active':''} aria-label={`View screen ${index+1}`}><img src={image} alt="" loading="lazy"/></button>)}</div><button onClick={next} aria-label="Next screen"><ChevronRight size={18}/></button></div>}
        </section>

        <Reveal><section className="case-tech-row"><div><p className="eyebrow">Technology</p><h2>Engineering stack</h2></div><div className="flex flex-wrap gap-2 lg:justify-end">{project.techStack.map(tag=><span key={tag} className="tag">{tag}</span>)}</div></section></Reveal>

        <Reveal><section className="case-cta"><div><p className="eyebrow">Have a similar product to build?</p><h2>Bring the problem. I’ll help shape the product and the system behind it.</h2></div><div className="case-cta-actions"><a className="premium-btn" href="mailto:ceo@korvenzatech.com?subject=Product%20Inquiry">Discuss a project <ArrowUpRight size={16}/></a>{shipped&&<a className="secondary-btn" href={project.demoUrl} target="_blank" rel="noreferrer">Live product <ExternalLink size={15}/></a>}{project.codeUrl&&project.codeUrl!=='#'&&<a className="secondary-btn" href={project.codeUrl} target="_blank" rel="noreferrer">GitHub <Github size={15}/></a>}</div></section></Reveal>
      </div>

      {lightbox&&<div className="lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} product gallery`}><button className="lightbox-close" onClick={()=>setLightbox(false)} aria-label="Close"><X size={22}/></button><button className="lightbox-nav lightbox-nav--left" onClick={previous} aria-label="Previous"><ChevronLeft/></button><img src={images[activeImage]} alt={`${project.title} screen ${activeImage+1}`}/><button className="lightbox-nav lightbox-nav--right" onClick={next} aria-label="Next"><ChevronRight/></button></div>}
    </main>
  );
}
