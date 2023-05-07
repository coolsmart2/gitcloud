import { Link, useLocation, useParams } from 'react-router-dom';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useEffect } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoEditor from '../RepoEditor';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import useExplorerResize from '../../hooks/useExplorerResize';
import './index.scss';

export default function RepoWindow() {
  const { reponame } = useParams() as { reponame: string };
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?

  const { tab } = useRepoValue();
  const { setReponame, setBranchname, initDefault } = useRepoActions();

  const [explorerWidth, lineWidth, contentWidth, setExplorerWidth] =
    useExplorerResize();

  useEffect(() => {
    setReponame(reponame);
    setBranchname(query.get('ref'));
  }, []);

  return (
    <div
      className="repo-window-container"
      onMouseDown={() => {
        initDefault();
      }}
    >
      <div className="repo-window__header">
        <h1 className="repo-window__title">{reponame}</h1>
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <div className="repo-window__body">
        <div className="repo-window__sidebar" style={{ width: explorerWidth }}>
          <RepoExplorer />
        </div>
        <div
          className="repo-window__vertical"
          style={{ left: explorerWidth }}
          onMouseDown={setExplorerWidth}
        />
        <div
          className="repo-window__content"
          style={{
            width: contentWidth,
            left: explorerWidth + lineWidth,
          }}
        >
          {tab.length > 0 && (
            <>
              <div className="repo-window__content__tab">
                <RepoTab />
              </div>
              <div className="repo-window__content__editor">
                <RepoEditor />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
