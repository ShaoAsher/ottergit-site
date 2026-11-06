/* ═══ 全屏文件对比：按类型渲染（文本 / Markdown / 图片 / 视频 / 文档 / 音频 / 二进制） ═══ */
const KIND_EXT={text:'dart js ts json yaml yml txt swift kt gradle xml html css sh toml lock',md:'md markdown',image:'png jpg jpeg webp gif svg ico',video:'mp4 mov webm m4v',doc:'pdf docx pages key',audio:'wav mp3 m4a aac flac ogg'};
const KIND_LABEL={text:'文本',md:'Markdown',image:'图片',video:'视频',doc:'文档',audio:'音频',bin:'二进制'};
function fileKind(f){const e=(f[2].split('.').pop()||'').toLowerCase();for(const k in KIND_EXT)if(KIND_EXT[k].split(' ').includes(e))return k;return 'bin'}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const PROMO='../assets/ottergit-promo.mp4';
const MEDIA={imgOld:'assets/brand/otter_git_icon.png',vidOld:PROMO+'#t=8',vidNew:PROMO+'#t=31'};
const MODES={text:[['split','并排'],['unified','统一']],md:[['rich','渲染对比'],['split','源码并排']],image:[['side','并排'],['swipe','滑动'],['onion','叠加'],['diff','差异']],
  video:[['side','并排'],['swipe','滑动对比']],doc:[['pages','页面对比'],['revs','修订列表']],audio:[['wave','波形']],bin:[['meta','概览'],['hex','十六进制']]};

document.head.insertAdjacentHTML('beforeend',`<style>
#fv{position:absolute;inset:0;z-index:36;display:none;flex-direction:column;background:color-mix(in srgb,var(--canvas) 94%,transparent);backdrop-filter:blur(18px)}
#fv.on{display:flex;animation:fvIn .42s var(--ease)} #fv.out{animation:fvOut .26s var(--exit) forwards}
@keyframes fvIn{from{opacity:0;transform:scale(.97)}} @keyframes fvOut{to{opacity:0;transform:scale(.98)}}
.fv-top{height:54px;display:flex;align-items:center;gap:10px;padding:0 14px;border-bottom:.5px solid var(--line);background:var(--chrome)}
.fv-top .path{font:13px var(--mono);color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:420px}
.fv-top .path em{font-style:normal;color:var(--hi);font-weight:700}
.fv-top .kind{font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;background:rgba(var(--ink),.07);color:var(--mid)}
.fv-top .sp{flex:1}
.fv-top .ib,.fv-tool .ib{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--ink),.06);border:.5px solid rgba(var(--ink),.08)}
.fv-top .ib svg,.fv-tool .ib svg{width:16px;height:16px;stroke:var(--hi);fill:none;stroke-width:1.8;stroke-linecap:round}
.fv-top .cnt{font:12px var(--mono);color:var(--lo);min-width:44px;text-align:center}
.fv-modes{display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(var(--ink),.05);border:.5px solid rgba(var(--ink),.08)}
.fv-modes button{height:26px;padding:0 12px;border-radius:999px;font-size:12px;color:var(--mid);transition:background .26s,color .26s}
.fv-modes button.on{background:var(--accent);color:var(--onAccent);font-weight:700}
.fv-main{flex:1;display:flex;min-height:0}
.fv-side{width:250px;flex:none;border-right:.5px solid var(--line);overflow:auto;padding:8px}
.fv-side .t{font-size:11px;color:var(--lo);padding:4px 8px 8px;line-height:1.5}
.fv-stage{flex:1;min-width:0;overflow:auto;position:relative}
.fv-foot{height:30px;display:flex;align-items:center;gap:16px;padding:0 14px;border-top:.5px solid var(--line);font-size:11.5px;color:var(--lo);background:var(--chrome)}
.fv-foot b{color:var(--mid);font-weight:600} .fv-foot .sp{flex:1} .fv-foot kbd{font:10.5px var(--mono);padding:1px 5px;border-radius:4px;background:rgba(var(--ink),.08);color:var(--mid)}
/* 文本 */
.sx{font:12.5px/1.8 var(--mono)}
.sx .hh{padding:2px 14px;color:var(--memory);background:color-mix(in srgb,var(--memory) 8%,transparent);position:sticky;top:0;z-index:1}
.sx .sr{display:grid;grid-template-columns:1fr 1fr}
.sx .c{display:flex;min-width:0;white-space:pre;color:var(--mid);border-right:.5px solid var(--line)}
.sx .c i{width:46px;flex:none;text-align:right;padding-right:12px;color:var(--lo);font-style:normal;user-select:none}
.sx .c code{font:inherit;overflow:hidden;text-overflow:ellipsis}
.sx .c.a{background:color-mix(in srgb,var(--add) 12%,transparent);color:var(--hi)} .sx .c.d{background:color-mix(in srgb,var(--del) 12%,transparent);color:var(--hi)}
.sx .c.e{background:repeating-linear-gradient(-45deg,transparent 0 6px,rgba(var(--ink),.03) 6px 12px)}
.sx .c.a mark{background:color-mix(in srgb,var(--add) 38%,transparent);color:inherit;border-radius:3px} .sx .c.d mark{background:color-mix(in srgb,var(--del) 38%,transparent);color:inherit;border-radius:3px}
.sx .u{display:flex;white-space:pre;color:var(--mid)} .sx .u i{width:42px;flex:none;text-align:right;padding-right:10px;color:var(--lo);font-style:normal}
.sx .u.a{background:color-mix(in srgb,var(--add) 12%,transparent);color:var(--hi)} .sx .u.d{background:color-mix(in srgb,var(--del) 12%,transparent);color:var(--hi)}
.sx .u b{width:16px;flex:none;font-weight:400;color:var(--lo)}
/* 双栏外壳 */
.duo{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:20px;min-height:100%}
.pane2{display:flex;flex-direction:column;gap:10px;min-width:0}
.pane2 .lb{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mid)}
.pane2 .lb .tg{font-size:10.5px;font-weight:800;padding:1px 8px;border-radius:999px}
.tg.old{background:color-mix(in srgb,var(--del) 18%,transparent);color:var(--del)} .tg.new{background:color-mix(in srgb,var(--add) 18%,transparent);color:var(--add)}
.checker{background:repeating-conic-gradient(rgba(var(--ink),.07) 0 25%,transparent 0 50%) 0 0/16px 16px;border-radius:14px;border:.5px solid var(--line);display:grid;place-items:center;position:relative;overflow:hidden}
.checker img,.checker .ficon{max-width:100%;max-height:100%}
.none{display:grid;place-items:center;color:var(--lo);font-size:13px;border:1px dashed var(--line);border-radius:14px;min-height:200px}
/* 图片单舞台 */
.solo{padding:20px;display:flex;flex-direction:column;align-items:center;gap:14px}
.stack{position:relative;width:420px;height:420px}
.stack>*{position:absolute;inset:0}
.stack .top{transition:opacity .2s}
.swipe-h{position:absolute;top:0;bottom:0;width:2px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.25);cursor:ew-resize;z-index:3}
.swipe-h::after{content:"⟷";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;background:#fff;color:#0B0A14;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.3)}
.rng{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--mid)} .rng input{width:260px;accent-color:var(--accent)}
.zoom{display:flex;gap:4px} .zoom button{height:24px;padding:0 9px;border-radius:999px;font-size:11.5px;color:var(--mid);background:rgba(var(--ink),.05)} .zoom button.on{color:var(--hi);background:rgba(var(--ink),.12)}
/* 视频 */
.vbox{background:#000;border-radius:14px;overflow:hidden;aspect-ratio:1;position:relative} .vbox video{width:100%;height:100%;object-fit:contain;display:block}
.vctl{display:flex;align-items:center;gap:10px;padding:10px 20px;border-top:.5px solid var(--line);position:sticky;bottom:0;background:var(--chrome);backdrop-filter:blur(10px)}
.vctl input[type=range]{flex:1;accent-color:var(--accent)} .vctl .tm{font:12px var(--mono);color:var(--mid);min-width:86px}
.vctl .play{width:34px;height:34px;border-radius:50%;background:var(--accent);color:var(--onAccent);display:grid;place-items:center;font-size:13px}
.vctl button.sm{height:26px;padding:0 9px;border-radius:999px;font-size:11.5px;color:var(--mid);background:rgba(var(--ink),.06)} .vctl button.sm.on{color:var(--hi);background:rgba(var(--ink),.14)}
/* 文档 */
.paper{background:#fff;color:#222;border-radius:6px;padding:28px 30px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-size:12px;line-height:1.75;aspect-ratio:1/1.32;overflow:hidden;position:relative}
.paper h4{font-size:15px;margin-bottom:8px;color:#111} .paper p{margin-bottom:8px}
.paper .pn{position:absolute;bottom:10px;right:14px;font-size:10px;color:#999}
.paper .ins{background:#d6f5d6;box-shadow:-3px 0 0 #3B9D2A} .paper .del{background:#fde0e0;text-decoration:line-through;color:#a33;box-shadow:-3px 0 0 #D0343A}
.paper .chg{position:absolute;right:-8px;width:4px;border-radius:2px;background:var(--accent)}
.pager{display:flex;align-items:center;justify-content:center;gap:10px;font-size:12px;color:var(--mid);padding-bottom:16px}
.revs{padding:20px;display:flex;flex-direction:column;gap:10px;max-width:760px;margin:0 auto}
.rev{padding:12px 14px;border-radius:12px;border:.5px solid var(--line);background:rgba(var(--ink),.03);font-size:13px}
.rev .k{font-size:11px;color:var(--lo);margin-bottom:6px} .rev del{color:var(--del)} .rev ins{color:var(--add);text-decoration:none}
/* Markdown 富文本 */
.md{max-width:760px;margin:0 auto;padding:28px 32px;font-size:14px;line-height:1.8}
.md h1{font-size:24px;margin-bottom:12px} .md h2{font-size:18px;margin:18px 0 8px} .md li{margin-left:20px}
.md .ins{background:color-mix(in srgb,var(--add) 16%,transparent);border-radius:4px;box-shadow:-3px 0 0 var(--add)}
.md .del{background:color-mix(in srgb,var(--del) 14%,transparent);text-decoration:line-through;color:var(--mid);border-radius:4px;box-shadow:-3px 0 0 var(--del)}
.md code{font:12.5px var(--mono);padding:1px 5px;border-radius:4px;background:rgba(var(--ink),.08)}
/* 音频 */
.wv{padding:24px;display:flex;flex-direction:column;gap:18px}
.wv .row{display:flex;align-items:center;gap:14px} .wv .row .lb{width:60px;font-size:12px;color:var(--mid)}
.wv canvas{flex:1;height:110px;border-radius:12px;background:rgba(var(--ink),.04);border:.5px solid var(--line)}
/* 二进制 */
.meta{padding:24px;max-width:820px;margin:0 auto}
.meta table{width:100%;border-collapse:collapse;font-size:13px} .meta td{padding:10px 12px;border-bottom:.5px solid var(--line)} .meta td:first-child{color:var(--lo);width:140px}
.meta .mono{font-family:var(--mono);font-size:12px} .meta .up{color:var(--add)} .meta .dn{color:var(--del)}
.hex{font:12px/1.9 var(--mono);padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.hex div{white-space:pre;color:var(--mid)} .hex .o{color:var(--lo)} .hex mark{background:color-mix(in srgb,var(--accent) 30%,transparent);color:var(--hi);border-radius:2px}
/* 详情面板里的小预览 */
.mini{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:zoom-in;padding:14px;position:relative}
.mini .pair{display:flex;align-items:center;gap:10px} .mini .pair>*{width:96px;height:96px;border-radius:12px}
.mini .cap{font-size:12px;color:var(--lo)} .mini:hover .cap{color:var(--accent)}
.mini video{width:200px;height:130px;object-fit:cover;border-radius:12px;background:#000}
</style>`);

/* ── 示例内容 ── */
const MD_DOC=[['h1','水獭 Git 设计文档'],['h2','首页',''],['li','首页改为浮卡布局，背景环境层透出','a'],['li','「接着来」卡片','d'],['li','「继续工作」卡片：显示分支、未提交数与最近提交','a'],['h2','提交反馈',''],['p','提交成功后弹出 toast，提供 <code>推送</code> 与 <code>撤销提交</code> 两个动作。',''],['p','撤销提交执行 <code>git reset --soft HEAD~1</code>，更改保留在暂存区。','a'],['h2','配色',''],['p','主题色：獭橙 #FA5A1E → #FFB04A','d'],['p','主题色：琥珀金 #E89B0C → #FFD66B；獭橙交给水獭工具','a']];
const PDF=[{old:[['h4','第 1 章 · 快速开始'],['p','安装后打开水獭 Git，首页会列出电脑上已经添加的仓库。'],['p','点击仓库卡片进入工作副本。','del'],['p','点击「继续工作」卡片或任意仓库卡片进入工作副本。','ins'],['p','顶部的视图胶囊用于在工作副本、历史、搜索和终端之间切换。']]},
  {old:[['h4','第 2 章 · 提交与推送'],['p','勾选要提交的文件，写一句提交信息，按 ⌘↩ 提交。'],['p','提交后需要手动点击工具栏的推送按钮。','del'],['p','提交成功后可以直接在提示里点「推送」，或在 5 秒内「撤销提交」。','ins'],['p','推送失败时，小獭会给出原因和下一步建议。']]},
  {old:[['h4','第 3 章 · 解决冲突'],['p','合并或拉取产生冲突时，窗口背景会变为珊瑚色，冲突文件排在列表最前。'],['p','可以逐个打开解决，也可以使用 AI 辅助解决。','ins'],['p','全部解决后，状态会自动恢复。']]}];
function hexRows(seed,diff){let x=seed,out=[];for(let r=0;r<18;r++){const b=[];for(let i=0;i<16;i++){x=(x*1103515245+12345)&0x7fffffff;let v=x>>16&255;const ch=diff&&((r*16+i)%37===5||(r===6&&i>3&&i<9));if(ch)v=(v+91)&255;b.push([v.toString(16).padStart(2,'0'),ch])}out.push([(r*16).toString(16).padStart(8,'0'),b])}return out}

/* ── 小预览（历史详情面板内） ── */
function miniPreview(f){
  const k=fileKind(f),s=f[0];let body='';
  if(k==='image')body=s==='A'||s==='D'?`<div class="pair"><div class="checker">${s==='A'?famIcon('git',84):`<img src="${MEDIA.imgOld}" style="width:84px;opacity:.6">`}</div></div><div style="font-size:11.5px;font-weight:700;color:var(${s==='A'?'--add':'--del'})">${s==='A'?'新增图片':'已删除'}</div>`:`<div class="pair"><div class="checker"><img src="${MEDIA.imgOld}" style="width:84px"></div><span style="color:var(--lo)">→</span><div class="checker">${famIcon('git',84)}</div></div>`;
  else if(k==='video')body=`<video src="${MEDIA.vidNew}" muted autoplay loop playsinline></video>`;
  else if(k==='doc')body=`<div style="font-size:40px">📄</div><div style="font-size:12px;color:var(--mid)">3 页 · 5 处修订</div>`;
  else if(k==='audio')body=`<svg width="200" height="50" viewBox="0 0 200 50">${Array.from({length:50},(_,i)=>{const h=4+Math.abs(Math.sin(i*.7)*Math.cos(i*.13))*40*(1-i/60);return `<rect x="${i*4}" y="${25-h/2}" width="2.4" height="${h}" rx="1.2" fill="var(--accent)"/>`}).join('')}</svg>`;
  else body=`<div style="font:12px var(--mono);color:var(--mid)">1.82 MB → 1.86 MB · 变化 1.2%</div>`;
  return `<div class="mini">${body}<div class="cap">${KIND_LABEL[k]} · 点击全屏对比</div></div>`;
}

/* ── 全屏 ── */
const V={list:[],idx:0,title:'',mode:{}};
const fv=document.createElement('div');fv.id='fv';document.getElementById('win').appendChild(fv);
function openViewer(list,idx,title){V.list=list;V.idx=idx;V.title=title;fv.className='on';renderViewer()}
function closeViewer(){fv.className='on out';setTimeout(()=>{fv.className='';fv.innerHTML=''},260)}
const ICO={x:'<path d="M6 6l12 12M18 6L6 18"/>',up:'<path d="M6 15l6-6 6 6"/>',dn:'<path d="M6 9l6 6 6-6"/>',back:'<path d="M15 6l-6 6 6 6"/>'};
const isvg=k=>`<svg viewBox="0 0 24 24">${ICO[k]}</svg>`;
function renderViewer(){
  const f=V.list[V.idx],k=fileKind(f),modes=MODES[k];let m=V.mode[k];if(!modes.some(x=>x[0]===m))m=V.mode[k]=modes[0][0];
  fv.innerHTML=`<div class="fv-top"><button class="ib" data-fv="close" title="返回（Esc）">${isvg('back')}</button>
    <span class="st ${f[0]}" style="width:20px;height:20px;border-radius:6px;font-size:11px;font-weight:800;display:grid;place-items:center">${f[0]}</span>
    <span class="path">${esc(f[1])}<em>${esc(f[2])}</em></span><span class="kind">${KIND_LABEL[k]}</span>
    ${f[3]||f[4]?`<span style="font:12px var(--mono)"><span style="color:var(--add)">+${f[3]}</span> <span style="color:var(--del)">−${f[4]}</span></span>`:''}
    <span class="sp"></span><div class="fv-modes">${modes.map(([id,lb],i)=>`<button data-mode="${id}" class="${id===m?'on':''}" title="${i+1}">${lb}</button>`).join('')}</div>
    <span class="sp"></span><button class="ib" data-fv="prev" title="上一个文件（↑ / K）">${isvg('up')}</button><span class="cnt">${V.idx+1} / ${V.list.length}</span><button class="ib" data-fv="next" title="下一个文件（↓ / J）">${isvg('dn')}</button>
    <button class="ib" data-fv="close" title="关闭（Esc）">${isvg('x')}</button></div>
  <div class="fv-main"><div class="fv-side"><div class="t">${esc(V.title)}</div>${V.list.map((x,i)=>`<div class="f ${i===V.idx?'sel':''}" data-fi="${i}"><span class="st ${x[0]}">${x[0]}</span><span class="nm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x[2])}</span><span class="ad">${x[3]||x[4]?`<em>+${x[3]}</em>`:KIND_LABEL[fileKind(x)]}</span></div>`).join('')}</div>
    <div class="fv-stage" id="fvStage"></div></div>
  <div class="fv-foot" id="fvFoot"></div>`;
  const st=document.getElementById('fvStage'),foot=document.getElementById('fvFoot');
  const keys='<span class="sp"></span><span><kbd>↑</kbd><kbd>↓</kbd> 切换文件</span><span><kbd>1</kbd>–<kbd>4</kbd> 切换模式</span><span><kbd>Esc</kbd> 退出</span>';
  const R={text:rText,md:rMd,image:rImage,video:rVideo,doc:rDoc,audio:rAudio,bin:rBin}[k];
  foot.innerHTML=(R(st,f,m)||'')+keys;
}
fv.addEventListener('click',e=>{
  const b=e.target.closest('[data-fv]');if(b){const a=b.dataset.fv;if(a==='close')return closeViewer();step(a==='next'?1:-1);return}
  const md=e.target.closest('[data-mode]');if(md){V.mode[fileKind(V.list[V.idx])]=md.dataset.mode;return renderViewer()}
  const fi=e.target.closest('[data-fi]');if(fi){V.idx=+fi.dataset.fi;renderViewer()}
});
function step(d){V.idx=(V.idx+d+V.list.length)%V.list.length;renderViewer()}
document.addEventListener('keydown',e=>{
  if(!fv.classList.contains('on')||fv.classList.contains('out'))return;
  if(e.key==='Escape'){e.stopImmediatePropagation();closeViewer()}
  else if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();step(1)}else if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();step(-1)}
  else if(/^[1-4]$/.test(e.key)){const k=fileKind(V.list[V.idx]),ms=MODES[k];if(ms[+e.key-1]){V.mode[k]=ms[+e.key-1][0];renderViewer()}}
},true);
document.getElementById('wcFull').onclick=()=>openViewer(files.map(f=>[f[0],f[1],f[2],f[0]==='D'?0:18,f[0]==='A'?0:6]),sel,'工作副本 · 未提交的更改');

/* ── 文本：并排（含行内词级高亮）/ 统一 ── */
function wordMark(a,b){let p=0;while(p<a.length&&p<b.length&&a[p]===b[p])p++;let s=0;while(s<a.length-p&&s<b.length-p&&a[a.length-1-s]===b[b.length-1-s])s++;
  const w=t=>esc(t.slice(0,p))+(t.length-s>p?`<mark>${esc(t.slice(p,t.length-s))}</mark>`:'')+esc(t.slice(t.length-s));return[w(a),w(b)]}
function rText(st,f,m){
  const rows=fakeDiff(f)||[];
  if(m==='unified'){let o=0,n=0;st.innerHTML=`<div class="sx">${rows.map(([c,num,t])=>c==='h'?`<div class="hh">${esc(num)}</div>`:`<div class="u ${c}"><i>${c==='a'?'':num}</i><i>${c==='d'?'':num}</i><b>${c==='a'?'+':c==='d'?'−':' '}</b>${esc(t)}</div>`).join('')}</div>`}
  else{
    let out='',D=[],A=[];
    const cell=(cls,n,html)=>`<div class="c ${cls}"><i>${n}</i><code>${html}</code></div>`;
    const flush=()=>{const L=Math.max(D.length,A.length);for(let i=0;i<L;i++){const d=D[i],a=A[i];let dh=d?esc(d[2]):'',ah=a?esc(a[2]):'';if(d&&a)[dh,ah]=wordMark(d[2],a[2]);out+=`<div class="sr">${d?cell('d',d[1],dh):cell('e','','')}${a?cell('a',a[1],ah):cell('e','','')}</div>`}D=[];A=[]};
    rows.forEach(r=>{if(r[0]==='d')D.push(r);else if(r[0]==='a')A.push(r);else{flush();out+=r[0]==='h'?`<div class="hh">${esc(r[1])}</div>`:`<div class="sr">${cell('',r[1],esc(r[2]))}${cell('',r[1],esc(r[2]))}</div>`}});flush();
    st.innerHTML=`<div class="sx"><div class="sr" style="position:sticky;top:0;z-index:2;background:var(--surface);font:11px var(--sans,inherit);color:var(--lo)"><div class="c" style="padding:6px 14px">旧 · HEAD~1</div><div class="c" style="padding:6px 14px">新 · HEAD</div></div>${out}</div>`;
  }
  return `<span>UTF-8 · LF</span><span><b>${rows.filter(r=>r[0]==='a').length}</b> 行新增 · <b>${rows.filter(r=>r[0]==='d').length}</b> 行删除</span><span>词级高亮</span>`;
}
/* ── Markdown：渲染后的修订对比 ── */
function rMd(st,f,m){
  if(m==='split')return rText(st,f,'split');
  st.innerHTML=`<div class="md">${MD_DOC.map(([t,x,s])=>{const cls=s==='a'?'ins':s==='d'?'del':'';return t==='li'?`<ul><li class="${cls}">${x}</li></ul>`:`<${t} class="${cls}">${x}</${t}>`}).join('')}</div>`;
  return `<span>渲染视图 · 绿色为新增段落，红色删除线为删除段落</span><span><b>3</b> 处新增 · <b>2</b> 处删除</span>`;
}
/* ── 图片：并排 / 滑动 / 叠加 / 差异 ── */
let zoom='fit';
function rImage(st,f,m){
  const zs=zoom==='fit'?1:zoom==='2x'?2:1.25;
  const s=f[0],oldEl=`<img src="${MEDIA.imgOld}" style="width:100%;height:100%;object-fit:contain">`,newIcon=px=>`<div style="display:grid;place-items:center;width:100%;height:100%">${famIcon('git',px)}</div>`;
  const zbar=`<div class="zoom">${[['fit','适应'],['1x','100%'],['2x','200%']].map(([z,l])=>`<button data-zoom="${z}" class="${z===zoom?'on':''}">${l}</button>`).join('')}</div>`;
  if(s!=='M'||m==='side'){
    const box=(el,tag,lb)=>`<div class="pane2"><div class="lb"><span class="tg ${tag}">${lb}</span>512 × 512 · PNG · ${tag==='old'?'48.2 KB':'51.0 KB'}</div><div class="checker" style="height:440px"><div style="width:${300*zs}px;height:${300*zs}px">${el}</div></div></div>`;
    st.innerHTML=`<div style="display:flex;justify-content:flex-end;padding:12px 20px 0">${zbar}</div><div class="duo" style="padding-top:8px">${s==='A'?`<div class="none">无（新增文件）</div>`:box(oldEl,'old','旧')}${s==='D'?`<div class="none">已删除</div>`:box(newIcon(300*zs),'new','新')}</div>`;
  }else{
    const ctl=m==='swipe'?`<div class="rng">旧<input type="range" min="0" max="100" value="50" id="imgR">新</div>`:m==='onion'?`<div class="rng">旧<input type="range" min="0" max="100" value="50" id="imgR">新 · 不透明度</div>`:`<div class="rng" style="color:var(--lo)">差异模式：相同像素为黑色，越亮表示变化越大</div>`;
    st.innerHTML=`<div class="solo">${zbar}<div class="stack checker" style="transform:scale(${zs});transform-origin:top center"><div>${oldEl}</div><div class="top" id="imgTop" style="${m==='diff'?'mix-blend-mode:difference':''}">${newIcon(420)}</div>${m==='swipe'?'<div class="swipe-h" id="imgH" style="left:50%"></div>':''}</div>${ctl}</div>`;
    const top=document.getElementById('imgTop'),r=document.getElementById('imgR'),h=document.getElementById('imgH');
    if(m==='diff')st.querySelector('.stack').style.background='#000';
    const set=v=>{if(m==='swipe'){top.style.clipPath=`inset(0 0 0 ${v}%)`;h.style.left=v+'%'}else if(m==='onion')top.style.opacity=v/100};
    if(r){set(50);r.oninput=()=>set(+r.value)}
    if(h){const stack=st.querySelector('.stack');h.onpointerdown=e=>{h.setPointerCapture(e.pointerId);h.onpointermove=ev=>{const b=stack.getBoundingClientRect();const v=Math.max(0,Math.min(100,(ev.clientX-b.left)/b.width*100));r.value=v;set(v)};h.onpointerup=()=>h.onpointermove=null}}
  }
  st.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=b.dataset.zoom;renderViewer()});
  return `<span>旧 <b>512×512 · 48.2 KB</b></span><span>新 <b>512×512 · 51.0 KB</b>（+2.8 KB）</span><span>sRGB · 带透明通道</span>`;
}
/* ── 视频：并排同步播放 / 滑动对比 ── */
function rVideo(st,f,m){
  const v=(src,id)=>`<div class="vbox"><video id="${id}" src="${src}" muted loop playsinline preload="auto"></video></div>`;
  if(m==='side')st.innerHTML=`<div class="duo"><div class="pane2"><div class="lb"><span class="tg old">旧</span>otter_idle.mp4 · H.264</div>${v(MEDIA.vidOld,'vA')}</div><div class="pane2"><div class="lb"><span class="tg new">新</span>otter_normal.mp4 · H.264</div>${v(MEDIA.vidNew,'vB')}</div></div>`;
  else st.innerHTML=`<div class="solo"><div class="stack" style="width:460px;height:460px">${v(MEDIA.vidOld,'vA')}<div class="top" id="vTop" style="clip-path:inset(0 0 0 50%)">${v(MEDIA.vidNew,'vB')}</div><div class="swipe-h" id="vH" style="left:50%"></div></div><div class="rng">旧<input type="range" min="0" max="100" value="50" id="vR">新</div></div>`;
  st.insertAdjacentHTML('beforeend',`<div class="vctl"><button class="play" id="vPlay">▶</button><button class="sm" id="vPrev" title="上一帧">‹ 帧</button><button class="sm" id="vNext" title="下一帧">帧 ›</button><input type="range" id="vSeek" min="0" max="1000" value="0"><span class="tm" id="vTm">0:00.0 / 0:00.0</span>${['0.5','1','2'].map(r=>`<button class="sm ${r==='1'?'on':''}" data-rate="${r}">${r}×</button>`).join('')}</div>`);
  const A=document.getElementById('vA'),B=document.getElementById('vB'),P=document.getElementById('vPlay'),K=document.getElementById('vSeek'),T=document.getElementById('vTm');
  const fmt=t=>`${Math.floor(t/60)}:${(t%60).toFixed(1).padStart(4,'0')}`;
  const both=fn=>[A,B].forEach(fn);
  P.onclick=()=>{if(B.paused){both(x=>x.play());P.textContent='❚❚'}else{both(x=>x.pause());P.textContent='▶'}};
  B.ontimeupdate=()=>{if(Math.abs(A.currentTime-B.currentTime)>.12)A.currentTime=B.currentTime;K.value=B.duration?B.currentTime/B.duration*1000:0;T.textContent=`${fmt(B.currentTime)} / ${fmt(B.duration||0)}`};
  K.oninput=()=>both(x=>x.currentTime=(x.duration||0)*K.value/1000);
  document.getElementById('vPrev').onclick=()=>both(x=>{x.pause();x.currentTime=Math.max(0,x.currentTime-1/30)});
  document.getElementById('vNext').onclick=()=>both(x=>{x.pause();x.currentTime+=1/30});
  st.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{both(x=>x.playbackRate=+b.dataset.rate);st.querySelectorAll('[data-rate]').forEach(y=>y.classList.toggle('on',y===b))});
  if(m==='swipe'){const top=document.getElementById('vTop'),h=document.getElementById('vH'),r=document.getElementById('vR'),stack=st.querySelector('.stack');const set=v=>{top.style.clipPath=`inset(0 0 0 ${v}%)`;h.style.left=v+'%'};r.oninput=()=>set(+r.value);
    h.onpointerdown=e=>{h.setPointerCapture(e.pointerId);h.onpointermove=ev=>{const b=stack.getBoundingClientRect();const v=Math.max(0,Math.min(100,(ev.clientX-b.left)/b.width*100));r.value=v;set(v)};h.onpointerup=()=>h.onpointermove=null}}
  B.onloadedmetadata=()=>{const fx=document.getElementById('vMeta');if(fx)fx.innerHTML=`${B.videoWidth}×${B.videoHeight} · ${B.duration.toFixed(1)}s`};
  return `<span>新 <b id="vMeta">读取中…</b></span><span>两侧同步播放 · 逐帧对比</span>`;
}
/* ── 文档（PDF 等）：页面对比 / 修订列表 ── */
let page=0;
function rDoc(st,f,m){
  if(m==='revs'){
    const revs=[];PDF.forEach((pg,i)=>pg.old.forEach(([t,x,s],j)=>{if(s)revs.push([i,s,x])}));
    st.innerHTML=`<div class="revs">${revs.map(([i,s,x])=>`<div class="rev"><div class="k">第 ${i+1} 页 · ${s==='ins'?'新增':'删除'}</div>${s==='ins'?`<ins>${x}</ins>`:`<del>${x}</del>`}</div>`).join('')}</div>`;
    return `<span><b>${revs.length}</b> 处修订</span>`;
  }
  const pg=PDF[page];
  const sheet=side=>`<div class="paper">${pg.old.filter(([,,s])=>side==='old'?s!=='ins':s!=='del').map(([t,x,s])=>`<${t} class="${s&&side==='old'&&s==='del'?'del':s&&side==='new'&&s==='ins'?'ins':''}">${x}</${t}>`).join('')}<span class="pn">${page+1} / ${PDF.length}</span></div>`;
  st.innerHTML=`<div class="duo" style="max-width:900px;margin:0 auto"><div class="pane2"><div class="lb"><span class="tg old">旧</span>用户手册 v1.1 · 3 页</div>${sheet('old')}</div><div class="pane2"><div class="lb"><span class="tg new">新</span>用户手册 v1.2 · 3 页</div>${sheet('new')}</div></div>
  <div class="pager"><button class="ghost rp" id="pgPrev" style="height:28px;padding:0 12px">‹ 上一页</button>第 ${page+1} / ${PDF.length} 页<button class="ghost rp" id="pgNext" style="height:28px;padding:0 12px">下一页 ›</button></div>`;
  document.getElementById('pgPrev').onclick=()=>{page=(page+PDF.length-1)%PDF.length;renderViewer()};
  document.getElementById('pgNext').onclick=()=>{page=(page+1)%PDF.length;renderViewer()};
  return `<span>PDF · A4 · 3 页</span><span>文字层对比：绿色新增，红色删除</span>`;
}
/* ── 音频：波形 + 试听 ── */
function rAudio(st,f){
  st.innerHTML=`<div class="wv"><div class="row"><span class="lb"><span class="tg old">旧</span></span>${f[0]==='A'?'<div class="none" style="flex:1;min-height:110px">无（新增文件）</div>':'<canvas id="wA" width="1600" height="220"></canvas>'}</div>
    <div class="row"><span class="lb"><span class="tg new">新</span></span><canvas id="wB" width="1600" height="220"></canvas></div>
    <div class="row"><span class="lb"></span><button class="slab rp" id="aPlay">▶ 试听新版本</button><span style="font-size:12px;color:var(--lo)">0.82 s · 44.1 kHz · 16 bit · 立体声 · 142 KB</span></div></div>`;
  const draw=(id,seed,ph=-1)=>{const c=document.getElementById(id);if(!c)return;const x=c.getContext('2d'),W=c.width,H=c.height;x.clearRect(0,0,W,H);const col=tone('--accent');
    for(let i=0;i<200;i++){const env=Math.exp(-i/70)*(1-Math.exp(-i/4));const h=(.15+.85*Math.abs(Math.sin(i*seed)*Math.cos(i*.17)))*env*H*.9;x.fillStyle=ph>=0&&i/200<ph?col:col+'88';x.fillRect(i*8,(H-h)/2,5,Math.max(2,h))}};
  draw('wA',.61);draw('wB',.83);
  document.getElementById('aPlay').onclick=()=>{try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(660,ac.currentTime);o.frequency.exponentialRampToValueAtTime(1320,ac.currentTime+.18);g.gain.setValueAtTime(.18,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.8);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.82)}catch(e){}
    const t0=performance.now();const tick=n=>{const p=(n-t0)/820;draw('wB',.83,Math.min(1,p));if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)};
  return `<span>WAV · PCM</span><span>${f[0]==='A'?'新增文件':'波形对比'}</span>`;
}
/* ── 二进制：概览 / 十六进制 ── */
function rBin(st,f,m){
  if(m==='hex'){
    const A=hexRows(7,false),B=hexRows(7,true);
    const col=(rows,mk)=>rows.map(([o,b])=>`<span class="o">${o}</span>  ${b.map(([v,ch])=>mk&&ch?`<mark>${v}</mark>`:v).join(' ')}`).join('\n');
    st.innerHTML=`<div class="hex"><div><div class="lb" style="font-family:inherit;margin-bottom:6px"><span class="tg old">旧</span></div>${col(A,false)}</div><div><div class="lb" style="font-family:inherit;margin-bottom:6px"><span class="tg new">新</span></div>${col(B,true)}</div></div>`;
    return `<span>显示前 288 字节 · 高亮为变化字节</span>`;
  }
  st.innerHTML=`<div class="meta"><table>
    <tr><td>大小</td><td class="mono">1.82 MB → 1.86 MB <span class="up">（+38.4 KB）</span></td></tr>
    <tr><td>SHA-256</td><td class="mono">3f9a1c…e07b → 8c21d4…19fa</td></tr>
    <tr><td>类型</td><td>Mach-O 动态库 · arm64 + x86_64</td></tr>
    <tr><td>段变化</td><td class="mono">__TEXT <span class="up">+24.1 KB</span> · __DATA <span class="up">+2.3 KB</span> · __LINKEDIT <span class="up">+12.0 KB</span></td></tr>
    <tr><td>变化字节</td><td><div style="display:flex;align-items:center;gap:10px"><div style="flex:1;height:6px;border-radius:3px;background:rgba(var(--ink),.08);overflow:hidden"><i style="display:block;width:1.2%;min-width:4px;height:100%;background:var(--accent)"></i></div><span class="mono">1.2%</span></div></td></tr>
    <tr><td>外部工具</td><td><button class="ghost rp" style="height:28px;padding:0 12px">用 Hex Fiend 打开</button> <button class="ghost rp" style="height:28px;padding:0 12px">在访达中显示</button></td></tr></table></div>`;
  return `<span>二进制文件无法逐行对比，显示元信息与字节级差异</span>`;
}
