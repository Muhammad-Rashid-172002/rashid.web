/**
 * Animated AI "orb": a swirling conic gradient with a glassy highlight. Pure CSS (see .ai-orb in index.css),
 * so it costs nothing in JS. `thinking` spins it faster and makes it pulse.
 */
export default function AiOrb({ size = 32, thinking = false, className = '' }: { size?: number; thinking?: boolean; className?: string }) {
  return (
    <span
      className={`ai-orb ${thinking ? 'ai-orb--thinking' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="ai-orb-core" />
    </span>
  );
}
