import { Link } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import {
  getGitHubCommitListAPI,
  getGitHubRepoAPI,
  postGitHubCommitAPI,
} from '../../apis/github';
import { convertChangedFilesToTree } from '../../utils/repo.util';
import './index.scss';

export default function RepoHeader() {
  const { reponame, branchname, changedFiles, commitList } = useRepoValue();
  const { setCommitList, setExplorer } = useRepoActions();

  const handleSave = useCallback(async () => {
    if (!reponame || !branchname) {
      return;
    }
    console.log(changedFiles);
    try {
      const data = await postGitHubCommitAPI({
        reponame,
        ref: branchname,
        tree: convertChangedFilesToTree(changedFiles),
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }, [reponame, branchname, changedFiles]);

  const handleOnChangeCommit = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!reponame || !branchname) {
        return;
      }
      setCommitList({
        ...commitList,
        currCommit: e.target.value,
      });
      try {
        const { data } = await getGitHubRepoAPI({
          reponame,
          branchname,
          ref: e.target.value,
        });
        setExplorer(data);
      } catch (err) {
        console.log(err);
      }
    },
    [commitList]
  );

  const fetchCommitList = useCallback(async () => {
    if (!reponame || !branchname) {
      return;
    }
    try {
      const { data } = await getGitHubCommitListAPI({
        reponame,
      });
      setCommitList({
        currBranch: branchname,
        currCommit: data[branchname][0].sha,
        list: data,
      });
    } catch (err) {
      console.log(err);
    }
  }, [reponame, branchname]);

  useEffect(() => {
    if (!reponame || !branchname) {
      return;
    }
    fetchCommitList();
  }, [reponame, branchname]);

  return (
    <div className="repo-header">
      <div className="repo-header__title">
        <span className="repo-title__reponame">{reponame}</span>
        <span className="repo-title__branchname">{branchname}</span>
      </div>
      <div className="repo-header__options">
        <button className="repo-options__branch">
          <form>
            <select defaultValue={commitList.currBranch ?? undefined}>
              {branchname &&
                Object.keys(commitList.list).map(branch => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </form>
        </button>
        <button className="repo-options__list">
          <form>
            <select
              defaultValue={commitList.currCommit ?? undefined}
              onChange={handleOnChangeCommit}
            >
              {branchname &&
                commitList.list[branchname] &&
                commitList.list[branchname].map(commit => (
                  <option key={commit.sha} value={commit.sha}>
                    {commit.name}
                  </option>
                ))}
            </select>
          </form>
        </button>
        <button className="repo-options__save" onClick={handleSave}>
          저장하기
        </button>
      </div>
      <Link to="/github">
        <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
      </Link>
    </div>
  );
}
