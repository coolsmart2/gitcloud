import { GoFileDirectory } from 'react-icons/go';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import File from '../File';
import { DirectoryInfo, FileInfo } from '../../types/repo.type';
import { useRepoValue } from '../../contexts/RepoContext';
import './index.scss';

interface DirectoryProps {
  depth: number;
  name: string;
  path: string;
  children: (FileInfo | DirectoryInfo)[];
}

export default function Directory({
  depth,
  name,
  path,
  children,
}: DirectoryProps) {
  const { selectedPath, focusedPath, changedFiles } = useRepoValue();
  const [isDirOpened, setIsDirOpened] = useState(false);

  return (
    <>
      <div
        className={`dir-wrapper${path === selectedPath ? ' selected' : ''}${
          path === focusedPath ? ' focused' : ''
        }`}
        style={{ paddingLeft: `${10 * depth}px` }}
        onClick={() => setIsDirOpened(prev => !prev)}
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        {isDirOpened ? (
          <MdKeyboardArrowDown size={18} />
        ) : (
          <MdKeyboardArrowRight size={18} />
        )}
        <GoFileDirectory className="dir__icon" size={18} />
        <div className="dir__name">{name}</div>
      </div>
      {isDirOpened &&
        children.map(item => {
          if ('children' in item) {
            return (
              <Directory
                depth={depth + 1}
                name={item.name}
                path={item.path}
                children={item.children}
                key={item.path}
              />
            );
          }
          return (
            <File
              depth={depth + 1}
              name={item.name}
              path={item.path}
              key={item.path}
            />
          );
        })}
    </>
  );
}
