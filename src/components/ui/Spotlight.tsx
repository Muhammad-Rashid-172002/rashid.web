import { useId } from 'react';

/**
 * Spotlight beam — adapted from 21st.dev "Spotlight" (manuarora700 / Aceternity).
 * Colour and opacity come from the --spot / --spot-opacity theme tokens (see index.css),
 * and the entry animation is disabled under prefers-reduced-motion.
 */
export function Spotlight({ className = '' }: { className?: string }) {
  const filterId = `spotlight-${useId().replace(/:/g, '')}`;
  return (
    <svg className={`spotlight ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none" aria-hidden="true">
      <g filter={`url(#${filterId})`}>
        <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" />
      </g>
      <defs>
        <filter id={filterId} x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}
