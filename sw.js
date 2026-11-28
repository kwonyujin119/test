// SACHIL:47 서비스 워커 — 홈 화면 설치(앱 설치) 조건을 맞추기 위한 최소 구성.
// 캐시는 하지 않는다(항상 최신 화면). 단 V111부터 화면(HTML) 한 장만 보관해 두고, 인터넷이 끊겼을 때만 그걸로 연다(지하·터널 등). 같은 주소의 GET 요청만 네트워크로 그대로 넘기고,
// 서버(app.sachil47.com) 채팅·메뉴 요청에는 관여하지 않는다.
// 화면(HTML)은 브라우저 캐시(github.io 10분)를 건너뛰고 매번 새 버전을 확인한다 — 바뀐 게 없으면 304로 가볍게 끝남.
const SHELL = 'sachil-shell-v1', SHELL_KEY = new URL('./', self.location).href;
const isShell = u => { const p = new URL(u).pathname, k = new URL(SHELL_KEY).pathname; return p === k || p === k + 'index.html'; };
// V260: UI gen2(입체) 그림 — 오프라인(지하·터널)에서도 첫 화면 S·A·CH·IL 3D 글자·아이콘이 빈칸이 되지 않게 미리 받아 둔다.
// 쓸 때는 네트워크 먼저(그림을 바꿔도 바로 새 그림), 끊겼을 때만 보관본.
const IMG = 'sachil-img-v1', IMG_PRE = [
  'img/3d/47.webp',
  'img/3d/ai-agent.webp',
  'img/3d/cases.webp',
  'img/3d/cp.webp',
  'img/3d/debrief.webp',
  'img/3d/drone.webp',
  'img/3d/ersp.webp',
  'img/3d/faq.webp',
  'img/3d/fobj.webp',
  'img/3d/hazmat.webp',
  'img/3d/hydrant.webp',
  'img/3d/icAnon.webp',
  'img/3d/icBroken.webp',
  'img/3d/icOffline.webp',
  'img/3d/ictc-eval.webp',
  'img/3d/ictc-schedule.webp',
  'img/3d/law.webp',
  'img/3d/mci.webp',
  'img/3d/rit.webp',
  'img/3d/safety.webp',
  'img/3d/sg-A.webp',
  'img/3d/sg-CH.webp',
  'img/3d/sg-IL.webp',
  'img/3d/sg-S.webp',
  'img/3d/sop.webp',
  'img/3d/updates.webp',
  'img/3d/water.webp',
  'img/hub-scene-m.webp',
  'img/hub-scene-pc.webp',
  'icons/icon-96.png'
];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(IMG).then(c => Promise.all(IMG_PRE.map(u => c.add(u).catch(() => {})))).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  // V246: 다른 앱에서 '공유 → SACHIL:47'(manifest share_target) — 받은 파일·글을 캐시에 잠깐 두고 47망 화면으로(화면이 꺼내 입력창 첨부로)
  if (req.method === 'POST' && new URL(req.url).searchParams.has('share-target')) {
    e.respondWith((async () => {
      try {
        const fd = await req.formData(), c = await caches.open('sachil-share-v1');
        for (const k of await c.keys()) await c.delete(k);
        const text = ['title', 'text', 'url'].map(k => String(fd.get(k) || '').trim()).filter((v, i, a) => v && a.indexOf(v) === i).join(' ');
        if (text) await c.put(new URL('./__share/text', self.location).href, new Response(text));
        let i = 0;
        for (const f of fd.getAll('files')) {
          if (!f || typeof f === 'string' || !f.size) continue;
          await c.put(new URL('./__share/f' + (i++), self.location).href, new Response(f, { headers: { 'Content-Type': f.type || 'application/octet-stream', 'X-Name': encodeURIComponent(f.name || ('공유파일' + i)) } }));
        }
      } catch (_) { }
      return Response.redirect(new URL('./?share=1#chat', self.location).href, 303);
    })());
    return;
  }
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(r => {
          if (r.redirected) return Response.redirect(r.url, 302);
          // V231: 앱 첫 화면(index.html)만 보관한다 — 같은 주소 아래 다른 페이지(album/ 등)가 오프라인용 화면을 덮어쓰지 않게
          if (r.ok && isShell(req.url) && (r.headers.get('content-type') || '').includes('text/html')) { const c = r.clone(); caches.open(SHELL).then(s => s.put(SHELL_KEY, c)).catch(() => {}); }
          return r;
        })
        .catch(() => fetch(req).catch(() => (isShell(req.url) ? caches.match(SHELL_KEY, { cacheName: SHELL }) : Promise.resolve(null)).then(m => m || Response.error())))
    );
    return;
  }
  if (/\/(img|icons)\//.test(new URL(req.url).pathname)) {   // V260: 그림은 네트워크 먼저 → 받은 것은 보관 → 끊기면 보관본
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(IMG).then(x => x.put(req, c)).catch(() => {}); } return r; })
      .catch(() => caches.match(req, { cacheName: IMG }).then(m => m || Response.error())));
    return;
  }
  e.respondWith(fetch(req));
});
// V202: 초과근무 알리미 알림을 누르면 앱 창으로
// V211: '초과근무 진행 중' 상시 알림(tag sachil-ot-run)은 눌러도 지우지 않고(진행 표시 유지), 앱 창에 알리미 창을 열라고 전한다(postMessage, 새 창이면 ?ot=1)
self.addEventListener('notificationclick', e => {
  // V216: 초과근무 알림의 '확인했어요'·'5분 뒤 다시' 버튼 — 열린 앱에 전하고, 없으면 그 동작으로 앱을 연다
  if (e.action === 'ot-ok' || e.action === 'ot-snz' || e.action === 'ot-end') {   // V224: '초과근무 계속'·'초과근무 종료'
    e.notification.close();
    const t = e.action === 'ot-ok' ? 'sachil-ot-ok' : e.action === 'ot-end' ? 'sachil-ot-end' : 'sachil-ot-snz';
    e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
      if (l.length) { l.forEach(c => { try { c.postMessage({ type: t }); } catch (_) {} }); return; }
      return self.clients.openWindow ? self.clients.openWindow('./?ot=' + (e.action === 'ot-ok' ? 'ok' : e.action === 'ot-end' ? 'end' : 'snz')) : null;
    }));
    return;
  }
  const ot = /^sachil-ot/.test(e.notification.tag || '');
  if (e.notification.tag !== 'sachil-ot-run') e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) { if ('focus' in c) { if (ot) { try { c.postMessage({ type: 'sachil-ot-open' }); } catch (_) {} } return c.focus(); } }
    return self.clients.openWindow ? self.clients.openWindow(ot ? './?ot=1' : './') : null;
  }));
});
