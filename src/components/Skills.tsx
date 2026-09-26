import { motion, useReducedMotion } from 'motion/react';
import { ease } from '../lib/motion';
import Reveal from './Reveal';
import Marquee from './ui/Marquee';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

const groups = [
  { title: 'Core Engineering', copy: 'Cross-platform apps for Android, iOS and web from a single, well-architected Flutter codebase.', items: ['Flutter', 'Dart', 'TypeScript', 'Firebase', 'REST APIs'], variant: 'hero' },
  { title: 'AI Systems', copy: 'LLM features that earn their place in the product.', items: ['Gemini', 'LLM Integration', 'Vision AI', 'Conversational AI'], variant: '' },
  { title: 'Infrastructure', copy: 'Reliable backends and deploys.', items: ['Google Cloud', 'Firestore', 'Cloud Functions', 'Git & GitHub', 'Vercel'], variant: '' },
  { title: 'Product Systems', copy: 'The pieces that turn an app into a business.', items: ['Architecture', 'Responsive UI', 'Real-time Systems', 'Payments', 'App Deployment'], variant: 'wide' },
];

/** Logos come from svgl.app (via the 21st.dev logo search), self-hosted in /public/logos. */
type Logo = { name: string; src: string; dark?: string };
const logos: Logo[] = [
  { name: 'Flutter', src: 'flutter' },
  { name: 'Dart', src: 'dart' },
  { name: 'Firebase', src: 'firebase' },
  { name: 'Gemini', src: 'gemini' },
  { name: 'OpenAI', src: 'openai', dark: 'openai_dark' },
  { name: 'Google Cloud', src: 'google-cloud' },
  { name: 'Google Maps', src: 'googleMaps' },
  { name: 'TypeScript', src: 'typescript' },
  { name: 'Android', src: 'android-icon' },
  { name: 'GitHub', src: 'github_light', dark: 'github_dark' },
  { name: 'Vercel', src: 'vercel', dark: 'vercel_dark' },
  { name: 'Figma', src: 'figma' },
];

function LogoImg({ logo }: { logo: Logo }) {
  if (!logo.dark) return <img src={`/logos/${logo.src}.svg`} alt="" width={22} height={22} loading="lazy" />;
  return (
    <>
      <img className="only-light" src={`/logos/${logo.src}.svg`} alt="" width={22} height={22} loading="lazy" />
      <img className="only-dark" src={`/logos/${logo.dark}.svg`} alt="" width={22} height={22} loading="lazy" />
    </>
  );
}

export default function Skills() {
  const reduce = useReducedMotion();
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <Kicker>{'Skills & tech stack'}</Kicker>
          <div className="section-heading-row">
            <h2 className="section-title max-w-3xl"><SplitWords text="Tools chosen for reliability, speed and long-term product ownership." inView stagger={0.045} /></h2>
            <p className="section-side-copy">Flutter and Firebase at the core, AI where it creates real value, and cloud infrastructure that stays maintainable after launch.</p>
          </div>
        </Reveal>

        <div className="bento">
          {groups.map((g, i) => (
            <motion.article
              key={g.title}
              className={`bento-card ${g.variant ? `bento-card--${g.variant}` : ''}`}
              initial={reduce ? false : { opacity: 0, y: 24, scale: .98 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: .3 }}
              transition={{ duration: .6, delay: i * .07, ease }}
            >
              <span className="bento-index">0{i + 1}</span>
              {g.variant === 'hero' && (
                <div className="bento-logos" aria-hidden="true">
                  {logos.slice(0, 3).map((l) => <span key={l.name} className="bento-logo"><LogoImg logo={l} /></span>)}
                </div>
              )}
              <h3>{g.title}</h3>
              <p>{g.copy}</p>
              <ul className="bento-tags" aria-label={`${g.title} skills`}>{g.items.map((x) => <li className="tag" key={x}>{x}</li>)}</ul>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="logo-strip">
        <Marquee duration={45} label="Technologies I work with">
          {logos.map((l) => (
            <span key={l.name} className="logo-chip"><LogoImg logo={l} />{l.name}</span>
          ))}
        </Marquee>
      </div>
    </>
  );
}
