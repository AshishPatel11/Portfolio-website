'use client';

import { useState, useEffect, useCallback } from 'react';
import CustomCursor from './CustomCursor';
import FloorLamp from './FloorLamp';
import Nav from './Nav';
import Hero from './Hero';
import About from './About';
import Work from './Work';
import Timeline from './Timeline';
import Skills from './Skills';
import Education from './Education';
import Contact from './Contact';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useParallax() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = (center - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${-offset}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

function doRadialReveal(toTheme) {
  const mask = document.getElementById('reveal-mask');
  if (!mask) { document.documentElement.dataset.theme = toTheme; return; }
  const lamp = document.querySelector('.lamp-wrap svg');
  let cx = window.innerWidth - 100, cy = window.innerHeight - 340;
  if (lamp) {
    const r = lamp.getBoundingClientRect();
    cx = r.left + r.width * 0.55;
    cy = r.top + r.height * 0.30;
  }
  const dx = Math.max(cx, window.innerWidth - cx);
  const dy = Math.max(cy, window.innerHeight - cy);
  const radius = Math.hypot(dx, dy);
  const colorBefore = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  mask.style.display = 'block';
  mask.style.background = colorBefore;
  mask.style.clipPath = `circle(${radius}px at ${cx}px ${cy}px)`;
  mask.getBoundingClientRect();
  document.documentElement.dataset.theme = toTheme;
  mask.style.transition = 'clip-path 1.1s cubic-bezier(0.7, 0, 0.2, 1)';
  requestAnimationFrame(() => {
    mask.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
  });
  setTimeout(() => {
    mask.style.display = 'none';
    mask.style.transition = '';
    mask.style.clipPath = '';
  }, 1200);
}

export default function ClientApp() {
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(false);
  useReveal();
  useParallax();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const checkMobile = () => setIsMobile(window.innerWidth < 720);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      doRadialReveal(next);
      return next;
    });
  }, []);

  return (
    <>
      <div className="grain" />
      <div className="ambient"><div className="crosses" /></div>
      <div className="spotlight" />
      <CustomCursor />
      <FloorLamp theme={theme} onToggle={toggleTheme} isMobile={isMobile} />
      <div id="reveal-mask" />

      <Nav />
      <Hero />
      <About />
      <Work />
      <Timeline />
      <Skills />
      <Education />
      <Contact />

      <footer>
        <span>© 2026 Ashish Patel — All rights reserved</span>
        <span>Built with React · No frameworks were harmed</span>
      </footer>
    </>
  );
}
