import { Link } from 'react-router-dom';
import './index.scss';

interface HeaderProps {
  isLogin: boolean;
  hasToken: boolean;
  section: string;
  setSection: (section: string) => void;
  onLoginClick: () => void;
  onTokenClick: () => void;
}

export default function Header({
  isLogin,
  hasToken,
  section,
  setSection,
  onLoginClick,
  onTokenClick,
}: HeaderProps) {
  const initStart = !isLogin && !hasToken;
  const canStart = isLogin && hasToken;

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">GitCloud</Link>
      </div>
      <nav className="header__navbar navbar">
        <ul className="navbar__list list">
          <li
            className={
              section === 'overview'
                ? 'list__item  list__item--active'
                : 'list__item'
            }
            onClick={() => {
              setSection('overview');
            }}
          >
            개요
          </li>
          <li
            className={
              section === 'how-to-use'
                ? 'list__item  list__item--active'
                : 'list__item'
            }
            onClick={() => {
              setSection('how-to-use');
            }}
          >
            사용방법
          </li>
        </ul>
      </nav>
      {isLogin && (
        <div className="header__token-wrapper">
          <button className="token__button" onClick={onTokenClick}>
            토큰 입력
          </button>
        </div>
      )}
      {initStart && (
        <div className="header__button-wrapper">
          <button className="login__github" onClick={onLoginClick}>
            <b>GitHub</b>로 시작하기
          </button>
        </div>
      )}
      {!initStart && (
        <div className="header__button-wrapper">
          <button
            className="button-start"
            onClick={onLoginClick}
            disabled={!canStart}
          >
            시작하기
          </button>
        </div>
      )}
    </header>
  );
}
