import './index.scss';
import useScrollToSection from '../../hooks/useScrollToSection';
import Header from '../../components/Header';
import Section from '../../components/Section';
import Overview from '../../components/Section/Overview';
import GetToken from '../../components/Section/GetToken';
import useOAuthPopup from '../../hooks/useOAuthPopup';
import RegisterToken from '../../components/Section/RegisterToken';

export default function Root() {
  const [section, setSection, sectionRef] = useScrollToSection();
  const openOAuthPopup = useOAuthPopup();

  return (
    <div className="root-container">
      <Header
        section={section}
        setSection={setSection}
        onLoginClick={openOAuthPopup}
      />
      <main className="section-container">
        <Section id="overview" ref={sectionRef}>
          <Overview onClick={openOAuthPopup} />
        </Section>
        <Section id="get-token" ref={sectionRef}>
          <GetToken />
        </Section>
        <Section id="register-token" ref={sectionRef}>
          <RegisterToken />
        </Section>
      </main>
    </div>
  );
}
