/**
 * content.js — all CV data in one place.
 * Edit this file to personalise the experience.
 */

export const OWNER = {
  name:    'Priya Sharma',
  tagline: 'Building Logic into Reality',
  email:   'priya.sharma@email.com',
  github:  'github.com/priya-sharma',
  linkedin:'linkedin.com/in/priya-sharma',
};

// Zone definitions — position, color, label
export const ZONES = {
  about:    { pos: [-22,  0, -10], color: 0x00f0ff, hex: '#00f0ff', label: 'About Me',         emoji: '🧑‍💻' },
  skills:   { pos: [ 22,  0, -10], color: 0xa855f7, hex: '#a855f7', label: 'Skills Lab',        emoji: '🧠' },
  projects: { pos: [  0,  0, -28], color: 0xf0a500, hex: '#f0a500', label: 'Project Arena',     emoji: '🛠' },
  library:  { pos: [-22,  0,  12], color: 0x39ff14, hex: '#39ff14', label: 'Knowledge Library', emoji: '📚' },
  contact:  { pos: [ 22,  0,  12], color: 0xff3a5c, hex: '#ff3a5c', label: 'Contact Hub',       emoji: '📞' },
};

export const GUIDE_TOUR = ['about', 'skills', 'projects', 'library', 'contact'];

// ── Panel HTML content ──────────────────────────────────────
export const PANELS = {

  about: `
    <span class="p-icon">🧑‍💻</span>
    <h2 class="p-title">ABOUT ME</h2>
    <p class="p-code">// who_am_i.json</p>
    <section class="p-section">
      <h3 class="p-sh">IDENTITY</h3>
      <p class="p-text">Hi! I'm <strong style="color:var(--c-cyan)">Priya Sharma</strong>, a final-year CSE student passionate about building systems that blur the line between digital and physical.</p>
    </section>
    <section class="p-section">
      <h3 class="p-sh">QUICK STATS</h3>
      <div class="stat-grid">
        <div class="stat-box"><b class="stat-val">3.9</b><span class="stat-lbl">CGPA</span></div>
        <div class="stat-box"><b class="stat-val">12+</b><span class="stat-lbl">Projects</span></div>
        <div class="stat-box"><b class="stat-val">5+</b><span class="stat-lbl">Hackathons</span></div>
        <div class="stat-box"><b class="stat-val">2</b><span class="stat-lbl">Papers</span></div>
      </div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">EDUCATION</h3>
      <div class="timeline">
        <div class="tl-item"><span class="tl-dot"></span>
          <p class="tl-yr">2021 – Present</p>
          <p class="tl-title">B.Tech — Computer Science</p>
          <p class="tl-sub">XYZ Institute of Technology · 3.9/4.0</p>
        </div>
        <div class="tl-item"><span class="tl-dot"></span>
          <p class="tl-yr">2019 – 2021</p>
          <p class="tl-title">Higher Secondary (PCM + CS)</p>
          <p class="tl-sub">ABC School · 96.4%</p>
        </div>
      </div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">INTERESTS</h3>
      <div class="tag-cloud">
        <span class="tag tc">IoT Systems</span><span class="tag tp">Web Dev</span>
        <span class="tag tg">System Design</span><span class="tag te">Open Source</span>
        <span class="tag tc">Robotics</span><span class="tag tp">3D Graphics</span>
      </div>
    </section>`,

  skills: `
    <span class="p-icon">🧠</span>
    <h2 class="p-title">SKILLS LAB</h2>
    <p class="p-code">// proficiency_matrix.dat</p>
    <section class="p-section">
      <h3 class="p-sh">CORE LANGUAGES</h3>
      <div class="orb-grid">
        <div class="orb oc"><span class="orb-ico">⚙️</span><span class="orb-lbl">C++</span></div>
        <div class="orb op"><span class="orb-ico">🐍</span><span class="orb-lbl">Python</span></div>
        <div class="orb og"><span class="orb-ico">☕</span><span class="orb-lbl">Java</span></div>
        <div class="orb oe"><span class="orb-ico">🌐</span><span class="orb-lbl">JS</span></div>
        <div class="orb oc"><span class="orb-ico">🔷</span><span class="orb-lbl">TypeScript</span></div>
        <div class="orb op"><span class="orb-ico">🗄️</span><span class="orb-lbl">SQL</span></div>
      </div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">PROFICIENCY</h3>
      <div class="skill-item"><div class="skill-hd"><span>C++ / OOP / STL</span><span class="spct">92%</span></div><div class="sbar"><div class="sfill" data-w="92" style="background:linear-gradient(90deg,#00f0ff,#0080a0)"></div></div></div>
      <div class="skill-item"><div class="skill-hd"><span>Python / Data Science</span><span class="spct">87%</span></div><div class="sbar"><div class="sfill" data-w="87" style="background:linear-gradient(90deg,#a855f7,#6020a0)"></div></div></div>
      <div class="skill-item"><div class="skill-hd"><span>React + Node.js</span><span class="spct">82%</span></div><div class="sbar"><div class="sfill" data-w="82" style="background:linear-gradient(90deg,#f0a500,#a07000)"></div></div></div>
      <div class="skill-item"><div class="skill-hd"><span>IoT / Embedded C</span><span class="spct">78%</span></div><div class="sbar"><div class="sfill" data-w="78" style="background:linear-gradient(90deg,#39ff14,#1a8000)"></div></div></div>
      <div class="skill-item"><div class="skill-hd"><span>System Design</span><span class="spct">75%</span></div><div class="sbar"><div class="sfill" data-w="75" style="background:linear-gradient(90deg,#00f0ff,#0080a0)"></div></div></div>
      <div class="skill-item"><div class="skill-hd"><span>Machine Learning</span><span class="spct">68%</span></div><div class="sbar"><div class="sfill" data-w="68" style="background:linear-gradient(90deg,#a855f7,#6020a0)"></div></div></div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">TOOLS</h3>
      <div class="tag-cloud">
        <span class="tag tc">Three.js</span><span class="tag tp">React</span>
        <span class="tag tg">Node.js</span><span class="tag te">Arduino</span>
        <span class="tag tc">Docker</span><span class="tag tp">Git</span>
        <span class="tag tg">MongoDB</span><span class="tag te">Firebase</span>
        <span class="tag tc">TensorFlow</span><span class="tag tp">Linux</span>
      </div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">LIVE CODE STREAM</h3>
      <div class="code-stream" id="code-stream-el">// Booting skill matrix...\n</div>
    </section>`,

  projects: `
    <span class="p-icon">🛠</span>
    <h2 class="p-title">PROJECT ARENA</h2>
    <p class="p-code">// projects_db.json — 12 entries</p>
    <section class="p-section">
      <h3 class="p-sh">FEATURED</h3>
      <div class="proj-card">
        <span class="proj-ico">🏠</span>
        <h4 class="proj-name">SmartNest — IoT Home Automation</h4>
        <p class="proj-desc">ESP32 controlling lights, climate & security via MQTT/WebSockets with React dashboard. 18 sensor nodes, 99.2% uptime.</p>
        <div class="tag-cloud"><span class="tag tc">ESP32</span><span class="tag tp">MQTT</span><span class="tag tg">React</span></div>
      </div>
      <div class="proj-card">
        <span class="proj-ico">🧠</span>
        <h4 class="proj-name">NeuroSort — AI Waste Classifier</h4>
        <p class="proj-desc">TensorFlow CNN achieving 94% accuracy on waste categorisation deployed via Raspberry Pi robotic arm.</p>
        <div class="tag-cloud"><span class="tag tp">TensorFlow</span><span class="tag te">Raspberry Pi</span><span class="tag tc">Python</span></div>
      </div>
      <div class="proj-card">
        <span class="proj-ico">🌐</span>
        <h4 class="proj-name">DevBoard — Real-time Collab IDE</h4>
        <p class="proj-desc">Collaborative coding with live cursors, shared execution and version history using CRDTs over WebRTC.</p>
        <div class="tag-cloud"><span class="tag tg">Node.js</span><span class="tag tp">WebRTC</span><span class="tag tc">React</span></div>
      </div>
      <div class="proj-card">
        <span class="proj-ico">📡</span>
        <h4 class="proj-name">EdgeGuard — Federated Intrusion Detection</h4>
        <p class="proj-desc">Network anomaly detection at edge nodes via federated learning — 89ms avg latency, 91% F1 score.</p>
        <div class="tag-cloud"><span class="tag tc">Python</span><span class="tag tg">Federated ML</span><span class="tag te">Networking</span></div>
      </div>
    </section>`,

  library: `
    <span class="p-icon">📚</span>
    <h2 class="p-title">KNOWLEDGE LIBRARY</h2>
    <p class="p-code">// reading_list.md</p>
    <section class="p-section">
      <h3 class="p-sh">CERTIFICATIONS</h3>
      <div class="ach"><span class="ach-ico">🏅</span><div><p class="ach-title">AWS Certified Cloud Practitioner</p><p class="ach-sub">Amazon Web Services · 2024</p></div></div>
      <div class="ach"><span class="ach-ico">🏅</span><div><p class="ach-title">Google Data Analytics Certificate</p><p class="ach-sub">Coursera / Google · 2023</p></div></div>
      <div class="ach"><span class="ach-ico">🏅</span><div><p class="ach-title">Embedded Systems — ARM Cortex</p><p class="ach-sub">Udemy · 2023</p></div></div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">READING LIST</h3>
      <div class="book"><span class="book-ico bc">📖</span><div><p class="book-title">Designing Data-Intensive Applications</p><p class="book-auth">Martin Kleppmann</p><span class="bstatus read">✔ Read</span></div></div>
      <div class="book"><span class="book-ico bp">📗</span><div><p class="book-title">The Pragmatic Programmer</p><p class="book-auth">Hunt & Thomas</p><span class="bstatus read">✔ Read</span></div></div>
      <div class="book"><span class="book-ico bg">📕</span><div><p class="book-title">Clean Architecture</p><p class="book-auth">Robert C. Martin</p><span class="bstatus reading">⟳ Reading</span></div></div>
    </section>
    <section class="p-section">
      <h3 class="p-sh">ACHIEVEMENTS</h3>
      <div class="ach"><span class="ach-ico">🥇</span><div><p class="ach-title">Smart India Hackathon — Winner</p><p class="ach-sub">National-level · 2023</p></div></div>
      <div class="ach"><span class="ach-ico">🥈</span><div><p class="ach-title">IEEE TechFest — 2nd Place</p><p class="ach-sub">IoT Innovation Track · 2023</p></div></div>
      <div class="ach"><span class="ach-ico">📄</span><div><p class="ach-title">Research Paper Published</p><p class="ach-sub">IJCSE Vol 12 — Federated Learning for Edge IoT</p></div></div>
    </section>`,

  contact: `
    <span class="p-icon">📞</span>
    <h2 class="p-title">CONTACT HUB</h2>
    <p class="p-code">// reach_out.sh</p>
    <section class="p-section">
      <p class="p-text" style="margin-bottom:16px">Open to internships, research collaborations, and full-time roles. Let's build something extraordinary together.</p>
      <a class="contact-row" href="mailto:priya.sharma@email.com"><span>✉️</span><div><p class="cr-lbl">Email</p><p class="cr-val">priya.sharma@email.com</p></div></a>
      <a class="contact-row" href="https://linkedin.com" target="_blank"><span>💼</span><div><p class="cr-lbl">LinkedIn</p><p class="cr-val">linkedin.com/in/priya-sharma</p></div></a>
      <a class="contact-row" href="https://github.com" target="_blank"><span>🐙</span><div><p class="cr-lbl">GitHub</p><p class="cr-val">github.com/priya-sharma</p></div></a>
      <a class="contact-row" href="#"><span>📄</span><div><p class="cr-lbl">Resume PDF</p><p class="cr-val">Download CV</p></div></a>
    </section>`,
};
