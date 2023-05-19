import { useCallback, useEffect, useMemo } from 'react';
import { getGitHubFileAPI } from '../../apis/github';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoEditorSkeleton from './skeleton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

export default function RepoEditor() {
  const {
    reponame,
    branchname,
    selectedPath,
    cachedFiles,
    changedFiles,
    commitList,
  } = useRepoValue();
  const { cacheFile, modifyFile, removeChangedFile } = useRepoActions();

  const content =
    selectedPath &&
    (changedFiles[selectedPath.current]?.content ??
      cachedFiles[selectedPath.original]?.content);

  const fetchFile = async () => {
    for (const path in changedFiles) {
      if (
        selectedPath &&
        path === selectedPath.current &&
        changedFiles[path].state === 'added'
      ) {
        return;
      }
    }

    if (
      reponame &&
      branchname &&
      selectedPath &&
      !cachedFiles[selectedPath.original]
    ) {
      const { data } = await getGitHubFileAPI({
        reponame,
        path: selectedPath.original,
        ref: commitList.currCommit ?? undefined,
      });
      cacheFile(data.path, data.content);
    }
  };

  const handleChange = useCallback(
    (content: string) => {
      if (
        selectedPath &&
        (selectedPath.original in cachedFiles ||
          selectedPath.current in changedFiles)
      ) {
        if (selectedPath.original in cachedFiles) {
          if (cachedFiles[selectedPath.original].content !== content) {
            modifyFile(selectedPath, content);
          } else {
            removeChangedFile(selectedPath);
          }
        } else {
          modifyFile(selectedPath, content);
        }
      }
    },
    [selectedPath, cachedFiles, changedFiles]
  );

  const modules = useMemo(
    () => ({
      toolbar: {
        // 툴바에 넣을 기능
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
        ],
      },
    }),
    []
  );

  useEffect(() => {
    fetchFile();
  }, [selectedPath]);

  const memoRepoEditorSkeleton = useMemo(() => <RepoEditorSkeleton />, []);

  if (!reponame || !branchname || !selectedPath || content === undefined) {
    return memoRepoEditorSkeleton;
  }

  return (
    <div className="repo-editor-container">
      <ReactQuill
        theme="snow"
        modules={modules}
        value={content}
        onChange={(content, delta, source, editor) =>
          handleChange(editor.getHTML())
        }
      />
    </div>
  );
}
