# 작업 규칙 (SACHIL:47)

- 응답은 한국어. 배포 흐름: 브랜치 `claude/untitled-session-tde5hr`에 커밋 → PR → main 머지(github.io 자동 반영).
- **버전 기록 필수(사용자 요청: 개선·업데이트·보강할 때마다 자동 기록)**: 앱 화면(index.html·sw.js·icons·img)을 바꾸는 반영(PR) 1건 = 1버전.
  1. index.html의 `UPDATES` 배열 **맨 위**에 `{v:'VNN', d:'YYYY-MM-DD', t:['쉬운 말로 바뀐 점', …]}` 추가 → 앱 메뉴 마지막 섹션 '업데이트 내역'에 표시됨
  2. 같은 파일의 `APP_VER`, 바닥글 `Incident Log · vNN`, `server/sachil_server.py`의 `APP_VERSION`을 같은 번호로
  3. `CHANGELOG.md` 3장 표에도 한 줄(근거 = PR 번호)
  3. 서버만 바꾸면 '서버만' 표에 추가, 서버 동작이 바뀌면 `VERSION`도 올리고 `server/SACHIL47-server-update.zip` 다시 묶기
- 공개 저장소: 개인정보가 든 자료(PDF 등)·API 키는 올리지 않는다.
- 메뉴 섹션 순서: '업데이트 내역'(`updates`)은 항상 맨 마지막. 새 섹션은 그 바로 앞에 넣는다.
- **서버 업데이트 알림(사용자 지시, 상시)**: 앱을 올릴 때는 서버 버전도 함께 올리고 zip을 다시 묶는다. 서버를 다시 켜야 하는 업데이트를 머지하면, 곧바로 Claude 세션 **'47망'**(사용자 PC, session_01NkB88N4uBRybUNDTmxFYGJ)에 `send_message`로 알린다. 알림에는 '47망' 세션이 **AskUserQuestion 플로팅으로 진행 여부를 물은 뒤**, 사용자가 '진행'을 누르면 다음 순서로 진행하라고 적는다: 백업(data/config.json·chat.db) → 서버 창 닫기 → zip 덮어쓰기 → start-domain.bat로 다시 켜기 → /api/me 버전 확인 → 결과 보고. 사용자는 클릭만 하면 되게 한다. 승인 없이 PC에 배포하지 않는다.
