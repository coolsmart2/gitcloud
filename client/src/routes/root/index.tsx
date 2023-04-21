import { Link, useNavigate } from 'react-router-dom';
import './index.scss';
import { useEffect, useState } from 'react';
import useScrollToSection from '../../hooks/useScrollToSection';
import axios from 'axios';

export default function Root() {
  const navigate = useNavigate();

  const [section, sectionRef] = useScrollToSection();
  const [oauthPopup, setOauthPopup] = useState<Window | null>(null);

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
      <header className="header">
        <div className="header__logo">
          <Link to="/">GitCloud</Link>
        </div>
        <nav className="header__navbar navbar">
          <ul className="navbar__list list">
            <li
              className={`list__item${
                section === 'overview' ? ' list__item--active' : ''
              }`}
              onClick={() => navigate('/#overview')}
            >
              개요
            </li>
            <li
              className={`list__item${
                section === 'how-to-use' ? ' list__item--active' : ''
              }`}
              onClick={() => navigate('/#how-to-use')}
            >
              사용방법
            </li>
          </ul>
        </nav>
        <div className="header__login-wrapper login">
          <button className="login__github" onClick={createOauthPopup}>
            <b>GitHub</b>로 시작하기
          </button>
        </div>
      </header>
      <section id="overview" className="root-section" ref={sectionRef}>
        <div className="section-content">
          <h1>GitCloud로 언제 어디서든 문서작업 버전 관리</h1>
          <p>문서를 더 효율적으로 관리할 수 있어요.</p>
          <p>코딩을 하지 않아도 GitHub를 사용해볼 수 있어요.</p>
          <div className="section__login-wrapper login">
            <button className="login__github" onClick={createOauthPopup}>
              <b>GitHub</b>로 시작하기
            </button>
          </div>
        </div>
      </section>
      <hr />
      <section
        id="how-to-use"
        className="root-section"
        ref={sectionRef}
      ></section>
    </div>
  );
}
