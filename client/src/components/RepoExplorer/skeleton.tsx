import './skeleton.scss';

export default function RepoExplorerSkeleton() {
  return (
    <div className="repo-explorer-skeleton-container">
      {Array(15)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="explorer-skeleton">
            <div className="explorer-skeleton__type" />
            <div
              className="explorer-skeleton__name"
              style={{ width: Math.random() * 100 + 50 }}
            />
          </div>
        ))}
    </div>
  );
}
