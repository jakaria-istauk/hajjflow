import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from './store/authStore.js';
import { useAmalStore } from './store/amalStore.js';
import { Header }     from './components/Header.jsx';
import { SyncBanner } from './components/SyncBanner.jsx';
import { Overview }   from './pages/Overview.jsx';
import { AmalChart }  from './pages/AmalChart.jsx';
import { Tawaf }      from './pages/Tawaf.jsx';
import { Makkah }     from './pages/Makkah.jsx';
import { Madina }     from './pages/Madina.jsx';
import { Mina }       from './pages/Mina.jsx';
import { Arafa }      from './pages/Arafa.jsx';
import { Doa }        from './pages/Doa.jsx';
import { Surah }      from './pages/Surah.jsx';
import { History }    from './pages/History.jsx';
import { HajjSteps }  from './pages/HajjSteps.jsx';
import './styles/globals.css';

const TABS = [
  { id: 'overview',   label: 'সারসংক্ষেপ',      icon: '🏠', Page: Overview   },
  { id: 'chart',      label: 'আমল চার্ট',        icon: '📊', Page: AmalChart  },
  { id: 'hajjsteps',  label: 'হজ্বের ধাপসমূহ',  icon: '🕋', Page: HajjSteps  },
  { id: 'tawaf',      label: 'তাওয়াফ',           icon: '🔄', Page: Tawaf      },
  { id: 'makkah',     label: 'মক্কা',             icon: '🌙', Page: Makkah     },
  { id: 'madina',     label: 'মদিনা',             icon: '🕌', Page: Madina     },
  { id: 'mina',       label: 'মিনা',              icon: '⛺', Page: Mina       },
  { id: 'arafa',      label: 'আরাফা',             icon: '🏔️', Page: Arafa      },
  { id: 'doa',        label: '১০০ দোয়া',         icon: '🤲', Page: Doa        },
  { id: 'surah',      label: 'সূরা',              icon: '📖', Page: Surah      },
  { id: 'history',    label: 'ইতিহাস',            icon: '📅', Page: History    },
];

// Primary tabs shown in bottom nav
const PRIMARY_TAB_IDS = ['overview', 'chart', 'hajjsteps', 'doa'];

// ── Login modal (shown when user explicitly requests login) ────────────────
function LoginModal() {
  const loginWithGoogle   = useAuthStore(s => s.loginWithGoogle);
  const closeLoginModal   = useAuthStore(s => s.closeLoginModal);
  const loading           = useAuthStore(s => s.loading);
  const error             = useAuthStore(s => s.error);
  const liftLocalToRemote = useAmalStore(s => s.liftLocalToRemote);

  async function handleSuccess(credential) {
    await loginWithGoogle(credential);
    await liftLocalToRemote();
  }

  return (
    <div className="modal-overlay" onClick={closeLoginModal}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeLoginModal}>✕</button>
        <div className="login-logo">🕋</div>
        <div className="login-title">হজ্ব আমল পরিকল্পনা</div>
        <div className="login-sub">
          লগইন করে আপনার আমল স্থায়ীভাবে সেভ করুন এবং যেকোনো ডিভাইসে অ্যাক্সেস করুন।
        </div>
        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>{error}</p>}
        {loading
          ? <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 12 }}>লগইন হচ্ছে…</p>
          : (
            <div style={{ marginTop: 16 }}>
              <GoogleLogin
                onSuccess={resp => handleSuccess(resp.credential)}
                onError={() => {}}
                useOneTap
                locale="bn"
              />
            </div>
          )
        }
      </div>
    </div>
  );
}

// ── Sidebar drawer ────────────────────────────────────────────────────────
function SideDrawer({ activeTab, onSelect, onClose }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">মেনু</span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <nav className="drawer-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`drawer-item${activeTab === t.id ? ' active' : ''}`}
              onClick={() => { onSelect(t.id); onClose(); }}
            >
              <span className="drawer-icon">{t.icon}</span>
              <span>{t.label}</span>
              {activeTab === t.id && <span className="drawer-active-dot" />}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────
export default function App() {
  const user           = useAuthStore(s => s.user);
  const loginModalOpen = useAuthStore(s => s.loginModalOpen);
  const setDate        = useAmalStore(s => s.setSelectedDate);
  const fetchDate      = useAmalStore(s => s.fetchDate);
  const [tab, setTab]        = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const primaryTabs = TABS.filter(t => PRIMARY_TAB_IDS.includes(t.id));

  // Auth expiry → logout
  useEffect(() => {
    const handler = () => useAuthStore.getState().logout();
    window.addEventListener('hajjflow:auth-expired', handler);
    return () => window.removeEventListener('hajjflow:auth-expired', handler);
  }, []);

  function handleTabChange(id) {
    if (id !== 'history') {
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
      fetchDate(today);
    }
    setTab(id);
  }

  const activeTabData = TABS.find(t => t.id === tab);
  const ActivePage = activeTabData?.Page ?? Overview;
  const isSecondaryActive = !PRIMARY_TAB_IDS.includes(tab);

  return (
    <div className="app">
      <Header />
      <SyncBanner />
      <main className="content">
        <ActivePage />
      </main>
      <footer>
        <nav className="nav" role="tablist" aria-label="Sections">
          {primaryTabs.map(t => (
            <button
              key={t.id}
              className={`nav-btn${tab === t.id ? ' active' : ''}`}
              onClick={() => handleTabChange(t.id)}
              role="tab"
              aria-selected={tab === t.id}
            >
              <span className="nav-btn-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
          <button
            className={`nav-btn nav-btn-menu${isSecondaryActive ? ' active' : ''}`}
            onClick={() => setDrawerOpen(true)}
            aria-label="আরো মেনু"
          >
            <span className="nav-btn-icon">
              {isSecondaryActive ? activeTabData?.icon : '☰'}
            </span>
            <span>{isSecondaryActive ? activeTabData?.label : 'আরো'}</span>
          </button>
        </nav>
      </footer>
      {drawerOpen && (
        <SideDrawer
          activeTab={tab}
          onSelect={handleTabChange}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      {loginModalOpen && !user && <LoginModal />}
    </div>
  );
}
