/* ═══ 菜单栏浮窗（macOS）/ 托盘浮窗（Windows） ═══
   同一块面板，两种落点：macOS 从菜单栏状态项向下弹（带尖角），Windows 从任务栏托盘向上滑。
   Windows 另有右键上下文菜单（复用 menus.js 的菜单）与悬停提示。数据口径与 lib/core/tray/tray_snapshot.dart 一致。 */
Object.assign(IC,{
  sync:'<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  power:'<path d="M12 3v9M6.3 6.8a8 8 0 1 0 11.4 0"/>',
  wifi:'<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/>',
  vol:'<path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  chevup:'<path d="M6 15l6-6 6 6"/>'
});

document.head.insertAdjacentHTML('beforeend',`<style>
#tray{position:absolute;inset:0;z-index:38;display:none;overflow:hidden;background:linear-gradient(160deg,#2B2147 0%,#1A2A4A 48%,#3A2340 100%)}
[data-theme=day] #tray{background:linear-gradient(160deg,#E9E2FF 0%,#D7ECFF 50%,#FFE3D4 100%)}
#tray.on{display:block}
#tray .ghostwin{position:absolute;left:200px;top:120px;width:820px;height:520px;border-radius:12px;background:color-mix(in srgb,var(--canvas) 70%,transparent);border:.5px solid rgba(var(--ink),.1);box-shadow:0 30px 80px rgba(0,0,0,.35);opacity:.55}
#tray .ghostwin::before{content:"";position:absolute;left:14px;top:12px;width:52px;height:12px;border-radius:6px;background:radial-gradient(circle at 6px 6px,#FF5F57 5px,transparent 5.5px),radial-gradient(circle at 26px 6px,#FEBC2E 5px,transparent 5.5px),radial-gradient(circle at 46px 6px,#28C840 5px,transparent 5.5px)}
/* macOS 菜单栏 */
.mbar{position:absolute;left:0;right:0;top:0;height:26px;display:flex;align-items:center;gap:18px;padding:0 14px;font-size:13px;color:#fff;background:rgba(20,16,32,.38);backdrop-filter:blur(20px) saturate(1.6)}
[data-theme=day] .mbar{color:#1A1726;background:rgba(255,255,255,.45)}
.mbar b{font-weight:700} .mbar .sp{flex:1} .mbar svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
.sitem{display:flex;align-items:center;gap:4px;height:22px;padding:0 7px;border-radius:6px;cursor:pointer;color:inherit}
.sitem:hover,.sitem.open{background:rgba(var(--ink),.16)} [data-theme=day] .sitem:hover,[data-theme=day] .sitem.open{background:rgba(23,21,31,.12)}
.sitem .glyph{width:17px;height:17px;background:currentColor;-webkit-mask:url(assets/brand/otter_white.png) center/contain no-repeat;position:relative}
.sitem .lbl{font:600 12px var(--mono);min-width:0}
.sitem .lbl:empty{display:none}
.sitem .lbl.bump{animation:bump .5s var(--pop)} @keyframes bump{40%{transform:scale(1.35)}}
/* Windows 任务栏 */
.tbar{position:absolute;left:0;right:0;bottom:0;height:48px;display:flex;align-items:center;justify-content:center;gap:4px;background:rgba(28,24,40,.72);backdrop-filter:blur(30px) saturate(1.6);border-top:.5px solid rgba(255,255,255,.08)}
[data-theme=day] .tbar{background:rgba(243,242,248,.8);border-top-color:rgba(0,0,0,.08)}
.tbar .tk{width:40px;height:40px;border-radius:6px;display:grid;place-items:center;position:relative}
.tbar .tk:hover{background:rgba(var(--ink),.08)}
.tbar .tk .ficon{pointer-events:none}
.tbar .tk>svg{width:20px;height:20px;stroke:var(--hi);fill:none;stroke-width:1.8;stroke-linecap:round}
.tbar .tk.run::after{content:"";position:absolute;bottom:2px;left:50%;width:6px;height:3px;border-radius:2px;background:var(--mid);transform:translateX(-50%)}
.tbar .win4{width:20px;height:20px;display:grid;grid-template-columns:1fr 1fr;gap:2px} .tbar .win4 i{background:#4CC2FF;border-radius:1px}
.tray-r{position:absolute;right:8px;top:4px;bottom:4px;display:flex;align-items:center;gap:2px;color:var(--hi);font-size:12px}
.tray-r .ti{height:40px;min-width:32px;padding:0 6px;border-radius:6px;display:grid;place-items:center;position:relative;cursor:default}
.tray-r .ti:hover,.tray-r .ti.open{background:rgba(var(--ink),.08)}
.tray-r svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
.tray-r .clock{text-align:right;line-height:1.25;font-size:11.5px;padding:0 8px}
.tray-r .ot .ficon{display:block}
.tray-r .ot .bd{position:absolute;right:2px;top:5px;min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:var(--accent);color:var(--onAccent);font:800 9px/14px var(--mono);text-align:center}
.tray-r .ot .bd:empty{display:none}
.wtip{position:absolute;z-index:3;padding:6px 10px;border-radius:8px;font-size:12px;line-height:1.5;white-space:pre;background:color-mix(in srgb,var(--raised) 96%,transparent);border:.5px solid rgba(var(--ink),.14);box-shadow:0 8px 24px rgba(0,0,0,.3);color:var(--hi);pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .16s,transform .16s}
.wtip.on{opacity:1;transform:none}
/* 面板 */
.tpanel{position:absolute;z-index:2;width:344px;border-radius:16px;background:color-mix(in srgb,var(--raised) 92%,transparent);backdrop-filter:blur(26px) saturate(1.6);border:.5px solid rgba(var(--ink),.14);box-shadow:0 24px 60px rgba(0,0,0,.45),0 2px 8px rgba(0,0,0,.2);color:var(--hi);display:none}
.tpanel.on{display:block}
.tpanel.mac{transform-origin:var(--nx,50%) 0;animation:tpMac .42s var(--pop)} @keyframes tpMac{from{opacity:0;transform:scale(.9) translateY(-6px)}}
.tpanel.win{animation:tpWin .36s var(--ease)} @keyframes tpWin{from{opacity:0;transform:translateY(24px)}}
.tpanel.mac::before{content:"";position:absolute;top:-6px;left:calc(var(--nx,50%) - 7px);width:14px;height:14px;transform:rotate(45deg);border-radius:3px 0 0 0;background:inherit;border-left:.5px solid rgba(var(--ink),.14);border-top:.5px solid rgba(var(--ink),.14)}
.tp-in{position:relative;overflow:hidden;border-radius:16px;isolation:isolate}
.tp-in::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--card)}
.tp-aura{position:absolute;left:-40px;right:-40px;top:-80px;height:200px;z-index:-1;background:radial-gradient(ellipse at 30% 50%,color-mix(in srgb,var(--tone,var(--accent)) 22%,transparent),transparent 70%);transition:background .6s}
.tp-head{display:flex;align-items:center;gap:12px;padding:14px 14px 10px}
.tp-head img{width:48px;height:48px;object-fit:contain;animation:float 2.4s ease-in-out infinite;cursor:pointer}
.tp-id{flex:1;min-width:0} .tp-id b{display:block;font-size:15.5px;font-weight:800;letter-spacing:-.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tp-id span{display:flex;align-items:center;gap:5px;font:12px var(--mono);color:var(--mid);white-space:nowrap;overflow:hidden}
.tp-id span svg{width:13px;height:13px;stroke:var(--accent);fill:none;stroke-width:2;stroke-linecap:round;flex:none} .tp-id i{font-style:normal;color:var(--lo)}
.tp-id .hint{font:12.5px/1.45 inherit;font-family:inherit;color:var(--mid);white-space:normal}
.tp-head .ib.spin svg{animation:spin .9s linear infinite} @keyframes spin{to{transform:rotate(360deg)}}
.tp-busy{height:2px;margin:0 14px;border-radius:2px;background:rgba(var(--ink),.06);overflow:hidden;opacity:0;transition:opacity .2s}
.tp-busy.on{opacity:1} .tp-busy i{display:block;width:40%;height:100%;border-radius:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);animation:flow 1s linear infinite} @keyframes flow{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
.tp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px 12px}
.tp-stats .c{padding:9px 4px 8px;border-radius:12px;text-align:center;background:rgba(var(--ink),.04);border:.5px solid rgba(var(--ink),.06);transition:background .3s}
.tp-stats .c b{display:block;font:800 19px/1.1 var(--mono);color:var(--lo)} .tp-stats .c span{font-size:10.5px;color:var(--lo)}
.tp-stats .c.hot{background:color-mix(in srgb,var(--t) 13%,transparent);border-color:color-mix(in srgb,var(--t) 22%,transparent)}
.tp-stats .c.hot b{color:color-mix(in srgb,var(--t) var(--tt),var(--hi))}
.tp-stats .c b.pop{animation:bump .5s var(--pop)}
.tp-sec{display:flex;justify-content:space-between;padding:6px 16px 4px;font-size:11px;font-weight:700;letter-spacing:.4px;color:var(--lo)}
.tp-br{padding:0 8px;max-height:120px;overflow:auto}
.tp-br .r{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:10px}
.tp-br .r:hover{background:rgba(var(--ink),.05)}
.tp-br .r .n{width:9px;height:9px;border-radius:50%;border:1.6px solid var(--lo);flex:none}
.tp-br .r.cur .n{border-color:var(--accent);background:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}
.tp-br .r .nm{flex:1;min-width:0} .tp-br .r .nm b{display:block;font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .tp-br .r.cur .nm b{font-weight:800}
.tp-br .r .nm span{font:10.5px var(--mono);color:var(--lo)}
.tp-br .empty{display:flex;align-items:center;gap:10px;padding:6px 8px 8px;font-size:12px;color:var(--mid)} .tp-br .empty img{width:36px;height:36px}
.tp-hint{display:flex;align-items:center;gap:8px;margin:8px 12px 0;padding:8px 10px;border-radius:10px;font-size:12px;color:var(--mid);background:rgba(var(--ink),.035)}
.tp-hint i{width:6px;height:6px;border-radius:50%;background:var(--tone,var(--accent));flex:none;box-shadow:0 0 6px var(--tone,var(--accent))}
.tp-hint.ok{color:color-mix(in srgb,var(--ok) var(--tt),var(--hi));background:color-mix(in srgb,var(--ok) 12%,transparent)} .tp-hint.ok i{background:var(--ok);box-shadow:0 0 6px var(--ok)}
.tp-hint.ok{animation:bump .4s var(--ease)}
.tp-acts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px 12px}
.ta{display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 0 8px;border-radius:12px;font-size:12px;font-weight:600;color:var(--hi);background:rgba(var(--ink),.05);border:.5px solid rgba(var(--ink),.08);position:relative;overflow:hidden;transition:background .12s,transform .12s}
.ta:hover{background:rgba(var(--ink),.09)} .ta:active{transform:scale(.95)}
.ta svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ta.sug{background:color-mix(in srgb,var(--accent) 16%,transparent);border-color:color-mix(in srgb,var(--accent) 45%,transparent);color:color-mix(in srgb,var(--accent) var(--tt),var(--hi))}
.ta.sug::after{content:"";position:absolute;top:6px;right:8px;width:6px;height:6px;border-radius:50%;background:var(--accent);animation:breath 1.6s ease-in-out infinite}
.ta.run svg{animation:spin .9s linear infinite} .ta[disabled]{opacity:.4;pointer-events:none}
.tp-foot{display:flex;align-items:center;gap:8px;padding:10px 12px 12px;border-top:.5px solid var(--line)}
.tp-foot .slab{flex:1}
</style>`);

const tray=document.createElement('div');tray.id='tray';WIN.appendChild(tray);
const TRS={os:'off',st:'dirty',busy:null,d:null,tipT:0};
const TRDATA={
  dirty:()=>({repo:'OtterGitApp',branch:'dev',up:'origin/dev',pending:12,behind:2,ahead:1,branches:[{n:'dev',u:'origin/dev',a:1,b:2,cur:1},{n:'feat/windows',u:'origin/feat/windows',a:0,b:3}]}),
  synced:()=>({repo:'OtterGitApp',branch:'dev',up:'origin/dev',pending:0,behind:0,ahead:0,branches:[]}),
  norepo:()=>null
};
const trBadge=d=>!d?0:d.branches.length||d.behind;
const trLabel=d=>!d?'':trBadge(d)?String(trBadge(d)):d.ahead?'↑'+d.ahead:d.pending?'·'+d.pending:'';
function trStats(d){const p=[d.pending&&d.pending+' 文件变更',d.behind&&'↓'+d.behind+' 可拉取',d.ahead&&'↑'+d.ahead+' 未推送',d.branches.length&&d.branches.length+' 分支有差'].filter(Boolean);return p.length?p.join(' · '):'所有已跟踪本地分支均与上游同步'}
function trAdvice(d){
  if(!d)return['打开一个仓库，小獭就帮你盯着远程变化','--accent',null];
  if(d.behind)return[`远程有 ${d.behind} 个新提交，建议先拉取`,'--memory','pull'];
  if(d.ahead)return[`有 ${d.ahead} 个提交还没推送`,'--accent','push'];
  if(d.pending)return[`${d.pending} 个文件待提交，回到应用处理`,'--warn',null];
  return['都同步好了，安心写代码','--ok',null];
}
function trScene(d){return !d?'noRepo':TRS.busy?'busy':d.pending?'dirty':d.behind?'behind':'clean'}

function trPanel(){
  const d=TRS.d,[adv,tone,sug]=trAdvice(d),busy=TRS.busy,win=TRS.os==='win';
  const cell=(v,l,t,on)=>`<div class="c ${on?'hot':''}" style="--t:var(${t})"><b data-v="${l}">${v}</b><span>${l}</span></div>`;
  const act=(k,ic,l)=>`<button class="ta rp ${sug===k&&!busy?'sug':''} ${busy===k?'run':''}" data-ta="${k}" ${!d||busy&&busy!==k?'disabled':''}>${svg(busy===k?'refresh':ic)}${l}</button>`;
  const rows=!d?'':d.branches.length?d.branches.map(b=>`<div class="r ${b.cur?'cur':''}"><span class="n"></span><div class="nm"><b>${b.n}</b><span>${b.u}</span></div>${b.a?`<span class="pill u" style="background:color-mix(in srgb,var(--accent) 16%,transparent);color:color-mix(in srgb,var(--accent) var(--tt),var(--hi))">↑${b.a}</span>`:''}${b.b?`<span class="pill u">↓${b.b}</span>`:''}</div>`).join(''):`<div class="empty"><img data-scene="clean" alt="">所有已跟踪本地分支均与上游同步</div>`;
  return `<div class="tp-in" style="--tone:var(${tone})"><div class="tp-aura"></div>
    <div class="tp-head"><img data-scene="${trScene(d)}" alt=""><div class="tp-id">${d?`<b>${d.repo}</b><span>${svg('branch')}${d.branch}<i>← ${d.up}</i></span>`:`<b>未打开仓库</b><div class="hint">打开仓库后，这里会显示分支与远程变更</div>`}</div>${d?`<button class="ib ${busy?'spin':''}" data-ta="refresh" title="刷新">${svg('refresh')}</button>`:''}</div>
    <div class="tp-busy ${busy?'on':''}"><i></i></div>
    <div class="tp-stats">${d?cell(d.pending,'文件变更','--warn',d.pending)+cell(d.behind?'↓'+d.behind:0,'可拉取','--memory',d.behind)+cell(d.ahead?'↑'+d.ahead:0,'未推送','--accent',d.ahead)+cell(d.branches.length,'分支有差','--alt',d.branches.length):cell('—','文件变更','--warn')+cell('—','可拉取','--memory')+cell('—','未推送','--accent')+cell('—','分支有差','--alt')}</div>
    ${d?`<div class="tp-sec"><span>本地分支 · 有远程变更</span><span>${d.branches.length||'无'}</span></div><div class="tp-br">${rows}</div>`:''}
    <div class="tp-hint" id="tpHint"><i></i>${busy?`正在${{fetch:'获取',pull:'拉取',push:'推送',sync:'同步',refresh:'刷新'}[busy]}…`:'小獭：'+adv}</div>
    <div class="tp-acts">${act('fetch','fetch','获取')}${act('pull','pull','拉取')}${act('push','push','推送')}${act('sync','sync','同步')}</div>
    <div class="tp-foot"><button class="ib" data-ta="settings" title="打开设置">${svg('gear')}</button><button class="slab rp" data-ta="open">${d?'打开 水獭 Git':'打开仓库…'}</button>${win?`<button class="ib" data-ta="quit" title="退出 水獭 Git">${svg('power')}</button>`:`<button class="ib" data-ta="about" title="关于">${svg('info')}</button>`}</div>
  </div>`;
}

function trRender(){
  const win=TRS.os==='win',lbl=trLabel(TRS.d);
  tray.innerHTML=`<div class="ghostwin"></div>${win?
    `<div class="tbar"><div class="tk"><div class="win4"><i></i><i></i><i></i><i></i></div></div><div class="tk">${svg('search')}</div><div class="tk run">${famIcon('gt',24)}</div><div class="tk run">${famIcon('tl',24)}</div><div class="tk run" id="tkGit">${famIcon('git',24)}</div>
      <div class="tray-r"><div class="ti">${svg('chevup')}</div><div class="ti ot" id="trIcon">${famIcon('git',18)}<span class="bd">${trBadge(TRS.d)||''}</span></div><div class="ti">${svg('wifi')}</div><div class="ti">${svg('vol')}</div><div class="ti clock">14:55<br>2026/11/5</div></div></div><div class="wtip" id="wtip"></div>`:
    `<div class="mbar"><b></b><b>水獭 Git</b><span>文件</span><span>编辑</span><span>仓库</span><span>窗口</span><span>帮助</span><span class="sp"></span><div class="sitem" id="trIcon"><span class="glyph"></span><span class="lbl">${lbl}</span></div>${svg('wifi')}<span>周四 14:55</span></div>`}
    <div class="tpanel ${win?'win':'mac'}" id="tpanel"></div>`;
  const ic=document.getElementById('trIcon');
  ic.onclick=e=>{e.stopPropagation();trToggle()};
  if(win){
    ic.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();trHide();const p=ptOf(e);openMenu(trMenu(),p.x-8,p.y,{minW:260})};
    const tip=document.getElementById('wtip');
    ic.onmouseenter=()=>{TRS.tipT=setTimeout(()=>{if(document.getElementById('tpanel').classList.contains('on'))return;const d=TRS.d;tip.textContent=d?`水獭 Git · ${d.repo}\n${d.branch}  ← ${d.up}\n${trStats(d)}`:'水獭 Git · 未打开仓库';tip.classList.add('on');const r=rectOf(ic);tip.style.left=Math.min(1280-tip.offsetWidth-8,r.l+r.w/2-tip.offsetWidth/2)+'px';tip.style.top=(r.t-tip.offsetHeight-10)+'px'},500)};
    ic.onmouseleave=()=>{clearTimeout(TRS.tipT);tip.classList.remove('on')};
  }
}
function trPaint(){
  const p=document.getElementById('tpanel');if(!p)return;p.innerHTML=trPanel();
  p.querySelectorAll('img[data-scene]').forEach(im=>face(im,im.dataset.scene));
  p.querySelectorAll('[data-ta]').forEach(b=>b.onclick=e=>{e.stopPropagation();trAct(b.dataset.ta)});
  const ot=p.querySelector('.tp-head img');ot.onclick=()=>{face(ot,'pet');ot.animate([{transform:'scale(.8) rotate(-8deg)'},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.3,1.5,.5,1)'})};
}
function trShow(){
  const p=document.getElementById('tpanel'),ic=document.getElementById('trIcon');trPaint();
  if(TRS.os==='mac'){const r=rectOf(ic),L=Math.min(1280-352,Math.max(8,r.l+r.w/2-172));p.style.left=L+'px';p.style.top=(r.t+r.h+10)+'px';p.style.setProperty('--nx',(r.l+r.w/2-L)+'px')}
  else{p.style.right='12px';p.style.bottom='60px'}
  p.classList.remove('on');void p.offsetWidth;p.classList.add('on');ic.classList.add('open');
  const tip=document.getElementById('wtip');if(tip)tip.classList.remove('on');
}
function trHide(){const p=document.getElementById('tpanel');if(p)p.classList.remove('on');const ic=document.getElementById('trIcon');if(ic)ic.classList.remove('open')}
function trToggle(){document.getElementById('tpanel').classList.contains('on')?trHide():trShow()}
function trSay(text){const h=document.getElementById('tpHint');if(!h)return;h.className='tp-hint ok';h.innerHTML='<i></i>'+text}

function trAct(k){
  const d=TRS.d;
  if(k==='open'){trHide();if(!d)return DLG.repos();return trOpenApp()}
  if(k==='settings'){trHide();trOpenApp();return setTimeout(()=>DLG.settings(),500)}
  if(k==='about'){trHide();trOpenApp();return setTimeout(()=>DLG.about(),500)}
  if(k==='quit'){trHide();return openMenu([{h:'退出 水獭 Git？'},{lb:'退出',ic:'power',danger:1,act:()=>{tray.style.transition='opacity .4s';tray.style.opacity=.4;setTimeout(()=>{tray.style.opacity=1},900)}},{lb:'最小化到托盘',ic:'chev'}],1280-280,800-200,{minW:220})}
  if(!d||TRS.busy)return;
  const before={b:d.behind,a:d.ahead};TRS.busy=k;trPaint();
  setTimeout(()=>{
    let msg='已刷新';
    if(k==='fetch'){msg=d.behind?`已获取 · 远程有 ${d.behind} 个新提交`:'已获取 · 远程没有新提交'}
    if(k==='pull'||k==='sync'){d.behind=0;d.branches.forEach(b=>{if(b.cur)b.b=0})}
    if(k==='push'||k==='sync'){d.ahead=0;d.branches.forEach(b=>{if(b.cur)b.a=0})}
    d.branches=d.branches.filter(b=>b.a||b.b);
    if(k==='pull')msg=`已拉取 ${before.b} 个提交`;if(k==='push')msg=`已推送 ${before.a} 个提交到 ${d.up}`;if(k==='sync')msg=`已同步 · ↓${before.b} ↑${before.a}`;
    TRS.busy=null;trPaint();trSay(msg);
    document.querySelectorAll('#tpanel .tp-stats b').forEach(b=>b.classList.add('pop'));
    const lb=tray.querySelector('.sitem .lbl, .tray-r .bd');if(lb){lb.textContent=TRS.os==='win'?(trBadge(d)||''):trLabel(d);lb.classList.remove('bump');void lb.offsetWidth;lb.classList.add('bump')}
  },k==='refresh'?700:1300);
}
function trOpenApp(){trSet('off')}
function trMenu(){
  const d=TRS.d,a=(lb,ic,k)=>({lb,ic,act:()=>{trShow();trAct(k)}});
  if(!d)return[{h:'水獭 Git'},{lb:'未打开仓库',sm:'打开仓库后显示分支与远程变更',ic:'info',dis:1},'-',{lb:'打开 水獭 Git',ic:'ext',act:trOpenApp},{lb:'打开设置',ic:'gear',act:()=>trAct('settings')},'-',{lb:'退出',ic:'power',danger:1,act:()=>trAct('quit')}];
  return[{h:d.repo,hr:'水獭 Git'},{lb:d.branch,sm:'← '+d.up,ic:'branch',dis:1},{lb:trStats(d),ic:'info',dis:1},'-',
    {lb:'本地分支 · 有远程变更',ic:'branch',sub:d.branches.length?d.branches.map(b=>({lb:b.n,sm:[b.a&&'↑'+b.a,b.b&&'↓'+b.b].filter(Boolean).join(' '),dot:b.cur?'var(--accent)':'var(--lo)',dis:1})):[{lb:'均与上游同步',ic:'check',dis:1}]},'-',
    a('获取','fetch','fetch'),a('拉取','pull','pull'),a('推送','push','push'),a('同步','sync','sync'),'-',
    {lb:'打开设置',ic:'gear',act:()=>trAct('settings')},{lb:'打开 水獭 Git',ic:'ext',act:trOpenApp},'-',{lb:'退出',ic:'power',danger:1,act:()=>trAct('quit')}];
}
function trSet(os,st){
  if(st){TRS.st=st}
  if(os)TRS.os=os;
  S.tray=TRS.os;S.trst=TRS.st;TRS.busy=null;TRS.d=TRDATA[TRS.st]();
  closeMenus();tray.style.opacity=1;
  if(TRS.os==='off'){tray.classList.remove('on')}else{tray.classList.add('on');trRender();setTimeout(trShow,240)}
  markConsole();
}
tray.addEventListener('pointerdown',e=>{if(!e.target.closest('.tpanel,#trIcon'))trHide()});

document.querySelector('#console .opt[data-k=moment]').insertAdjacentHTML('afterend',`<h2>菜单栏 / 托盘</h2><div class="opt" data-k="tray"><button data-v="mac">macOS 菜单栏</button><button data-v="win">Windows 托盘</button><button data-v="off">回到应用</button></div><div class="opt" data-k="trst"><button data-v="dirty">有变更</button><button data-v="synced">已同步</button><button data-v="norepo">未打开仓库</button></div><p>macOS 点状态栏的水獭图标；Windows 左键托盘图标出浮窗、右键出菜单、悬停看提示。</p>`);
document.querySelector('#console .opt[data-k=tray]').addEventListener('click',e=>{const b=e.target.closest('button');if(b){e.stopPropagation();trSet(b.dataset.v)}});
document.querySelector('#console .opt[data-k=trst]').addEventListener('click',e=>{const b=e.target.closest('button');if(b){e.stopPropagation();trSet(TRS.os==='off'?'mac':null,b.dataset.v)}});
S.tray='off';S.trst='dirty';markConsole();
