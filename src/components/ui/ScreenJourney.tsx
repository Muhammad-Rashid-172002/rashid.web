import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import DeviceFrame, { type DeviceKind } from './DeviceFrame';

interface Props {
  images: string[];
  title: string;
  kind?: DeviceKind;
  label?: string;
  captions?: [string, string][];
  onOpen: (index: number) => void;
}

function useDesktop() {
  const query = '(min-width: 1024px)';
  const [desktop, setDesktop] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setDesktop(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

function Item({ src, i, title, kind, label, caption, onOpen }: { src: string; i: number; title: string; kind?: DeviceKind; label?: string; caption?: [string, string]; onOpen: (i: number) => void }) {
  return (
    <button type="button" className="journey-item" onClick={() => onOpen(i)} aria-label={`Open screen ${i + 1} full size`} data-cursor="Open">
      <DeviceFrame src={src} alt={`${title} screen ${i + 1}`} kind={kind} label={label} />
      <span className="journey-caption">
        <span className="journey-index">{String(i + 1).padStart(2, '0')}</span>
        {caption && <><strong>{caption[0]}</strong><small>{caption[1]}</small></>}
      </span>
    </button>
  );
}

/**
 * Desktop: the section pins while vertical scroll drives the row of screens sideways.
 * Mobile / reduced motion: a native, swipeable scroll-snap row.
 */
export default function ScreenJourney({ images, title, kind, label, captions, onOpen }: Props) {
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const pinned = desktop && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!pinned || !trackRef.current) return;
    const track = trackRef.current;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [pinned, images.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: .0005 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  // Screens lean slightly with scroll speed, then settle.
  const velocity = useSpring(useVelocity(scrollYProgress), { stiffness: 120, damping: 30 });
  const skew = useTransform(velocity, [-1.5, 0, 1.5], [4, 0, -4], { clamp: true });

  const heading = (
    <div className="container mx-auto px-4 sm:px-6 journey-heading">
      <div><p className="eyebrow">Screen journey</p><h2>Every screen, end to end.</h2></div>
      <p>{pinned ? 'Keep scrolling to move through the product.' : 'Swipe to move through the product.'}</p>
    </div>
  );

  if (!pinned) {
    return (
      <section className="journey journey--static" aria-label={`${title} screen journey`}>
        {heading}
        <div className="journey-scroller">
          {images.map((src, i) => <Item key={`${src}-${i}`} src={src} i={i} title={title} kind={kind} label={label} caption={captions?.[i]} onOpen={onOpen} />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="journey" style={{ height: `calc(100vh + ${distance}px)` }} aria-label={`${title} screen journey`}>
      <div className="journey-sticky">
        {heading}
        <motion.div ref={trackRef} className="journey-track" style={{ x, skewX: skew }}>
          {images.map((src, i) => <Item key={`${src}-${i}`} src={src} i={i} title={title} kind={kind} label={label} caption={captions?.[i]} onOpen={onOpen} />)}
        </motion.div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="journey-progress" aria-hidden="true"><motion.span style={{ scaleX: smooth }} /></div>
        </div>
      </div>
    </section>
  );
}
