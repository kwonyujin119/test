# 작업 규칙 (SACHIL:47)

- 응답은 한국어. 배포 흐름: 브랜치 `claude/untitled-session-tde5hr`에 커밋 → PR → main 머지(github.io 자동 반영).
- **버전 기록 필수**: 앱 화면(index.html·sw.js·icons·img)을 바꾸는 반영마다
  1. `CHANGELOG.md` 3장 표에 새 버전 한 줄(주요 수정 내용, 근거 = PR 번호) 추가
  2. index.html 바닥글 `Incident Log · vNN`과 `server/sachil_server.py`의 `APP_VERSION`을 같은 번호로 올림
  3. 서버만 바꾸면 '서버만' 표에 추가, 서버 동작이 바뀌면 `VERSION`도 올리고 `server/SACHIL47-server-update.zip` 다시 묶기
- 공개 저장소: 개인정보가 든 자료(PDF 등)·API 키는 올리지 않는다.
