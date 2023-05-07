import { useContext, useLayoutEffect } from 'react';
import './index.scss';

interface ContextMenuProps {
  items: {
    label: string;
    onClick: () => void;
  }[];
  pos: {
    x: number;
    y: number;
  };
}

export default function ContextMenu({ items, pos }: ContextMenuProps) {
  return (
    <div className="context-menu" style={{ left: pos.x, top: pos.y }}>
      {items.map(({ label, onClick }, index) => (
        <div className="context-menu__item" key={index} onClick={onClick}>
          {label}
        </div>
      ))}
    </div>
  );
}
