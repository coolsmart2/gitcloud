import { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  ChangedFileState,
  CachedFileState,
  FileInfo,
  DirectoryInfo,
} from '../types/repo.type';
import { TreeBlobResponse } from '../types/response';
import { convertTreeBlobResponseToExplorer } from '../utils/repo.util';

interface RepoValue {
  selectedPath: string | null;
  focusedPath: string | null;
  branch: string | null;
  tab: string[];
  changedFiles: Record<string, ChangedFileState>;
  cachedFiles: Record<string, CachedFileState>;
  explorer: (FileInfo | DirectoryInfo)[] | null;
}

interface RepoActions {
  selectFile(path: string): void;
  selectDir(path: string): void;
  focusPath(path: string): void;
  setBranch(branch: string | null): void;
  selectTab(path: string): void;
  removeTab(path: string): void;
  setExplorer(treeBlob: TreeBlobResponse[]): void;
  removeFocusedPath(): void;
}

const RepoValueContext = createContext<RepoValue>({
  selectedPath: null,
  focusedPath: null,
  branch: null,
  tab: [],
  changedFiles: {},
  cachedFiles: {},
  explorer: null,
});
const RepoActionsContext = createContext<RepoActions>({
  selectFile: () => {},
  selectDir: () => {},
  focusPath: () => {},
  setBranch: () => {},
  selectTab: () => {},
  removeTab: () => {},
  setExplorer: () => {},
  removeFocusedPath: () => {},
});

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null); // 선택된 파일 경로 (ex. 파일-폴더 좌클릭, 탭 클릭)
  const [focusedPath, setFocusedPath] = useState<string | null>(null); // 포커싱된 파일 경로 (ex. 파일-폴더 우클릭)
  const [branch, setBranch] = useState<string | null>(null); // 현재 브랜치
  const [tab, setTab] = useState<string[]>([]); // 열려있는 파일 경로 리스트 (ex. 탭, 탭 순서)
  const [changedFiles, setChangedFiles] = useState<
    Record<string, ChangedFileState>
  >({}); // 추가, 변경, 삭제된 파일 경로, 파일 커밋시 사용됨
  const [cachedFiles, setCachedFiles] = useState<
    Record<string, CachedFileState>
  >({}); // api 요청한 파일 캐싱
  const [explorer, setExplorer] = useState<(FileInfo | DirectoryInfo)[] | null>(
    null
  ); // 파일 탐색기

  const tabStack = useRef<string[]>([]); // 작업한 탭 순서

  const actions = useMemo(
    () => ({
      // 탐색기에서 파일 좌클릭
      selectFile(path: string) {
        setSelectedPath(path);
        setFocusedPath(path);
        setTab(prev => {
          tabStack.current = tabStack.current.filter(_path => _path !== path);
          tabStack.current.push(path);
          return prev.includes(path) ? prev : [...prev, path];
        });
      },
      // 탐색기에서 폴더 좌클릭
      selectDir(path: string) {
        setSelectedPath(path);
        setFocusedPath(path);
      },
      // 탐색기에서 파일, 폴더 우클릭
      focusPath(path: string) {
        setFocusedPath(path);
      },
      // todo: 미완성
      setBranch(branch: string) {
        setBranch(branch);
      },
      // 열려있는 탭 간 이동
      selectTab(path: string) {
        setFocusedPath(null);
        setSelectedPath(path);
        tabStack.current = tabStack.current.filter(_path => _path !== path);
        tabStack.current.push(path);
        console.log(tabStack.current);
      },
      // 열려있는 탭 삭제
      removeTab(path: string) {
        setFocusedPath(null);
        setSelectedPath(prev => {
          tabStack.current = tabStack.current.filter(_path => _path !== path);
          return prev === path ? tabStack.current.at(-1) ?? null : prev;
        });
        setTab(prev => prev.filter(_path => _path !== path));
      },
      // 탐색기 포커싱 해제
      removeFocusedPath() {
        setFocusedPath(null);
      },
      // 파일 내용 수정시
      modifyFile({ path, content }: { path: string; content: string }) {
        if (path in changedFiles) {
          if (cachedFiles[path].content !== content) {
            setChangedFiles({
              ...changedFiles,
              [path]: {
                state: 'modified',
                content,
              },
            });
          } else {
            setChangedFiles(prev => {
              delete prev[path];
              return prev; // { ...prev }
            });
          }
        } else {
          setChangedFiles({
            ...changedFiles,
            [path]: {
              state: 'modified',
              content,
            },
          });
        }
      },
      // 탐색기에서 파일 추가
      addFile(path: string) {
        const pathList = path.split('/');
        // explorer에 있다면 추가 안됨
        // 없다면 추가
      },
      // 탐색기에서 파일 삭제
      deleteFile(path: string) {},
      // 탐색기에서 폴더 추가
      addDir(path: string) {},
      // 탐색기에서 폴더 삭제
      deleteDir(path: string) {},
      setExplorer(treeBlob: TreeBlobResponse[]) {
        setExplorer(convertTreeBlobResponseToExplorer(treeBlob));
      },
    }),
    []
  );

  return (
    <RepoActionsContext.Provider value={actions}>
      <RepoValueContext.Provider
        value={{
          selectedPath,
          focusedPath,
          branch,
          tab,
          changedFiles,
          cachedFiles,
          explorer,
        }}
      >
        {children}
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
