import { TAWAF_ROUNDS } from '../data/amalData.js';

export function Tawaf() {
  return (
    <>
      <p className="section-title">তাওয়াফের ৭ চক্করের গাইড</p>
      {TAWAF_ROUNDS.map((r, i) => (
        <div className="tawaf-item" key={i}>
          <div className="tawaf-num" style={{ color: r.color }}>
            {r.emoji} {r.num} — {r.theme}
          </div>
          <div className="tawaf-focus">{r.focus}</div>
          {r.arabic && <div className="arabic">{r.arabic}</div>}
          {r.bangla && <div className="bangla-trans">{r.bangla}</div>}
        </div>
      ))}
    </>
  );
}
