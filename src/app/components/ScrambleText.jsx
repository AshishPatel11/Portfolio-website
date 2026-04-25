'use client';

import { useState, useEffect, useRef } from 'react';

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#________";

function useScramble(text, active) {
  const [out, setOut] = useState(text);
  const queueRef = useRef([]);
  useEffect(() => {
    if (!active) { setOut(text); return; }
    const old = typeof out === 'string' ? out.replace(/<[^>]*>/g, '') : text;
    const length = Math.max(old.length, text.length);
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      queueRef.current.push({ from, to, start, end, char: '' });
    }
    let frame = 0;
    let raf;
    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < queueRef.current.length; i++) {
        const q = queueRef.current[i];
        if (frame >= q.end) { complete++; output += q.to; }
        else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          output += `<span style="color:var(--accent)">${q.char}</span>`;
        } else { output += q.from; }
      }
      setOut(output);
      if (complete < queueRef.current.length) {
        frame++;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [active, text]);
  return out;
}

export default function ScrambleText({ children, className = '', as: Tag = 'span' }) {
  const [active, setActive] = useState(false);
  const out = useScramble(children, active);
  return (
    <Tag
      className={`scramble ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      dangerouslySetInnerHTML={{ __html: out }}
      data-cursor="hover"
    />
  );
}
