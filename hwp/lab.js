/* SACHIL:47 지휘역량강화센터 연구실 — 연구 과제(hwpx)·자료실·질문 모음을 한글 작업장 문서함(GitHub, 브라우저 안 AES 암호화)에 저장해 어느 기기에서나 같게.
   문서 편집은 한글 작업장(hangul.html, test0 사본)으로 연다. 아래 HWPX 묶음은 앱(index.html V241)의 것과 같다(새 과제·예전 기기 저장분 옮기기에 씀). */
(() => {
'use strict';
  const LABT={water:'상수도 흐름',hydrant:'소화전 실증',coupling:'100mm 보수구',etc:'기타'};   /* V240: 질문 모음 과제 꼬리표 */
  const LAB_SEED=[
    {title:'상수도 흐름 구조(취수에서 소방용수까지)에 관한 연구', summary:'수운영관리실 · 정수장 · 배수지에 관한 이해',
      body:'<p>물이 소화전에 닿기까지의 길을 따라가며 각 시설의 역할과 소방용수에 주는 영향을 이해합니다.</p><h4>상수도 흐름</h4><p>취수 → 정수장 → 배수지 → 배수관 → 소화전(소방용수)</p><h4>주요 시설</h4><ul><li><b>수운영관리실</b> — 상수도 전체 흐름(유량·수압·수위)을 보고 조절하는 곳, 화재 때 수압·유량 협조 창구</li><li><b>정수장</b> — 취수한 원수를 정수해 보내는 곳, 처리 용량·송수 방식</li><li><b>배수지</b> — 정수를 모아 두었다가 지역으로 내려보내는 곳, 저류량·높이(수압)·급수 구역</li></ul>'},
    {title:'소화전 급수량 / 방수 거리 / 방수량 실증 연구', summary:'단계적으로 화재경계지구 → 산업단지 → 대응2단계 발생 지역 → 인천 전지역',
      body:'<p>소화전의 실제 급수량·방수 거리·방수량을 현장에서 재어, 지역별로 믿을 수 있는 기준을 만듭니다.</p><h4>측정 항목</h4><ul><li><b>급수량</b> — 소화전 1개에서 실제로 받을 수 있는 물의 양</li><li><b>방수 거리</b> — 소화전 급수로 닿는 방수 거리</li><li><b>방수량</b> — 노즐 끝에서 나오는 실제 방수량</li></ul><h4>단계</h4><ol><li>화재경계지구</li><li>산업단지</li><li>대응2단계 발생 지역</li><li>인천 전지역</li></ol>'},
    {title:'소방차량 100mm 보수구 구조 변경에 관한 연구', summary:'소방차량 100mm 보수구의 구조 변경',
      body:'<p>소방차량 100mm 보수구의 구조를 바꿔 급수·연결 효율을 높이는 방안을 연구합니다.</p><p>세부 내용은 준비 중이에요.</p>'}];
  // 본문 HTML은 허용한 태그만(서버와 같은 규칙) — 붙여넣기·hwpx 불러오기·저장 모두 이 함수를 거친다
  const LAB_OK=new Set(['P','H3','H4','B','STRONG','I','EM','U','UL','OL','LI','BR','TABLE','TBODY','THEAD','TR','TD','TH','BLOCKQUOTE']);
  function labClean(html){ const t=document.createElement('template'); t.innerHTML=String(html||'');
    const walk=n=>{ [...n.childNodes].forEach(c=>{ if(c.nodeType===3) return; if(c.nodeType!==1){ c.remove(); return; }
      if(/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|META|LINK)$/.test(c.tagName)){ c.remove(); return; }
      walk(c);
      if(c.tagName==='DIV'||c.tagName==='SECTION'){ const p=document.createElement('p'); while(c.firstChild) p.appendChild(c.firstChild); c.replaceWith(p); return; }
      if(/^H[1-2]$/.test(c.tagName)||c.tagName==='H5'||c.tagName==='H6'){ const h=document.createElement('h4'); while(c.firstChild) h.appendChild(c.firstChild); c.replaceWith(h); return; }
      if(!LAB_OK.has(c.tagName)){ c.replaceWith(...c.childNodes); return; }
      [...c.attributes].forEach(a=>c.removeAttribute(a.name)); }); };
    walk(t.content); return t.innerHTML.replace(/<p>\s*<\/p>/g,'').trim(); }
  // ---------- hwpx(한글 표준 문서) 읽기·쓰기 — test0 한글 작업장과 같은 방식(브라우저 내장 압축, 외부 라이브러리 없음) ----------
  const HWPX=(()=>{
    const CRC=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; CRC[n]=c>>>0; }
    const crc32=u=>{ let c=0xFFFFFFFF; for(let i=0;i<u.length;i++) c=CRC[(c^u[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; };
    const pipe=async(u,st)=>new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(st)).arrayBuffer());
    async function read(buf){ const u8=new Uint8Array(buf), dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength); let eo=-1;
      for(let i=u8.length-22;i>=Math.max(0,u8.length-65557);i--) if(dv.getUint32(i,true)===0x06054b50){ eo=i; break; }
      if(eo<0) throw new Error('hwpx 파일이 아니에요 — 한글에서 ‘다른 이름으로 저장 → 한글 표준 문서(*.hwpx)’로 저장해 올려 주세요(옛 .hwp는 못 읽어요)');
      const cnt=dv.getUint16(eo+10,true); let p=dv.getUint32(eo+16,true); const out=new Map(), td=new TextDecoder();
      for(let n=0;n<cnt;n++){ if(dv.getUint32(p,true)!==0x02014b50) throw new Error('파일이 손상됐어요');
        const meth=dv.getUint16(p+10,true), cs=dv.getUint32(p+20,true), nl=dv.getUint16(p+28,true), xl=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), lo=dv.getUint32(p+42,true);
        const name=td.decode(u8.subarray(p+46,p+46+nl)); p+=46+nl+xl+cl;
        const st=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true), raw=u8.subarray(st,st+cs);
        if(name.endsWith('/')) continue; out.set(name, meth===0?raw.slice():meth===8?await pipe(raw,new DecompressionStream('deflate-raw')):null); }
      return out; }
    async function write(entries){ const enc=new TextEncoder(), d=new Date(), tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1), dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
      const loc=[], cen=[]; let off=0;
      for(const e of entries){ const data=typeof e.data==='string'?enc.encode(e.data):e.data, nb=enc.encode(e.name), crc=crc32(data);
        let meth=e.store?0:8, body=data; if(meth===8){ body=await pipe(data,new CompressionStream('deflate-raw')); if(body.length>=data.length){ meth=0; body=data; } }
        const lh=new Uint8Array(30+nb.length), lv=new DataView(lh.buffer); lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x800,true); lv.setUint16(8,meth,true); lv.setUint16(10,tm,true); lv.setUint16(12,dt,true); lv.setUint32(14,crc,true); lv.setUint32(18,body.length,true); lv.setUint32(22,data.length,true); lv.setUint16(26,nb.length,true); lh.set(nb,30);
        const ch=new Uint8Array(46+nb.length), cv=new DataView(ch.buffer); cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0x800,true); cv.setUint16(10,meth,true); cv.setUint16(12,tm,true); cv.setUint16(14,dt,true); cv.setUint32(16,crc,true); cv.setUint32(20,body.length,true); cv.setUint32(24,data.length,true); cv.setUint16(28,nb.length,true); cv.setUint32(42,off,true); ch.set(nb,46);
        loc.push(lh,body); cen.push(ch); off+=lh.length+body.length; }
      const cd=cen.reduce((a,c)=>a+c.length,0), end=new Uint8Array(22), ev=new DataView(end.buffer); ev.setUint32(0,0x06054b50,true); ev.setUint16(8,entries.length,true); ev.setUint16(10,entries.length,true); ev.setUint32(12,cd,true); ev.setUint32(16,off,true);
      return new Blob([...loc,...cen,end],{type:'application/hwp+zip'}); }
    const XH='<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    const NS='xmlns:ha="http://www.hancom.co.kr/hwpml/2011/app" xmlns:hp="http://www.hancom.co.kr/hwpml/2011/paragraph" xmlns:hp10="http://www.hancom.co.kr/hwpml/2016/paragraph" xmlns:hs="http://www.hancom.co.kr/hwpml/2011/section" xmlns:hc="http://www.hancom.co.kr/hwpml/2011/core" xmlns:hh="http://www.hancom.co.kr/hwpml/2011/head" xmlns:hhs="http://www.hancom.co.kr/hwpml/2011/history" xmlns:hm="http://www.hancom.co.kr/hwpml/2011/master-page" xmlns:hpf="http://www.hancom.co.kr/schema/2011/hpf" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf/" xmlns:ooxmlchart="http://www.hancom.co.kr/hwpml/2016/ooxmlchart" xmlns:hwpunitchar="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"';
    const LG=['hangul','latin','hanja','japanese','other','symbol','user'], all=v=>LG.map(l=>`${l}="${v}"`).join(' ');
    const xe=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    /* 글자 모양: 0 본문 10pt · 1 본문 굵게 · 2 제목 18pt 굵게 · 3 소제목 13pt 굵게 · 4 요약 10pt 회색 · 5 쪽번호용 9pt */
    const cp=(id,h,font,bold,color)=>`<hh:charPr id="${id}" height="${h}" textColor="${color||'#000000'}" shadeColor="none" useFontSpace="0" useKerning="0" symMark="NONE" borderFillIDRef="2"><hh:fontRef ${all(font)}/><hh:ratio ${all(100)}/><hh:spacing ${all(0)}/><hh:relSz ${all(100)}/><hh:offset ${all(0)}/>${bold?'<hh:bold/>':''}<hh:underline type="NONE" shape="SOLID" color="#000000"/><hh:strikeout shape="NONE" color="#000000"/><hh:outline type="NONE"/><hh:shadow type="NONE" color="#B2B2B2" offsetX="10" offsetY="10"/></hh:charPr>`;
    const mg=(o,mul)=>['intent','left','right','prev','next'].map(k=>`<hc:${k} value="${(o[k]||0)*mul}" unit="HWPUNIT"/>`).join('');
    /* 문단 모양: 0 양쪽 · 1 가운데(제목) · 2 들여쓴 목록 · 3 표 칸 */
    const pp=(id,o)=>`<hh:paraPr id="${id}" tabPrIDRef="0" condense="0" fontLineHeight="0" snapToGrid="1" suppressLineNumbers="0" checked="0"><hh:align horizontal="${o.align||'JUSTIFY'}" vertical="BASELINE"/><hh:heading type="NONE" idRef="0" level="0"/><hh:breakSetting breakLatinWord="KEEP_WORD" breakNonLatinWord="KEEP_WORD" widowOrphan="0" keepWithNext="0" keepLines="0" pageBreakBefore="0" lineWrap="BREAK"/><hh:autoSpacing eAsianEng="0" eAsianNum="0"/><hp:switch><hp:case hp:required-namespace="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar"><hh:margin>${mg(o,1)}</hh:margin><hh:lineSpacing type="PERCENT" value="${o.ls||160}" unit="HWPUNIT"/></hp:case><hp:default><hh:margin>${mg(o,2)}</hh:margin><hh:lineSpacing type="PERCENT" value="${o.ls||160}" unit="HWPUNIT"/></hp:default></hp:switch><hh:border borderFillIDRef="2" offsetLeft="0" offsetRight="0" offsetTop="0" offsetBottom="0" connect="0" ignoreMargin="0"/></hh:paraPr>`;
    const side=(t,w)=>['left','right','top','bottom'].map(x=>`<hh:${x}Border type="${t}" width="${w}" color="#000000"/>`).join('');
    const bf=(id,t,w,fill)=>`<hh:borderFill id="${id}" threeD="0" shadow="0" centerLine="NONE" breakCellSeparateLine="0"><hh:slash type="NONE" Crooked="0" isCounter="0"/><hh:backSlash type="NONE" Crooked="0" isCounter="0"/>${side(t,w)}<hh:diagonal type="SOLID" width="0.1 mm" color="#000000"/>${fill?'<hc:fillBrush><hc:winBrush faceColor="none" hatchColor="#999999" alpha="0"/></hc:fillBrush>':''}</hh:borderFill>`;
    function header(){ const ti='<hh:typeInfo familyType="FCAT_GOTHIC" weight="6" proportion="4" contrast="0" strokeVariation="1" armStyle="1" letterform="1" midline="1" xHeight="1"/>';
      const ff=LG.map(l=>`<hh:fontface lang="${l.toUpperCase()}" fontCnt="2"><hh:font id="0" face="함초롬돋움" type="TTF" isEmbedded="0">${ti}</hh:font><hh:font id="1" face="함초롬바탕" type="TTF" isEmbedded="0">${ti}</hh:font></hh:fontface>`).join('');
      const cps=[cp(0,1000,1),cp(1,1000,1,1),cp(2,1800,0,1),cp(3,1300,0,1),cp(4,1000,1,0,'#555555'),cp(5,900,0)];
      const pps=[pp(0,{}),pp(1,{align:'CENTER'}),pp(2,{left:1500,intent:-1500}),pp(3,{align:'LEFT',ls:130})];
      const sty=`<hh:style id="0" type="PARA" name="바탕글" engName="Normal" paraPrIDRef="0" charPrIDRef="0" nextStyleIDRef="0" langID="1042" lockForm="0"/>`;
      return XH+`<hh:head ${NS} version="1.4" secCnt="1"><hh:beginNum page="1" footnote="1" endnote="1" pic="1" tbl="1" equation="1"/><hh:refList><hh:fontfaces itemCnt="7">${ff}</hh:fontfaces><hh:borderFills itemCnt="3">${bf(1,'NONE','0.1 mm')}${bf(2,'NONE','0.1 mm',true)}${bf(3,'SOLID','0.12 mm')}</hh:borderFills><hh:charProperties itemCnt="${cps.length}">${cps.join('')}</hh:charProperties><hh:tabProperties itemCnt="1"><hh:tabPr id="0" autoTabLeft="0" autoTabRight="0"/></hh:tabProperties><hh:numberings itemCnt="0"/><hh:paraProperties itemCnt="${pps.length}">${pps.join('')}</hh:paraProperties><hh:styles itemCnt="1">${sty}</hh:styles></hh:refList><hh:compatibleDocument targetProgram="HWP201X"><hh:layoutCompatibility/></hh:compatibleDocument><hh:docOption><hh:linkinfo path="" pageInherit="0" footnoteInherit="0"/></hh:docOption><hh:trackchageConfig flags="56"/></hh:head>`; }
    const secPr=`<hp:secPr id="" textDirection="HORIZONTAL" spaceColumns="1134" tabStop="8000" tabStopVal="4000" tabStopUnit="HWPUNIT" outlineShapeIDRef="0" memoShapeIDRef="0" textVerticalWidthHead="0" masterPageCnt="0"><hp:grid lineGrid="0" charGrid="0" wonggojiFormat="0"/><hp:startNum pageStartsOn="BOTH" page="0" pic="0" tbl="0" equation="0"/><hp:visibility hideFirstHeader="0" hideFirstFooter="0" hideFirstMasterPage="0" border="SHOW_ALL" fill="SHOW_ALL" hideFirstPageNum="0" hideFirstEmptyLine="0" showLineNumber="0"/><hp:lineNumberShape restartType="0" countBy="0" distance="0" startNumber="0"/><hp:pagePr landscape="WIDELY" width="59528" height="84188" gutterType="LEFT_ONLY"><hp:margin header="4252" footer="4252" gutter="0" left="8504" right="8504" top="5668" bottom="4252"/></hp:pagePr><hp:footNotePr><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" suffixChar=")" supscript="0"/><hp:noteLine length="-1" type="SOLID" width="0.12 mm" color="#000000"/><hp:noteSpacing betweenNotes="283" belowLine="567" aboveLine="850"/><hp:numbering type="CONTINUOUS" newNum="1"/><hp:placement place="EACH_COLUMN" beneathText="0"/></hp:footNotePr><hp:endNotePr><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" suffixChar=")" supscript="0"/><hp:noteLine length="14692344" type="SOLID" width="0.12 mm" color="#000000"/><hp:noteSpacing betweenNotes="0" belowLine="567" aboveLine="850"/><hp:numbering type="CONTINUOUS" newNum="1"/><hp:placement place="END_OF_DOCUMENT" beneathText="0"/></hp:endNotePr>${['BOTH','EVEN','ODD'].map(t=>`<hp:pageBorderFill type="${t}" borderFillIDRef="1" textBorder="PAPER" headerInside="0" footerInside="0" fillArea="PAPER"><hp:offset left="1417" right="1417" top="1417" bottom="1417"/></hp:pageBorderFill>`).join('')}</hp:secPr>`;
    /* 본문 HTML → 문단(글자 조각) 목록. 굵은 글(b·strong)은 굵은 글자 모양으로 */
    function runsOf(el,bold){ const out=[]; el.childNodes.forEach(c=>{ if(c.nodeType===3){ if(c.nodeValue) out.push([c.nodeValue,bold]); } else if(c.nodeType===1){ if(c.tagName==='BR') out.push(['\n',bold]); else out.push(...runsOf(c,bold||/^(B|STRONG)$/.test(c.tagName))); } }); return out; }
    let pid=1;
    const para=(runs,pr,base)=>{ const r=runs.length?runs:[['',0]]; return `<hp:p id="${pid++}" paraPrIDRef="${pr}" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">${r.map(([t,b])=>`<hp:run charPrIDRef="${base===0&&b?1:base}"><hp:t>${xe(String(t).replace(/\n/g,' '))}</hp:t></hp:run>`).join('')}</hp:p>`; };
    function table(tb){ const rows=[...tb.querySelectorAll('tr')]; const nc=Math.max(1,...rows.map(r=>r.children.length)), W=42520, cw=Math.floor(W/nc), rh=1800;
      const cells=rows.map((r,ri)=>`<hp:tr>${Array.from({length:nc},(_,ci)=>{ const c=r.children[ci]; return `<hp:tc name="" header="${ri===0&&c&&c.tagName==='TH'?1:0}" hasMargin="0" protect="0" editable="0" dirty="0" borderFillIDRef="3"><hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">${para(c?runsOf(c,c.tagName==='TH'):[],3,0)}</hp:subList><hp:cellAddr colAddr="${ci}" rowAddr="${ri}"/><hp:cellSpan colSpan="1" rowSpan="1"/><hp:cellSz width="${cw}" height="${rh}"/><hp:cellMargin left="510" right="510" top="141" bottom="141"/></hp:tc>`; }).join('')}</hp:tr>`).join('');
      return `<hp:p id="${pid++}" paraPrIDRef="0" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0"><hp:tbl id="${1000+pid}" zOrder="0" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="1" rowCnt="${rows.length}" colCnt="${nc}" cellSpacing="0" borderFillIDRef="3" noAdjust="0"><hp:sz width="${cw*nc}" widthRelTo="ABSOLUTE" height="${rh*rows.length}" heightRelTo="ABSOLUTE" protect="0"/><hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/><hp:outMargin left="0" right="0" top="0" bottom="283"/><hp:inMargin left="510" right="510" top="141" bottom="141"/>${cells}</hp:tbl></hp:run><hp:run charPrIDRef="0"><hp:t/></hp:run></hp:p>`; }
    async function exportDoc(doc){ pid=1; const t=document.createElement('template'); t.innerHTML=labClean(doc.body);
      const ps=[para([[doc.title||'제목 없음',0]],1,2)]; if(doc.summary) ps.push(para([[doc.summary,0]],1,4)); ps.push(para([],0,0));
      const blk=el=>{ const tg=el.tagName;
        if(tg==='H3'||tg==='H4'){ ps.push(para([['',0]],0,0)); ps.push(para(runsOf(el,0).map(([x])=>[x,0]),0,3)); return; }
        if(tg==='UL'||tg==='OL'){ [...el.children].forEach((li,i)=>ps.push(para([[tg==='OL'?`${i+1}. `:'• ',0],...runsOf(li,0)],2,0))); return; }
        if(tg==='TABLE'){ ps.push(table(el)); return; }
        if(tg==='BLOCKQUOTE'){ ps.push(para([['※ ',0],...runsOf(el,0)],2,0)); return; }
        ps.push(para(runsOf(el,0),0,0)); };
      [...t.content.childNodes].forEach(n=>{ if(n.nodeType===1) blk(n); else if(n.nodeType===3&&n.nodeValue.trim()) ps.push(para([[n.nodeValue.trim(),0]],0,0)); });
      const first=ps[0].replace('<hp:run charPrIDRef="2">',`<hp:run charPrIDRef="2">${secPr}<hp:ctrl><hp:colPr id="" type="NEWSPAPER" layout="LEFT" colCount="1" sameSz="1" sameGap="0"/></hp:ctrl></hp:run><hp:run charPrIDRef="2">`);
      const sec=XH+`<hs:sec ${NS}>${first}${ps.slice(1).join('')}</hs:sec>`, now=new Date().toISOString().replace(/\.\d+Z$/,'Z');
      return write([{name:'mimetype',data:'application/hwp+zip',store:true},
        {name:'version.xml',data:XH+'<hv:HCFVersion xmlns:hv="http://www.hancom.co.kr/hwpml/2011/version" tagetApplication="WORDPROCESSOR" major="5" minor="1" micro="0" buildNumber="1" os="1" xmlVersion="1.4" application="Hancom Office Hangul" appVersion="9, 1, 1, 5656 WIN32LEWindows_10"/>',store:true},
        {name:'Contents/header.xml',data:header()},{name:'Contents/section0.xml',data:sec},
        {name:'Preview/PrvText.txt',data:String(doc.title||'').slice(0,200)},
        {name:'settings.xml',data:XH+'<ha:HWPApplicationSetting xmlns:ha="http://www.hancom.co.kr/hwpml/2011/app" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"><ha:CaretPosition listIDRef="0" paraIDRef="0" pos="0"/></ha:HWPApplicationSetting>'},
        {name:'META-INF/container.rdf',data:XH+'<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about=""><ns0:hasPart xmlns:ns0="http://www.hancom.co.kr/hwpml/2016/meta/pkg#" rdf:resource="Contents/header.xml"/></rdf:Description><rdf:Description rdf:about="Contents/header.xml"><rdf:type rdf:resource="http://www.hancom.co.kr/hwpml/2016/meta/pkg#HeaderFile"/></rdf:Description><rdf:Description rdf:about=""><ns0:hasPart xmlns:ns0="http://www.hancom.co.kr/hwpml/2016/meta/pkg#" rdf:resource="Contents/section0.xml"/></rdf:Description><rdf:Description rdf:about="Contents/section0.xml"><rdf:type rdf:resource="http://www.hancom.co.kr/hwpml/2016/meta/pkg#SectionFile"/></rdf:Description><rdf:Description rdf:about=""><rdf:type rdf:resource="http://www.hancom.co.kr/hwpml/2016/meta/pkg#Document"/></rdf:Description></rdf:RDF>'},
        {name:'Contents/content.hpf',data:XH+`<opf:package ${NS} version="" unique-identifier="" id=""><opf:metadata><opf:title>${xe(doc.title||'')}</opf:title><opf:language>ko</opf:language><opf:meta name="creator" content="text">SACHIL:47 연구실</opf:meta><opf:meta name="CreatedDate" content="text">${now}</opf:meta><opf:meta name="ModifiedDate" content="text">${now}</opf:meta></opf:metadata><opf:manifest><opf:item id="header" href="Contents/header.xml" media-type="application/xml"/><opf:item id="section0" href="Contents/section0.xml" media-type="application/xml"/><opf:item id="settings" href="settings.xml" media-type="application/xml"/></opf:manifest><opf:spine><opf:itemref idref="header" linear="yes"/><opf:itemref idref="section0" linear="yes"/></opf:spine></opf:package>`},
        {name:'META-INF/container.xml',data:XH+'<ocf:container xmlns:ocf="urn:oasis:names:tc:opendocument:xmlns:container" xmlns:hpf="http://www.hancom.co.kr/schema/2011/hpf"><ocf:rootfiles><ocf:rootfile full-path="Contents/content.hpf" media-type="application/hwpml-package+xml"/><ocf:rootfile full-path="Preview/PrvText.txt" media-type="text/plain"/><ocf:rootfile full-path="META-INF/container.rdf" media-type="application/rdf+xml"/></ocf:rootfiles></ocf:container>'},
        {name:'META-INF/manifest.xml',data:XH+'<odf:manifest xmlns:odf="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"/>'}]); }
    /* hwpx → {title, html}: 문단 글을 차례로, 표는 표로, 개요·제목 스타일이나 크고 굵은 글은 소제목으로 */
    async function importDoc(file){ const files=await read(await file.arrayBuffer()), td=new TextDecoder();
      const secs=[...files.keys()].filter(n=>/^Contents\/section\d+\.xml$/i.test(n)).sort((a,b)=>(+a.match(/\d+/)[0])-(+b.match(/\d+/)[0]));
      if(!secs.length) throw new Error('hwpx 안에 본문(section)이 없어요');
      const P=s=>new DOMParser().parseFromString(td.decode(s),'application/xml');
      const hd=files.get('Contents/header.xml')?P(files.get('Contents/header.xml')):null, styleName={}, charBig={}, center={};
      if(hd){ [...hd.getElementsByTagNameNS('*','style')].forEach(x=>styleName[x.getAttribute('id')]=x.getAttribute('name')||'');
        [...hd.getElementsByTagNameNS('*','charPr')].forEach(x=>{ charBig[x.getAttribute('id')]=(+x.getAttribute('height')||1000)>=1200||!!x.getElementsByTagNameNS('*','bold').length; });
        [...hd.getElementsByTagNameNS('*','paraPr')].forEach(x=>{ const a=x.getElementsByTagNameNS('*','align')[0]; center[x.getAttribute('id')]=!!a&&a.getAttribute('horizontal')==='CENTER'; }); }
      const kids=(el,nm)=>[...el.children].filter(c=>c.localName===nm), out=[]; let title='', summary='', sumOk=true;
      const txt=p=>{ let t=''; const walk=n=>{ for(const c of n.children){ if(c.localName==='tbl') continue; if(c.localName==='t') t+=c.textContent; else if(c.localName==='lineBreak') t+='\n'; else if(c.localName==='tab') t+=' '; else walk(c); } }; walk(p); return t; };
      const esc2=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
      const doP=p=>{ p.querySelectorAll&&[...p.getElementsByTagNameNS('*','tbl')].filter(tb=>{ let a=tb.parentElement; while(a&&a!==p){ if(a.localName==='tbl') return false; a=a.parentElement; } return true; }).forEach(tb=>{
          const rows=kids(tb,'tr').map(tr=>kids(tr,'tc').map(tc=>[...tc.getElementsByTagNameNS('*','p')].map(txt).join(' ').trim()));
          if(rows.length) out.push(`<table><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc2(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`); });
        const t=txt(p).replace(/\s+$/,''); if(!t.trim()) return;
        const sn=styleName[p.getAttribute('styleIDRef')]||'', runs=kids(p,'run'), big=runs.length&&runs.every(r=>charBig[r.getAttribute('charPrIDRef')]);
        if(!title&&!out.length&&(big||/제목/.test(sn))){ title=t.trim().slice(0,200); return; }
        if(title&&sumOk&&!out.length&&!summary&&center[p.getAttribute('paraPrIDRef')]){ summary=t.trim().slice(0,500); return; }   /* 제목 바로 아래 가운데 줄 = 한 줄 요약 */
        sumOk=false;
        if(/^\s*\d{1,2}[.)]\s/.test(t)){ const li=`<li>${esc2(t.replace(/^\s*\d{1,2}[.)]\s*/,''))}</li>`; if(/<\/ol>$/.test(out[out.length-1]||'')) out[out.length-1]=out[out.length-1].replace(/<\/ol>$/,li+'</ol>'); else out.push(`<ol>${li}</ol>`); return; }
        if(/^개요|제목|Heading/i.test(sn)||(big&&t.length<60)) out.push(`<h4>${esc2(t.trim())}</h4>`);
        else if(/^\s*[•·○◦▪■□\-–]\s/.test(t)){ const li=`<li>${esc2(t.replace(/^\s*[•·○◦▪■□\-–]\s*/,''))}</li>`; if(/<\/ul>$/.test(out[out.length-1]||'')) out[out.length-1]=out[out.length-1].replace(/<\/ul>$/,li+'</ul>'); else out.push(`<ul>${li}</ul>`); }
        else out.push(`<p>${esc2(t)}</p>`); };
      for(const n of secs){ const d=P(files.get(n)); kids(d.documentElement,'p').forEach(doP); }
      return {title, summary, html:labClean(out.join(''))}; }
    return {exportDoc, importDoc};
  })();

  /* ================= 연구실 화면 ================= */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const BOX = HwpStore.box;
  const LIB_MAX = 50 * 1024 * 1024;   // GitHub 한 번에 올리는 한도(100MB)·암호화 여유를 생각한 파일 1개 크기
  const TABS = [['docs', '연구 과제'], ['lib', '자료실'], ['qna', '질문 모음']];
  const S = { tab: 'docs', docs: null, others: [], q: null, qf: 'all', qedit: null, lib: null, folder: 0, sel: new Set(), sort: 'name', found: null, fq: '', ups: [], order: false, busy: false };
  const view = $('#view');
  const dev = () => { const ua = navigator.userAgent; return /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'Mac' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : ''; };
  const fmtD = t => { if (!t) return ''; const d = new Date(t); return isNaN(d) ? '' : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const sz = n => !n ? '0KB' : n >= 1073741824 ? (n / 1073741824).toFixed(1) + 'GB' : n >= 1048576 ? (n / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(n / 1024)) + 'KB';
  const rid = () => Date.now().toString(36) + crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  const ext = n => (String(n).match(/\.([a-z0-9]{1,6})$/i) || [, ''])[1].toLowerCase();
  const VIEW_OK = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', txt: 'text/plain;charset=utf-8' };
  function toast(m, ms) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms || 2400); }
  function dl(blob, name) { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 8000); }
  function setBusy(on, msg) { S.busy = on; const b = $('#busy'); b.hidden = !on; b.querySelector('span').textContent = msg || '문서함과 주고받는 중…'; }
  /* 문서함 작업: 토큰 만료·암호 키 문제면 해당 화면으로, 그 밖에는 알림 */
  async function run(fn, msg) {
    setBusy(true, msg);
    try { return await fn(); }
    catch (e) {
      console.error(e);
      if (e.status === 401 || e.noToken) { gateConnect('GitHub 토큰이 만료됐거나 올바르지 않아요 — 다시 넣어 주세요'); return undefined; }
      if (e.badPass) { gateUnlock('문서함 암호를 다시 넣어 주세요'); return undefined; }
      toast(e.message || '문서함 작업에 실패했어요', 4000); return undefined;
    } finally { setBusy(false); }
  }

  /* ---------- 들어가기: GitHub 연결 → 문서함 암호 ---------- */
  function shell(inner) {
    view.innerHTML = `<nav class="tabs" role="tablist">${TABS.map(([k, t]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${t}</button>`).join('')}</nav>${inner}`;
  }
  function gateConnect(why) {
    view.innerHTML = `<section class="gate"><h2>문서함 연결</h2>
      ${why ? `<p class="warn">${esc(why)}</p>` : ''}
      <p>연구실 자료는 <b>한글 작업장의 문서함</b>(GitHub 저장소 <code>kwonyujin119/test0</code>)에 <b>이 브라우저 안에서 암호화</b>한 뒤 올라가요. 그래서 집·사무실·휴대폰 어디서나 같은 내용을 봅니다.</p>
      <p>이 기기에서 처음이면 GitHub 토큰을 한 번 넣어 주세요(한글 작업장·교안 작업장에서 이미 넣은 브라우저는 자동으로 연결돼요).</p>
      <form id="ghF" autocomplete="off"><label>GitHub 토큰<input id="ghT" type="password" placeholder="github_pat_… 또는 ghp_…" required></label>
      <button class="btn primary" type="submit">연결</button></form>
      <details><summary>토큰 만드는 법</summary><ol><li><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a>를 엽니다.</li><li>Repository access → Only select repositories → <b>test0</b></li><li>Permissions → Repository permissions → <b>Contents: Read and write</b></li><li>Generate token → 나온 문자열을 위 칸에 붙여 넣기</li></ol></details></section>`;
    $('#ghF').onsubmit = async e => {
      e.preventDefault(); const tok = $('#ghT').value.trim().replace(/\s+/g, ''); if (!tok) return;
      const prev = GH.cfg; GH.save({ token: tok }); GH.load();
      const ok = await run(async () => { await GH.api('GET', ''); return true; }, '연결 확인 중…');
      if (!ok) { if (prev) GH.save(prev); else GH.clear(); GH.load(); return; }
      toast('GitHub에 연결했어요 — 이 기기에서는 다시 넣지 않아도 돼요'); gate();
    };
  }
  async function gateUnlock(why) {
    const exists = await run(() => BOX.exists(), '문서함 확인 중…'); if (exists === undefined) return;
    view.innerHTML = `<section class="gate"><h2>${exists ? '문서함 열기' : '문서함 만들기'}</h2>
      ${why ? `<p class="warn">${esc(why)}</p>` : ''}
      ${exists ? '<p>한글 작업장 문서함 암호를 넣어 주세요(한글 작업장과 같은 암호).</p>' : '<p class="warn">처음 한 번 문서함 암호를 정해요. 자료는 이 암호로 암호화돼 올라가므로 저장소가 공개여도 내용·파일 이름이 보이지 않아요. <b>암호를 잊으면 아무도 되살릴 수 없어요.</b></p>'}
      <form id="bxF" autocomplete="off"><label>암호<input id="bxP" type="password" minlength="6" required></label>${exists ? '' : '<label>암호 확인<input id="bxP2" type="password" required></label>'}
      <p class="muted">이 기기에 암호를 기억해 둬요(편집기에서 바로 열리게). 남이 쓰는 기기라면 다 쓴 뒤 ‘잠그기’를 눌러 주세요.</p>
      <button class="btn primary" type="submit">${exists ? '열기' : '만들기'}</button></form></section>`;
    $('#bxF').onsubmit = async e => {
      e.preventDefault(); const p = $('#bxP').value;
      if (p.length < 6) { toast('암호는 6자 이상으로 해 주세요'); return; }
      if (!exists && p !== $('#bxP2').value) { toast('두 암호가 달라요'); return; }
      setBusy(true, '여는 중…(몇 초 걸려요)');
      try { await BOX.unlock(p, true); } catch (er) { setBusy(false); if (er.status === 401) { gateConnect('GitHub 토큰을 다시 넣어 주세요'); return; } toast(er.message || '열지 못했어요', 3500); return; }
      setBusy(false); gate();
    };
  }
  async function gate() {
    GH.load();
    if (!BOX.ready()) { gateConnect(); return; }
    if (!(BOX.unlocked || await BOX.restoreKey())) { gateUnlock(); return; }
    $('#lockBtn').hidden = false;
    go(S.tab, true);
  }
  function go(tab, reload) {
    S.tab = tab; try { history.replaceState(null, '', '#' + tab); } catch (_) { }
    if (tab === 'lib') return libTab(reload); if (tab === 'qna') return qnaTab(reload); return docsTab(reload);
  }
  view.addEventListener('click', e => { const t = e.target.closest('.tabs [data-tab]'); if (t && !S.busy) go(t.dataset.tab, true); });
  $('#lockBtn').onclick = () => { if (!confirm('이 기기에 기억한 문서함 암호를 지울까요? 다음에 다시 넣어야 해요.')) return; BOX.lock(); $('#lockBtn').hidden = true; S.docs = S.q = S.lib = null; gate(); };

  /* ---------- 연구 과제(hwpx 문서) ---------- */
  const LS_OLD = 'sachil_lab_local_v1';
  const oldLocal = () => { try { const v = JSON.parse(localStorage.getItem(LS_OLD) || 'null'); return Array.isArray(v) && v.length ? v : null; } catch (_) { return null; } };
  async function loadDocs() {
    const items = await BOX.list();
    S.docs = items.filter(x => x.lab).sort((a, b) => ((a.lab.ord || 0) - (b.lab.ord || 0)) || String(a.created || '').localeCompare(String(b.created || '')));
    S.others = items.filter(x => !x.lab);
  }
  async function docsTab(reload) {
    if (reload || !S.docs) { shell('<p class="muted pad">문서함을 불러오는 중…</p>'); if ((await run(loadDocs, '문서함을 불러오는 중…')) === undefined && !S.docs) return; }
    const L = S.docs, old = oldLocal();
    shell(`<div class="tools"><button type="button" class="btn primary" data-a="new">＋ 새 연구 과제</button>
        <label class="btn">한글(hwpx) 파일 올리기<input type="file" accept=".hwpx" multiple hidden data-a="imp"></label>
        ${S.others.length ? `<button type="button" class="btn" data-a="pick">문서함 문서 가져오기 (${S.others.length})</button>` : ''}
        ${L.length > 1 ? `<button type="button" class="btn ${S.order ? 'on' : ''}" data-a="order">${S.order ? '순서 바꾸기 끝' : '순서 바꾸기'}</button>` : ''}</div>
      ${old ? `<div class="note">이 기기에 예전 방식으로 저장된 연구 과제가 ${old.length}개 있어요. <button type="button" class="btn sm primary" data-a="migrate">문서함으로 옮기기</button></div>` : ''}
      ${L.length ? `<ol class="docs">${L.map((x, i) => `<li data-id="${esc(x.id)}">
          <a class="doc" href="hangul.html?box=${encodeURIComponent(x.id)}"><span class="no">${i + 1}</span><span class="tx"><b>${esc(x.name)}</b>${x.lab.sum ? `<span>${esc(x.lab.sum)}</span>` : ''}<small>${x.lab.topic && LABT[x.lab.topic] ? `<i class="tag t-${esc(x.lab.topic)}">${esc(LABT[x.lab.topic])}</i>` : ''}${fmtD(x.modified)}${x.device ? ' · ' + esc(x.device) : ''} · ${sz(x.size)}</small></span><span class="go">편집 ›</span></a>
          <div class="acts">${S.order ? `<button type="button" class="btn sm" data-a="up" ${i ? '' : 'disabled'} aria-label="위로">▲</button><button type="button" class="btn sm" data-a="dn" ${i < L.length - 1 ? '' : 'disabled'} aria-label="아래로">▼</button>`
            : `<button type="button" class="btn sm" data-a="dl">받기</button><button type="button" class="btn sm" data-a="info">이름·요약</button><button type="button" class="btn sm" data-a="out" title="연구실 목록에서만 빼요(문서함에는 남음)">빼기</button><button type="button" class="btn sm danger" data-a="del">삭제</button>`}</div></li>`).join('')}</ol>`
        : `<div class="empty"><p>아직 연구 과제가 없어요.</p><button type="button" class="btn primary" data-a="seed">기본 연구 과제 3개로 시작</button></div>`}
      <p class="foot">문서를 누르면 한글 작업장 편집기로 열려요(💾 저장 = 문서함에 저장). 한글 작업장 문서함에서도 같은 문서가 보여요.</p>`);
    const root = view;
    root.onclick = async e => {
      const b = e.target.closest('[data-a]'); if (!b || b.tagName === 'INPUT' || S.busy) return;
      const li = b.closest('li[data-id]'), it = li && L.find(x => x.id === li.dataset.id), a = b.dataset.a;
      if (a === 'new') return newDoc();
      if (a === 'seed') return seed();
      if (a === 'migrate') return migrate(old);
      if (a === 'pick') return pickOthers();
      if (a === 'order') { S.order = !S.order; return docsTab(); }
      if (!it) return;
      if (a === 'up' || a === 'dn') { const i = L.indexOf(it), j = a === 'up' ? i - 1 : i + 1; const ids = L.map(x => x.id); [ids[i], ids[j]] = [ids[j], ids[i]]; return reorder(ids); }
      if (a === 'dl') { const u = await run(() => BOX.load(it.id), '받는 중…'); if (u) dl(new Blob([u], { type: 'application/hwp+zip' }), it.name.replace(/[\\/:*?"<>|]/g, '_') + '.hwpx'); return; }
      if (a === 'info') {
        const n = prompt('문서 이름', it.name); if (n === null) return; const s = prompt('한 줄 요약(목록에 보여요)', it.lab.sum || ''); if (s === null) return;
        const tp = prompt(`과제 꼬리표 — ${Object.entries(LABT).map(([k, v]) => k + ':' + v).join(', ')}`, it.lab.topic || 'etc'); if (tp === null) return;
        if (await run(async () => { await BOX.meta(it.id, { name: n.trim() || it.name, lab: Object.assign({}, it.lab, { sum: s.trim().slice(0, 300), topic: LABT[tp.trim()] ? tp.trim() : 'etc' }) }); return true; })) { toast('바꿨어요'); docsTab(true); }
        return;
      }
      if (a === 'out') { if (!confirm(`‘${it.name}’을(를) 연구실 목록에서 뺄까요? 문서함에는 그대로 남아요.`)) return; if (await run(async () => { await BOX.meta(it.id, { lab: null }); return true; })) docsTab(true); return; }
      if (a === 'del') { if (!confirm(`‘${it.name}’을(를) 문서함에서 지울까요? 한글 작업장에서도 사라져요.`)) return; if (await run(async () => { await BOX.remove(it.id); return true; }, '지우는 중…')) { toast('지웠어요'); docsTab(true); } return; }
    };
    root.onchange = async e => {
      const inp = e.target.closest('[data-a="imp"]'); if (!inp) return; const fs = [...inp.files]; inp.value = ''; if (!fs.length) return;
      let n = 0, ord = maxOrd();
      for (const f of fs) {
        if (!/\.hwpx$/i.test(f.name)) { toast(`${f.name}: hwpx만 올릴 수 있어요(옛 .hwp는 한글에서 hwpx로 저장)`, 3500); continue; }
        let sum = ''; try { const r = await HWPX.importDoc(f); sum = r.summary || ''; } catch (er) { toast(`${f.name}: ${er.message}`, 3500); continue; }
        const ok = await run(() => BOX.save(null, f.name.replace(/\.hwpx$/i, ''), f, dev(), { lab: { ord: ++ord, topic: 'etc', sum } }), `올리는 중… ${f.name}`);
        if (ok) n++;
      }
      if (n) { toast(`${n}개 올렸어요`); docsTab(true); }
    };
  }
  const maxOrd = () => (S.docs || []).reduce((m, x) => Math.max(m, x.lab.ord || 0), 0);
  async function reorder(ids) {
    const byId = new Map(S.docs.map(x => [x.id, x]));
    if (await run(async () => { await BOX.metaMany(ids.map((id, i) => [id, { lab: Object.assign({}, byId.get(id).lab, { ord: i + 1 }) }])); return true; }, '순서 저장 중…')) docsTab(true);
  }
  async function newDoc() {
    const t = prompt('새 연구 과제 제목'); if (!t || !t.trim()) return;
    const sum = prompt('한 줄 요약(없으면 비워 두세요)', '') || '';
    const blob = await HWPX.exportDoc({ title: t.trim(), summary: sum.trim(), body: '<p></p>' });
    const id = await run(() => BOX.save(null, t.trim().slice(0, 120), blob, dev(), { lab: { ord: maxOrd() + 1, topic: 'etc', sum: sum.trim().slice(0, 300) } }), '만드는 중…');
    if (id) location.href = 'hangul.html?box=' + encodeURIComponent(id);
  }
  async function seed() {
    let ord = maxOrd(), n = 0; const tps = ['water', 'hydrant', 'coupling'];
    for (const [i, d] of LAB_SEED.entries()) {
      const blob = await HWPX.exportDoc(d);
      if (await run(() => BOX.save(null, d.title, blob, dev(), { lab: { ord: ++ord, topic: tps[i] || 'etc', sum: d.summary } }), `만드는 중… ${i + 1}/${LAB_SEED.length}`)) n++;
    }
    if (n) toast(`연구 과제 ${n}개를 만들었어요`); docsTab(true);
  }
  async function migrate(old) {
    let ord = maxOrd(), n = 0;
    for (const d of old) {
      const blob = await HWPX.exportDoc({ title: d.title, summary: d.summary, body: d.body });
      if (await run(() => BOX.save(null, String(d.title || '연구 과제').slice(0, 120), blob, dev(), { lab: { ord: ++ord, topic: 'etc', sum: String(d.summary || '').slice(0, 300) } }), `옮기는 중… ${n + 1}/${old.length}`)) n++; else break;
    }
    if (n === old.length) { try { localStorage.removeItem(LS_OLD); } catch (_) { } toast(`${n}개를 문서함으로 옮겼어요`); } else toast(`${n}/${old.length}개만 옮겼어요 — 다시 눌러 주세요`, 3500);
    docsTab(true);
  }
  function pickOthers() {
    const ov = document.createElement('div'); ov.className = 'pick'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="pk"><b>문서함 문서를 연구실로 가져오기</b><p class="muted">한글 작업장 문서함에 있는 문서예요. 가져와도 문서함에는 그대로 있고, 연구실 목록에도 보여요.</p><ul>${S.others.map(x => `<li><span><b>${esc(x.name)}</b><small>${fmtD(x.modified)}${x.device ? ' · ' + esc(x.device) : ''}</small></span><button type="button" class="btn sm primary" data-id="${esc(x.id)}">가져오기</button></li>`).join('')}</ul><button type="button" class="btn" data-x>닫기</button></div>`;
    document.body.appendChild(ov);
    ov.onclick = async e => {
      if (e.target === ov || e.target.closest('[data-x]')) { ov.remove(); return; }
      const b = e.target.closest('[data-id]'); if (!b) return; b.disabled = true;
      if (await run(async () => { await BOX.meta(b.dataset.id, { lab: { ord: maxOrd() + 1, topic: 'etc', sum: '' } }); return true; }, '가져오는 중…')) { ov.remove(); toast('연구실로 가져왔어요'); docsTab(true); } else b.disabled = false;
    };
  }

  /* ---------- 질문 모음(문서함 lab-q.bin) ---------- */
  async function qnaTab(reload) {
    if (reload || !S.q) { shell('<p class="muted pad">질문을 불러오는 중…</p>'); const q = await run(() => BOX.raw.getJSON('lab-q.bin', []), '질문을 불러오는 중…'); if (q === undefined) return; S.q = q; }
    const items = S.q.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)), f = S.qf, L = items.filter(x => f === 'all' || x.topic === f), e = S.qedit && items.find(x => x.id === S.qedit);
    const cnt = k => items.filter(x => k === 'all' || x.topic === k).length;
    shell(`<form class="qadd" autocomplete="off">
        <div class="qt" role="radiogroup" aria-label="관련 과제">${Object.entries(LABT).map(([k, v]) => `<label><input type="radio" name="tp" value="${k}"${(e ? e.topic : (f !== 'all' ? f : 'etc')) === k ? ' checked' : ''}><span>${v}</span></label>`).join('')}</div>
        <textarea name="q" rows="2" maxlength="2000" placeholder="질문을 적어 주세요" required>${e ? esc(e.q) : ''}</textarea>
        <textarea name="note" rows="2" maxlength="4000" placeholder="메모·답(선택)">${e ? esc(e.note || '') : ''}</textarea>
        <div class="row"><button type="submit" class="btn primary">${e ? '수정 저장' : '질문 추가'}</button>${e ? '<button type="button" class="btn" data-q="cancel">취소</button>' : ''}</div></form>
      <div class="qf">${[['all', '전체'], ...Object.entries(LABT)].map(([k, v]) => `<button type="button" class="chip${f === k ? ' on' : ''}" data-qf="${k}">${v} ${cnt(k)}</button>`).join('')}</div>
      ${L.length ? `<ul class="qs">${L.map((x, i) => `<li data-id="${esc(x.id)}"${x.id === S.qedit ? ' class="ed"' : ''}><span class="no">${L.length - i}</span><div><p class="q">${esc(x.q)}</p>${x.note ? `<p class="a">${esc(x.note)}</p>` : ''}<small><i class="tag t-${esc(x.topic)}">${esc(LABT[x.topic] || '기타')}</i>${fmtD(x.ts)}${x.dev ? ' · ' + esc(x.dev) : ''}</small></div><span class="acts"><button type="button" class="btn sm" data-q="ed">고치기</button><button type="button" class="btn sm danger" data-q="del">삭제</button></span></li>`).join('')}</ul>` : '<p class="empty">아직 질문이 없어요 — 위에서 추가해 주세요.</p>'}`);
    const fm = view.querySelector('.qadd');
    fm.onsubmit = async ev => {
      ev.preventDefault(); const tp = (fm.querySelector('[name=tp]:checked') || {}).value || 'etc', qv = fm.q.value.trim(); if (!qv) return;
      const id = S.qedit, note = fm.note.value.trim();
      const r = await run(async () => { const cur = await BOX.raw.getJSON('lab-q.bin', []);
        if (id) { const x = cur.find(z => z.id === id); if (x) Object.assign(x, { topic: tp, q: qv, note }); } else cur.push({ id: rid(), topic: tp, q: qv, note, ts: Date.now(), dev: dev() });
        await BOX.raw.put('연구실 질문 모음 갱신', [{ name: 'lab-q.bin', json: cur }]); return cur; }, '저장 중…');
      if (r) { S.q = r; S.qedit = null; toast(id ? '질문을 고쳤어요' : '질문을 추가했어요'); qnaTab(); }
    };
    view.onclick = async ev => {
      const fb = ev.target.closest('[data-qf]'); if (fb) { S.qf = fb.dataset.qf; qnaTab(); return; }
      const b = ev.target.closest('[data-q]'); if (!b || S.busy) return;
      if (b.dataset.q === 'cancel') { S.qedit = null; qnaTab(); return; }
      const li = b.closest('li[data-id]'); if (!li) return; const id = li.dataset.id;
      if (b.dataset.q === 'ed') { S.qedit = id; qnaTab(); const t = view.querySelector('textarea[name=q]'); if (t) { t.focus(); t.scrollIntoView({ block: 'center' }); } return; }
      if (b.dataset.q === 'del') { if (!confirm('이 질문을 지울까요?')) return;
        const r = await run(async () => { const cur = (await BOX.raw.getJSON('lab-q.bin', [])).filter(z => z.id !== id); await BOX.raw.put('연구실 질문 모음 갱신', [{ name: 'lab-q.bin', json: cur }]); return cur; }, '지우는 중…');
        if (r) { S.q = r; if (S.qedit === id) S.qedit = null; toast('질문을 지웠어요'); qnaTab(); } }
    };
  }

  /* ---------- 자료실(문서함 lab-lib.bin 목록 + lab-f-<id>.bin 파일) ---------- */
  const LIBF = 'lab-lib.bin', fblob = id => 'lab-f-' + id + '.bin';
  const getLib = async () => { const j = await BOX.raw.getJSON(LIBF, null); return j && Array.isArray(j.dirs) ? j : { dirs: [], files: [] }; };
  const putLib = (msg, lib, extra) => BOX.raw.put(msg, [...(extra || []), { name: LIBF, json: lib }]);
  const pathOf = (lib, f) => { const out = []; let x = lib.dirs.find(d => d.id === f), n = 0; while (x && n++ < 50) { out.unshift(x); x = lib.dirs.find(d => d.id === x.parent); } return out; };
  const subOf = (lib, id) => { const out = [id]; for (let i = 0; i < out.length; i++) lib.dirs.forEach(d => { if (d.parent === out[i]) out.push(d.id); }); return out; };
  const uniq = (names, n) => { if (!names.has(n)) return n; const m = n.match(/^(.*?)(\.[^.]*)?$/); for (let i = 2; i < 999; i++) { const c = `${m[1]} (${i})${m[2] || ''}`; if (!names.has(c)) return c; } return n + ' ' + rid(); };
  const clean = v => String(v || '').replace(/[\x00-\x1f\x7f<>:"/\\|?*]/g, '').trim().replace(/^\.+|\.+$/g, '').slice(0, 120);
  /* 목록을 최신으로 다시 읽고 고친 뒤 저장 — 다른 기기에서 그 사이 바꾼 것을 덮지 않게 */
  async function libEdit(msg, fn, busy) {
    const r = await run(async () => { const lib = await getLib(); const extra = await fn(lib); if (extra === false) return lib; await putLib(msg, lib, extra || []); return lib; }, busy || '저장 중…');
    if (r) { S.lib = r; if (S.folder && !r.dirs.some(d => d.id === S.folder)) S.folder = 0; S.sel = new Set([...S.sel].filter(k => { const [t, id] = k.split(':'); return (t === 'dir' ? r.dirs : r.files).some(x => x.id === id); })); }
    return r;
  }
  async function libTab(reload) {
    if (reload || !S.lib) { shell('<p class="muted pad">자료실을 불러오는 중…</p>'); const l = await run(getLib, '자료실을 불러오는 중…'); if (l === undefined) return; S.lib = l; if (S.folder && !l.dirs.some(d => d.id === S.folder)) S.folder = 0; }
    drawLib();
  }
  function drawLib() {
    const lib = S.lib, f = S.folder, path = pathOf(lib, f), sel = S.sel;
    const cmpN = (a, b) => a.name.localeCompare(b.name, 'ko', { numeric: true }), CMP = { name: cmpN, date: (a, b) => (b.ts || 0) - (a.ts || 0), size: (a, b) => (b.size || 0) - (a.size || 0) }, cmp = CMP[S.sort] || cmpN;
    const cnt = id => lib.dirs.filter(d => d.parent === id).length + lib.files.filter(x => x.folder === id).length;
    const dirs = lib.dirs.filter(d => d.parent === f).sort(S.sort === 'size' ? cmpN : cmp), files = lib.files.filter(x => x.folder === f).sort(cmp);
    const icon = n => { const e = ext(n); return `<span class="fi fi-${/^(pdf)$/.test(e) ? 'pdf' : /^(hwp|hwpx|doc|docx|txt)$/.test(e) ? 'doc' : /^(xls|xlsx|csv)$/.test(e) ? 'xls' : /^(ppt|pptx)$/.test(e) ? 'ppt' : /^(jpe?g|png|gif|webp|heic)$/.test(e) ? 'img' : /^(mp4|mov|avi)$/.test(e) ? 'vid' : /^(zip|7z|rar)$/.test(e) ? 'zip' : 'etc'}">${esc((e || '?').toUpperCase().slice(0, 4))}</span>`; };
    const row = (x, k) => { const key = k + ':' + x.id, on = sel.has(key);
      return `<li class="lr${on ? ' on' : ''}" data-k="${k}" data-id="${esc(x.id)}"><label class="chk"><input type="checkbox" data-sel="${key}"${on ? ' checked' : ''} aria-label="${esc(x.name)} 고르기"></label>
        ${k === 'dir' ? `<button type="button" class="main" data-open="${esc(x.id)}"><span class="fd"></span><span class="nm"><b>${esc(x.name)}</b><small>${cnt(x.id) ? cnt(x.id) + '개' : '비어 있음'} · ${fmtD(x.ts)}</small></span></button>`
          : `<button type="button" class="main" data-tog>${icon(x.name)}<span class="nm"><b>${esc(x.name)}</b><small>${sz(x.size)} · ${fmtD(x.ts)}${x.dev ? ' · ' + esc(x.dev) : ''}${x.note ? `<em> · ${esc(x.note)}</em>` : ''}</small></span></button>`}
        <span class="acts">${k === 'file' && VIEW_OK[ext(x.name)] ? '<button type="button" class="btn sm" data-l="view">보기</button>' : ''}${k === 'file' ? '<button type="button" class="btn sm" data-l="dl">받기</button>' : ''}<button type="button" class="btn sm more" data-l="more" aria-label="${esc(x.name)} 메뉴">⋯</button></span></li>`; };
    const ups = S.ups.length ? `<ul class="ups">${S.ups.map((u, i) => `<li class="st-${u.st}"><span class="nm"><b>${esc(u.name)}</b><small>${u.st === 'ok' ? '올림 완료' : u.st === 'bad' ? '실패 — ' + esc(u.why || '') : u.st === 'up' ? '암호화해서 올리는 중…' : '기다리는 중'}</small></span>${u.st === 'bad' ? `<button type="button" class="btn sm" data-upx="${i}">닫기</button>` : ''}</li>`).join('')}</ul>` : '';
    const tot = lib.files.reduce((a, x) => a + (x.size || 0), 0);
    const fd = S.found;
    shell(`<div class="tools"><button type="button" class="btn primary" data-l="mk">＋ 새 폴더</button><label class="btn">파일 올리기<input type="file" multiple hidden data-upf></label>
        <form class="lq" role="search"><input type="search" placeholder="자료실 전체에서 이름·메모 찾기" value="${esc(S.fq)}" aria-label="자료실 검색"></form>
        <select class="lsort" aria-label="정렬">${[['name', '이름순'], ['date', '최근순'], ['size', '크기순']].map(([v, t]) => `<option value="${v}"${S.sort === v ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
      ${fd ? `<div class="crumb"><button type="button" class="cr" data-l="unq">‹ 폴더로</button><b>‘${esc(S.fq)}’ 찾은 결과 ${fd.length}개</b></div>
        <ul class="list">${fd.map(x => `<li class="lr"><button type="button" class="main" data-open="${esc(x.k === 'dir' ? x.id : x.folder)}">${x.k === 'dir' ? '<span class="fd"></span>' : icon(x.name)}<span class="nm"><b>${esc(x.name)}</b><small>위치: ${esc(pathOf(lib, x.k === 'dir' ? x.parent : x.folder).map(d => d.name).join(' › ') || '자료실')}${x.note ? ' · ' + esc(x.note) : ''}</small></span></button></li>`).join('') || '<li class="empty">찾은 것이 없어요</li>'}</ul>`
      : `<nav class="crumb" aria-label="폴더 위치">${[{ id: 0, name: '자료실' }, ...path].map((p, i, a) => i < a.length - 1 ? `<button type="button" class="cr" data-go="${esc(p.id)}">${esc(p.name)}</button><span aria-hidden="true">›</span>` : `<b>${esc(p.name)}</b>`).join('')}</nav>
        ${sel.size ? `<div class="selbar"><b>${sel.size}개 골랐어요</b><button type="button" class="btn sm" data-l="mv">옮기기</button><button type="button" class="btn sm danger" data-l="delsel">삭제</button><button type="button" class="btn sm" data-l="unsel">고르기 해제</button></div>` : ''}
        ${ups}
        <div class="drop"><ul class="list">${f ? `<li class="lr"><button type="button" class="main" data-go="${esc(path.length > 1 ? path[path.length - 2].id : 0)}"><span class="fd up"></span><span class="nm"><b>위 폴더로</b></span></button></li>` : ''}${dirs.map(x => row(x, 'dir')).join('')}${files.map(x => row(x, 'file')).join('')}</ul>
        ${!dirs.length && !files.length ? '<p class="empty">비어 있어요 — ‘＋ 새 폴더’나 ‘파일 올리기’, 또는 파일을 여기로 끌어다 놓으세요</p>' : ''}</div>
        <p class="foot">자료실 전체 파일 ${lib.files.length}개 · ${sz(tot)} · 파일 1개 ${LIB_MAX / 1048576}MB까지 · 문서함 암호로 암호화돼 어느 기기에서나 같아요</p>`}`);
    bindLib();
  }
  const libIt = key => { const [t, id] = key.split(':'); return (t === 'dir' ? S.lib.dirs : S.lib.files).find(x => x.id === id); };
  async function fileBytes(x) { return run(() => BOX.raw.get(fblob(x.id)), '받는 중…(복호화)'); }
  function pickFolder(title, cb) {
    const lib = S.lib, kids = p => lib.dirs.filter(d => d.parent === p).sort((a, b) => a.name.localeCompare(b.name, 'ko', { numeric: true }));
    const tree = (p, dep) => kids(p).map(x => `<li><button type="button" data-to="${esc(x.id)}" style="padding-left:${12 + dep * 18}px"><span class="fd"></span>${esc(x.name)}</button>${tree(x.id, dep + 1)}</li>`).join('');
    const ov = document.createElement('div'); ov.className = 'pick'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="pk"><b>${esc(title)}</b><ul class="tree"><li><button type="button" data-to="0"><span class="fd"></span>자료실(맨 위)</button></li>${tree(0, 1)}</ul><button type="button" class="btn" data-x>취소</button></div>`;
    document.body.appendChild(ov);
    ov.onclick = e => { if (e.target === ov || e.target.closest('[data-x]')) { ov.remove(); return; } const b = e.target.closest('[data-to]'); if (b) { ov.remove(); cb(b.dataset.to === '0' ? 0 : b.dataset.to); } };
  }
  async function libMove(items, to) {
    await libEdit('연구실 자료실 옮기기', lib => {
      for (const it of items) {
        if (it.kind === 'dir') { if (to && subOf(lib, it.id).includes(to)) { toast('폴더를 자기 안(또는 그 아래)으로 옮길 수 없어요', 3000); return false; } const d = lib.dirs.find(x => x.id === it.id); if (d) d.parent = to; }
        else { const x = lib.files.find(z => z.id === it.id); if (x) x.folder = to; }
      }
    }, '옮기는 중…');
    drawLib();
  }
  async function libDel(items) {
    await libEdit('연구실 자료실 지우기', lib => {
      const dirs = new Set(), files = new Set();
      items.forEach(it => { if (it.kind === 'dir') subOf(lib, it.id).forEach(d => dirs.add(d)); else files.add(it.id); });
      lib.files.forEach(x => { if (dirs.has(x.folder)) files.add(x.id); });
      lib.dirs = lib.dirs.filter(d => !dirs.has(d.id)); lib.files = lib.files.filter(x => !files.has(x.id));
      S.sel.clear(); return [...files].map(id => ({ name: fblob(id), delete: true }));
    }, '지우는 중…');
    toast('지웠어요'); drawLib();
  }
  async function upload(fs) {
    const items = fs.map(f => ({ f, name: f.name, size: f.size, st: 'wait' }));
    S.ups = items.concat(S.ups.filter(u => u.st === 'up' || u.st === 'wait')); drawLib();
    for (const u of items) {
      if (u.size > LIB_MAX) { u.st = 'bad'; u.why = `${LIB_MAX / 1048576}MB가 넘어요(${sz(u.size)})`; drawLib(); continue; }
      u.st = 'up'; drawLib(); const folder = S.folder;
      try {
        const u8 = new Uint8Array(await u.f.arrayBuffer()), id = rid();
        const lib = await getLib(); if (folder && !lib.dirs.some(d => d.id === folder)) throw new Error('올릴 폴더가 사라졌어요');
        const nm = uniq(new Set(lib.files.filter(x => x.folder === folder).map(x => x.name)), clean(u.name) || '파일');
        lib.files.push({ id, folder, name: nm, size: u.size, note: '', ts: Date.now(), dev: dev() });
        await putLib('연구실 자료실 올리기', lib, [{ name: fblob(id), u8 }]);
        S.lib = lib; u.st = 'ok';
      } catch (e) { u.st = 'bad'; u.why = e.status === 401 ? 'GitHub 토큰을 다시 넣어 주세요' : (e.message || '올리지 못했어요'); }
      drawLib();
    }
    const ok = items.filter(u => u.st === 'ok').length; toast(ok === items.length ? `${ok}개 올렸어요` : `${ok}개 올림 · ${items.length - ok}개 실패`, 3000);
    setTimeout(() => { S.ups = S.ups.filter(u => u.st !== 'ok'); if (S.tab === 'lib' && !S.busy) drawLib(); }, 4000);
  }
  function menu(key, btn) {
    document.querySelectorAll('.menu').forEach(m => m.remove()); const [k] = key.split(':'), x = libIt(key); if (!x) return;
    const m = document.createElement('div'); m.className = 'menu'; m.setAttribute('role', 'menu');
    m.innerHTML = `<button type="button" data-m="ren" role="menuitem">이름 바꾸기</button><button type="button" data-m="mv" role="menuitem">다른 폴더로 옮기기</button>${k === 'file' ? '<button type="button" data-m="note" role="menuitem">메모</button>' : ''}<button type="button" data-m="del" role="menuitem" class="danger">${k === 'dir' ? '폴더 삭제(안의 자료 포함)' : '삭제'}</button>`;
    btn.closest('.lr').appendChild(m);
    m.onclick = async e => { const a = (e.target.closest('[data-m]') || {}).dataset; if (!a || !a.m) return; m.remove();
      if (a.m === 'ren') { const v = clean(prompt('새 이름', x.name)); if (!v || v === x.name) return;
        await libEdit('연구실 자료실 이름 바꾸기', lib => { const L = k === 'dir' ? lib.dirs : lib.files, it = L.find(z => z.id === x.id); if (!it) return false;
          const par = k === 'dir' ? it.parent : it.folder; let nv = v; if (k === 'file' && !ext(nv) && ext(it.name)) nv += '.' + ext(it.name);
          if (L.some(z => z.id !== it.id && (k === 'dir' ? z.parent : z.folder) === par && z.name === nv)) { toast(k === 'dir' ? '같은 이름의 폴더가 있어요' : '같은 이름의 파일이 있어요'); return false; }
          it.name = nv; }); drawLib(); }
      else if (a.m === 'note') { const v = prompt('메모(검색에도 쓰여요)', x.note || ''); if (v === null) return; await libEdit('연구실 자료실 메모', lib => { const it = lib.files.find(z => z.id === x.id); if (!it) return false; it.note = v.trim().slice(0, 500); }); drawLib(); }
      else if (a.m === 'mv') pickFolder(`‘${x.name}’ 옮길 곳`, to => libMove([{ kind: k, id: x.id }], to));
      else if (a.m === 'del') { if (confirm(k === 'dir' ? `‘${x.name}’ 폴더와 그 안의 모든 자료를 지울까요? 되돌릴 수 없어요` : `‘${x.name}’을(를) 지울까요? 되돌릴 수 없어요`)) libDel([{ kind: k, id: x.id }]); } };
    setTimeout(() => document.addEventListener('click', function h(ev) { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('click', h); } }), 0);
  }
  function bindLib() {
    view.onclick = async e => {
      const t = e.target; if (S.busy) return;
      const ux = t.closest('[data-upx]'); if (ux) { S.ups.splice(+ux.dataset.upx, 1); drawLib(); return; }
      const g = t.closest('[data-go]'); if (g) { S.folder = g.dataset.go === '0' ? 0 : g.dataset.go; S.sel.clear(); drawLib(); return; }
      const op = t.closest('[data-open]'); if (op) { S.found = null; S.fq = ''; S.folder = op.dataset.open === '0' ? 0 : op.dataset.open; S.sel.clear(); drawLib(); return; }
      if (t.closest('[data-tog]')) { const cb = t.closest('.lr').querySelector('[data-sel]'); if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); } return; }
      const b = t.closest('[data-l]'); if (!b) return; const a = b.dataset.l, li = b.closest('.lr'), key = li && li.dataset.k ? li.dataset.k + ':' + li.dataset.id : '';
      if (a === 'mk') { const v = clean(prompt('새 폴더 이름')); if (!v) return; const f = S.folder;
        await libEdit('연구실 자료실 새 폴더', lib => { if (lib.dirs.some(d => d.parent === f && d.name === v)) { toast('같은 이름의 폴더가 있어요'); return false; } if (lib.dirs.length >= 2000) { toast('폴더는 2000개까지예요'); return false; } lib.dirs.push({ id: rid(), parent: f, name: v, ts: Date.now() }); }); drawLib(); return; }
      if (a === 'unq') { S.found = null; S.fq = ''; drawLib(); return; }
      if (a === 'unsel') { S.sel.clear(); drawLib(); return; }
      if (a === 'mv') { const its = [...S.sel].map(k => { const [kind, id] = k.split(':'); return { kind, id }; }); pickFolder(`${its.length}개 옮길 곳`, to => libMove(its, to)); return; }
      if (a === 'delsel') { const its = [...S.sel].map(k => { const [kind, id] = k.split(':'); return { kind, id }; }), nd = its.filter(x => x.kind === 'dir').length; if (confirm(`${its.length}개를 지울까요?${nd ? ` 폴더 ${nd}개는 안의 자료도 함께 지워져요.` : ''} 되돌릴 수 없어요`)) libDel(its); return; }
      if (a === 'more') { e.stopPropagation(); menu(key, b); return; }
      const x = key && libIt(key); if (!x) return;
      if (a === 'dl') { const u = await fileBytes(x); if (u) dl(new Blob([u]), x.name); return; }
      if (a === 'view') { const w = window.open('', '_blank'); const u = await fileBytes(x); if (!u) { if (w) w.close(); return; } const url = URL.createObjectURL(new Blob([u], { type: VIEW_OK[ext(x.name)] })); if (w) w.location.href = url; else window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 120000); return; }
    };
    view.onchange = e => {
      const c = e.target.closest('[data-sel]'); if (c) { if (c.checked) S.sel.add(c.dataset.sel); else S.sel.delete(c.dataset.sel); drawLib(); return; }
      if (e.target.closest('.lsort')) { S.sort = e.target.value; drawLib(); return; }
      const u = e.target.closest('[data-upf]'); if (u) { const fs = [...u.files]; u.value = ''; if (fs.length) upload(fs); }
    };
    const qf = view.querySelector('.lq'); if (qf) qf.onsubmit = e => { e.preventDefault(); const v = qf.querySelector('input').value.trim(); S.fq = v; if (!v) { S.found = null; drawLib(); return; }
      const k = v.toLowerCase(), lib = S.lib; S.found = [...lib.dirs.filter(d => d.name.toLowerCase().includes(k)).map(d => Object.assign({ k: 'dir' }, d)), ...lib.files.filter(x => (x.name + ' ' + (x.note || '')).toLowerCase().includes(k)).map(x => Object.assign({ k: 'file' }, x))]; drawLib(); };
    const dz = view.querySelector('.drop'); if (dz) { const has = e => e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files');
      dz.ondragover = e => { if (has(e)) { e.preventDefault(); dz.classList.add('on'); } }; dz.ondragleave = () => dz.classList.remove('on');
      dz.ondrop = e => { if (!has(e)) return; e.preventDefault(); dz.classList.remove('on'); const fs = [...(e.dataTransfer.files || [])]; if (fs.length) upload(fs); }; }
  }

  /* ---------- 시작 ---------- */
  const h = (location.hash || '').replace('#', '');
  if (/^msg=/.test(h)) toast(decodeURIComponent(h.slice(4)), 3500);
  else if (TABS.some(([k]) => k === h)) S.tab = h;
  window.addEventListener('hashchange', () => { const k = (location.hash || '').replace('#', ''); if (k !== S.tab && TABS.some(([t]) => t === k) && BOX.unlocked && !S.busy) go(k, true); });
  window.__lab = { S, go };
  gate();
})();
