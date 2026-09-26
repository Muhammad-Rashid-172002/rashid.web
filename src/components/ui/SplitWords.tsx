import { motion, useReducedMotion } from 'motion/react';
import { Fragment } from 'react';
import { ease } from '../../lib/motion';

interface Props {
  text: string;
  /** Trailing words rendered with the accent gradient. */
  accent?: string;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
  delay?: number;
  stagger?: number;
}

/**
 * Masked word reveal: each word slides up from behind its own clipping line.
 * Visibility is observed on the wrapper (the words themselves start clipped, so they
 * never "intersect"), and words follow via variants.
 * Words stay real text nodes, so headings remain readable to crawlers and screen readers.
 */
export default function SplitWords({ text, accent, inView = false, delay = 0, stagger = 0.05 }: Props) {
  const reduce = useReducedMotion();
  const words = [
    ...text.split(' ').map((w) => ({ w, accent: false })),
    ...(accent ? accent.split(' ').map((w) => ({ w, accent: true })) : []),
  ];

  const render = (animated: boolean) => words.map(({ w, accent: isAccent }, i) => {
    const cls = `split-word-inner${isAccent ? ' split-word-inner--accent' : ''}`;
    return (
      <Fragment key={i}>
        <span className="split-word">
          {animated
            ? <motion.span className={cls} variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0, transition: { duration: 0.9, delay: delay + i * stagger, ease } } }}>{w}</motion.span>
            : <span className={cls}>{w}</span>}
        </span>{' '}
      </Fragment>
    );
  });

  if (reduce) return <>{render(false)}</>;

  const trigger = inView
    ? { whileInView: 'show', viewport: { once: true, amount: 0.4 } }
    : { animate: 'show' };

  return (
    <motion.span className="split-words" initial="hidden" {...trigger}>
      {render(true)}
    </motion.span>
  );
}
