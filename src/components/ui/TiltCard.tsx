import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { hasFinePointer } from '../../lib/motion';

interface Props {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  glare?: boolean;
}

/** 3D tilt that follows the cursor, with an optional light glare. Static on touch devices and with reduced motion. */
export default function TiltCard({ children, className = '', max = 6, glare = true }: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !hasFinePointer()) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    // Glare position is written straight to CSS vars — no React re-render per frame.
    el.style.setProperty('--gx', `${nx * 100}%`);
    el.style.setProperty('--gy', `${ny * 100}%`);
  };
  const reset = () => { px.set(0); py.set(0); };

  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
    >
      {children}
      {glare && !reduce && <span className="tilt-glare" aria-hidden="true" />}
    </motion.div>
  );
}
