import Reveal from './Reveal';
import Kicker from './ui/Kicker';
import SplitWords from './ui/SplitWords';

const steps = [
  ['01', 'Discover', 'Align on the business problem, user journey, constraints and definition of success.'],
  ['02', 'Architect', 'Translate the product into flows, data models, APIs and a maintainable technical system.'],
  ['03', 'Build', 'Execute in focused milestones with production-quality engineering and clear communication.'],
  ['04', 'Ship & Evolve', 'Test, optimize, deploy and leave the product ready for the next stage of growth.'],
];

export default function Process() {
  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Reveal>
        <Kicker>Operating model</Kicker>
        <div className="section-heading-row">
          <h2 className="section-title max-w-2xl"><SplitWords text="From idea to production, without losing the product thinking." inView stagger={0.045} /></h2>
          <p className="section-side-copy">A founder-led delivery process designed to keep strategy, architecture and execution connected.</p>
        </div>
      </Reveal>
      <ol className="process-grid">
        {steps.map(([n, t, d], i) => (
          <li key={n}>
            <Reveal delay={i * .08} className="h-full">
              <div className="process-card">
                <span aria-hidden="true">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
