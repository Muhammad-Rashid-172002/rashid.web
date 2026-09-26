import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { hasFinePointer } from '../../lib/motion';

/**
 * Trailing ring + dot that grows over interactive elements and shows a label for
 * elements with data-cursor="…". The native cursor is kept. Desktop mouse only; off with reduced motion.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled] = useState(() => hasFinePointer());
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: .5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: .5 });
  const [state, setState] = useState<{ hover: boolean; label: string; visible: boolean }>({ hover: false, label: '', visible: false });

  useEffect(() => {
    if (!enabled || reduce) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest?.('a, button, [data-cursor], input, [role="button"]') as HTMLElement | null;
      const label = target?.dataset.cursor ?? '';
      setState((s) => (s.hover === !!target && s.label === label && s.visible ? s : { hover: !!target, label, visible: true }));
    };
    const onLeave = () => setState((s) => ({ ...s, visible: false }));
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, reduce, x, y]);

  if (!enabled || reduce) return null;

  const size = state.label ? 76 : state.hover ? 52 : 34;
  return (
    <>
      <motion.div
        className={`cursor-ring ${state.label ? 'cursor-ring--label' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ scale: size / 76, opacity: state.visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        aria-hidden="true"
      >
        {state.label && <span>{state.label}</span>}
      </motion.div>
      <motion.div className="cursor-dot" style={{ x, y }} animate={{ opacity: state.visible && !state.hover ? 1 : 0 }} aria-hidden="true" />
    </>
  );
}
