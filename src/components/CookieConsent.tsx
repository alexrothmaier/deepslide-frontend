import React, { useState, useEffect } from "react";

const COOKIE_KEY = "cookie_consent";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState<{ necessary: boolean; analytics: boolean; marketing: boolean }>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };
  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };
  const handleSave = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#222",
      color: "#fff",
      padding: 24,
      zIndex: 10000,
      boxShadow: "0 -2px 12px rgba(0,0,0,0.2)",
      fontSize: 15
    }}>
      <div style={{ maxWidth: 800, margin: "auto" }}>
        <b>Diese Website verwendet Cookies</b><br />
        Wir verwenden Cookies, um die Benutzerfreundlichkeit zu verbessern und anonymisierte Statistiken zu erfassen. Sie können Ihre Einstellungen jederzeit anpassen.
        <div style={{ margin: "16px 0" }}>
          <label style={{ marginRight: 20 }}>
            <input type="checkbox" checked disabled /> Notwendig
          </label>
          <label style={{ marginRight: 20 }}>
            <input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))} /> Statistik (z.B. Google Analytics)
          </label>
          <label>
            <input type="checkbox" checked={prefs.marketing} onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))} /> Marketing
          </label>
        </div>
        <button onClick={handleAcceptAll} style={{ background: "#00bfae", color: "#fff", border: 0, padding: "8px 18px", borderRadius: 4, marginRight: 10 }}>Alle akzeptieren</button>
        <button onClick={handleRejectAll} style={{ background: "#444", color: "#fff", border: 0, padding: "8px 18px", borderRadius: 4, marginRight: 10 }}>Nur notwendige</button>
        <button onClick={handleSave} style={{ background: "#222", color: "#fff", border: "1px solid #00bfae", padding: "8px 18px", borderRadius: 4 }}>Speichern</button>
      </div>
    </div>
  );
};

export default CookieConsent;
