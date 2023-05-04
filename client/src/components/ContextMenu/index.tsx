import { useContext, useLayoutEffect } from 'react';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';

interface ContextMenuProps {
  items: {
    label: string;
    onClick: () => void;
  }[];
}

export default function ContextMenu({ items }: ContextMenuProps) {
  const {
    state: { mousePos },
  } = useRepoContext();
  return (
    <div className="context-menu" style={{ left: mousePos.x, top: mousePos.y }}>
      {items.map(({ label, onClick }, index) => (
        <div className="context-menu__item" key={index} onClick={onClick}>
          {label}
        </div>
      ))}
    </div>
  );
}
