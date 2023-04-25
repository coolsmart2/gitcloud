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

  const smoothScroll = useCallback(
    (endX: number, endY: number, duration: number) => {
      const [startX, startY] = [window.scrollX, window.scrollY];
      const [distanceX, distanceY] = [endX - startX, endY - startY];
      const startTime = Date.now();

      const easeInOutQuart = (
        time: number,
        from: number,
        distance: number,
        duration: number
      ) => {
        if ((time /= duration / 2) < 1)
          return (distance / 2) * time * time * time * time + from;
        return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
      };

      const scrollAnimation = () => {
        const time = Date.now() - startTime;
        const [newX, newY] = [
          Math.round(easeInOutQuart(time, startX, distanceX, duration)),
          Math.round(easeInOutQuart(time, startY, distanceY, duration)),
        ];
        if (time > duration) {
          return;
        }
        window.scrollTo(newX, newY);
        requestAnimationFrame(scrollAnimation);
      };

      scrollAnimation();
    },
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleSectionScroll);
    return () => {
      window.removeEventListener('scroll', handleSectionScroll);
      window.removeEventListener('wheel', handlePreventWheelScroll);
      window.removeEventListener('keydown', handlePreventKeyBoardScroll);
    };
  }, []);

  useEffect(() => {
    if (mode === 'click') {
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
    if (mode === 'scroll') {
      window.removeEventListener('wheel', handlePreventWheelScroll);
      window.removeEventListener('keydown', handlePreventKeyBoardScroll);
      return;
    }
    window.addEventListener('wheel', handlePreventWheelScroll, {
      passive: false,
    });
    window.addEventListener('keydown', handlePreventKeyBoardScroll);
    smoothScroll(0, sectionPos[section].minHeight, 500);
  }, [section, mode]);

  return [section, handleSectionClick, ref] as [
    string,
    (section: string) => void,
    (node: HTMLElement) => void
  ];
}
