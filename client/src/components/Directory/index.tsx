import { GoFileDirectory } from 'react-icons/go';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import File from '../File';
import { TreeBlobResponse } from '../../types/response';
import './index.scss';
import { useRepoContext } from '../../contexts/RepoContext';

interface DirectoryProps {
  depth: number;
  name: string;
  path: string;
  tree: TreeBlobResponse[];
}

export default function Directory({ depth, name, path, tree }: DirectoryProps) {
  const {
    action: { openContextMenu, setMousePos },
  } = useRepoContext();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div
        className="dir-wrapper"
        style={{ paddingLeft: `${10 * depth}px` }}
        onClick={() => setIsOpened(prev => !prev)}
        onContextMenu={e => {
          e.preventDefault();
          openContextMenu('directory');
          setMousePos({ x: e.clientX || e.pageX, y: e.clientY || e.pageY });
        }}
      >
        {isOpened ? (
          <MdKeyboardArrowDown size={18} />
        ) : (
          <MdKeyboardArrowRight size={18} />
        )}
        <GoFileDirectory className="dir__icon" size={18} />
        <div className="dir__name">{name}</div>
      </div>
      {isOpened &&
        tree.map(data => {
          if (data.type === 'tree') {
            return (
              <Directory
                depth={depth + 1}
                name={data.path}
                path={`${path}/${data.path}`}
                tree={data.tree!}
                key={data.sha}
              />
            );
          }
          return (
            <File
              name={data.path}
              path={`${path}/${data.path}`}
              depth={depth + 1}
              key={data.sha}
            />
          );
        })}
    </>
  );
}
