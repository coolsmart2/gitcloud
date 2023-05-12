import { GoFile } from 'react-icons/go';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import { DirectoryInfo, FileInfo } from '../../types/repo.type';
import { useEffect, useRef, useState } from 'react';
import './index.scss';

interface FileProps {
  depth: number;
  info: FileInfo;
  parent?: DirectoryInfo;
}

export default function File({ depth, info, parent }: FileProps) {
  const { name, path, originalPath } = info;
  const { selectedPath, focusedPath, renamePath, changedFiles } =
    useRepoValue();
  const { selectFile, showContextMenu, escape, renameFile } = useRepoActions();
  const [fileName, setFileName] = useState(name);
  const fileRef = useRef<HTMLInputElement>(null);

  // const isModified =
  //   path in changedFiles &&
  //   (changedFiles[path].state === 'modified' ||
  //     changedFiles[path].state === 'renamed');

  const isModified = false;

  const isRenaming =
    name === '' || (renamePath && renamePath && path === renamePath.current);

  useEffect(() => {
    if (fileRef.current) {
      fileRef.current.select();
      fileRef.current.focus();
    }
  }, [renamePath]);

  return (
    <div
      className={`file-wrapper${isModified ? ' modified' : ''}${
        selectedPath && path === selectedPath.current ? ' selected' : ''
      }${focusedPath && path === focusedPath.current ? ' focused' : ''}`}
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
        if (path === '') return;
        selectFile(info);
      }}
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu('file', info, {
          x: e.clientX || e.pageX,
          y: e.clientY || e.pageY,
        });
      }}
    >
      <GoFile className="file__icon" size={18} />
      {!isRenaming ? (
        <div className="file__name">{name}</div>
      ) : (
        <input
          value={fileName}
          className="file__input"
          ref={fileRef}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (name === '') {
                renameFile(info, {
                  path: path.replace(new RegExp(name + '$'), fileName),
                  originalPath: path.replace(new RegExp(name + '$'), fileName),
                  name: fileName,
                });
              } else {
                renameFile(info, {
                  ...info,
                  path: path.replace(new RegExp(name + '$'), fileName),
                  name: fileName,
                });
              }
            }
            if (e.key === 'Escape') {
              setFileName(name);
              escape();
            }
          }}
          onClick={e => {
            e.stopPropagation();
          }}
          onChange={e => {
            setFileName(e.target.value);
          }}
        />
      )}
    </div>
  );
}
