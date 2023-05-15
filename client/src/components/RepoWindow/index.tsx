import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoEditor from '../RepoEditor';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import useExplorerResize from '../../hooks/useExplorerResize';
import './index.scss';
import RepoHeader from '../RepoHeader';

export default function RepoWindow() {
  const { reponame } = useParams() as { reponame?: string };
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?
  const navigate = useNavigate();

  const { tab } = useRepoValue();
  const { setReponame, setBranchname, escape } = useRepoActions();

  const [explorerWidth, lineWidth, contentWidth, setExplorerWidth] =
    useExplorerResize();

  useEffect(() => {
    const branchname = query.get('ref');

    if (!branchname || !reponame) {
      navigate('/github');
      return;
    }
    setReponame(reponame);
    setBranchname(query.get('ref') ?? 'main');
  }, [reponame, query]);

  return (
    <div
      className="repo-window-container"
      onMouseDown={() => {
        escape();
      }}
    >
      <div className="repo-window__header">
        <RepoHeader />
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
