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

export default function Skills() {
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
