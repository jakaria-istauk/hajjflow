const GITHUB_URL = 'https://github.com/jakaria-istauk/hajjflow';

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function About() {
  return (
    <>
      <div className="card" style={{ borderLeft: '3px solid var(--green)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', marginBottom: 16 }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>🕋 HajjFlow</div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
          হজ্বের সফরকে সহজ, সুশৃঙ্খল ও বরকতময় করে তোলার জন্য তৈরি একটি ডিজিটাল সঙ্গী।
        </div>
      </div>

      <div className="card">
        <div className="card-title">উদ্দেশ্য</div>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
          হজ্ব ইসলামের পাঁচটি স্তম্ভের অন্যতম। জীবনে একবার এই সুযোগ আসে — এবং প্রতিটি মুহূর্ত মূল্যবান।
          HajjFlow তৈরি করা হয়েছে যাতে একজন হাজী প্রতিদিনের আমল ট্র্যাক করতে পারেন,
          তাওয়াফের প্রতিটি চক্করে সঠিক নিয়তে মনোযোগ দিতে পারেন, এবং
          মক্কা-মদিনা-মিনা-আরাফার প্রতিটি স্থানে সর্বোচ্চ ইবাদতে সময় কাটাতে পারেন।
        </div>
      </div>

      <div className="card">
        <div className="card-title">যা যা আছে এই অ্যাপে</div>
        {[
          { icon: '📋', title: 'দৈনিক আমল চেকলিস্ট', desc: 'প্রতিটি দিনের ইবাদত ট্র্যাক করুন' },
          { icon: '🔄', title: 'তাওয়াফ গাইড ও কাউন্টার', desc: '৭ চক্করের আলাদা নিয়ত, জিকির ও দোয়া' },
          { icon: '🕋', title: 'হজ্বের ধাপসমূহ', desc: 'ইহরাম থেকে তাওয়াফে বিদা পর্যন্ত সম্পূর্ণ গাইড' },
          { icon: '🗓️', title: 'লোকেশন রুটিন', desc: 'মক্কা, মদিনা, মিনা ও আরাফার টাইম-ব্লক শিডিউল' },
          { icon: '🤲', title: '১০০ দোয়ার তালিকা', desc: 'হজ্বের সফরে পড়ার জন্য বাছাই করা দোয়া' },
          { icon: '📖', title: 'সূরার রুটিন', desc: 'ফজর থেকে রাত পর্যন্ত কোন সময় কোন সূরা পড়বেন' },
          { icon: '📅', title: 'আমলের ইতিহাস', desc: 'যেকোনো দিনের আমল দেখুন ও এডিট করুন' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="amal-row" style={{ border: 'none', padding: '6px 0' }}>
            <div style={{ fontSize: 18, minWidth: 28 }}>{icon}</div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>
              <b style={{ fontWeight: 500 }}>{title}</b> — {desc}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">কিভাবে ব্যবহার করবেন</div>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.9 }}>
          ১. প্রতিদিন সকালে <b style={{ fontWeight: 500 }}>সারসংক্ষেপ</b> ট্যাব খুলুন<br />
          ২. আমল সম্পন্ন করলে চেকবক্সে টিক দিন<br />
          ৩. তাওয়াফের সময় <b style={{ fontWeight: 500 }}>তাওয়াফ</b> ট্যাব দেখুন<br />
          ৪. যে শহরে আছেন সেই ট্যাবের রুটিন অনুসরণ করুন<br />
          ৫. দোয়া পড়লে <b style={{ fontWeight: 500 }}>১০০ দোয়া</b> ট্যাবে মার্ক করুন<br />
          ৬. Google দিয়ে লগইন করলে ডেটা ক্লাউডে সেভ হয়
        </div>
      </div>

      {/* ── Footer card ── */}
      <div className="card" style={{ background: 'var(--bg-sec)', border: 'none', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 1 }}>
          ভার্সন ১.০ • বাংলা ভাষায় তৈরি
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 10, fontStyle: 'italic', lineHeight: 1.7 }}>
          "হজ্ব কবুল হলে পূর্ববর্তী সব গুনাহ মাফ হয়ে যায়।"
          <span style={{ fontStyle: 'normal', fontWeight: 500 }}>— বুখারি</span>
        </div>
      </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center',
            padding: '10px 18px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text)', textDecoration: 'none',
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <GithubIcon />
          তৈরি করেছেন জাকারিয়া ইসতেয়াক
        </a>
    </>
  );
}
