import { GoFileDirectory } from 'react-icons/go';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
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
  const { selectedPath, focusedPath, renamePath, explorer } = useRepoValue();
  const { showContextMenu, renameDir, escape } = useRepoActions();
  const [isDirOpened, setIsDirOpened] = useState(false);
  const [dirName, setDirName] = useState(name);
  const dirRef = useRef<HTMLInputElement>(null);

  const isRenaming =
    name === '' || (renamePath && renamePath && path === renamePath.current);

  useEffect(() => {
    if (children.some(item => item.name === '')) {
      setIsDirOpened(true);
    }
  }, [explorer]);

  useEffect(() => {
    if (dirRef.current) {
      dirRef.current.select();
      dirRef.current.focus();
    }
  }, [renamePath]);

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
        {!isRenaming ? (
          <div className="dir__name">{name}</div>
        ) : (
          <input
            value={dirName}
            className="file__input"
            ref={dirRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (name === '') {
                  renameDir(info, {
                    path: path ? `${path}/${dirName}` : dirName,
                    originalPath: path ? `${path}/${dirName}` : dirName,
                    name: dirName,
                    children: [],
                  });
                } else {
                  renameDir(info, {
                    ...info,
                    path: path.replace(new RegExp(name + '$'), dirName),
                    name: dirName,
                    children: [],
                  });
                }
              }
              if (e.key === 'Escape') {
                setDirName(name);
                escape();
              }
            }}
            onClick={e => {
              e.stopPropagation();
            }}
            onChange={e => {
              setDirName(e.target.value);
            }}
          />
        )}
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
