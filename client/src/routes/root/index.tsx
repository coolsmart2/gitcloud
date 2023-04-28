import './index.scss';
import useScrollToSection from '../../hooks/useScrollToSection';
import Header from '../../components/Header';
import Section from '../../components/Section';
import Overview from '../../components/Section/Overview';
import HowToUse from '../../components/Section/HowToUse';
import useOAuthPopup from '../../hooks/useOAuthPopup';

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
        <Section id="how-to-use" ref={sectionRef}>
          <HowToUse />
        </Section>
      </main>
    </div>
  );
}
