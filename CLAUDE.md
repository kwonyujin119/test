# 작업 규칙 (SACHIL:47)

- 응답은 한국어. 배포 흐름: 브랜치 `claude/untitled-session-tde5hr`에 커밋 → PR → main 머지(github.io 자동 반영).
- **버전 기록 필수(사용자 요청: 개선·업데이트·보강할 때마다 자동 기록)**: 앱 화면(index.html·sw.js·icons·img)을 바꾸는 반영(PR) 1건 = 1버전.
  1. index.html의 `UPDATES` 배열 **맨 위**에 `{v:'VNN', d:'YYYY-MM-DD', t:['쉬운 말로 바뀐 점', …]}` 추가 → 앱 메뉴 마지막 섹션 '업데이트 내역'에 표시됨
  2. 같은 파일의 `APP_VER`, 바닥글 `Incident Log · vNN`, `server/sachil_server.py`의 `APP_VERSION`을 같은 번호로
  3. `CHANGELOG.md` 3장 표에도 한 줄(근거 = PR 번호)
  3. 서버만 바꾸면 '서버만' 표에 추가, 서버 동작이 바뀌면 `VERSION`도 올리고 `server/SACHIL47-server-update.zip` 다시 묶기
- 공개 저장소: 개인정보가 든 자료(PDF 등)·API 키는 올리지 않는다.
- 메뉴 섹션 순서: '업데이트 내역'(`updates`)은 항상 맨 마지막. 새 섹션은 그 바로 앞에 넣는다.
