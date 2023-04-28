import { Link, useNavigate } from 'react-router-dom';
import './index.scss';
import { useState } from 'react';
import axios from 'axios';

interface HeaderProps {
  isLogin: boolean;
  hasToken: boolean;
  setHasToken: (hasToken: boolean) => void;
  section: string;
  setSection: (section: string) => void;
  onLoginClick: () => void;
}

export default function Header({
  isLogin,
  hasToken,
  setHasToken,
  section,
  setSection,
  onLoginClick,
}: HeaderProps) {
  const navigate = useNavigate();

  const initStart = !isLogin && !hasToken;
  const canStart = isLogin && hasToken;

  const [token, setToken] = useState('');
  const [isTokenInput, setIsTokenInput] = useState(false);

  const handleSummit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8080/user/token',
        { token },
        { withCredentials: true }
      );
      setHasToken(true);
      setIsTokenInput(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
                navigate('/#overview');
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
                navigate('/#how-to-use');
                setSection('how-to-use');
              }}
            >
              사용방법
            </li>
          </ul>
        </nav>
        {isLogin && (
          <div className="header__token-wrapper">
            <button
              className="token__button"
              onClick={() => setIsTokenInput(prev => !prev)}
            >
              토큰
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
              onClick={() => navigate('/github')}
              disabled={!canStart}
            >
              시작하기
            </button>
          </div>
        )}
      </header>
      {isTokenInput && (
        <div className="token-container">
          <form className="token-form" onSubmit={handleSummit}>
            <input
              className="token-form__input"
              placeholder="github personal access token"
              type="password"
              maxLength={40}
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <button className="token-form__summit" type="submit">
              입력
            </button>
          </form>
        </div>
      )}
    </>
  );
}
