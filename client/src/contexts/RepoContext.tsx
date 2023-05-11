import { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  ChangedFileDirectoryState,
  CachedFileState,
  Explorer,
  FileInfo,
} from '../types/repo.type';
import { TreeBlobResponse } from '../types/response.type';
import {
  addFileToExplorer,
  convertBase64ToString,
  convertTreeBlobResponseToExplorer,
  findFileDirectory,
  initExplorer,
  removeFileFromExplorer,
} from '../utils/repo.util';
import ContextMenu from '../components/ContextMenu';

interface RepoValue {
  reponame: string | null;
  selectedPath: {
    current: string | null;
    original: string | null;
  };
  focusedPath: {
    current: string | null;
    original: string | null;
  };
  renamePath: {
    current: string | null;
    original: string | null;
  };
  branchname: string | null;
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
  explorer: Explorer | null;
}

interface RepoActions {
  setReponame(reponame: string): void;
  selectFile(info: FileInfo): void;
  selectDir(info: FileInfo): void;
  focusPath(info: FileInfo): void;
  setBranchname(branchname: string | null): void;
  selectTab(path: { current: string; original: string }): void;
  removeTab(path: { current: string; original: string }): void;
  setExplorer(treeBlob: TreeBlobResponse[]): void;
  initDefault(): void;
  cacheFile(path: string, content: string): void;
  modifyFile(path: string, content: string): void;
  removeChangedFile(path: string): void;
  showContextMenu(
    type: 'file' | 'directory' | 'explorer' | null,
    info: FileInfo | null,
    pos: { x: number; y: number }
  ): void;
  escape(): void;
  renameFile(oldInfo: FileInfo, newInfo: FileInfo): void;
}

const RepoValueContext = createContext<RepoValue>({
  reponame: null,
  selectedPath: { current: null, original: null },
  focusedPath: { current: null, original: null },
  renamePath: { current: null, original: null },
  branchname: null,
  tab: [],
  tabStack: [],
  changedFiles: {},
  cachedFiles: {},
  explorer: null,
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
});

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPath, setSelectedPath] = useState<{
    current: string | null;
    original: string | null;
  }>({ current: null, original: null }); // 선택된 파일 경로
  const [focusedPath, setFocusedPath] = useState<{
    current: string | null;
    original: string | null;
  }>({ current: null, original: null }); // 포커싱된 파일 경로 (ex. 파일-폴더 우클릭)
  const [renamePath, setRenamePath] = useState<{
    current: string | null;
    original: string | null;
  }>({ current: null, original: null }); // 이름을 변경 중인 파일 경로
  const [reponame, setReponame] = useState<string | null>(null); // 현재 레포지토리 이름
  const [branchname, setBranchname] = useState<string | null>(null); // 현재 브랜치
  const [tab, setTab] = useState<{ current: string; original: string }[]>([]); // 열려있는 파일 경로 리스트 (ex. 탭, 탭 순서)
  const [tabStack, setTabStack] = useState<
    { current: string; original: string }[]
  >([]); // 작업한 탭 순서
  const [changedFiles, setChangedFiles] = useState<
    Record<string, ChangedFileDirectoryState>
  >({}); // 추가, 변경, 삭제된 파일 경로, 파일 커밋시 사용됨
  const [cachedFiles, setCachedFiles] = useState<
    Record<string, CachedFileState>
  >({}); // api 요청한 파일 캐싱
  const [explorer, setExplorer] = useState<Explorer | null>(null); // 파일 탐색기
  const [contextMenu, setContextMenu] = useState<{
    type: 'file' | 'directory' | 'explorer' | null;
    pos: { x: number; y: number };
    target: FileInfo | null;
  }>({ type: null, pos: { x: 0, y: 0 }, target: null });

  const dirContextMenuItems = useMemo(
    () => [
      { label: '새 파일', onClick: () => {} },
      { label: '새 폴더', onClick: () => {} },
      { label: '이름 바꾸기', onClick: () => {} },
      { label: '삭제', onClick: () => {} },
    ],
    [contextMenu]
  );

  const fileContextMenuItems = useMemo(
    () => [
      {
        label: '이름 바꾸기',
        onClick: () => {
          setContextMenu({ type: null, pos: { x: 0, y: 0 }, target: null });
          setFocusedPath({ current: null, original: null });
          if (!explorer || !focusedPath) {
            return;
          }
          const file = findFileDirectory(explorer, focusedPath.current);
          if (!file) {
            return;
          }
          setRenamePath({
            current: focusedPath.current,
            original: focusedPath.original,
          });
        },
      },
      { label: '삭제', onClick: () => {} },
    ],
    [contextMenu]
  );

  const explorerContextMenuItems = useMemo(
    () => [
      {
        label: '새 파일',
        onClick: () => {},
      },
      { label: '새 폴더', onClick: () => {} },
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
        setFocusedPath({ current: null, original: null });
        setSelectedPath({ ...path });
        setTabStack(prev => [
          ...prev.filter(item => item.current !== path.current),
          { ...path },
        ]);
      },
      // 열려있는 탭 삭제
      removeTab(path: { current: string; original: string }) {
        setFocusedPath({ current: null, original: null });
        setTab(prev => prev.filter(item => item.current !== path.current));
        setTabStack(prev => {
          const filteredTabStack = prev.filter(
            item => item.current !== path.current
          );
          setSelectedPath({
            current:
              filteredTabStack[filteredTabStack.length - 1].current ?? null,
            original:
              filteredTabStack[filteredTabStack.length - 1].original ?? null,
          });
          return filteredTabStack;
        });
      },
      // 탐색기 포커싱 해제
      initDefault() {
        setFocusedPath({ current: null, original: null });
        setContextMenu({ type: null, pos: { x: 0, y: 0 }, target: null });
      },
      // 파일 내용 수정시
      modifyFile(path: string, content: string) {
        setChangedFiles(prev => {
          if (!prev[path]) {
            prev[path] = { state: 'modified' };
          }
          prev[path].content = content;
          return { ...prev };
        });
      },
      // 파일 수정시 원본과 동일해질 경우
      removeChangedFile(path: string) {
        setChangedFiles(prev => {
          delete prev[path];
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
      renameFile(oldInfo: FileInfo, newInfo: FileInfo) {
        setSelectedPath({
          current: newInfo.path,
          original: newInfo.originalPath,
        });
        setExplorer(prev => {
          if (
            !prev ||
            !findFileDirectory(prev, oldInfo.path) ||
            findFileDirectory(prev, newInfo.path)
          ) {
            return prev;
          }
          removeFileFromExplorer(prev, oldInfo);
          addFileToExplorer(prev, newInfo);
          return [...prev];
        });
        setChangedFiles(prev => {
          prev[newInfo.originalPath] = {
            ...prev[newInfo.originalPath],
            state: 'deleted',
          };
          prev[newInfo.path] = {
            ...prev[newInfo.path],
            state: 'renamed',
            originalPath: newInfo.originalPath,
          };
          return { ...prev };
        });
        setTab(prev =>
          prev.map(item =>
            item.current === oldInfo.path
              ? { current: newInfo.path, original: newInfo.originalPath }
              : item
          )
        );
        setTabStack(prev =>
          prev.map(item =>
            item.current === oldInfo.path
              ? { current: newInfo.path, original: newInfo.originalPath }
              : item
          )
        );
      },
      // 탐색기에서 폴더 추가
      addDir(path: string) {},
      // 탐색기에서 폴더 삭제
      deleteDir(path: string) {},
      // 파일 탐색기 초기화
      setExplorer(treeBlob: TreeBlobResponse[]) {
        setExplorer(convertTreeBlobResponseToExplorer(treeBlob));
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
        info: FileInfo | null,
        pos: { x: number; y: number }
      ) {
        if (!info) return;
        setFocusedPath({ current: info.path, original: info.originalPath });
        setContextMenu({ type, pos, target: info });
      },
      // esc 클릭시 초기화 (이름바꾸기시 esc, )
      escape() {
        setExplorer(prev => {
          if (!prev) {
            return prev;
          }
          initExplorer(prev);
          return [...prev];
        });
        setFocusedPath({ current: null, original: null });
      },
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
