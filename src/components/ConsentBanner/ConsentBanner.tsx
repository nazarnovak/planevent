import { useEffect, useState } from "react";

import "./ConsentBanner.css";

const CONSENT_COOKIE_NAME = "consent";

export const ConsentBanner = () => {
  const [consentGiven, setConsentGiven] = useState(false);

  const setCookie = (name: string, value: boolean, daysToLive: number) => {
    var cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysToLive === "number") {
      cookie += "; max-age=" + daysToLive * 24 * 60 * 60;
      document.cookie = cookie;
    }
  };

  const getCookie = (name: string) => {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name === cookiePair[0].trim()) {
        return cookiePair[1];
      }
    }

    return null;
  };

  useEffect(() => {
    let existingConsent = getCookie(CONSENT_COOKIE_NAME);
    if (!!existingConsent) {
      setConsentGiven(true);
    }
  }, []);

  const onConsentAgree = () => {
    setCookie(CONSENT_COOKIE_NAME, true, 180);
    setConsentGiven(true);
  };

  if (consentGiven) {
    return null;
  }

  return (
    <div id="consent-wrapper">
      <div id="consent-text">
        We use cookies to store your lineup selection, name of your lineup, and
        people you follow
      </div>
      <div id="consent-agree-wrapper">
        <button id="consent-agree" onClick={onConsentAgree}>
          I understand
        </button>
      </div>
    </div>
  );
};
