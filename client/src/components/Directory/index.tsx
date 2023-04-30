import { GoFileDirectory } from 'react-icons/go';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import './index.scss';
import { useState } from 'react';
import { Tree } from '../../types';
import File from '../File';

interface DirectoryProps {
  depth: number;
  name: string;
  path: string;
  tree: Tree[];
}

export default function Directory({ depth, name, path, tree }: DirectoryProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div
        className="dir-wrapper"
        style={{ paddingLeft: `${10 * depth}px` }}
        onClick={() => setIsOpened(prev => !prev)}
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
          if (data.type === 'dir') {
            return (
              <Directory
                depth={depth + 1}
                name={data.name}
                path={`${path}/${data.name}`}
                tree={data.tree!}
                key={data.sha}
              />
            );
          }
          return (
            <File
              name={data.name}
              path={`${path}/${data.name}`}
              depth={depth + 1}
              key={data.sha}
            />
          );
        })}
    </>
  );
}
