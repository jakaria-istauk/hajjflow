import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from './store/authStore.js';
import { useAmalStore } from './store/amalStore.js';
import { Header } from './components/Header.jsx';
import { Overview }  from './pages/Overview.jsx';
import { AmalChart } from './pages/AmalChart.jsx';
import { Tawaf }     from './pages/Tawaf.jsx';
import { Makkah }    from './pages/Makkah.jsx';
import { Madina }    from './pages/Madina.jsx';
import { Mina }      from './pages/Mina.jsx';
import { Arafa }     from './pages/Arafa.jsx';
import { Doa }       from './pages/Doa.jsx';
import { Surah }     from './pages/Surah.jsx';
import { History }   from './pages/History.jsx';
import './styles/globals.css';

const TABS = [
  { id: 'overview',  label: 'সারসংক্ষেপ',  Page: Overview  },
  { id: 'chart',     label: 'আমল চার্ট',    Page: AmalChart },
  { id: 'tawaf',     label: 'তাওয়াফ',       Page: Tawaf     },
  { id: 'makkah',    label: 'মক্কা',         Page: Makkah    },
  { id: 'madina',    label: 'মদিনা',         Page: Madina    },
  { id: 'mina',      label: 'মিনা',          Page: Mina      },
  { id: 'arafa',     label: 'আরাফা',         Page: Arafa     },
  { id: 'doa',       label: '১০০ দোয়া',     Page: Doa       },
  { id: 'surah',     label: 'সূরা',           Page: Surah     },
  { id: 'history',   label: 'ইতিহাস',        Page: History   },
];

function LoginScreen() {
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle);
  const loading         = useAuthStore(s => s.loading);
  const error           = useAuthStore(s => s.error);

  return (
    <div className="login-screen">
      <div className="login-logo">🕋</div>
      <div className="login-title">হজ্ব আমল পরিকল্পনা</div>
      <div className="login-sub">আপনার হজ্বের সফর সহজ ও বরকতময় করতে Google দিয়ে লগইন করুন।</div>
      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
      {loading
        ? <p style={{ color: 'var(--text-sec)', fontSize: 14 }}>লগইন হচ্ছে…</p>
        : (
          <GoogleLogin
            onSuccess={resp => loginWithGoogle(resp.credential)}
            onError={() => useAuthStore.getState().logout()}
            useOneTap
            locale="bn"
          />
        )
      }
    </div>
  );
}

export default function App() {
  const user      = useAuthStore(s => s.user);
  const setDate   = useAmalStore(s => s.setSelectedDate);
  const fetchDate = useAmalStore(s => s.fetchDate);
  const [tab, setTab] = useState('overview');

  // On auth expiry, clear store
  useEffect(() => {
    const handler = () => useAuthStore.getState().logout();
    window.addEventListener('hajjflow:auth-expired', handler);
    return () => window.removeEventListener('hajjflow:auth-expired', handler);
  }, []);

  // When switching to non-history tab, reset to today
  function handleTabChange(id) {
    if (id !== 'history') {
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
      fetchDate(today);
    }
    setTab(id);
  }

  if (!user) return <LoginScreen />;

  const ActivePage = TABS.find(t => t.id === tab)?.Page ?? Overview;

  return (
    <div className="app">
      <Header />
      <nav className="nav" role="tablist" aria-label="Sections">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => handleTabChange(t.id)}
            role="tab"
            aria-selected={tab === t.id}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main className="content">
        <ActivePage />
      </main>
    </div>
  );
}
