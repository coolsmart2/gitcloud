import { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  ChangedFileDirectoryState,
  CachedFileState,
  Explorer,
  FileInfo,
  DirectoryInfo,
} from '../types/repo.type';
import { TreeBlobResponse } from '../types/response.type';
import {
  addFileToExplorer,
  convertBase64ToString,
  convertTreeBlobResponseToExplorer,
  removeRenamingFile,
  findFileDirectory,
  removeFileFromExplorer,
} from '../utils/repo.util';
import ContextMenu from '../components/ContextMenu';

interface RepoValue {
  reponame: string | undefined;
  selectedPath:
    | {
        current: string;
        original: string;
      }
    | undefined;
  focusedPath:
    | {
        current: string;
        original: string;
      }
    | undefined;
  renamePath:
    | {
        current: string;
        original: string;
      }
    | undefined;
  branchname: string | undefined;
  tab: {
    current: string;
    original: string;
  }[];
  tabStack: {
    current: string;
    original: string;
  }[];
  changedFiles: Record<string, ChangedFileDirectoryState>;
  cachedFiles: Record<string, CachedFileState>;
  explorer: Explorer | undefined;
  commitList: {
    currBranch: string | null;
    currCommit: string | null;
    list: {
      [branch: string]: {
        sha: string;
        name: string;
      }[];
    };
  };
}

interface RepoActions {
  setReponame(reponame: string): void;
  selectFile(info: FileInfo): void;
  selectDir(info: FileInfo): void;
  focusPath(info: FileInfo): void;
  setBranchname(branchname: string | undefined): void;
  selectTab(path: { current?: string; original?: string }): void;
  removeTab(path: { current?: string; original?: string }): void;
  setExplorer(treeBlob: TreeBlobResponse[] | undefined): void;
  initDefault(): void;
  cacheFile(path: string, content: string): void;
  modifyFile(
    path: {
      current: string;
      original: string;
    },
    content: string
  ): void;
  removeChangedFile(path: { current: string; original: string }): void;
  showContextMenu(
    type: 'file' | 'directory' | 'explorer' | undefined,
    info: FileInfo | undefined,
    pos: { x: number; y: number }
  ): void;
  escape(): void;
  renameFile(oldInfo: FileInfo, newInfo: FileInfo): void;
  renameDir(oldInfo: DirectoryInfo, newInfo: DirectoryInfo): void;
  setCommitList(commitList: {
    currBranch: string | null;
    currCommit: string | null;
    list: {
      [branch: string]: {
        sha: string;
        name: string;
      }[];
    };
  }): void;
}

const RepoValueContext = createContext<RepoValue>({
  reponame: undefined,
  selectedPath: undefined,
  focusedPath: undefined,
  renamePath: undefined,
  branchname: undefined,
  tab: [],
  tabStack: [],
  changedFiles: {},
  cachedFiles: {},
  explorer: undefined,
  commitList: {
    currBranch: null,
    currCommit: null,
    list: {},
  },
});

const RepoActionsContext = createContext<RepoActions>({
  setReponame: () => {},
  selectFile: () => {},
  selectDir: () => {},
  focusPath: () => {},
  setBranchname: () => {},
  selectTab: () => {},
  removeTab: () => {},
  setExplorer: () => {},
  initDefault: () => {},
  cacheFile: () => {},
  modifyFile: () => {},
  removeChangedFile: () => {},
  showContextMenu: () => {},
  escape: () => {},
  renameFile: () => {},
  renameDir: () => {},
  setCommitList: () => {},
});

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPath, setSelectedPath] = useState<
    | {
        current: string;
        original: string;
      }
    | undefined
  >(); // 선택된 파일 경로
  const [focusedPath, setFocusedPath] = useState<
    | {
        current: string;
        original: string;
      }
    | undefined
  >(); // 포커싱된 파일 경로 (ex. 파일-폴더 우클릭)
  const [renamePath, setRenamePath] = useState<
    | {
        current: string;
        original: string;
      }
    | undefined
  >(); // 이름을 변경 중인 파일 경로
  const [reponame, setReponame] = useState<string | undefined>(undefined); // 현재 레포지토리 이름
  const [branchname, setBranchname] = useState<string | undefined>(undefined); // 현재 브랜치
  const [tab, setTab] = useState<
    {
      current: string;
      original: string;
    }[]
  >([]); // 열려있는 파일 경로 리스트 (ex. 탭, 탭 순서)
  const [tabStack, setTabStack] = useState<
    {
      current: string;
      original: string;
    }[]
  >([]); // 작업한 탭 순서
  const [changedFiles, setChangedFiles] = useState<
    Record<string, ChangedFileDirectoryState>
  >({}); // 추가, 변경, 삭제된 파일 경로, 파일 커밋시 사용됨
  const [cachedFiles, setCachedFiles] = useState<
    Record<string, CachedFileState>
  >({}); // api 요청한 파일 캐싱
  const [explorer, setExplorer] = useState<Explorer | undefined>(undefined); // 파일 탐색기
  const [contextMenu, setContextMenu] = useState<{
    type: 'file' | 'directory' | 'explorer' | undefined;
    pos: { x: number; y: number };
    target: FileInfo | undefined;
  }>({ type: undefined, pos: { x: 0, y: 0 }, target: undefined });

  const [commitList, setCommitList] = useState<{
    currBranch: string | null;
    currCommit: string | null;
    list: {
      [branch: string]: {
        sha: string;
        name: string;
      }[];
    };
  }>({
    currBranch: null,
    currCommit: null,
    list: {},
  });

  const dirContextMenuItems = useMemo(
    () => [
      {
        label: '새 파일',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          if (!focusedPath) {
            return;
          }
          setExplorer(prev => {
            if (!prev) {
              return prev;
            }
            addFileToExplorer(prev, {
              path: focusedPath.current,
              originalPath: focusedPath.current,
              name: '',
            });
            return [...prev];
          });
          setFocusedPath(undefined);
        },
      },
      {
        label: '새 폴더',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          if (!focusedPath) {
            return;
          }
          setExplorer(prev => {
            if (!prev) {
              return prev;
            }
            addFileToExplorer(prev, {
              path: focusedPath.current,
              originalPath: focusedPath.current,
              name: '',
              children: [],
            });
            return [...prev];
          });
          setFocusedPath(undefined);
        },
      },
      // todl: 폴더 이름 바꾸기
      {
        label: '이름 바꾸기',
        onClick: () => {
          // setContextMenu({
          //   type: undefined,
          //   pos: { x: 0, y: 0 },
          //   target: undefined,
          // });
          // if (!focusedPath || !explorer) {
          //   return;
          // }
          // const file = findFileDirectory(explorer, focusedPath.current);
          // if (!file) {
          //   return;
          // }
          // setFocusedPath(undefined);
          // setRenamePath({
          //   current: focusedPath.current,
          //   original: focusedPath.original,
          // });
        },
      },
      // todo: 폴더 삭제하기
      { label: '삭제', onClick: () => {} },
    ],
    [contextMenu]
  );

  const fileContextMenuItems = useMemo(
    () => [
      {
        label: '이름 바꾸기',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          if (!focusedPath || !explorer) {
            return;
          }
          const file = findFileDirectory(explorer, focusedPath.current);
          if (!file) {
            return;
          }
          setFocusedPath(undefined);
          setRenamePath({
            current: focusedPath.current,
            original: focusedPath.original,
          });
        },
      },
      {
        label: '삭제',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          if (!focusedPath || !explorer) {
            return;
          }
          const file = findFileDirectory(explorer, focusedPath.current);
          if (!file) {
            return;
          }

          setChangedFiles(prev => {
            if (!prev) {
              return prev;
            }
            prev[focusedPath.current] = {
              ...prev[focusedPath.current],
              state: 'deleted',
              originalPath: focusedPath.original,
            };
            console.log(prev);
            return { ...prev };
          });

          setExplorer(prev => {
            if (!prev) {
              return prev;
            }
            removeFileFromExplorer(prev, {
              path: focusedPath.current,
              originalPath: focusedPath.current,
              name: focusedPath.current.split('/').pop()!,
            });
            return [...prev];
          });
          setFocusedPath(undefined);
        },
      },
    ],
    [contextMenu]
  );

  const explorerContextMenuItems = useMemo(
    () => [
      {
        label: '새 파일',
        onClick: () => {
          setExplorer(prev => {
            if (!prev) {
              return prev;
            }
            addFileToExplorer(prev, { path: '', originalPath: '', name: '' });
            return [...prev];
          });
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
        },
      },
      {
        label: '새 폴더',
        onClick: () => {
          setContextMenu({
            type: undefined,
            pos: { x: 0, y: 0 },
            target: undefined,
          });
          setExplorer(prev => {
            if (!prev) {
              return prev;
            }
            addFileToExplorer(prev, {
              path: '',
              originalPath: '',
              name: '',
              children: [],
            });
            return [...prev];
          });
        },
      },
    ],
    [contextMenu]
  );

  const actions = useMemo(
    () => ({
      // 레포지토리 이름 설정
      setReponame,
      // 탐색기에서 파일 좌클릭
      selectFile(info: FileInfo) {
        setSelectedPath({ current: info.path, original: info.originalPath });
        setFocusedPath({ current: info.path, original: info.originalPath });
        setTab(prev =>
          prev.some(item => item.current === info.path)
            ? [...prev]
            : [...prev, { current: info.path, original: info.originalPath }]
        );
        setTabStack(prev => [
          ...prev.filter(item => item.current !== info.path),
          { current: info.path, original: info.originalPath },
        ]);
      },
      // 탐색기에서 폴더 좌클릭
      selectDir(info: FileInfo) {
        setSelectedPath({ current: info.path, original: info.originalPath });
        setFocusedPath({ current: info.path, original: info.originalPath });
      },
      // 탐색기에서 파일, 폴더 우클릭
      focusPath(info: FileInfo) {
        setFocusedPath({ current: info.path, original: info.originalPath });
      },
      // todo: 미완성
      setBranchname(branchname: string) {
        setBranchname(branchname);
      },
      // 열려있는 탭 간 이동
      selectTab(path: { current: string; original: string }) {
        setFocusedPath(undefined);
        setSelectedPath({ ...path });
        setTabStack(prev => [
          ...prev.filter(item => item.current !== path.current),
          { ...path },
        ]);
      },
      // 열려있는 탭 삭제
      removeTab(path: { current: string; original: string }) {
        setFocusedPath(undefined);
        setTab(prev => prev.filter(item => item.current !== path.current));
        setTabStack(prev => {
          const filteredTabStack = prev.filter(
            item => item.current !== path.current
          );
          setSelectedPath({
            current: filteredTabStack[filteredTabStack.length - 1]?.current,
            original: filteredTabStack[filteredTabStack.length - 1]?.original,
          });
          return filteredTabStack;
        });
      },
      // 탐색기 포커싱 해제
      initDefault() {
        setFocusedPath(undefined);
        setContextMenu({
          type: undefined,
          pos: { x: 0, y: 0 },
          target: undefined,
        });
      },
      // 파일 내용 수정시
      modifyFile(
        path: {
          current: string;
          original: string;
        },
        content: string
      ) {
        setChangedFiles(prev => {
          if (!prev[path.current]) {
            prev[path.current] = {
              originalPath: path.original,
              state: 'modified',
            };
          }
          prev[path.current].content = content;
          return { ...prev };
        });
      },
      // 파일 수정시 원본과 동일해질 경우
      removeChangedFile(path: { current: string; original: string }) {
        setChangedFiles(prev => {
          delete prev[path.current];
          return { ...prev };
        });
      },
      // 미완성: 탐색기에서 파일 삭제
      removeFile(info: FileInfo) {
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          removeFileFromExplorer(prev, info);
          return [...prev];
        });
      },
      // 미완성: 탐색기에서 파일 추가
      addFile(info: FileInfo) {
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          addFileToExplorer(prev, info);
          return [...prev];
        });
      },
      // 탐색기에서 파일명 수정
      // todo: 이름 바꾼후 다시 원래 이름으로 바꾼 경우 예외처리
      // todo: 파일명에 / 들어갈 경우 예외처리
      renameFile(oldInfo: FileInfo, newInfo: FileInfo) {
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          removeFileFromExplorer(prev, oldInfo);
          addFileToExplorer(prev, newInfo);
          return [...prev];
        });
        setChangedFiles(prev => {
          if (oldInfo.name === '') {
            prev[newInfo.path] = {
              state: 'added',
              originalPath: newInfo.originalPath,
              content: '',
            };
          } else {
            prev[oldInfo.path] = {
              ...prev[oldInfo.path],
              state: 'deleted',
              originalPath: oldInfo.originalPath,
            };
            prev[newInfo.path] = {
              ...prev[newInfo.path],
              state: 'renamed',
              originalPath: newInfo.originalPath,
              content: prev[oldInfo.path]?.content,
            };
          }
          return { ...prev };
        });
        setTab(prev => {
          if (prev.some(item => item.current === oldInfo.path)) {
            return prev.map(item =>
              item.current === oldInfo.path
                ? { current: newInfo.path, original: newInfo.originalPath }
                : item
            );
          }
          return [
            ...prev,
            { current: newInfo.path, original: newInfo.originalPath },
          ];
        });
        setTabStack(prev => [
          ...prev.filter(item => item.current !== oldInfo.path),
          { current: newInfo.path, original: newInfo.originalPath },
        ]);
        setSelectedPath({
          current: newInfo.path,
          original: newInfo.originalPath,
        });
      },
      renameDir(oldInfo: DirectoryInfo, newInfo: DirectoryInfo) {
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          removeFileFromExplorer(prev, oldInfo);
          addFileToExplorer(prev, newInfo);
          return [...prev];
        });
      },
      // 파일 탐색기 초기화
      setExplorer(treeBlob: TreeBlobResponse[] | undefined) {
        if (!treeBlob) {
          setExplorer(undefined);
        } else {
          setExplorer(convertTreeBlobResponseToExplorer(treeBlob));
        }
        setTab([]);
        setTabStack([]);
        setSelectedPath(undefined);
        setFocusedPath(undefined);
        setContextMenu({
          type: undefined,
          pos: { x: 0, y: 0 },
          target: undefined,
        });
        setChangedFiles({});
        setCachedFiles({});
      },
      // 가져온 파일 캐싱
      cacheFile(path: string, base64: string) {
        setCachedFiles(prev => ({
          ...prev,
          [path]: { content: convertBase64ToString(base64) },
        }));
      },
      // 파일 탐색기 우클릭시 옵션 출력
      showContextMenu(
        type: 'file' | 'directory' | 'explorer',
        info: FileInfo | undefined,
        pos: { x: number; y: number }
      ) {
        setContextMenu({ type, pos, target: info });
        if (!info) {
          return;
        }
        setFocusedPath({ current: info.path, original: info.originalPath });
      },
      // esc 클릭시 초기화 (이름바꾸기시 esc, )
      escape() {
        setRenamePath(undefined);
        setFocusedPath(undefined);
        setContextMenu({
          type: undefined,
          pos: { x: 0, y: 0 },
          target: undefined,
        });
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          removeRenamingFile(prev);
          return [...prev];
        });
      },
      setCommitList,
    }),
    []
  );

  return (
    <RepoActionsContext.Provider value={actions}>
      <RepoValueContext.Provider
        value={{
          reponame,
          selectedPath,
          focusedPath,
          renamePath,
          branchname,
          tab,
          tabStack,
          changedFiles,
          cachedFiles,
          explorer,
          commitList,
        }}
      >
        {children}
        {contextMenu.type === 'directory' && (
          <ContextMenu items={dirContextMenuItems} pos={contextMenu.pos} />
        )}
        {contextMenu.type === 'file' && (
          <ContextMenu items={fileContextMenuItems} pos={contextMenu.pos} />
        )}
        {contextMenu.type === 'explorer' && (
          <ContextMenu items={explorerContextMenuItems} pos={contextMenu.pos} />
        )}
      </RepoValueContext.Provider>
    </RepoActionsContext.Provider>
  );
};

export const useRepoValue = () => {
  const context = useContext(RepoValueContext);
  if (!context) {
    throw new Error('useRepoValue must be used within a RepoProvider');
  }
  return context;
};

export const useRepoActions = () => {
  const context = useContext(RepoActionsContext);
  if (!context) {
    throw new Error('useRepoActions must be used within a RepoProvider');
  }
  return context;
};
