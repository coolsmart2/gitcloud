import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollToSection() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, hash]);

  return null;
}
