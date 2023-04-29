import { GoFileDirectory } from 'react-icons/go';
import './index.scss';
import { useState } from 'react';
import { Tree } from '../../types';
import File from '../File';

interface DirectoryProps {
  depth: number;
  name: string;
  tree: Tree[];
}

export default function Directory({ depth, name, tree }: DirectoryProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div
        className="dir-wrapper"
        style={{ paddingLeft: `${20 * depth}px` }}
        onClick={() => setIsOpened(prev => !prev)}
      >
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
                tree={data.tree!}
                key={data.sha}
              />
            );
          }
          return <File name={data.name} depth={depth + 1} key={data.sha} />;
        })}
    </>
  );
}
