import { useState } from 'react';

const consentKey = 'any-composites-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(consentKey));

  const saveConsent = (choice) => {
    localStorage.setItem(consentKey, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return <aside className="cookie-consent" aria-label="Cookie consent">
    <h2>We use cookies!</h2>
    <p>Hi, this website uses essential cookies to ensure its proper operation and analytics cookies to understand how you interact with it. Analytics cookies are set only after your consent.</p>
    <div className="cookie-actions"><button type="button" onClick={() => saveConsent('all')}>Accept All</button><button type="button" onClick={() => saveConsent('necessary')}>Accept Necessary</button></div>
    <a href="#privacy-policy">Privacy policy</a>
  </aside>;
}
