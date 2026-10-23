# 작업 규칙 (SACHIL:47)

- 응답은 한국어. 배포 흐름: 브랜치 `claude/untitled-session-tde5hr`에 커밋 → PR → main 머지(github.io 자동 반영).
- **버전 기록 필수(사용자 요청: 개선·업데이트·보강할 때마다 자동 기록)**: 앱 화면(index.html·sw.js·icons·img)을 바꾸는 반영(PR) 1건 = 1버전.
  1. index.html의 `UPDATES` 배열 **맨 위**에 `{v:'VNN', d:'YYYY-MM-DD', t:['쉬운 말로 바뀐 점', …]}` 추가 → 앱 메뉴 마지막 섹션 '업데이트 내역'에 표시됨
  2. 같은 파일의 `APP_VER`, 바닥글 `Incident Log · vNN`, `server/sachil_server.py`의 `APP_VERSION`을 같은 번호로
  3. `CHANGELOG.md` 3장 표에도 한 줄(근거 = PR 번호)
  3. 서버만 바꾸면 '서버만' 표에 추가, 서버 동작이 바뀌면 `VERSION`도 올리고 `server/SACHIL47-server-update.zip` 다시 묶기
- 공개 저장소: 개인정보가 든 자료(PDF 등)·API 키는 올리지 않는다.
- 메뉴 섹션 순서: '업데이트 내역'(`updates`)은 항상 맨 마지막. 새 섹션은 그 바로 앞에 넣는다.
- **서버 업데이트 확인(사용자 지시, 상시)**: 앱을 올릴 때는 서버 버전도 함께 올리고 zip을 다시 묶는다. PC 서버는 자동 업데이트(`auto_update`, 5분마다 GitHub main의 서버 파일을 받아 스스로 다시 켬)로 반영되므로 '47망' 세션에 알림을 보내지 않는다. 머지한 뒤 5~10분 지나 GitHub Actions **'Server check'**(`.github/workflows/server-check.yml`, workflow_dispatch)를 실행해 `server version`이 새 번호인지 확인하고 사용자에게 알린다. 버전이 안 올라가면(자동 업데이트 꺼짐·옛 start-domain.bat 등) 그때만 사용자에게 PC에서 할 일(백업 data/config.json·chat.db → 서버 창 닫기 → zip 덮어쓰기 → start-domain.bat로 다시 켜기)을 안내한다.
