import { useState } from 'react';
import type { SyntheticEvent } from 'react';

export type DeviceKind = 'phone' | 'browser' | 'poster';

interface Props {
  src: string;
  alt: string;
  /** Force a frame; otherwise it is picked from the image's orientation once loaded. */
  kind?: DeviceKind;
  eager?: boolean;
  label?: string;
}

/** Wraps a screenshot in a phone (portrait) or browser-window (landscape) mockup; 'poster' shows a finished marketing image as a card. */
export default function DeviceFrame({ src, alt, kind: forced, eager = false, label = 'app' }: Props) {
  const [detected, setDetected] = useState<DeviceKind>('phone');
  const kind = forced ?? detected;

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (forced) return;
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setDetected(w > h ? 'browser' : 'phone');
  };

  return (
    <div className={`device device--${kind}`}>
      {kind === 'browser' && (
        <div className="device-bar" aria-hidden="true">
          <span /><span /><span />
          <div className="device-url">{label}</div>
        </div>
      )}
      <div className="device-screen">
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} onLoad={onLoad} />
      </div>
    </div>
  );
}
