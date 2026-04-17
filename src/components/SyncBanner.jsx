import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore.js';
import { useAmalStore } from '../store/amalStore.js';

export function SyncBanner() {
  const user             = useAuthStore(s => s.user);
  const loginWithGoogle  = useAuthStore(s => s.loginWithGoogle);
  const loading          = useAuthStore(s => s.loading);
  const error            = useAuthStore(s => s.error);
  const showSyncPrompt   = useAmalStore(s => s.showSyncPrompt);
  const liftLocalToRemote = useAmalStore(s => s.liftLocalToRemote);
  const [dismissed, setDismissed] = useState(false);

  if (user || !showSyncPrompt || dismissed) return null;

  async function handleSuccess(credential) {
    await loginWithGoogle(credential);
    // liftLocalToRemote checks JWT which is now set
    await liftLocalToRemote();
  }

  return (
    <div className="sync-banner">
      <button
        className="sync-banner-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
      <p className="sync-banner-msg">
        ☁️ আপনার আমলের তথ্য স্থায়ীভাবে সেভ করতে চান?
      </p>
      {error && <p className="sync-banner-error">{error}</p>}
      {loading
        ? <p className="sync-banner-loading">লগইন হচ্ছে…</p>
        : (
          <GoogleLogin
            onSuccess={resp => handleSuccess(resp.credential)}
            onError={() => {}}
            useOneTap={false}
            locale="bn"
            size="medium"
            text="signin_with"
            shape="pill"
          />
        )
      }
    </div>
  );
}
