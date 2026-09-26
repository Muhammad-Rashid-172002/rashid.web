/** Shared easing: fast start, long soft landing. */
export const ease = [0.16, 1, 0.3, 1] as const;

/** True when the device has a precise pointer that can hover (mouse / trackpad). */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
