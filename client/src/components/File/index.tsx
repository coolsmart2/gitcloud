import { GoFile } from 'react-icons/go';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';

interface FileProps {
  name: string;
  path: string;
  depth: number;
}

export default function File({ name, path, depth }: FileProps) {
  const {
    actions: { setPath },
  } = useRepoContext();

  return (
    <div
      className="file-wrapper"
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        setPath(path);
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
