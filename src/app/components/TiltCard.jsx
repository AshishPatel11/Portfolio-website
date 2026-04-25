'use client';

import { useRef } from 'react';

export default function TiltCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (window.innerWidth < 720) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${-y * 4.5}deg) rotateY(${x * 4.5}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1400px) rotateX(0) rotateY(0)';
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
}
