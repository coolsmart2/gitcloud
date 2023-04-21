import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HEADER_HEIGHT = 80;

interface SectionPos {
  [key: string]: {
    minHeight: number;
    maxHeight: number;
  };
}

export default function useScrollToSection() {
  const navigate = useNavigate();
  const [sectionPos, setSectionPos] = useState<SectionPos>({});
  const [section, setSection] = useState('overview');
  const [mode, setMode] = useState<'scroll' | 'click'>('scroll');
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

  const handleSectionScroll = useCallback(() => {
    setScroll(window.scrollY);
  }, []);

  const handleSectionClick = useCallback((section: string) => {
    navigate(`/#${section}`);
    setSection(section);
    setMode('click');
  }, []);

  const handlePreventWheelScroll = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handlePreventKeyBoardScroll = useCallback((e: KeyboardEvent) => {
    const keys = [32, 33, 34, 35, 37, 38, 39, 40];
    if (keys.includes(e.keyCode)) {
      e.preventDefault();
      return false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleSectionScroll);
    return () => {
      window.removeEventListener('scroll', handleSectionScroll);
      window.removeEventListener('wheel', handlePreventWheelScroll);
      window.removeEventListener('keydown', handlePreventKeyBoardScroll);
    };
  }, []);

  useEffect(() => {
    if (mode == 'click') {
      if (scroll == sectionPos[section].minHeight) {
        setMode('scroll');
      }
      return;
    }
    for (const name in sectionPos) {
      if (
        scroll >= sectionPos[name].minHeight &&
        scroll < sectionPos[name].maxHeight
      ) {
        setSection(name);
        break;
      }
    }
  }, [scroll, mode]);

  useEffect(() => {
    if (mode == 'scroll') {
      window.removeEventListener('wheel', handlePreventWheelScroll);
      window.removeEventListener('keydown', handlePreventKeyBoardScroll);
      return;
    }
    window.addEventListener('wheel', handlePreventWheelScroll, {
      passive: false,
    });
    window.addEventListener('keydown', handlePreventKeyBoardScroll);
    window.scrollTo({
      top: sectionPos[section].minHeight,
      behavior: 'smooth', // TODO: 부드럽게 이동시 스크롤 이벤트 발생하여 메뉴바 깜박거리는 현상
    });
  }, [mode, section]);

  return [section, handleSectionClick, ref] as [
    string,
    (section: string) => void,
    (node: HTMLElement) => void
  ];
}
