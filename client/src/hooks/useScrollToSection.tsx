import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SectionPos {
  [key: string]: {
    minHeight: number;
    maxHeight: number;
  };
}

const HEADER_HEIGHT = 80;

export default function useScrollToSection() {
  const { pathname, hash } = useLocation();
  const [sectionPos, setSectionPos] = useState<SectionPos>({});
  const [section, setSection] = useState('overview');
  const [scroll, setScroll] = useState(window.scrollY);

  const ref = useCallback((node: HTMLElement) => {
    if (node !== null) {
      sectionPos[node.id] = {
        minHeight:
          window.pageYOffset + node.getBoundingClientRect().top - HEADER_HEIGHT,
        maxHeight:
          window.pageYOffset +
          node.getBoundingClientRect().top -
          HEADER_HEIGHT +
          node.getBoundingClientRect().height,
      };
      setSectionPos(sectionPos);
    }
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    for (const sectionName in sectionPos) {
      if (
        scroll >= sectionPos[sectionName].minHeight &&
        scroll < sectionPos[sectionName].maxHeight
      ) {
        setSection(sectionName);
        break;
      }
    }
  }, [scroll]);

  useEffect(() => {
    if (!sectionPos) {
      return;
    }
    const sectionName = hash.slice(1);
    if (sectionName in sectionPos) {
      setSection(sectionName);
      window.scrollTo({
        top: sectionPos[sectionName].minHeight,
        // behavior: 'smooth', // TODO: 부드럽게 이동시 스크롤 이벤트 발생하여 메뉴바 깜박거리는 현상
      });
    }
  }, [pathname, hash]);

  return [section, ref];
}
