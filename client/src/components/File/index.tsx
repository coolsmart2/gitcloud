import { GoFile } from 'react-icons/go';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';

interface FileProps {
  depth: number;
  name: string;
  path: string;
}

export default function File({ name, path, depth }: FileProps) {
  const { workspace, setWorkspace } = useRepoContext();

  return (
    <div
      className="file-wrapper"
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        setWorkspace({ ...workspace, currPath: path });
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
