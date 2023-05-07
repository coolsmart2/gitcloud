import { useEffect, useState } from 'react';

const DEFAULT_VERTICAL_LINE_WIDTH = 5;
const DEFAULT_EXPLORER_WIDTH = 300;

export default function useExplorerResize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [explorerWidth, setExplorerWidth] = useState(DEFAULT_EXPLORER_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const handleExplorerWidth = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'auto';
    };

    const handleMouseMove = (e: MouseEvent) => {
      console.log('mouse move');
      if (isResizing) {
        setExplorerWidth(
          Math.max(
            0,
            Math.min(
              e.clientX || e.pageX,
              windowWidth - DEFAULT_VERTICAL_LINE_WIDTH
            )
          )
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return [
    explorerWidth,
    DEFAULT_VERTICAL_LINE_WIDTH,
    windowWidth - DEFAULT_VERTICAL_LINE_WIDTH - explorerWidth,
    handleExplorerWidth,
  ] as const;
}
