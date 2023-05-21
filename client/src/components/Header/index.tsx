import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUserState from '../../hooks/useUserState';
import { postTokenAPI } from '../../apis/user';
import './index.scss';

const NAV_LIST = [
  {
    label: '개요',
    id: 'overview',
  },
  {
    label: '토큰 발급',
    id: 'get-token',
  },
  {
    label: '토큰 등록',
    id: 'register-token',
  },
];

interface HeaderProps {
  section: string;
  setSection: (section: string) => void;
  onLoginClick: () => void;
}

export default function Header({
  section,
  setSection,
  onLoginClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useUserState();

  const [token, setToken] = useState('');
  const [isTokenOpen, setIsTokenOpen] = useState(false);

  const isLogin = !!user;
  const hasToken = !!user && user.hasToken;

  const handleSummit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        await postTokenAPI({ token });
        setUser({ ...user, hasToken: true });
        setIsTokenOpen(false);
      } catch (error) {
        console.log(error);
      }
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
            {NAV_LIST.map(({ label, id }) => (
              <li
                key={id}
                className={
                  section === id
                    ? 'list__item  list__item--active'
                    : 'list__item'
                }
                onClick={() => {
                  navigate(`/#${id}`);
                  setSection(id);
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </nav>
        {isLogin ? (
          <>
            <div className="header__token-wrapper">
              <button
                className="token__button"
                onClick={() => setIsTokenOpen(prev => !prev)}
              >
                토큰
              </button>
            </div>
            <div className="header__button-wrapper">
              <button
                className="button-start"
                onClick={onLoginClick}
                disabled={!hasToken}
              >
                시작하기
              </button>
            </div>
          </>
        ) : (
          <div className="header__button-wrapper">
            <button className="login__github" onClick={onLoginClick}>
              <b>GitHub</b>로 시작하기
            </button>
          </div>
        )}
      </header>
      {isTokenOpen && (
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
