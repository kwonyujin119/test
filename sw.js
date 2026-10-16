// SACHIL:47 서비스 워커 — 홈 화면 설치(앱 설치) 조건을 맞추기 위한 최소 구성.
// 캐시는 하지 않는다(항상 최신 화면). 같은 주소의 GET 요청만 네트워크로 그대로 넘기고,
// 서버(app.sachil47.com) 채팅·메뉴 요청에는 관여하지 않는다.
// 화면(HTML)은 브라우저 캐시(github.io 10분)를 건너뛰고 매번 새 버전을 확인한다 — 바뀐 게 없으면 304로 가볍게 끝남.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(r => r.redirected ? Response.redirect(r.url, 302) : r)
        .catch(() => fetch(req))
    );
    return;
  }
  e.respondWith(fetch(req));
});
