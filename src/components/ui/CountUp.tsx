import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

/** Counts the leading number of `value` (e.g. "15+") up from 0 when scrolled into view. Non-numeric values render as-is. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!match || !inView || reduce || !ref.current) return;
    const [, num, suffix] = match;
    const node = ref.current;
    const controls = animate(0, Number(num), {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = `${Math.round(v)}${suffix}`; },
    });
    return () => controls.stop();
  }, [inView, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  // The rendered text stays constant; the animation writes to the DOM node directly, so React never resets it.
  if (!match || reduce) return <span>{value}</span>;
  return (
    <span>
      <span ref={ref} aria-hidden="true">{`0${match[2]}`}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
