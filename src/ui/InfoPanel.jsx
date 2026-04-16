/**
 * InfoPanel.jsx — Slide-in panel for buildings and zones
 */
import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { OWNER, SKILLS } from '../utils/constants';

export default function InfoPanel() {
  const infoPanel    = useStore(s => s.infoPanel);
  const closeInfoPanel = useStore(s => s.closeInfoPanel);
  const fillsRef     = useRef([]);

  useEffect(() => {
    if (!infoPanel) return;
    // Animate skill bars
    requestAnimationFrame(() => {
      fillsRef.current.forEach(el => {
        if (el) el.style.width = el.dataset.w + '%';
      });
    });
  }, [infoPanel]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeInfoPanel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeInfoPanel]);

  if (!infoPanel) return null;

  return (
    <div className="info-panel">
      <button className="panel-close" onClick={closeInfoPanel}>✕</button>
      {infoPanel.type === 'skill'   && <SkillPanel   data={infoPanel} fillsRef={fillsRef} />}
      {infoPanel.type === 'project' && <ProjectPanel data={infoPanel} />}
      {infoPanel.type === 'contact' && <ContactPanel />}
    </div>
  );
}

function SkillPanel({ data, fillsRef }) {
  return (
    <>
      <span className="p-icon">🧠</span>
      <h2 className="p-title" style={{ color: data.color }}>{data.title}</h2>
      <p className="p-sub">// skill_profile.json</p>

      <div className="p-section">
        <h3 className="p-sh">PROFICIENCY</h3>
        {SKILLS.map((s, i) => (
          <div className="skill-bar-row" key={s.name}>
            <div className="skill-bar-hd">
              <span>{s.name}</span>
              <span className="skill-bar-pct" style={{ color: s.color }}>{s.level}%</span>
            </div>
            <div className="sbar">
              <div
                className="sfill"
                ref={el => fillsRef.current[i] = el}
                data-w={s.level}
                style={{ width: 0, background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-section">
        <h3 className="p-sh">TOOLS & FRAMEWORKS</h3>
        <div className="tag-cloud">
          {['React','Node.js','Three.js','Docker','Git','MongoDB','Firebase','Arduino','TensorFlow','Linux'].map(tag => (
            <span key={tag} className="tag tc">{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectPanel({ data }) {
  const { project } = data;
  return (
    <>
      <span className="p-icon">🛠</span>
      <h2 className="p-title" style={{ color: project.color }}>{project.name}</h2>
      <p className="p-sub">// project_brief.md</p>
      <div className="p-section">
        <h3 className="p-sh">DESCRIPTION</h3>
        <p className="proj-desc">{project.desc}</p>
      </div>
      <div className="p-section">
        <h3 className="p-sh">TECH STACK</h3>
        <div className="tag-cloud">
          {project.tech.map(t => <span key={t} className="tag tg">{t}</span>)}
        </div>
      </div>
    </>
  );
}

function ContactPanel() {
  return (
    <>
      <span className="p-icon">📡</span>
      <h2 className="p-title">CONTACT HUB</h2>
      <p className="p-sub">// reach_out.sh</p>
      <div className="p-section">
        <p className="p-text" style={{ marginBottom:14 }}>
          Open to internships, research collaborations, and full-time roles.
        </p>
        {[
          { icon:'✉️', lbl:'Email',    val: OWNER.email },
          { icon:'💼', lbl:'LinkedIn', val: OWNER.linkedin },
          { icon:'🐙', lbl:'GitHub',   val: OWNER.github },
          { icon:'📄', lbl:'Resume',   val: 'Download CV PDF' },
        ].map(c => (
          <a key={c.lbl} href="#" className="contact-link">
            <span style={{ fontSize:20 }}>{c.icon}</span>
            <div>
              <p className="cl-lbl">{c.lbl}</p>
              <p className="cl-val">{c.val}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
