const SURAHS = [
  { dot: 'dot-orange', time: 'ফজরের পর',                       body: '<b>সূরা ইয়াসিন</b> — দিনের বরকত ও সহজতার জন্য' },
  { dot: 'dot-green',  time: 'সকাল / দিনের যেকোনো সময়',       body: '<b>সূরা ওয়াকিয়া</b> — রিজিকের বরকতের নিয়তে' },
  { dot: 'dot-blue',   time: 'আসর বা মাগরিবের পর',             body: '<b>সূরা রহমান</b> — আল্লাহর নিয়ামত স্মরণ ও প্রশান্তির জন্য' },
  { dot: 'dot-purple', time: 'মাগরিব / এশার পর',               body: '<b>সূরা মুলক</b> — কবরের আজাব থেকে বাঁচার ফজিলত' },
  { dot: 'dot-red',    time: 'ঘুমানোর আগে (অত্যন্ত গুরুত্বপূর্ণ)', body: '<b>সূরা ইখলাস + ফালাক + নাস</b> — ৩ বার করে পড়ে শরীরে ফুঁ দিন' },
  { dot: 'dot-gray',   time: 'ঘুমানোর আগে (অতিরিক্ত)',         body: '<b>সূরা সাজদাহ + মুলক</b> — রাসূল ﷺ পড়তেন' },
  { dot: 'dot-green',  time: 'শুক্রবার (জুমা)',                 body: '<b>সূরা কাহফ</b> — জুমার দিনে পড়া সুন্নাহ' },
];

export function Surah() {
  return (
    <>
      <p className="section-title">আমলি সূরার তালিকা</p>
      <div className="card">
        {SURAHS.map((s, i) => (
          <div className="time-block" key={i}>
            <div className="time-label"><div className={`dot ${s.dot}`} />{s.time}</div>
            <div className="time-body" dangerouslySetInnerHTML={{ __html: s.body }} />
          </div>
        ))}
        <div style={{ background: 'var(--bg-sec)', borderRadius: 'var(--radius-md)', padding: 12, marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 6 }}>শর্ট রুটিন (ব্যস্ত হলে)</div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>ফজর: ইয়াসিন • দিন: ওয়াকিয়া • রাত: মুলক + ৩ কুল</div>
        </div>
      </div>
    </>
  );
}
