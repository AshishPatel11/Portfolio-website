export default function About() {
  return (
    <section className="about fade-up" id="about">
      <span className="section-label">01 — About</span>
      <div>
        <div className="eyebrow">About</div>
        <h2 className="about__title">
          Engineer who ships — from blank repo to <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>production</em>.
        </h2>
      </div>
      <div className="about__body">
        <p>
          I&apos;m a <span className="hl">full-stack engineer</span> with 2+ years of experience building and shipping
          production SaaS platforms. I work across the stack — <em>React, Next.js, Node, TypeScript, AWS</em> — and
          have delivered two products end-to-end, from architecture to deployment, with real users in production.
        </p>
        <p>
          I care about the parts that don&apos;t show up in the demo: <span className="hl">queue reliability, CI/CD,
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
