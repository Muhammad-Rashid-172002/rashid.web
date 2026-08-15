import Reveal from './Reveal';
const groups={
 'Core Engineering':['Flutter','Dart','TypeScript','Firebase','REST APIs'],
 'AI Systems':['Gemini','LLM Integration','Vision AI','Conversational AI'],
 'Infrastructure':['Google Cloud','Firestore','Cloud Functions','Git & GitHub','Vercel'],
 'Product Systems':['Architecture','Responsive UI','Real-time Systems','Payments','App Deployment']
};
export default function Skills(){return <div className="container mx-auto px-5 sm:px-6"><Reveal><div className="section-kicker">Technology</div><h2 className="section-title max-w-3xl mb-12">Tools chosen for reliability, speed and long-term product ownership.</h2></Reveal><div className="tech-grid">{Object.entries(groups).map(([g,items],i)=><Reveal key={g} delay={i*.05}><div className="tech-card"><span className="tech-index">0{i+1}</span><h3>{g}</h3><div className="tech-tags">{items.map(x=><span className="tag" key={x}>{x}</span>)}</div></div></Reveal>)}</div></div>}
