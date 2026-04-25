import ScrambleText from './ScrambleText';

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

export default function Timeline() {
  return (
    <section className="fade-up" id="timeline">
      <span className="section-label">03 — Experience</span>
      <div className="eyebrow">Experience</div>
      <h2 className="section-title">
        Where I&apos;ve shipped <em>real software.</em>
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
