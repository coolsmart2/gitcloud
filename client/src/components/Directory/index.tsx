import { GoFileDirectory } from 'react-icons/go';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import File from '../File';
import { DirectoryInfo } from '../../types/repo.type';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import './index.scss';

interface DirectoryProps {
  depth: number;
  info: DirectoryInfo;
  parent?: DirectoryInfo;
}

export default function Directory({ depth, info, parent }: DirectoryProps) {
  const { name, path, children } = info;
  const { selectedPath, focusedPath, renamePath, changedFiles } =
    useRepoValue();
  const { showContextMenu } = useRepoActions();
  const [isDirOpened, setIsDirOpened] = useState(false);

  return (
    <>
      <div
        className={`dir-wrapper${
          selectedPath && path === selectedPath.current ? ' selected' : ''
        }${focusedPath && path === focusedPath.current ? ' focused' : ''}`}
        style={{ paddingLeft: `${10 * depth}px` }}
        onClick={() => setIsDirOpened(prev => !prev)}
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
          showContextMenu('directory', info, {
            x: e.clientX || e.pageX,
            y: e.clientY || e.pageY,
          });
        }}
      >
        {isDirOpened ? (
          <MdKeyboardArrowDown size={18} />
        ) : (
          <MdKeyboardArrowRight size={18} />
        )}
        <GoFileDirectory className="dir__icon" size={18} />
        {!renamePath || (renamePath && path !== renamePath.current) ? (
          <div className="dir__name">{name}</div>
        ) : null}
      </div>
      {isDirOpened &&
        children.map(item => {
          if ('children' in item) {
            return (
              <Directory
                depth={depth + 1}
                info={item}
                parent={info}
                key={item.path}
              />
            );
          } else if ('type' in item) {
          } else {
            return (
              <File
                depth={depth + 1}
                info={item}
                parent={info}
                key={item.path}
              />
            );
          }
        })}
    </>
  );
}
