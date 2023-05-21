export default function GetToken() {
  return (
    <div className="section-content">
      <h1 className="section-title">GitHub 토큰 발급받기</h1>
      <h3 className="section-subtitle">
        1. 자신의 깃허브 사용자 메뉴에서 Settting 클릭
      </h3>
      <img
        className="section-image"
        src="/get github token (1).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        2. Setting 메뉴에서 Developer settings 클릭
      </h3>
      <img
        className="section-image"
        src="/get github token (2).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        3. Personal access tokens 메뉴에서 Tokens (classic) 클릭
      </h3>
      <img
        className="section-image"
        src="/get github token (3).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">4. Generate new token (classic) 클릭</h3>
      <img
        className="section-image"
        src="/get github token (4).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        5. 원하는 personal access token의 이름 입력
      </h3>
      <img
        className="section-image"
        src="/get github token (5).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        6. Expiration은 원하는 기간으로 설정. (기간을 작게 잡으면 기간 이후
        토큰을 다시 발급받아야 합니다.)
      </h3>
      <img
        className="section-image"
        src="/get github token (6).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        7. Select scopes에서 repo 체크박스 체크
      </h3>
      <img
        className="section-image"
        src="/get github token (7).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        8. Select scopes에서 delete_repo 체크박스 체크
      </h3>
      <img
        className="section-image"
        src="/get github token (8).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">9. 토큰 발급</h3>
      <img
        className="section-image"
        src="/get github token (9).png"
        alt="get github token"
      />
      <h3 className="section-subtitle">
        10. 발급받은 토큰은 기억해두었다가 이후 GitCloud 서비스에서 토큰 등록
      </h3>
      <img
        className="section-image"
        src="/get github token (10).png"
        alt="get github token"
      />
    </div>
  );
}
