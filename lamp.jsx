/* global React */

/**
 * Background floor lamp — sits in the corner BEHIND content.
 * Bigger, more realistic shade, nicer pull-string with bead.
 * Click/drag the string → toggles theme via radial reveal from bulb.
 */
function FloorLamp({ theme, onToggle, isMobile }) {
  const { useEffect, useRef, useState } = React;
  const [pull, setPull] = useState(0); // 0..1
  const [swingPhase, setSwingPhase] = useState(0);
  const dragging = useRef(false);
  const moved = useRef(false);
  const suppressClick = useRef(false);
  const startY = useRef(0);
  const armed = useRef(false);
  const pullRef = useRef(0);
  pullRef.current = pull;

  // Single stable RAF loop: when not dragging, decay pull toward 0.
  useEffect(() => {
    let raf;
    const tick = () => {
      if (!dragging.current) {
        const p = pullRef.current;
        if (p > 0.005) {
          const next = p * 0.86;
          pullRef.current = next < 0.005 ? 0 : next;
          setPull(pullRef.current);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // continuous gentle swing on tug — damped sine
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      setSwingPhase(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    moved.current = false;
    armed.current = false;
    startY.current = (e.touches ? e.touches[0].clientY : e.clientY);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const dy = Math.max(0, y - startY.current);
      if (dy > 3) moved.current = true;
      const p = Math.min(1, dy / 80);
      pullRef.current = p;
      setPull(p);
      if (p > 0.55) armed.current = true;
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const wasArmed = armed.current;
      const wasMoved = moved.current;
      armed.current = false;
      if (wasMoved) suppressClick.current = true;
      if (wasArmed) onToggle();
      // Settle loop will pick it up on next frame.
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [onToggle]);

  const onClick = () => {
    if (dragging.current) return;
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    pullRef.current = 1;
    setPull(1);
    setTimeout(() => onToggle(), 200);
    // settle loop will decay back automatically once dragging.current stays false
  };

  const lampOn = theme === 'dark';
  const stringExtra = pull * 44;
  // damped pendulum — swing more after a hard pull, decays naturally
  const swing = Math.sin(swingPhase * 3) * pull * 5;

  // restored width close to original; height reduced by shrinking pole
  const W = isMobile ? 220 : 340;
  const H = isMobile ? 280 : 480;
  const VBW = 360, VBH = 680;

  return (
    <>
      {/* Top-level pull-cord hit zone — sits above content so overlapping
          sections can't eat the click. Position it visually over the string. */}
      <div
        className="lamp-pull-zone"
        style={{
          right: isMobile ? 48 : 70,
          bottom: isMobile ? 95 : 155,
          width: isMobile ? 32 : 40,
          height: isMobile ? 110 : 165,
        }}
        onMouseDown={onDown}
        onTouchStart={onDown}
        onClick={onClick}
        data-cursor="hover"
        title="Pull to toggle theme"
        aria-label="Toggle dark / light mode"
      />

      <div className="lamp-wrap" aria-hidden="true">
        <div className="light-cone" style={{ opacity: lampOn ? 1 : 0 }} />

        <svg width={W} height={H} viewBox={`0 0 ${VBW} ${VBH}`}>
        <defs>
          <radialGradient id="bulbGlow" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="oklch(0.97 0.18 78)" stopOpacity="0.85" />
            <stop offset="25%" stopColor="oklch(0.85 0.17 75)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="oklch(0.80 0.15 72)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.80 0.15 72)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bulbInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8dc" stopOpacity="1" />
            <stop offset="60%" stopColor="oklch(0.92 0.18 75)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.78 0.15 70)" stopOpacity="0" />
          </radialGradient>

          {/* Pole — brushed metal */}
          <linearGradient id="poleGradOff" x1="0" x2="1">
            <stop offset="0" stopColor="#1d1a17" />
            <stop offset="0.35" stopColor="#3c3631" />
            <stop offset="0.55" stopColor="#5a514a" />
            <stop offset="0.75" stopColor="#3c3631" />
            <stop offset="1" stopColor="#1d1a17" />
          </linearGradient>
          <linearGradient id="poleGradOn" x1="0" x2="1">
            <stop offset="0" stopColor="#5a4f44" />
            <stop offset="0.35" stopColor="#8a7d6e" />
            <stop offset="0.55" stopColor="#c0b3a2" />
            <stop offset="0.75" stopColor="#8a7d6e" />
            <stop offset="1" stopColor="#5a4f44" />
          </linearGradient>

          {/* Shade exterior */}
          <linearGradient id="shadeOff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a342d" />
            <stop offset="0.5" stopColor="#231f1a" />
            <stop offset="1" stopColor="#15120f" />
          </linearGradient>
          <linearGradient id="shadeOn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.62 0.14 78)" />
            <stop offset="0.5" stopColor="oklch(0.50 0.12 72)" />
            <stop offset="1" stopColor="oklch(0.36 0.08 65)" />
          </linearGradient>

          {/* Shade interior (visible from below — warm when on) */}
          <linearGradient id="shadeInside" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.78 0.16 78)" />
            <stop offset="1" stopColor="oklch(0.96 0.18 80)" />
          </linearGradient>

          {/* Floor pool of light */}
          <radialGradient id="floorPool" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.16 75)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.85 0.16 75)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor pool when on */}
        {lampOn && (
          <ellipse cx="180" cy="660" rx="220" ry="40" fill="url(#floorPool)" />
        )}

        {/* Big halo behind shade when on — at new shade position */}
        {lampOn && (
          <>
            <circle cx="200" cy="350" r="340" fill="url(#bulbGlow)" opacity="0.35" />
            <circle cx="200" cy="350" r="190" fill="url(#bulbGlow)" opacity="0.5" />
          </>
        )}

        {/* Base */}
        <ellipse cx="180" cy="660" rx="68" ry="10" fill="#000" opacity="0.55" />
        <path d="M 118 658 Q 180 642 242 658 L 232 668 Q 180 678 128 668 Z"
              fill={lampOn ? '#5d5246' : '#241f1a'} />
        <path d="M 118 658 Q 180 644 242 658"
              stroke={lampOn ? '#7a6d5d' : '#3a3329'}
              strokeWidth="1" fill="none" />
        <rect x="170" y="630" width="20" height="32" rx="2"
              fill={lampOn ? '#7a6d5d' : '#3a3329'} />

        {/* Pole — shorter (lifted bottom from 635 to 635 still ends at base, top at 320 instead of 240) */}
        <rect x="176" y="320" width="8" height="315"
              fill={`url(#${lampOn ? 'poleGradOn' : 'poleGradOff'})`} />
        <rect x="178.5" y="320" width="1" height="315"
              fill={lampOn ? '#e8dcc8' : '#7a6d5d'} opacity="0.5" />

        {/* Top connector / bend — taller, more graceful arc */}
        <path d="M 180 320 Q 180 250 200 232"
              stroke={lampOn ? '#a0958a' : '#4a423a'}
              strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="180" cy="320" r="5"
                fill={lampOn ? '#a0958a' : '#3a3329'} />

        {/* Lamp shade — taller body (140 vs 110), positioned at the new arm tip */}
        <g transform={`translate(${200 + swing}, 232) rotate(${pull * 7 + swing * 0.5})`}>
          {/* outer shade body — taller */}
          <path d="M -68 0 L 68 0 L 96 140 L -96 140 Z"
                fill={lampOn ? 'url(#shadeOn)' : 'url(#shadeOff)'}
                stroke={lampOn ? 'oklch(0.45 0.10 70)' : '#0d0b09'}
                strokeWidth="1.5" />

          {/* inner rim glow when on — at new bottom y=140 */}
          {lampOn && (
            <>
              <ellipse cx="0" cy="140" rx="96" ry="11"
                       fill="url(#shadeInside)" />
              <ellipse cx="0" cy="140" rx="96" ry="11"
                       fill="oklch(0.97 0.18 80)" opacity="0.5" />
            </>
          )}

          {/* top cap */}
          <ellipse cx="0" cy="0" rx="68" ry="8"
                   fill={lampOn ? '#6a5e50' : '#0d0b09'} />
          <ellipse cx="0" cy="-1" rx="68" ry="6"
                   fill="none"
                   stroke={lampOn ? '#a0958a' : '#2a2520'}
                   strokeWidth="0.8" />

          {/* vertical seams — extend to new height */}
          {[-50, -25, 0, 25, 50].map((x, i) => (
            <line key={i}
                  x1={x} y1="2"
                  x2={x * 1.4} y2="138"
                  stroke={lampOn ? 'oklch(0.45 0.10 70)' : '#0a0807'}
                  strokeWidth="0.5"
                  opacity="0.45" />
          ))}

          {/* Bulb — positioned at new shade-bottom (y=120) */}
          {lampOn && (
            <>
              <circle cx="0" cy="118" r="28" fill="url(#bulbInner)" opacity="0.95" />
              <circle cx="0" cy="118" r="55" fill="url(#bulbGlow)" opacity="0.6" />
              <circle cx="0" cy="118" r="10" fill="#fff8dc" opacity="0.9" />
            </>
          )}

          {/* Pull cord — longer, hangs from shade bottom rim */}
          <g>
            <line
              x1="78" y1="138"
              x2="78" y2={220 + stringExtra}
              stroke={lampOn ? '#d8cfc4' : '#7a7068'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle
              cx="78"
              cy={232 + stringExtra}
              r="6"
              fill={lampOn ? 'oklch(0.85 0.14 75)' : '#9a9088'}
              stroke={lampOn ? 'oklch(0.55 0.12 70)' : '#3a3329'}
              strokeWidth="0.8"
            />
            <circle
              cx="76"
              cy={230 + stringExtra}
              r="2"
              fill={lampOn ? '#fff8dc' : '#c8bfb4'}
              opacity="0.8"
            />
            <rect
              x="64"
              y={138}
              width="28"
              height={108 + stringExtra}
              fill="transparent"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onMouseDown={onDown}
              onTouchStart={onDown}
              onClick={onClick}
              data-cursor="hover"
            />
          </g>
        </g>

        {/* Tooltip hint near string bead */}
        {!isMobile && (
          <g opacity={pull > 0.05 ? 0 : 0.55} style={{ transition: 'opacity 0.4s' }}>
            <text x="270" y="490"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="1.5"
                  textAnchor="end"
                  fill={lampOn ? '#a8a098' : '#777'}>
              ↓ PULL ME
            </text>
          </g>
        )}
      </svg>
    </div>
    </>
  );
}

window.FloorLamp = FloorLamp;
