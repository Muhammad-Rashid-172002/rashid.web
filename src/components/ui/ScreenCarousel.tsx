import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import DeviceFrame, { type DeviceKind } from './DeviceFrame';

interface Props {
  images: string[];
  title: string;
  active: number;
  onChange: (index: number) => void;
  onOpen: () => void;
  kind?: DeviceKind;
  label?: string;
  captions?: [string, string][];
}

function useIsSmall() {
  const [small, setSmall] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = () => setSmall(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return small;
}

/**
 * 3D coverflow of device mockups. Swipe/drag, arrow keys, buttons or clicking a side screen
 * moves it; clicking the centre screen opens the full-size viewer.
 */
export default function ScreenCarousel({ images, title, active, onChange, onOpen, kind, label, captions }: Props) {
  const reduce = useReducedMotion();
  const small = useIsSmall();
  const panned = useRef(false);
  const count = images.length;
  const visibleRange = small ? 1 : 3;

  const go = (i: number) => onChange((i + count) % count);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    if (e.key === 'Enter') onOpen();
  };

  return (
    <div className={`coverflow ${kind === 'browser' ? 'coverflow--browser' : ''}`} role="region" aria-roledescription="carousel" aria-label={`${title} screens`} tabIndex={0} onKeyDown={onKey}>
      {/* Ambient light: a heavily blurred copy of the active screen tints the stage. */}
      <div className="coverflow-ambient" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img key={images[active]} src={images[active]} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .8 }} />
        </AnimatePresence>
      </div>
      <div className="coverflow-glow" aria-hidden="true" />
      <motion.div
        className="coverflow-stage"
        onPanStart={() => { panned.current = true; }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -40) go(active + 1);
          else if (info.offset.x > 40) go(active - 1);
          // Let the click that ends a pan be ignored.
          setTimeout(() => { panned.current = false; }, 0);
        }}
      >
        {images.map((src, i) => {
          const offset = i - active;
          const dist = Math.abs(offset);
          const hidden = dist > visibleRange;
          const target = reduce
            ? { x: `${offset * 105}%`, opacity: dist === 0 ? 1 : hidden ? 0 : .45, scale: 1, rotateY: 0, z: 0 }
            : {
                x: `${offset * (small ? 78 : 62)}%`,
                rotateY: Math.max(-55, Math.min(55, -offset * 32)),
                scale: Math.max(.6, 1 - dist * .14),
                z: -dist * 140,
                opacity: hidden ? 0 : 1 - dist * .22,
              };
          return (
            <motion.button
              key={`${src}-${i}`}
              type="button"
              className={`coverflow-item ${offset === 0 ? 'is-active' : ''}`}
              style={{ zIndex: 100 - dist, pointerEvents: hidden ? 'none' : 'auto' }}
              initial={false}
              animate={target}
              transition={{ type: 'spring', stiffness: 170, damping: 24, mass: .9 }}
              onClick={() => { if (panned.current) return; offset === 0 ? onOpen() : go(i); }}
              aria-label={offset === 0 ? `Open screen ${i + 1} full size` : `Show screen ${i + 1}`}
              aria-hidden={hidden || undefined}
              tabIndex={offset === 0 ? 0 : -1}
              data-cursor={offset === 0 ? 'Open' : 'Drag'}
            >
              <DeviceFrame src={src} alt={`${title} screen ${i + 1}`} kind={kind} eager={dist <= 1} label={label} />
            </motion.button>
          );
        })}
      </motion.div>

      {captions?.[active] && (
        <div className="coverflow-caption" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(6px)' }} transition={{ duration: .35 }}>
              <strong>{captions[active][0]}</strong>
              <span>{captions[active][1]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="coverflow-controls">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous screen"><ChevronLeft size={18} /></button>
        <div className="coverflow-meta">
          <span className="coverflow-count" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={active} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: .25 }}>
                {String(active + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="coverflow-total">/ {String(count).padStart(2, '0')}</span>
          </span>
          <div className="coverflow-progress" aria-hidden="true">
            <motion.span animate={{ scaleX: (active + 1) / count }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
          </div>
        </div>
        <button type="button" onClick={onOpen} aria-label="Open full-size viewer"><Maximize2 size={16} /></button>
        <button type="button" onClick={() => go(active + 1)} aria-label="Next screen"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
