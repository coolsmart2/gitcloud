import { useState } from 'react';
import { GoFile } from 'react-icons/go';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import './index.scss';

interface FileProps {
  depth: number;
  name: string;
  path: string;
}

export default function File({ name, path, depth }: FileProps) {
  const { selectedPath, focusedPath, changedFiles } = useRepoValue();
  const { selectFile, focusPath } = useRepoActions();
  const isModified = path in changedFiles;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  return (
    <div
      className={`file-wrapper${isModified ? ' modified' : ''}${
        path === selectedPath ? ' selected' : ''
      }${path === focusedPath ? ' focused' : ''}`}
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        selectFile(path);
      }}
      onContextMenu={e => {
        e.preventDefault();
        focusPath(path);
      }}
    >
      <GoFile className="file__icon" size={18} />
      <div className="file__name">{name}</div>
    </div>
  );
}
