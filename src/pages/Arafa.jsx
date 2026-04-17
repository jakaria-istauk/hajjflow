const SCHEDULE = [
  { dot: 'dot-purple', time: '৩:৩০ – ৪:৩০ (তাহাজ্জুদ)', body: '৪–৮ রাকাত • দীর্ঘ সিজদায় দোয়া • ইস্তিগফার ১০০+ বার • কান্না করে তওবা' },
  { dot: 'dot-orange', time: '৪:৩০ – ৬:৩০ (ফজর)',       body: 'ফজর জামাত • তাসবিহ ৩৩×৩ • কুরআন • ইশরাক ২ রাকাত' },
  { dot: 'dot-green',  time: '৬:৩০ – ১২:৩০',             body: 'তালবিয়া বেশি বেশি • কুরআন • দোয়া লিস্ট থেকে পড়া • হালকা বিশ্রাম' },
  { dot: 'dot-blue',   time: '১২:৩০ – ১:৩০ (যোহর+আসর)', body: 'যোহর + আসর জমা কসর • নামাজের পরেই দোয়া শুরু' },
];

export function Arafa() {
  return (
    <>
      <p className="section-title">আরাফার দিনের পরিকল্পনা</p>

      <div className="card" style={{ borderLeft: '3px solid #1a5c3a', borderRadius: '0 16px 16px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a5c3a', marginBottom: 6 }}>সেরা দোয়া (আরাফার দিন)</div>
        <div className="arabic">لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير</div>
        <div className="bangla-trans">লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকালাহু, লাহুল মুলকু ওয়া লাহুল হামদ, ওয়া হুয়া আলা কুল্লি শাই'ইন ক্বাদীর</div>
      </div>

      <div className="card">
        {SCHEDULE.map((s, i) => (
          <div className="time-block" key={i}>
            <div className="time-label"><div className={`dot ${s.dot}`} />{s.time}</div>
            <div className="time-body">{s.body}</div>
          </div>
        ))}
        <div className="highlight-block">
          <div className="time-label">
            <div className="dot dot-red" />
            🔥 ১:৩০ – সূর্যাস্ত (গোল্ডেন টাইম)
          </div>
          <div className="time-body">দুই হাত তুলে দীর্ঘ দোয়া • কিবলামুখী • কান্না করে দোয়া • বারবার রিপিট • মোবাইল বন্ধ রাখুন!</div>
        </div>
      </div>
    </>
  );
}
