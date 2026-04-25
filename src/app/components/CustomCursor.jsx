'use client';

import { useRef, useEffect } from 'react';

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (window.innerWidth < 720) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      document.documentElement.style.setProperty('--mx', mx + 'px');
      document.documentElement.style.setProperty('--my', my + 'px');
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    requestAnimationFrame(tick);
    const onOver = (e) => {
      const t = e.target;
      const isHover = t.closest && (t.closest("a, button, [data-cursor='hover'], input, textarea"));
      if (ring.current) ring.current.classList.toggle('hover', !!isHover);
    };
    document.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
