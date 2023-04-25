import './index.scss';
import { useEffect, useRef, useState } from 'react';
import useScrollToSection from '../../hooks/useScrollToSection';
import axios from 'axios';
import Header from '../../components/Header';
import Section from '../../components/Section';
import Overview from '../../components/Section/Overview';
import HowToUse from '../../components/Section/HowToUse';

export default function Root() {
  const [section, setSection, sectionRef] = useScrollToSection();
  const [oauthPopup, setOauthPopup] = useState<Window | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const popupInterval = useRef<number | null>(null);

  const createOauthPopup = () => {
    const outerWidth = window.outerWidth;
    const outerHeight = window.outerHeight;
    const newWindowWidth = 500;
    const newWindowHeight = 600;
    const options = `top=${outerHeight / 2 - newWindowHeight / 2}}, left=${
      outerWidth / 2 - newWindowWidth / 2
    }, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no`;
    const popup = window.open(
      'https://github.com/login/oauth/authorize?client_id=aa35721dd67709b79ce2',
      '_blank',
      options
    );
    setOauthPopup(popup);
  };

  useEffect(() => {
    if (!oauthPopup) {
      return;
    }
    if (isLogin) {
      oauthPopup?.close();
      setOauthPopup(null);
      return;
    }
    popupInterval.current = setInterval(async () => {
      const currentUrl = oauthPopup.location.href;
      const params = new URL(currentUrl).searchParams;
      const code = params.get('code');
      if (!code) {
        return;
      }
      popupInterval.current && clearInterval(popupInterval.current);
      const { data } = await axios.post(
        'http://127.0.0.1:8080/github/oauth',
        { code },
        { withCredentials: true }
      );
      if (data.message == 'success') {
        setHasToken(true);
      }
      setIsLogin(true);
    }, 500);
    return () => {
      popupInterval.current && clearInterval(popupInterval.current);
      oauthPopup?.close();
      setOauthPopup(null);
    };
  }, [oauthPopup, isLogin]);

  return (
    <div className="root-container">
      <Header
        isLogin={isLogin}
        hasToken={hasToken}
        setHasToken={setHasToken}
        section={section}
        setSection={setSection}
        onLoginClick={createOauthPopup}
      />
      <main className="section-container">
        <Section id="overview" ref={sectionRef}>
          <Overview onClick={createOauthPopup} />
        </Section>
        <Section id="how-to-use" ref={sectionRef}>
          <HowToUse />
        </Section>
      </main>
    </div>
  );
}
