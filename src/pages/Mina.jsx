const SCHEDULE = [
  { dot: 'dot-purple', time: 'ফজরের আগে (তাহাজ্জুদ)', body: 'তাহাজ্জুদ ২–৮ রাকাত • দীর্ঘ দোয়া • ইস্তিগফার' },
  { dot: 'dot-orange', time: 'ফজর → সূর্যোদয়',        body: 'জামাতে ফজর • জিকির (৩৩+৩৩+৩৪) • কুরআন • ইশরাক' },
  { dot: 'dot-green',  time: 'সকাল (দুহা)',             body: '২–৮ রাকাত দুহা নামাজ • হালকা বিশ্রাম • তালবিয়া: لبيك اللهم لبيك' },
  { dot: 'dot-blue',   time: 'যোহর → আসর',             body: 'যোহর কসর (২ রাকাত) • কুরআন • জিকির لا إله إلا الله • দরুদ' },
  { dot: 'dot-red',    time: 'আসর → রাত',              body: 'আসর কসর • বেশি দোয়া • মাগরিব ৩ রাকাত • এশা কসর • বিতর • আয়াতুল কুরসি + ৩ কুল' },
];

export function Mina() {
  return (
    <>
      <p className="section-title">মিনার আমল</p>
      <div className="card">
        {SCHEDULE.map((s, i) => (
          <div className="time-block" key={i}>
            <div className="time-label"><div className={`dot ${s.dot}`} />{s.time}</div>
            <div className="time-body">{s.body}</div>
          </div>
        ))}
        <div className="special-days">
          <div className="special-days-title">বিশেষ দিন</div>
          <div className="special-days-body">
            📅 <b>৮ জিলহজ:</b> মিনায় ৫ ওয়াক্ত নামাজ<br />
            📅 <b>৯ জিলহজ:</b> আরাফায় সারাদিন দোয়া<br />
            📅 <b>১০–১৩ জিলহজ:</b> জামারায় কংকর নিক্ষেপ
          </div>
        </div>
      </div>
    </>
  );
}
