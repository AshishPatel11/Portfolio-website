export default function Hero() {
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
        <a className="btn" href="/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Download Résumé ↓</a>
        <a className="btn" href="#contact">Get in Touch</a>
      </div>

      <div className="scroll-cue">
        <span className="line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
