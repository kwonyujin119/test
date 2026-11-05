/* SACHIL 연구실: hangul.html?box=문서id — 연구실 목록에서 고른 문서를 문서함에서 바로 연다(암호는 연구실 화면에서 이미 연 상태) */
(async function () {
  const id = new URLSearchParams(location.search).get('box'); if (!id) return;
  const H = window.__hwp; const st = $id('start');
  const back = (m) => { location.replace('lab.html' + (m ? '#msg=' + encodeURIComponent(m) : '')); };
  if (!HwpStore.box.ready() || !(HwpStore.box.unlocked || await HwpStore.box.restoreKey())) { back('문서함을 먼저 열어 주세요'); return; }
  if (st) { st.hidden = false; const c = st.querySelector('.card'); if (c) c.insertAdjacentHTML('afterbegin', '<p id="labOpening" style="font-weight:700">연구실 문서를 여는 중…</p>'); }
  try {
    const items = await HwpStore.box.list(); const it = items.find(x => x.id === id);
    if (!it) { back('문서함에서 그 문서를 찾지 못했어요'); return; }
    const u = await HwpStore.box.load(id);
    await H.openBytes(u.buffer, { name: it.name, boxId: id });
  } catch (e) { alert('문서를 열지 못했습니다: ' + e.message); back(); }
  finally { const o = document.getElementById('labOpening'); if (o) o.remove(); }
})();
