export default function Contact() {
  return (
    <section className="contact fade-up" id="contact">
      <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Get in touch</div>
      <h2 className="contact__hello">
        Let&apos;s <em>work</em> together.
      </h2>
      <a className="contact__email" href="mailto:me@ashish-patel.dev" data-cursor="hover">me@ashish-patel.dev</a>
      <div className="contact__sub">Currently open to full-stack &amp; backend roles · Remote or relocation</div>
      <div className="contact__links">
        <a href="https://github.com/ashishpatel11" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://linkedin.com/in/ashishpatel05" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href="https://ashish-patel.dev" target="_blank" rel="noreferrer">ashish-patel.dev ↗</a>
        <a href="/ashish-patel-resume-v1.pdf" target="_blank" rel="noreferrer">Résumé.pdf ↗</a>
      </div>
    </section>
  );
}
