import { useState } from 'react';
import { TAWAF_ROUNDS } from '../data/amalData.js';

const BN = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
function toBn(n) {
  return String(n).split('').map(d => BN[parseInt(d, 10)] ?? d).join('');
}
function getTawafCount() {
  return parseInt(localStorage.getItem('hajjflow_tawaf_count') || '0', 10);
}
function getTawafRound() {
  return parseInt(localStorage.getItem('hajjflow_tawaf_round') || '0', 10);
}
function getTawafSalah() {
  return localStorage.getItem('hajjflow_tawaf_salah') === 'true';
}

export function Tawaf() {
  const [roundCount,  setRoundCount]  = useState(getTawafRound);
  const [salahDone,   setSalahDone]   = useState(getTawafSalah);
  const [showPopup,   setShowPopup]   = useState(false);
  const [tawafTotal,  setTawafTotal]  = useState(getTawafCount);

  function handleRound() {
    setRoundCount(c => {
      const next = Math.min(c + 1, 7);
      localStorage.setItem('hajjflow_tawaf_round', next);
      return next;
    });
  }

  function handleSalahCheck() {
    const next = !salahDone;
    setSalahDone(next);
    localStorage.setItem('hajjflow_tawaf_salah', next);
    if (next) setShowPopup(true);
  }

  function handleSave() {
    const newTotal = tawafTotal + 1;
    localStorage.setItem('hajjflow_tawaf_count', newTotal);
    localStorage.setItem('hajjflow_tawaf_round', '0');
    localStorage.setItem('hajjflow_tawaf_salah', 'false');
    setTawafTotal(newTotal);
    setRoundCount(0);
    setSalahDone(false);
    setShowPopup(false);
  }

  function handleCancel() {
    setSalahDone(false);
    localStorage.setItem('hajjflow_tawaf_salah', 'false');
    setShowPopup(false);
  }

  return (
    <>
      {/* ── Counter Card ─────────────────────────────────────────────── */}
      <div className="tawaf-counter-card">
        <div className="tawaf-counter-header">
          <span className="card-title" style={{ marginBottom: 0 }}>তাওয়াফ কাউন্টার</span>
          {tawafTotal > 0 && (
            <span className="tawaf-total-badge">সম্পন্ন: {toBn(tawafTotal)}</span>
          )}
        </div>

        <div className="counter-display">
          <div className="counter-num">{toBn(roundCount)}</div>
          <div className="counter-sub">/ ৭ চক্কর</div>
        </div>

        <div className="counter-dots">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={`counter-dot${i < roundCount ? ' done' : ''}`} />
          ))}
        </div>

        {roundCount < 7 && (
          <button className="counter-btn" onClick={handleRound}>
            <span className="counter-btn-icon">🔄</span>
            <span>চক্কর {toBn(roundCount + 1)}</span>
          </button>
        )}

        {roundCount === 7 && (
          <div className="salah-reveal">
            <div className="salah-reveal-label">
              আলহামদুলিল্লাহ! ৭ চক্কর সম্পন্ন — এখন ২ রাকাত নামাজ পড়ুন
            </div>
            <button
              className={`salah-check-btn${salahDone ? ' done' : ''}`}
              onClick={handleSalahCheck}
            >
              <span className="salah-check-box">{salahDone ? '✓' : ''}</span>
              <span>২ রাকাত নামাজ আদায় করেছি</span>
            </button>
          </div>
        )}

        {roundCount > 0 && roundCount < 7 && (
          <button className="counter-reset" onClick={() => {
            setRoundCount(0);
            localStorage.setItem('hajjflow_tawaf_round', '0');
          }}>
            রিসেট
          </button>
        )}
      </div>

      {/* ── Confirmation Popup ────────────────────────────────────────── */}
      {showPopup && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-card tawaf-popup" onClick={e => e.stopPropagation()}>
            <div className="tawaf-popup-icon">🕋</div>
            <div className="tawaf-popup-title">তাওয়াফ সম্পন্ন হয়েছে</div>
            <div className="tawaf-popup-sub">
              ৭ চক্কর ও ২ রাকাত নামাজ সম্পন্ন।<br />
              আপনার লগে সেভ করবেন?
            </div>
            <div className="tawaf-popup-btns">
              <button className="tawaf-btn-save"   onClick={handleSave}>সেভ করুন</button>
              <button className="tawaf-btn-cancel" onClick={handleCancel}>বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Round Guide ───────────────────────────────────────────────── */}
      <p className="section-title" style={{ marginTop: 8 }}>তাওয়াফের ৭ চক্করের গাইড</p>
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
