const SCHEDULE = [
  { dot: 'dot-purple', time: '৪:৩০ – ৫:৩০ (ফজর প্রস্তুতি)', body: 'মসজিদে নববী • তাহাজ্জুদ • ইস্তিগফার + দরুদ' },
  { dot: 'dot-orange', time: '৫:৩০ – ৬:১৫ (ফজর)',           body: 'ফজর জামাত • জিকির • কুরআন তিলাওয়াত' },
  { dot: 'dot-green',  time: '৬:১৫ – ৭:১৫ (নববীতে জিকির)', body: 'সূর্য ওঠা পর্যন্ত বসা • দরুদ শরীফ • দোয়া' },
  { dot: 'dot-green',  time: '৭:১৫ – ৮:৩০ (কুবা)',           body: 'মসজিদে কুবা যাত্রা • তাহিয়্যাতুল মসজিদ • ইশরাক ২ রাকাত • দোয়া' },
  { dot: 'dot-blue',   time: '৮:৩০ – ১০:৩০ (বিশ্রাম)',       body: 'কুরআন তিলাওয়াত • হালকা বিশ্রাম • ব্যক্তিগত দোয়া' },
  { dot: 'dot-green',  time: '১২:০০ – ১:৩০ (যোহর)',          body: 'মসজিদে নববীতে যোহর জামাত • দোয়া • কুরআন/জিকির' },
  { dot: 'dot-orange', time: '৪:০০ – ৬:০০ (আসর + রওজা)',    body: 'আসর নামাজ • দরুদ • রওজা শরীফ যিয়ারত' },
  { dot: 'dot-red',    time: '৬:০০ – ১০:০০ (মাগরিব-এশা)',   body: 'মাগরিব • খাবার • এশা • নফল ২–৮ রাকাত • দরুদ • ইস্তিগফার' },
];

export function Madina() {
  return (
    <>
      <p className="section-title">মদিনার দৈনিক রুটিন</p>
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
