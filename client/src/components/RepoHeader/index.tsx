import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import {
  getGitHubCommitListAPI,
  postGitHubCommitAPI,
  postGitHubNewBranchAPI,
} from '../../apis/github';
import {
  convertChangedFilesToTree,
  mergeChangedFilesToCachedFiles,
} from '../../utils/repo.util';
import './index.scss';
import Modal from '../Modal';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function RepoHeader() {
  const navigate = useNavigate();

  const { reponame, branchname, cachedFiles, changedFiles, commitList } =
    useRepoValue();
  const { setCommitList, setExplorer, setChangedFiles } = useRepoActions();

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [isNewBranchLoading, setIsNewBranchLoading] = useState(false);

  const fetchCommitList = useCallback(
    async (branchname: string) => {
      if (!reponame) {
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
    },
    [reponame, branchname]
  );

  const handleSave = useCallback(() => {
    if (!reponame || !branchname) {
      return;
    }
    setSaveMessage(Date().toString());
    setIsSaveModalOpen(true);
  }, [reponame, branchname]);

  const handleNewBranch = useCallback(() => {
    if (!reponame || !branchname) {
      return;
    }
    setNewBranchName('');
    setIsNewBranchModalOpen(true);
  }, [reponame, branchname]);

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
    fetchCommitList(branchname);
  }, [reponame, branchname]);

  return (
    <>
      <div className="repo-header">
        <div className="repo-header__title">
          <span className="repo-title__reponame">{reponame}</span>
          <span className="repo-title__branchname">{branchname}</span>
        </div>
        <div className="repo-header__options">
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
          <button
            className="repo-options__new-version"
            onClick={handleNewBranch}
          >
            새 버전
          </button>
          <button
            className="repo-options__save"
            onClick={handleSave}
            disabled={Object.keys(changedFiles).length === 0}
          >
            저장하기
          </button>
        </div>
        <Link to="/github">
          <RiCloseCircleFill size={35} color="red" cursor={'pointer'} />
        </Link>
      </div>
      <Modal
        title="저장하기"
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      >
        <form
          className="save-commit-form"
          onSubmit={async e => {
            e.preventDefault();
            if (!reponame || !branchname) {
              return;
            }
            console.log(changedFiles);
            setIsSaveLoading(true);
            try {
              const data = await postGitHubCommitAPI({
                reponame,
                ref: branchname,
                tree: convertChangedFilesToTree(changedFiles),
                message: saveMessage,
              });
              await fetchCommitList(branchname);
              console.log(data);
            } catch (err) {
              console.log(err);
            }
            mergeChangedFilesToCachedFiles(cachedFiles, changedFiles);
            setChangedFiles({});
            setIsSaveLoading(false);
            setIsSaveModalOpen(false);
          }}
        >
          <input
            className="save-commit-form__input"
            value={saveMessage}
            onChange={e => setSaveMessage(e.target.value)}
          />
          <button className="save-commit-form__submit" type="submit">
            {isSaveLoading ? (
              <AiOutlineLoading3Quarters className="save__spinner" />
            ) : (
              '저장'
            )}
          </button>
        </form>
      </Modal>
      <Modal
        title="새 버전 생성"
        isOpen={isNewBranchModalOpen}
        onClose={() => setIsNewBranchModalOpen(false)}
      >
        <form
          className="new-branch-form"
          onSubmit={async e => {
            e.preventDefault();
            if (!reponame || !branchname || !commitList.currCommit) {
              return;
            }
            setIsNewBranchLoading(true);
            try {
              const { data } = await postGitHubNewBranchAPI({
                reponame,
                branchname: newBranchName,
                commitSHA: commitList.currCommit,
              });
              await fetchCommitList(newBranchName);
              setExplorer(undefined);
              navigate(`/github/${reponame}?ref=${newBranchName}`);
              console.log(data);
            } catch (err) {
              console.log(err);
            }
            setIsNewBranchLoading(false);
            setIsNewBranchModalOpen(false);
          }}
        >
          <input
            className="new-branch-form__input"
            value={newBranchName}
            onChange={e => setNewBranchName(e.target.value)}
          />
          <button className="new-branch-form__submit" type="submit">
            {isNewBranchLoading ? (
              <AiOutlineLoading3Quarters className="save__spinner" />
            ) : (
              '생성'
            )}
          </button>
        </form>
      </Modal>
    </>
  );
}
