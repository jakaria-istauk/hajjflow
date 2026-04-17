const SCHEDULE = [
  { dot: 'dot-purple', time: '৪:৩০ – ৫:৩০ (তাহাজ্জুদ)', body: 'তাহাজ্জুদ ২–৮ রাকাত • দীর্ঘ সিজদায় দোয়া • ইস্তিগফার + দরুদ' },
  { dot: 'dot-orange', time: '৫:৩০ – ৬:৩০ (ফজর)',       body: 'মসজিদুল হারামে ফজর জামাত • জিকির • কুরআন তিলাওয়াত • সূর্য ওঠা পর্যন্ত বসা' },
  { dot: 'dot-green',  time: '৬:৩০ – ৮:৩০ (ইশরাক + তাওয়াফ)', body: 'ইশরাক ২ রাকাত • নফল তাওয়াফ • কাবা দেখে দোয়া' },
  { dot: 'dot-orange', time: '৮:৩০ – ১১:৩০ (কুরআন)',    body: 'কুরআন তিলাওয়াত (১ পারা) • দোয়া • হালকা বিশ্রাম' },
  { dot: 'dot-green',  time: '১২:০০ – ১:৩০ (যোহর)',      body: 'মসজিদুল হারামে যোহর জামাত • কুরআন' },
  { dot: 'dot-blue',   time: '২:০০ – ৪:০০ (বিশ্রাম)',    body: 'কায়লুলা (হালকা ঘুম) • শরীর রিকভারি' },
  { dot: 'dot-orange', time: '৪:০০ – ৬:০০ (আসর)',        body: 'আসর নামাজ • দরুদ শরীফ • নফল তাওয়াফ • কাবার পাশে দোয়া' },
  { dot: 'dot-red',    time: '৬:০০ – ১০:০০ (মাগরিব-এশা)', body: 'নফল তাওয়াফ • মাগরিব • খাবার • এশা • নফল তাওয়াফ • কুরআন • দরুদ + ইস্তিগফার' },
];

export function Makkah() {
  return (
    <>
      <p className="section-title">মক্কার দৈনিক রুটিন</p>
      <div className="card">
        {SCHEDULE.map((s, i) => (
          <div className="time-block" key={i}>
            <div className="time-label"><div className={`dot ${s.dot}`} />{s.time}</div>
            <div className="time-body">{s.body}</div>
          </div>
        ))}
      </div>
    </>
  );
}
