import './skeleton.scss';

export default function RepoExplorerSkeleton() {
  return (
    <div className="repo-explorer-skeleton-container">
      {Array(15)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="dir-file-skeleton">
            <div className="dir-file-skeleton__type" />
            <div
              className="dir-file-skeleton__name"
              style={{ width: Math.random() * 100 + 50 }}
            />
          </div>
        ))}
    </div>
  );
}
