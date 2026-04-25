'use client';

import { useState, useEffect } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#home" className="nav__brand">
        <span className="nav__dot" />
        <span>Ashish Patel — Full-Stack Engineer</span>
      </a>
      <div className="nav__links">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#timeline">Experience</a>
        <a href="#skills">Skills</a>
        <a className="nav__cta" href="/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
      </div>
    </nav>
  );
}
