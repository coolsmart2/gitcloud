import { Link, Outlet } from 'react-router-dom';
import './index.scss';
import useScrollToSection from '../../hooks/useScrollToSection';

export default function Root() {
  useScrollToSection();

  return (
    <div className="root-container">
      <header className="header">
        <div className="header__logo">GitCloud</div>
        <nav className="header__navbar navbar">
          <ul className="navbar__list list">
            <li className="list__item">
              <Link to="/#overview">개요</Link>
            </li>
            <li className="list__item">
              <Link to="/#how-to-use">사용방법</Link>
            </li>
          </ul>
        </nav>
        <div className="header__login-wrapper login">
          <button className="login__github">Github</button>
        </div>
      </header>
      <section id="overview" className="root-section"></section>
      <hr />
      <section id="how-to-use" className="root-section"></section>
    </div>
  );
}
