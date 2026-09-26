import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  label?: string;
}

/**
 * Infinite CSS marquee (GPU transform only). The track is rendered twice for a seamless loop;
 * the copy is aria-hidden and removed under prefers-reduced-motion, where the strip becomes scrollable.
 * Pauses on hover and keyboard focus.
 */
export default function Marquee({ children, duration = 40, reverse = false, className = '', label }: Props) {
  return (
    <div
      className={`marquee ${reverse ? 'marquee--reverse' : ''} ${className}`}
      style={{ '--duration': `${duration}s` } as CSSProperties}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true" inert>{children}</div>
    </div>
  );
}
