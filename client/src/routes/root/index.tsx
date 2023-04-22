import './index.scss';
import { useEffect, useState } from 'react';
import useScrollToSection from '../../hooks/useScrollToSection';
import axios from 'axios';
import Header from '../../components/Header';
import Section from '../../components/Section';
import Overview from '../../components/Section/Overview';
import HowToUse from '../../components/Section/HowToUse';

export default function Root() {
  const [section, setSection, sectionRef] = useScrollToSection();
  const [oauthPopup, setOauthPopup] = useState<Window | null>(null);
  const [user, setUser] = useState<string>('');

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
    const loginPopupInterval = setInterval(async () => {
      const currentUrl = oauthPopup.location.href;
      const params = new URL(currentUrl).searchParams;
      const code = params.get('code');
      if (!code) {
        return;
      }
      clearInterval(loginPopupInterval);
      oauthPopup.close();
      setOauthPopup(null);
      const { data } = await axios.post(
        'http://localhost:8080/github/oauth',
        { code },
        { withCredentials: true }
      );
      console.log(data); // TODO: code를 이용해서 oauth 로그인
    }, 500);
    return () => {
      clearInterval(loginPopupInterval);
      oauthPopup?.close();
      setOauthPopup(null);
    };
  }, [oauthPopup]);

  return (
    <div className="root-container">
      <Header
        isLogin={false}
        hasToken={false}
        section={section}
        setSection={setSection}
        onLoginClick={createOauthPopup}
        onTokenClick={() => {}}
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
