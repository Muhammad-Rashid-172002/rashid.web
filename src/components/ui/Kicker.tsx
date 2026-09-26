import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/&#*';

/**
 * Section label with a one-time "decode" scramble when it scrolls into view.
 * The animated text is aria-hidden; screen readers get the real label.
 */
export default function Kicker({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 1 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const node = ref.current;
    const target = children;
    const duration = 700; // ms
    const step = 32; // ~30fps keeps it readable and cheap
    let start = 0;
    let last = 0;
    let raf = 0;
    const loop = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      if (t - last >= step || progress === 1) {
        last = t;
        const revealed = Math.floor(progress * target.length);
        node.textContent = target
          .split('')
          .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
      }
      if (progress < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); node.textContent = target; };
  }, [inView, reduce, children]);

  return (
    <div className="section-kicker">
      <span ref={ref} aria-hidden="true">{children}</span>
      <span className="sr-only">{children}</span>
    </div>
  );
}
