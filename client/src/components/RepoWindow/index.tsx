import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import RepoExplorer from '../RepoExplorer';
import RepoEditor from '../RepoEditor';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoTab from '../RepoTab';
import useExplorerResize from '../../hooks/useExplorerResize';
import RepoHeader from '../RepoHeader';
import './index.scss';

export default function RepoWindow() {
  const { reponame: reponameParam } = useParams() as { reponame?: string };
  const query = new URLSearchParams(useLocation().search); // 이런식으로 컴포넌트에 변수를 선언해도 될까?
  const navigate = useNavigate();

  const { reponame, branchname, tab } = useRepoValue();
  const { setReponame, setBranchname, escape } = useRepoActions();

  const [explorerWidth, lineWidth, contentWidth, setExplorerWidth] =
    useExplorerResize();

  useEffect(() => {
    const branchnameQuery = query.get('ref');

    if (!branchnameQuery || !reponameParam) {
      navigate('/github');
      return;
    }

    if (reponameParam !== reponame) {
      setReponame(reponameParam);
    }

    if (branchnameQuery !== branchname) {
      setBranchname(branchnameQuery);
    }
  }, [reponameParam, query]);

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
