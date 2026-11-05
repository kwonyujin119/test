/* SACHIL 연구실: 한글 작업장(test0)과 같은 문서함을 쓴다 — GitHub 저장소는 늘 kwonyujin119/test0(토큰은 이 기기에 넣은 것을 함께 씀) */
(function () {
  const FIX = { owner: 'kwonyujin119', repo: 'test0', branch: 'main' };
  GH.detect = () => Object.assign({}, FIX);
  const load0 = GH.load.bind(GH);
  GH.load = function () { const c = load0() || Object.assign({ token: '' }, FIX); this.cfg = Object.assign({}, c, FIX); return this.cfg; };
  const save0 = GH.save.bind(GH);
  GH.save = function (c) { save0(Object.assign({}, c, FIX)); };
})();
