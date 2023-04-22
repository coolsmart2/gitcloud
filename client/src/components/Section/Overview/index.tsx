import './index.scss';

interface OverviewProps {
  onClick: () => void;
}

export default function Overview({ onClick }: OverviewProps) {
  return (
    <div className="overview-content">
      <h1>GitCloud로 언제 어디서든 문서작업 버전 관리</h1>
      <p>문서를 더 효율적으로 관리할 수 있어요.</p>
      <p>코딩을 하지 않아도 GitHub를 사용해볼 수 있어요.</p>
      <div className="overview__login">
        <button className="overview__login__github" onClick={onClick}>
          <b>GitHub</b>로 시작하기
        </button>
      </div>
    </div>
  );
}
