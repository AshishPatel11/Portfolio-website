import TiltCard from './TiltCard';
import ScrambleText from './ScrambleText';

export default function Work() {
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
