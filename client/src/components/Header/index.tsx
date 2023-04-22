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
}: HeaderProps) {
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
      <div className="header__login-wrapper login">
        <button className="login__github" onClick={onLoginClick}>
          <b>GitHub</b>로 시작하기
        </button>
      </div>
    </header>
  );
}
