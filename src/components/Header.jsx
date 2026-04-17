import { useAuthStore } from '../store/authStore.js';
import { useAmalStore } from '../store/amalStore.js';

export function Header() {
  const user            = useAuthStore(s => s.user);
  const logout          = useAuthStore(s => s.logout);
  const openLoginModal  = useAuthStore(s => s.openLoginModal);
  const syncing         = useAmalStore(s => s.syncing);

  const today = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

  return (
    <div className="header">
      <div className="header-top">
        <span style={{ fontSize: 20 }}>🕋</span>
        <h1>হজ্ব আমল পরিকল্পনা</h1>
        <div className="header-user">
          <div className={`sync-dot${syncing ? ' syncing' : ''}`} title={syncing ? 'সিঙ্ক হচ্ছে…' : 'সিঙ্ক হয়েছে'} />
          {user?.picture && (
            <img src={user.picture} alt={user.name} className="header-avatar" referrerPolicy="no-referrer" />
          )}
          {user
            ? <button className="header-logout" onClick={logout}>বের হন</button>
            : <button className="header-logout" onClick={openLoginModal}>লগইন</button>
          }
        </div>
      </div>
      <div className="header-sub">আপনার হজ্বের সফর সহজ ও বরকতময় হোক</div>
      <div className="header-date">{today}</div>
    </div>
  );
}
