import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import React, { useCallback, useMemo, useState } from 'react';
import { RepoInfoResponse } from '../../types/response.type';
import RepoIcon from '../../components/RepoIcon';
import ContextMenu from '../../components/ContextMenu';
import Modal from '../../components/Modal';
import './index.scss';
import { postGitHubCreateRepoAPI } from '../../apis/github';

export default function GitHub() {
  const [repos, setRepos] = useState<RepoInfoResponse[]>(
    useLoaderData() as RepoInfoResponse[]
  );
  const navigate = useNavigate();

  const [checkedRepo, setCheckedRepo] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    type: 'repository' | 'background' | undefined;
    pos: { x: number; y: number };
    target: RepoInfoResponse | undefined;
  }>({
    type: undefined,
    pos: { x: 0, y: 0 },
    target: undefined,
  });
  const [createRepoModal, setCreateRepoModal] = useState<
    'public' | 'private' | null
  >(null);
  const [newReponame, setNewReponame] = useState('');
  const [isCreateRepoLoading, setIsCreateRepoLoading] = useState(false);

  const handleBackgroundContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        ...contextMenu,
        type: 'background',
        pos: { x: e.clientX | e.pageX, y: e.clientY | e.pageY },
      });
    },
    []
  );

  const handleBackgroundMouseDown = useCallback(() => {
    setContextMenu({
      type: undefined,
      pos: { x: 0, y: 0 },
      target: undefined,
    });
    setCheckedRepo(null);
  }, []);

  const handleRepoClick = useCallback(
    ({ name, defaultBranch }: { name: string; defaultBranch: string }) => {
      return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setCheckedRepo(name);
        if (e.detail == 2) {
          navigate(`/github/${name}?ref=${defaultBranch}`);
        }
      };
    },
    []
  );

  const handleRepoContextMenu = useCallback((repo: RepoInfoResponse) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        ...contextMenu,
        type: 'repository',
        pos: { x: e.clientX | e.pageX, y: e.clientY | e.pageY },
        target: repo,
      });
      setCheckedRepo(repo.name);
    };
  }, []);

  const backgroundContextMenuItems = useMemo(
    () => [
      {
        label: '공개 레포지토리 생성',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          setCheckedRepo(null);
          setCreateRepoModal('public');
          setNewReponame('');
        },
      },
      {
        label: '비공개 레포지토리 생성',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          setCheckedRepo(null);
          setCreateRepoModal('private');
          setNewReponame('');
        },
      },
    ],
    []
  );

  const repositoryContextMenuItems = useMemo(
    () => [
      {
        label: '삭제',
        onClick: () => {},
      },
    ],
    []
  );

  return (
    <div className="github-container">
      <main
        className="github-background"
        onContextMenu={handleBackgroundContextMenu}
        onMouseDown={handleBackgroundMouseDown}
      >
        {repos.map(repo => (
          <RepoIcon
            key={repo.id}
            checked={checkedRepo === repo.name}
            onClick={handleRepoClick({
              name: repo.name,
              defaultBranch: repo.defaultBranch,
            })}
            onContextMenu={handleRepoContextMenu(repo)}
            {...repo}
          />
        ))}
      </main>
      <section className="github-repo">
        <Outlet />
      </section>
      {contextMenu.type === 'background' && (
        <ContextMenu items={backgroundContextMenuItems} pos={contextMenu.pos} />
      )}
      {contextMenu.type === 'repository' && (
        <ContextMenu items={repositoryContextMenuItems} pos={contextMenu.pos} />
      )}
      <Modal
        title={`${
          createRepoModal === 'public' ? '공개' : '비공개'
        } 레포지토리 생성`}
        isOpen={!!createRepoModal}
        onClose={() => {
          setCreateRepoModal(null);
        }}
      >
        <form
          className="new-repo-form"
          onSubmit={async e => {
            e.preventDefault();
            setIsCreateRepoLoading(true);
            try {
              const { data } = await postGitHubCreateRepoAPI({
                reponame: newReponame,
                isPrivate: createRepoModal === 'private',
              });
              setRepos([...repos, data]);
              setCreateRepoModal(null);
            } catch (err) {
              console.log(err);
            }
            setIsCreateRepoLoading(false);
          }}
        >
          <input
            className="new-repo-form__input"
            value={newReponame}
            onChange={e => setNewReponame(e.target.value)}
          />
          <button className="new-repo-form__submit" type="submit">
            {isCreateRepoLoading ? (
              <AiOutlineLoading3Quarters className="new-repo__spinner" />
            ) : (
              '생성'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
