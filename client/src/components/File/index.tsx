import { GoFile } from 'react-icons/go';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import { DirectoryInfo, FileInfo } from '../../types/repo.type';
import './index.scss';
import { useEffect, useRef, useState } from 'react';

interface FileProps {
  depth: number;
  info: FileInfo;
  parent?: DirectoryInfo;
}

export default function File({ depth, info, parent }: FileProps) {
  const { name, path, originalPath, state } = info;
  const { selectedFile, focusedFile, changedFiles } = useRepoValue();
  const { selectFile, showContextMenu, escape, renameFile } = useRepoActions();
  const [fileName, setFileName] = useState(name);
  const fileRef = useRef<HTMLInputElement>(null);

  const isModified =
    path in changedFiles && changedFiles[path].state === 'modified';

  useEffect(() => {
    if (fileRef.current) {
      fileRef.current.select();
      fileRef.current.focus();
    }
  }, [state]);

  return (
    <div
      className={`file-wrapper${isModified ? ' modified' : ''}${
        path === selectedFile?.path ? ' selected' : ''
      }${path === focusedFile?.path ? ' focused' : ''}`}
      style={{ paddingLeft: `${10 * depth + 23}px` }}
      onClick={() => {
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
      {state === 'default' && <div className="file__name">{name}</div>}
      {state === 'rename' && (
        <input
          value={fileName}
          className="file__input"
          ref={fileRef}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              renameFile(info, {
                ...info,
                state: 'default',
                path: path.replace(new RegExp(name + '$'), fileName),
                name: fileName,
              });
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
