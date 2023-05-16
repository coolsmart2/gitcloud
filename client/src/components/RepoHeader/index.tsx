import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import { getGitHubCommitListAPI, postGitHubCommitAPI } from '../../apis/github';
import { convertChangedFilesToTree } from '../../utils/repo.util';
import './index.scss';

export default function RepoHeader() {
  const navigate = useNavigate();

  const { reponame, branchname, changedFiles, commitList } = useRepoValue();
  const { setCommitList, setExplorer } = useRepoActions();

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
      await fetchCommitList();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }, [reponame, branchname, changedFiles]);

  const handleOnChangeBranch = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!reponame || !branchname) {
        return;
      }
      const changedBranch = e.target.value;
      if (branchname === changedBranch) {
        return;
      }
      setCommitList({
        ...commitList,
        currBranch: changedBranch,
        currCommit: commitList.list[changedBranch][0].sha,
      });
      setExplorer(undefined);
      navigate(`/github/${reponame}?ref=${changedBranch}`);
    },
    [commitList]
  );

  const handleOnChangeCommit = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!reponame || !branchname) {
        return;
      }
      setCommitList({
        ...commitList,
        currCommit: e.target.value,
      });
      setExplorer(undefined);
    },
    [commitList]
  );

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
          <form className="repo-options__branch__form">
            <select
              className="repo-options__branch__form__select"
              value={commitList.currBranch ?? undefined}
              onChange={handleOnChangeBranch}
            >
              {commitList.currBranch &&
                Object.keys(commitList.list).map(branch => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </form>
        </button>
        <button className="repo-options__list">
          <form className="repo-options__list__form">
            <select
              className="repo-options__list__form__select"
              value={commitList.currCommit ?? undefined}
              onChange={handleOnChangeCommit}
            >
              {commitList.currBranch &&
                commitList.list[commitList.currBranch] &&
                commitList.list[commitList.currBranch].map(commit => (
                  <option key={commit.sha} value={commit.sha}>
                    {commit.name}
                  </option>
                ))}
            </select>
          </form>
        </button>
        <button className="repo-options__new-version" onClick={() => {}}>
          새 버전
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
