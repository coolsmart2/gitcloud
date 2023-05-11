import { useEffect } from 'react';
import { getGitHubFileAPI } from '../../apis/github';
import { useRepoActions, useRepoValue } from '../../contexts/RepoContext';
import RepoEditorSkeleton from './skeleton';
import './index.scss';

export default function RepoEditor() {
  const { reponame, branchname, selectedPath, cachedFiles, changedFiles } =
    useRepoValue();
  const { cacheFile, modifyFile, removeChangedFile } = useRepoActions();

  const content =
    selectedPath.current &&
    selectedPath.original &&
    (changedFiles[selectedPath.current]?.content ||
      cachedFiles[selectedPath.original]?.content);

  const fetchFile = async () => {
    for (const path in changedFiles) {
      if (
        path === selectedPath.current &&
        changedFiles[path].state === 'added'
      ) {
        return;
      }
    }

    if (
      reponame &&
      branchname &&
      selectedPath.original &&
      !cachedFiles[selectedPath.original]
    ) {
      const { data } = await getGitHubFileAPI({
        reponame,
        path: selectedPath.original,
        ref: branchname,
      });
      cacheFile(data.path, data.content);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (
      selectedPath.current &&
      selectedPath.original &&
      selectedPath.original in cachedFiles
    ) {
      const { value } = e.target;
      if (cachedFiles[selectedPath.original].content !== value) {
        modifyFile(selectedPath.current, value);
      } else {
        removeChangedFile(selectedPath.current);
      }
    }
  };

  useEffect(() => {
    fetchFile();
  }, [selectedPath]);

  if (!reponame || !branchname || !selectedPath || !content) {
    return <RepoEditorSkeleton />;
  }

  return (
    <div className="repo-editor-container">
      <textarea
        className="repo-editor__textarea"
        wrap="off"
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}
