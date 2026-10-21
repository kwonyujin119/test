// SACHIL:47 서비스 워커 — 홈 화면 설치(앱 설치) 조건을 맞추기 위한 최소 구성.
// 캐시는 하지 않는다(항상 최신 화면). 단 V111부터 화면(HTML) 한 장만 보관해 두고, 인터넷이 끊겼을 때만 그걸로 연다(지하·터널 등). 같은 주소의 GET 요청만 네트워크로 그대로 넘기고,
// 서버(app.sachil47.com) 채팅·메뉴 요청에는 관여하지 않는다.
// 화면(HTML)은 브라우저 캐시(github.io 10분)를 건너뛰고 매번 새 버전을 확인한다 — 바뀐 게 없으면 304로 가볍게 끝남.
const SHELL = 'sachil-shell-v1', SHELL_KEY = new URL('./', self.location).href;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(r => {
          if (r.redirected) return Response.redirect(r.url, 302);
          if (r.ok && (r.headers.get('content-type') || '').includes('text/html')) { const c = r.clone(); caches.open(SHELL).then(s => s.put(SHELL_KEY, c)).catch(() => {}); }
          return r;
        })
        .catch(() => fetch(req).catch(() => caches.match(SHELL_KEY, { cacheName: SHELL }).then(m => m || Response.error())))
    );
    return;
  }
  e.respondWith(fetch(req));
});
// V202: 초과근무 알리미 알림을 누르면 앱 창으로
// V211: '초과근무 진행 중' 상시 알림(tag sachil-ot-run)은 눌러도 지우지 않고(진행 표시 유지), 앱 창에 알리미 창을 열라고 전한다(postMessage, 새 창이면 ?ot=1)
self.addEventListener('notificationclick', e => {
  const ot = /^sachil-ot/.test(e.notification.tag || '');
  if (e.notification.tag !== 'sachil-ot-run') e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) { if ('focus' in c) { if (ot) { try { c.postMessage({ type: 'sachil-ot-open' }); } catch (_) {} } return c.focus(); } }
    return self.clients.openWindow ? self.clients.openWindow(ot ? './?ot=1' : './') : null;
  }));
});
