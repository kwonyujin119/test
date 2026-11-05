# hwp/ — 연구실(교수 전용) 화면

- `lab.html`, `lab.js`: 지휘역량강화센터 연구실 — 연구 과제(hwpx)·자료실·질문 모음.
- `hangul.html`, `app/common.js`, `app/hwp/*`: 한글 작업장 편집기. **kwonyujin119/test0 (커밋 3f121fa)에서 그대로 가져온 사본**이다.
  - 바꾼 곳은 세 군데뿐이다.
    - `hangul.html`의 링크와 스크립트 목록(`lab-gh.js`, `lab-edit.js` 추가, pwa 제거)
    - `app/hwp/store.js`의 `save(extra)`·`meta`·`metaMany`·`raw` 추가
  - test0 편집기를 고친 뒤에는 이 사본도 같이 갱신한다.
- 저장소는 한글 작업장 문서함과 같다. GitHub `kwonyujin119/test0`의 `hwp/` 폴더이고, 브라우저 안에서 암호로 AES-GCM 암호화한다.
  - 연구 과제: 문서함 목록에서 `lab` 꼬리표가 붙은 문서
  - 질문 모음: `lab-q.bin`
  - 자료실: 목록 `lab-lib.bin`, 파일 `lab-f-<id>.bin`
- 토큰은 기기의 브라우저(localStorage `gyoan:gh`)에, 암호 키는 IndexedDB `hwp-ws`에 저장된다. test0와 같은 출처(kwonyujin119.github.io)라서 함께 쓴다.
