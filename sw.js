// SACHIL:47 서비스 워커 — 홈 화면 설치(앱 설치) 조건을 맞추기 위한 최소 구성.
// 캐시는 하지 않는다(항상 최신 화면). 같은 주소의 GET 요청만 네트워크로 그대로 넘기고,
// 서버(app.sachil47.com) 채팅·메뉴 요청에는 관여하지 않는다.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req));
});
