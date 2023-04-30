import { Link, useParams } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import React, { useContext, useEffect, useState } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoExplorerSkeleton from '../RepoExplorer/skeleton';
import './index.scss';
import RepoEditor from '../RepoEditor';
import { RepoProvider, useRepoContext } from '../../contexts/RepoContext';

const VERTICAL_LINE_WIDTH = 5;

export default function RepoWindow() {
  const { reponame } = useParams() as { reponame: string };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [verticalX, setVerticalX] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const {
    state: { path, branch },
  } = useRepoContext();

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    console.log(path, branch);
  }, [path, branch]);

  const handleMouseDown = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizing) {
      setVerticalX(e.clientX || e.pageX);
    }
  };

  return (
    <div className="repo-window-container">
      <div className="repo-window__header">
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <div
        className="repo-window__body"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="repo-window__sidebar" style={{ width: verticalX }}>
          <React.Suspense fallback={<RepoExplorerSkeleton />}>
            <RepoExplorer reponame={reponame} />
          </React.Suspense>
        </div>
        <div
          className="repo-window__vertical"
          style={{ left: verticalX }}
          onMouseDown={handleMouseDown}
        />
        <div
          className="repo-window__content"
          style={{
            width: windowWidth - verticalX - VERTICAL_LINE_WIDTH,
            left: verticalX + VERTICAL_LINE_WIDTH,
          }}
        >
          <div className="repo-window__content__editor">
            {path !== '/' && (
              <React.Suspense fallback={<div>loading...</div>}>
                <RepoEditor reponame={reponame} />
              </React.Suspense>
            )}
          </div>
          {/* <div className="repo-window__content__log">로그</div> */}
        </div>
      </div>
    </div>
  );
}
