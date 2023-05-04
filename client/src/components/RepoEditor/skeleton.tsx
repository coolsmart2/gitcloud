import './skeleton.scss';

export default function RepoEditorSkeleton() {
  return (
    <div className="repo-editor-skeleton-container">
      {Array(25)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="editor-skeleton">
            <div
              className="editor-skeleton__content"
              style={{ width: Math.random() * 300 + 200 }}
            />
          </div>
        ))}
    </div>
  );
}
