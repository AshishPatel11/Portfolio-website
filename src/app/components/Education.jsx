const items = [
  { date: "2022 — 2024", degree: "MCA — Master of Computer Applications", school: "S S Agrawal · GTU, Navsari", cgpa: "8.85" },
  { date: "2019 — 2022", degree: "BCA — Bachelor of Computer Applications", school: "S S Agrawal · VNSGU, Navsari", cgpa: "8.85" }
];

export default function Education() {
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
