import { GoFile } from 'react-icons/go';
import './index.scss';

interface FileProps {
  name: string;
  depth: number;
}

export default function File({ name, depth }: FileProps) {
  return (
    <div
      className="file-wrapper"
      style={{ paddingLeft: `${10 * depth + 23}px` }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
