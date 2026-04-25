/* global React, FloorLamp */
const { useEffect, useRef, useState, useCallback } = React;

/* ============== TEXT SCRAMBLE ============== */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#________";
function useScramble(text, active) {
  const [out, setOut] = useState(text);
  const queueRef = useRef([]);
  useEffect(() => {
    if (!active) { setOut(text); return; }
    const old = typeof out === "string" ? out.replace(/<[^>]*>/g, "") : text;
    const length = Math.max(old.length, text.length);
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || "";
      const to = text[i] || "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      queueRef.current.push({ from, to, start, end, char: "" });
    }
    let frame = 0;
    let raf;
    const update = () => {
      let output = "";
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

function ScrambleText({ children, className = "", as: Tag = "span" }) {
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

/* ============== CURSOR ============== */
function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (window.innerWidth < 720) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      document.documentElement.style.setProperty("--mx", mx + "px");
      document.documentElement.style.setProperty("--my", my + "px");
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    requestAnimationFrame(tick);
    const onOver = (e) => {
      const t = e.target;
      const isHover = t.closest && (t.closest("a, button, [data-cursor='hover'], input, textarea"));
      if (ring.current) ring.current.classList.toggle("hover", !!isHover);
    };
    document.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseover", onOver); };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ============== TILT CARD ============== */
function TiltCard({ children, className = "", ...rest }) {
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
    if (ref.current) ref.current.style.transform = "perspective(1400px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
}

/* ============== REVEAL ON SCROLL ============== */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ============== PARALLAX ============== */
function useParallax() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-parallax]"));
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
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ============== NAV ============== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#home" className="nav__brand">
        <span className="nav__dot" />
        <span>Ashish Patel — Full-Stack Engineer</span>
      </a>
      <div className="nav__links">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#timeline">Experience</a>
        <a href="#skills">Skills</a>
        <a className="nav__cta" href="uploads/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
      </div>
    </nav>
  );
}

/* ============== RADIAL REVEAL THEME TOGGLE ============== */
function doRadialReveal(toTheme) {
  const mask = document.getElementById("reveal-mask");
  if (!mask) { document.documentElement.dataset.theme = toTheme; return; }
  const lamp = document.querySelector(".lamp-wrap svg");
  let cx = window.innerWidth - 100, cy = window.innerHeight - 340;
  if (lamp) {
    const r = lamp.getBoundingClientRect();
    cx = r.left + r.width * 0.55;
    cy = r.top + r.height * 0.30;
  }
  const dx = Math.max(cx, window.innerWidth - cx);
  const dy = Math.max(cy, window.innerHeight - cy);
  const radius = Math.hypot(dx, dy);
  const colorBefore = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  mask.style.display = "block";
  mask.style.background = colorBefore;
  mask.style.clipPath = `circle(${radius}px at ${cx}px ${cy}px)`;
  mask.getBoundingClientRect();
  document.documentElement.dataset.theme = toTheme;
  mask.style.transition = "clip-path 1.1s cubic-bezier(0.7, 0, 0.2, 1)";
  requestAnimationFrame(() => {
    mask.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
  });
  setTimeout(() => {
    mask.style.display = "none";
    mask.style.transition = "";
    mask.style.clipPath = "";
  }, 1200);
}

/* ============== APP ============== */
function App() {
  const [theme, setTheme] = useState("dark");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
  useReveal();
  useParallax();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const onResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
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

/* ============== HERO ============== */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__meta">
        <span className="blink" />
        <span>Portfolio v2026 — Open to roles</span>
        <span className="avail">Available June 2026</span>
      </div>

      <h1 className="hero__name">
        <span className="first">Ashish</span>
        <span className="last">Patel</span>
      </h1>

      <div className="hero__role">
        <strong>Full-Stack Engineer</strong>
        <span className="dot" />
        <span>2+ yrs · React · Next · Node · AWS</span>
        <span className="dot" />
        <span>Ahmedabad, IN — Open to remote</span>
      </div>

      <div className="hero__ctas">
        <a className="btn btn--primary" href="#work">View Work →</a>
        <a className="btn" href="uploads/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Download Résumé ↓</a>
        <a className="btn" href="#contact">Get in Touch</a>
      </div>

      <div className="scroll-cue">
        <span className="line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ============== ABOUT ============== */
function About() {
  return (
    <section className="about fade-up" id="about">
      <span className="section-label">01 — About</span>
      <div>
        <div className="eyebrow">About</div>
        <h2 className="about__title">
          Engineer who ships — from blank repo to <em style={{ color: "var(--accent)", fontStyle: "italic" }}>production</em>.
        </h2>
      </div>
      <div className="about__body">
        <p>
          I'm a <span className="hl">full-stack engineer</span> with 2+ years of experience building and shipping
          production SaaS platforms. I work across the stack — <em>React, Next.js, Node, TypeScript, AWS</em> — and
          have delivered two products end-to-end, from architecture to deployment, with real users in production.
        </p>
        <p>
          I care about the parts that don't show up in the demo: <span className="hl">queue reliability, CI/CD,
          observability, accessibility</span>, and making sure the thing still works at 2 AM. Looking for a
          <em> full-stack or backend role</em> on a team that values craft and ownership.
        </p>

        <div className="about__highlights">
          <div><strong>2+ yrs</strong><span>Production experience</span></div>
          <div><strong>2</strong><span>SaaS platforms shipped</span></div>
          <div><strong>50+</strong><span>Client deployments</span></div>
          <div><strong>8.85</strong><span>MCA · BCA CGPA</span></div>
        </div>
      </div>
    </section>
  );
}

/* ============== WORK ============== */
function Work() {
  return (
    <section className="fade-up" id="work">
      <span className="section-label">02 — Work</span>
      <div className="eyebrow">Selected Work</div>
      <h2 className="section-title">
        Two SaaS platforms, <em>built end-to-end.</em>
      </h2>

      <div className="work">
        <TiltCard className="work-card">
          <span className="work-card__num">001 / GUIDY</span>
          <div className="work-card__visual">
            <div className="viz">
              <div className="viz__overlay">
                <div className="corners"><span>✱ wcag 2.1</span><span>BRAOZA.COM</span></div>
                <div className="corners"><span>4 microservices</span><span>↗ AI</span></div>
              </div>
              <div className="viz__center">G</div>
            </div>
          </div>
          <div>
            <div className="work-card__sub">WCAG Accessibility SaaS · 2024 → Now</div>
            <h3 className="work-card__title"><ScrambleText>Guidy</ScrambleText></h3>
            <p className="work-card__desc">
              Led full-stack development of a web accessibility SaaS — embeddable widget + Next.js dashboard.
              Architected 4 microservices (dashboard, widget, scan API, BullMQ worker), patched axe-core with
              50+ custom WCAG rules, and integrated 4 AI providers for voice navigation, alt-text generation,
              and hands-free head-gesture control via MediaPipe.
            </p>
            <div className="work-card__metrics">
              <div className="work-card__metric"><strong>50+</strong><span>Client sites</span></div>
              <div className="work-card__metric"><strong>50+</strong><span>WCAG rules</span></div>
              <div className="work-card__metric"><strong>4</strong><span>AI providers</span></div>
            </div>
            <div className="work-card__stack">
              {["Next.js", "Node", "MongoDB", "Redis", "BullMQ", "AWS", "Stripe", "OpenAI", "Gemini", "Deepgram", "MediaPipe", "Puppeteer"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </TiltCard>

        <TiltCard className="work-card">
          <span className="work-card__num">002 / CUSTAMA</span>
          <div className="work-card__visual">
            <div className="viz">
              <div className="viz__overlay">
                <div className="corners"><span>✱ ai chatbot</span><span>WOKKEY</span></div>
                <div className="corners"><span>0-dep widget</span><span>↗ omni</span></div>
              </div>
              <div className="viz__center">C</div>
            </div>
          </div>
          <div>
            <div className="work-card__sub">AI Chatbot SaaS · 2024 → Now</div>
            <h3 className="work-card__title"><ScrambleText>Custama</ScrambleText></h3>
            <p className="work-card__desc">
              Built an AI chatbot platform from scratch. Engineered a zero-dependency vanilla-JS embeddable widget,
              a trigger-based workflow automation engine, knowledge-base ingestion (PDF/DOCX/sitemap → Python
              microservice), and omnichannel ticketing via Gmail OAuth + SendGrid webhooks. Full EN/JP i18n.
            </p>
            <div className="work-card__metrics">
              <div className="work-card__metric"><strong>0</strong><span>Widget deps</span></div>
              <div className="work-card__metric"><strong>EN/JP</strong><span>Localized</span></div>
              <div className="work-card__metric"><strong>2</strong><span>Repos owned</span></div>
            </div>
            <div className="work-card__stack">
              {["Node", "Express", "TypeScript", "React", "RTK Query", "MongoDB", "Socket.io", "AWS S3", "SendGrid", "Google OAuth", "LINE API", "i18next"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

/* ============== TIMELINE ============== */
function Timeline() {
  const rows = [
    {
      date: "Jul 2024 — Now",
      role: "Full-Stack Engineer",
      company: "Webosmotic Pvt Ltd",
      points: [
        "Led full-stack development of Guidy (WCAG SaaS) — widget + Next.js dashboard with Stripe, team management, EN/JA i18n; deployed to 50+ client websites.",
        "Patched axe-core with 10+ custom WCAG rules; integrated Gemini AI + Puppeteer for auto-suggested fixes on failed elements.",
        "Built an AI voice assistant (Deepgram STT, OpenAI TTS, MediaPipe gesture nav, sign-language detection, face auth).",
        "Owned AWS infra (EC2, S3, Lambda, ALB), BullMQ/Redis queues, and CI/CD via CodeDeploy; resolved 100+ QA bugs across releases.",
        "Built Custama (AI chatbot SaaS) from scratch with direct client communication."
      ],
      tags: ["React", "Next.js", "Node", "AWS", "AI"]
    },
    {
      date: "Jan 2024 — Jul 2024",
      role: "Frontend Developer Intern",
      company: "Webosmotic Pvt Ltd",
      points: [
        "Built production features for Coables (therapy booking platform) — session management, admin dashboard, therapist onboarding, VideoSDK integration, PDF notes via pdfjs.",
        "Trained in React hooks, RTK Query, Express, MongoDB; delivered training projects including a real-time social feed with infinite scroll."
      ],
      tags: ["React", "TypeScript", "Redux", "MongoDB"]
    }
  ];
  return (
    <section className="fade-up" id="timeline">
      <span className="section-label">03 — Experience</span>
      <div className="eyebrow">Experience</div>
      <h2 className="section-title">
        Where I've shipped <em>real software.</em>
      </h2>
      <div className="timeline">
        {rows.map((r, i) => (
          <div className="tl-row" key={i}>
            <div className="tl-date">{r.date}</div>
            <div>
              <div className="tl-role"><ScrambleText as="span">{r.role}</ScrambleText></div>
              <div className="tl-company">{r.company}</div>
              <ul className="tl-points">{r.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
            </div>
            <div className="tl-tags">{r.tags.map(t => <span key={t}>{t}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== SKILLS ============== */
function Skills() {
  const cats = [
    { name: "Languages", list: ["JavaScript", "TypeScript", "Python", "Go", "C++", "SQL", "Bash"] },
    { name: "Frontend", list: ["React", "Next.js", "Redux Toolkit", "RTK Query", "Vite", "Socket.io"] },
    { name: "Backend", list: ["Node.js", "Express", "REST API", "JWT", "BullMQ", "Puppeteer"] },
    { name: "Databases", list: ["MongoDB", "MySQL", "PostgreSQL", "Redis"] },
    { name: "Cloud / DevOps", list: ["AWS (EC2, S3, Lambda, ALB)", "Docker", "CodeDeploy", "CI/CD"] },
    { name: "AI / ML", list: ["OpenAI", "Gemini", "Deepgram", "MediaPipe", "Rekognition"] },
    { name: "Practices", list: ["Agile / Scrum", "Code reviews", "Client communication", "Multi-repo orchestration"] },
    { name: "Specialties", list: ["Embeddable widgets", "WCAG accessibility", "i18n (EN/JP)", "Workflow automation"] }
  ];

  const marqueeWords = ["React", "Next.js", "Node", "TypeScript", "AWS", "MongoDB", "Redis", "BullMQ", "OpenAI", "Gemini", "Puppeteer", "MediaPipe", "Stripe", "Socket.io"];
  const marqueeAlt = ["// shipping production", "// hands-free navigation", "// ai-integrated saas", "// 50+ deployments", "// the boring infra", "// 4 microservices"];

  return (
    <section className="skills-section fade-up" id="skills">
      <div className="skills-head">
        <span className="section-label">04 — Skills</span>
        <div className="eyebrow">Toolbelt</div>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          The stack I <em>ship with.</em>
        </h2>
      </div>

      <div className="marquee" data-parallax="0.05">
        <div className="marquee__track">
          {[...marqueeWords, ...marqueeWords].map((w, i) => <div key={i} className="marquee__item">{w}</div>)}
        </div>
      </div>
      <div className="marquee" data-parallax="-0.05">
        <div className="marquee__track">
          {[...marqueeAlt, ...marqueeAlt].map((w, i) => <div key={i} className="marquee__item alt">{w}</div>)}
        </div>
      </div>

      <div className="skills-grid">
        {cats.map((c) => (
          <div key={c.name} className="skill-cat">
            <h4>{c.name}</h4>
            <ul>{c.list.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== EDUCATION ============== */
function Education() {
  const items = [
    { date: "2022 — 2024", degree: "MCA — Master of Computer Applications", school: "S S Agrawal · GTU, Navsari", cgpa: "8.85" },
    { date: "2019 — 2022", degree: "BCA — Bachelor of Computer Applications", school: "S S Agrawal · VNSGU, Navsari", cgpa: "8.85" }
  ];
  return (
    <section className="fade-up" id="education">
      <span className="section-label">05 — Education</span>
      <div className="eyebrow">Education</div>
      <h2 className="section-title">
        Six years of <em>computer applications.</em>
      </h2>
      <div className="edu">
        {items.map((it, i) => (
          <div className="edu-card" key={i}>
            <div className="edu-card__date">{it.date}</div>
            <div className="edu-card__degree">{it.degree}</div>
            <div className="edu-card__school">{it.school}</div>
            <div className="edu-card__cgpa">CGPA <strong>{it.cgpa}</strong></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== CONTACT ============== */
function Contact() {
  return (
    <section className="contact fade-up" id="contact">
      <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Get in touch</div>
      <h2 className="contact__hello">
        Let's <em>work</em> together.
      </h2>
      <a className="contact__email" href="mailto:me@ashish-patel.dev" data-cursor="hover">me@ashish-patel.dev</a>
      <div className="contact__sub">Currently open to full-stack &amp; backend roles · Remote or relocation</div>
      <div className="contact__links">
        <a href="https://github.com/ashishpatel11" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://linkedin.com/in/ashishpatel05" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href="https://ashish-patel.dev" target="_blank" rel="noreferrer">ashish-patel.dev ↗</a>
        <a href="uploads/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Résumé.pdf ↗</a>
      </div>
    </section>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
