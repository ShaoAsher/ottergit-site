/* ═══ 小獭 AI 助手面板（与 App 2.0.0 的 ai_panel 同构） ═══
   用户消息：靠右、无头像、选中色底、无描边。
   助手消息：连续几条只在第一条挂头像和「小獭」名字；气泡细描边、左上角收成小圆角。
   操作：最后一条助手消息常显「复制 / 重新生成」；其余悬停才出现（用户消息在气泡左侧，助手消息浮在右下角）。 */
Object.assign(IC,{
  copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  retry:'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clip:'<path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/>',
  send:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h0a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
  caret:'<path d="M9 6l6 6-6 6"/>',
  dots:'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>'
});

document.head.insertAdjacentHTML('beforeend',`<style>
.ai{width:0;flex:none;display:flex;flex-direction:column;opacity:0;margin-left:-8px;transition:width .42s var(--ease),opacity .26s,margin .42s var(--ease)}
.ai.on{width:340px;opacity:1;margin-left:0}
.ai .ah{display:flex;align-items:center;gap:10px;padding:12px 10px 10px 14px;border-bottom:.5px solid var(--line);min-width:340px}
.ai .ah img{width:34px;height:34px}
.ai .ah .tt{flex:1;min-width:0}
.ai .ah b{display:block;font-size:14.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ai .ah small{display:block;font-size:11.5px;color:var(--lo);white-space:nowrap}
.ai .gb{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:var(--mid);transition:background .12s,color .12s}
.ai .gb:hover{background:rgba(var(--ink),.07);color:var(--hi)}
.ai .gb svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ai .gb.sm{width:24px;height:24px;border-radius:7px}.ai .gb.sm svg{width:13px;height:13px}
.ai .ml{flex:1;overflow:auto;padding:14px 12px 6px;min-width:340px;scroll-behavior:smooth}
.ai .ml::-webkit-scrollbar{width:0}
.mr{display:flex;align-items:flex-start;padding-bottom:4px}
.mr.lead{padding-top:10px}
.mr.u{justify-content:flex-end}
.mr.new{animation:rise .42s var(--ease)}
.mr .av{width:30px;height:30px;flex:none;margin-right:8px}
.mr .av.ph{visibility:hidden}
.mr .col{display:flex;flex-direction:column;align-items:flex-start;min-width:0;max-width:calc(100% - 38px)}
.mr.u .col{align-items:flex-end}
.mr .meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:11.5px;font-weight:600;color:var(--mid);margin:0 0 4px 2px}
.badge{white-space:nowrap;flex:none;font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;color:var(--warn);background:color-mix(in srgb,var(--warn) 14%,transparent);border:.5px solid color-mix(in srgb,var(--warn) 45%,transparent)}
.fr{position:relative;display:flex;align-items:flex-end;gap:4px;max-width:100%}
.bb{padding:9px 12px;border-radius:16px;font-size:13.5px;line-height:1.55;overflow-wrap:anywhere;max-width:100%;transition:background .2s}
.mr.u .bb{background:color-mix(in srgb,var(--accent) 16%,transparent)}
.mr.u.lead .bb{border-top-right-radius:6px}
.mr.a .bb{background:var(--raised);border:.5px solid var(--line)}
.mr.a.lead .bb{border-top-left-radius:6px}
.bb .tx{white-space:pre-wrap}
.bb code{font:12px var(--mono);padding:1px 5px;border-radius:5px;background:rgba(var(--ink),.07)}
.bb .cur{display:inline-block;width:7px;height:14px;border-radius:2px;background:var(--accent);vertical-align:-2px;margin-left:2px;animation:blink 1s steps(1) infinite}
.acts{display:flex;gap:0;opacity:0;pointer-events:none;transition:opacity .12s}
.mr:hover .acts{opacity:1;pointer-events:auto}
.acts.pin{opacity:1;pointer-events:auto;margin-top:2px}
.acts.fl{position:absolute;right:4px;bottom:4px;background:var(--surface);border:.5px solid var(--line);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.18)}
.dots{display:flex;align-items:center;gap:4px;font-size:11.5px;color:var(--lo);min-width:0}
.dots i{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:dot 1.1s infinite ease-in-out;flex:none}
.dots i:nth-child(2){animation-delay:.18s}.dots i:nth-child(3){animation-delay:.36s}
.dots span{margin-left:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@keyframes dot{0%,100%{opacity:.35;transform:none}50%{opacity:1;transform:translateY(-2px)}}
.fold{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;color:var(--lo);padding:2px 4px;border-radius:7px;cursor:pointer}
.fold:hover{background:rgba(var(--ink),.06)}
.fold svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .26s var(--ease)}
.fold.on svg:first-child{transform:rotate(90deg)}
.think{margin:2px 0 6px 10px;padding-left:10px;border-left:1.5px solid var(--line);font-size:11.5px;line-height:1.45;color:var(--lo);white-space:pre-wrap}
.steps2{border:.5px solid var(--line);border-radius:12px;padding:6px 8px;margin-bottom:8px;background:rgba(var(--ink),.025)}
.steps2 .sh{display:flex;font-size:11.5px;font-weight:700;color:var(--mid);padding:2px 2px 4px}
.steps2 .sh span:last-child{margin-left:auto;font:11px var(--mono);color:var(--lo)}
.st{display:flex;gap:8px;align-items:flex-start;padding:4px 2px;font-size:12.5px}
.st .ic{width:16px;height:16px;border-radius:50%;flex:none;display:grid;place-items:center;margin-top:1px}
.st .ic svg{width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.st.done .ic{background:color-mix(in srgb,var(--ok) 18%,transparent);color:var(--ok)}
.st.run .ic{border:2px solid color-mix(in srgb,var(--accent) 30%,transparent);border-top-color:var(--accent);animation:spin .8s linear infinite}
.st.wait .ic{border:1.5px dashed var(--lo)}
@keyframes spin{to{transform:rotate(360deg)}}
.st .t{flex:1;min-width:0}
.st .t small{display:block;font:11px var(--mono);color:var(--lo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cf{border:.5px solid color-mix(in srgb,var(--warn) 40%,transparent);background:color-mix(in srgb,var(--warn) 7%,transparent);border-radius:12px;padding:10px 10px 10px 12px;margin-bottom:8px}
.cf .ch{display:flex;gap:6px;align-items:flex-start;font-weight:700;font-size:13px;line-height:1.35}
.cf .ch svg{flex:none;margin-top:1px}
.cf .ch .tl{flex:1;min-width:0}
.cf p{font-size:12px;color:var(--mid);margin:4px 0 6px;line-height:1.5}
.cf .ps{font:11px var(--mono);color:var(--lo);line-height:1.6}
.cf .cb{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;margin-top:10px}
.cf .cb button{height:28px;padding:0 12px;font-size:12px}
.cf .cb .slab{height:28px}
.chips2{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chips2 button{font-size:12px;font-weight:600;color:var(--accent);padding:5px 10px;border-radius:999px;background:rgba(var(--ink),.04);border:.5px solid var(--line);transition:background .12s,transform .12s}
.chips2 button:hover{background:color-mix(in srgb,var(--accent) 10%,transparent)}
.chips2 button:active{transform:scale(.96)}
.ai .empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;gap:6px;min-width:340px}
.ai .empty img{width:96px;height:96px;animation:float 2.4s ease-in-out infinite}
.ai .empty b{font-size:15px}
.ai .empty p{font-size:12.5px;color:var(--mid);margin-bottom:8px}
.ai .cp{margin:6px 10px 10px;border-radius:14px;background:var(--field);border:.5px solid var(--line);padding:8px 8px 6px 10px;min-width:320px;transition:border-color .2s,box-shadow .2s}
.ai .cp:focus-within{border-color:color-mix(in srgb,var(--accent) 50%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.ai .cp textarea{width:100%;height:40px;border:0;background:none;resize:none;color:var(--hi);font:inherit;font-size:13px;outline:none}
.ai .cp .row{display:flex;align-items:center;gap:4px}
.ai .cp .pill{display:flex;align-items:center;gap:4px;font-size:11.5px;color:var(--mid);padding:3px 8px;border-radius:999px;background:rgba(var(--ink),.05)}
.ai .cp .pill svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2}
.ai .cp .go{margin-left:auto;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--onAccent);transition:transform .12s,filter .12s}
.ai .cp .go:active{transform:scale(.92)}
.ai .cp .go[disabled]{filter:grayscale(1) opacity(.5)}
.ai .cp .go svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.avatar-btn.on img{box-shadow:0 0 0 2px var(--accent)}
.page.on.ai-open .detail{width:340px}
.page.on.ai-open .files{width:300px}
.ph button,.ph .ibs{flex:none;white-space:nowrap}
.ph>span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.page.on.ai-open #wcDiscard{display:none}
</style>`);

document.querySelector('#app .body').insertAdjacentHTML('beforeend',`<aside class="cardp ai" id="aiPanel" aria-label="小獭 AI 助手">
  <div class="ah"><img data-scene="greet" alt=""><div class="tt"><b id="aiTitle">新对话</b><small>按仓库隔离</small></div>
    <button class="gb" id="aiHist" title="历史对话">${svg('clock')}</button><button class="gb" id="aiNew" title="新对话">${svg('plus')}</button><button class="gb" id="aiMore" title="更多">${svg('dots')}</button><button class="gb" id="aiClose" title="收起">${svg('x')}</button></div>
  <div class="ml" id="aiList"></div>
  <div class="cp"><textarea id="aiInput" placeholder="问小獭…（回车发送，Shift+回车换行）"></textarea>
    <div class="row"><span class="pill">${svg('spark')}doubao-seed-2.0</span><span class="pill">${svg('shield')}能改</span><button class="gb sm" title="添加附件">${svg('clip')}</button><button class="go" id="aiGo" title="发送" disabled>${svg('send')}</button></div></div>
</aside>`);

const AI={open:false,title:'新对话',msgs:[],busy:false,seq:0};
const aiEl=document.getElementById('aiPanel'),aiList=document.getElementById('aiList'),aiInput=document.getElementById('aiInput'),aiGo=document.getElementById('aiGo');
const fmt=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>');

function msg(role,o={}){return Object.assign({id:++AI.seq,role,text:'',thinking:'',steps:[],chips:[],confirm:null,live:false,fresh:true},o)}
function aiReset(seed=true){
  AI.msgs=[];AI.title='新对话';
  if(seed){
    AI.title='看看改动';
    AI.msgs.push(msg('user',{text:'现在有什么改动？',fresh:false}));
    AI.msgs.push(msg('assistant',{fresh:false,steps:[{t:'查看状态',d:'dev · 未暂存 12',s:'done'}],ask:true,text:'当前在 `dev`，改了 12 个文件：首页改成浮卡布局、新增背景环境层和按压波纹，都还没暂存。',chips:['帮我写提交说明并提交','先看 diff']}));
  }
  aiRender();
}

function rowHtml(m,i){
  const prev=AI.msgs[i-1],lead=!prev||prev.role!==m.role,isU=m.role==='user';
  const lastA=AI.msgs.map(x=>x.role).lastIndexOf('assistant');
  const pin=!isU&&i===lastA&&!m.live;
  const awaiting=!isU&&!m.live&&m.ask&&i===lastA;
  const meta=!isU&&(lead||m.confirm||awaiting)?`<div class="meta">${m.live?'小獭正在想…':'小獭'}${awaiting?'<span class="badge">等待你回复</span>':''}${m.confirm&&!m.confirm.done?'<span class="badge">等待确认</span>':''}</div>`:'';
  let body='';
  if(m.thinking)body+=`<div class="fold ${m.openThink?'on':''}" data-think="${m.id}">${svg('caret')}${svg('brain')}${m.live&&!m.text?'正在思考':'思考过程'}</div>${m.openThink||(m.live&&!m.text)?`<div class="think">${esc(m.thinking)}</div>`:''}`;
  if(m.steps.length)body+=`<div class="steps2"><div class="sh"><span>过程 · ${m.steps.length} 步</span><span>${m.steps.filter(s=>s.s==='done').length}/${m.steps.length}</span></div>${m.steps.map(s=>`<div class="st ${s.s}"><span class="ic">${s.s==='done'?svg('check'):''}</span><div class="t">${s.t}${s.d?`<small>${esc(s.d)}</small>`:''}</div></div>`).join('')}</div>`;
  if(m.confirm&&!m.confirm.done)body+=`<div class="cf"><div class="ch">${svg('shield').replace('<svg','<svg style="width:15px;height:15px;stroke:var(--warn);fill:none;stroke-width:2"')}<span class="tl">${m.confirm.title}</span><span class="badge">L3</span></div><p>${m.confirm.body}</p><div class="ps">${m.confirm.paths.join('<br>')}</div><div class="cb"><button class="ghost rp" data-cf="no" data-m="${m.id}">取消</button><button class="slab rp" data-cf="yes" data-m="${m.id}">允许</button></div></div>`;
  if(m.text)body+=`<div class="tx">${fmt(m.text)}${m.live?'<i class="cur"></i>':''}</div>`;
  else if(m.live&&!m.confirm)body+=`<div class="dots"><i></i><i></i><i></i><span>${m.working||'小獭正在整理回复…'}</span></div>`;
  const acts=fl=>`<div class="acts ${fl}"><button class="gb sm" data-copy="${m.id}" title="复制">${svg('copy')}</button>${isU?'':`<button class="gb sm" data-retry="${m.id}" title="重新生成">${svg('retry')}</button>`}</div>`;
  const bubble=`<div class="bb">${body}</div>`;
  const framed=m.live?`<div class="fr">${bubble}</div>`:pin?`<div class="fr">${bubble}</div>`:isU?`<div class="fr">${acts('')}${bubble}</div>`:`<div class="fr">${bubble}${acts('fl')}</div>`;
  const chips=!isU&&!m.live&&m.chips.length?`<div class="chips2">${m.chips.map(c=>`<button data-chip="${esc(c)}">${esc(c)}</button>`).join('')}</div>`:'';
  const av=isU?'':lead?`<img class="av" src="${pick(m.live?'busy':'greet')}" alt="">`:'<span class="av ph"></span>';
  return `<div class="mr ${isU?'u':'a'} ${lead?'lead':''} ${m.fresh?'new':''}" data-row="${m.id}">${av}<div class="col">${meta}${framed}${chips}${pin?acts('pin'):''}</div></div>`;
}
function aiRender(){
  document.getElementById('aiTitle').textContent=AI.title;
  if(!AI.msgs.length){aiList.style.display='none';let e=aiEl.querySelector('.empty');if(!e){aiList.insertAdjacentHTML('afterend',`<div class="empty"><img alt=""><b>问小獭任何关于这个仓库的事</b><p>它会先看状态和 diff，动手前一定先问你。</p><div class="chips2" style="justify-content:center">${['现在有什么改动？','帮我写提交说明','解释最近一次提交'].map(c=>`<button data-chip="${c}">${c}</button>`).join('')}</div></div>`);e=aiEl.querySelector('.empty');e.querySelector('img').src=pick('greet')}return}
  aiEl.querySelector('.empty')?.remove();aiList.style.display='';
  aiList.innerHTML=AI.msgs.map(rowHtml).join('');AI.msgs.forEach(m=>m.fresh=false);
  aiList.scrollTop=aiList.scrollHeight;
}
function aiUpdate(m){document.getElementById('aiTitle').textContent=AI.title;const el=aiList.querySelector(`[data-row="${m.id}"]`),i=AI.msgs.indexOf(m);if(!el)return aiRender();const t=document.createElement('div');t.innerHTML=rowHtml(m,i);el.replaceWith(t.firstChild);m.fresh=false;aiList.scrollTop=aiList.scrollHeight}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function stream(m,text){m.text='';for(let i=0;i<text.length;i+=3){m.text=text.slice(0,i+3);aiUpdate(m);await wait(28)}m.text=text;aiUpdate(m)}
async function streamThink(m,text){for(let i=0;i<text.length;i+=4){m.thinking=text.slice(0,i+4);aiUpdate(m);await wait(22)}}

function setOpen(v){
  AI.open=v;if(v&&(S.page==='home'||S.page==='repos'))go('files');
  aiEl.classList.toggle('on',v);document.getElementById('aiBtn').classList.toggle('on',v);
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('ai-open',v));
  if(v&&!AI.msgs.length&&!aiEl.querySelector('.empty'))aiReset();
  if(v)setTimeout(()=>aiInput.focus({preventScroll:true}),420);
  if(typeof markConsole==='function')markConsole();
}
document.getElementById('aiBtn').onclick=()=>setOpen(!AI.open);
document.getElementById('aiClose').onclick=()=>setOpen(false);
document.getElementById('aiNew').onclick=()=>{if(AI.busy)return;aiReset(false)};
document.getElementById('aiHist').onclick=e=>{const b=e.currentTarget;menuAt(b,[{lb:'看看改动',chk:AI.title==='看看改动',sm:'刚刚',act:()=>aiReset(true)},{lb:'提交并推送',sm:'今天 10:42'},{lb:'解释 merge 冲突',sm:'昨天'},'-',{lb:'清空本仓库的对话…',danger:true}],{right:1,minW:240})};
document.getElementById('aiMore').onclick=e=>menuAt(e.currentTarget,[{lb:'复制整段对话'},{lb:'导出为 Markdown…'},'-',{lb:'模型与权限…',act:()=>{stab=1;DLG.settings()}}],{right:1,minW:220});
const _go2=go;go=p=>{_go2(p);if((p==='home'||p==='repos')&&AI.open){aiEl.classList.remove('on');document.getElementById('aiBtn').classList.remove('on')}else if(AI.open){aiEl.classList.add('on');document.getElementById('aiBtn').classList.add('on')}};

aiInput.addEventListener('input',()=>aiGo.disabled=!aiInput.value.trim()||AI.busy);
aiInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(aiInput.value)}});
aiGo.onclick=()=>send(aiInput.value);

aiEl.addEventListener('click',e=>{
  const c=e.target.closest('[data-chip]');if(c)return send(c.dataset.chip);
  const th=e.target.closest('[data-think]');if(th){const m=AI.msgs.find(x=>x.id==th.dataset.think);m.openThink=!m.openThink;return aiUpdate(m)}
  const cp=e.target.closest('[data-copy]');if(cp){const m=AI.msgs.find(x=>x.id==cp.dataset.copy);navigator.clipboard?.writeText(m.text).catch(()=>{});cp.innerHTML=svg('check');cp.style.color='var(--ok)';setTimeout(()=>{cp.innerHTML=svg('copy');cp.style.color=''},1400);return}
  const rt=e.target.closest('[data-retry]');if(rt&&!AI.busy){const m=AI.msgs.find(x=>x.id==rt.dataset.retry);return regenerate(m)}
  const cf=e.target.closest('[data-cf]');if(cf){const m=AI.msgs.find(x=>x.id==cf.dataset.m);return decide(m,cf.dataset.cf==='yes')}
});

async function send(text){
  text=text.trim();if(!text||AI.busy)return;
  aiInput.value='';aiGo.disabled=true;AI.busy=true;
  if(AI.title==='新对话')AI.title=text.length>14?text.slice(0,14)+'…':text;
  AI.msgs.forEach(m=>m.chips=[]);
  AI.msgs.push(msg('user',{text}));
  const a=msg('assistant',{live:true});AI.msgs.push(a);aiRender();
  await wait(500);
  if(/提交/.test(text)&&files.length)return planCommit(a);
  if(/diff|改了什么|改动/.test(text))return explainDiff(a);
  if(/最近一次提交|解释/.test(text))return explainCommit(a);
  await stream(a,'这是交互原型：小獭能演示「看改动 → 写提交说明 → 确认后提交并推送」这条完整流程。真实 App 里它会读仓库状态和 diff 再回答。');
  a.live=false;a.chips=['帮我写提交说明并提交','先看 diff'];aiUpdate(a);AI.busy=false;
}
async function explainDiff(a){
  a.steps=[{t:'读取 diff',d:'12 个文件 · +214 −61',s:'run'}];a.working='正在读取 diff…';aiUpdate(a);await wait(900);a.steps[0].s='done';aiUpdate(a);
  await stream(a,'主要三块：\n· `home_view.dart` 首页换成浮卡布局，加了「继续工作」卡片\n· `ambient_backdrop.dart` 新增背景环境层，颜色跟着仓库状态走\n· `ripple.dart` 按钮按下会扩散一圈波纹\n没有看到风险改动，可以直接提交。');
  a.live=false;a.chips=['帮我写提交说明并提交'];aiUpdate(a);AI.busy=false;
}
async function explainCommit(a){
  a.steps=[{t:'查看提交',d:'a1f3c9e · shaw · 刚刚',s:'done'}];aiUpdate(a);await wait(400);
  await stream(a,'`a1f3c9e feat(home): 首页与继续工作卡片` 把首页改成浮卡布局，仓库卡会显示未提交数和领先的提交数。');
  a.live=false;a.chips=['先看 diff'];aiUpdate(a);AI.busy=false;
}
async function planCommit(a){
  if(AI.title==='新对话'||AI.title==='看看改动')AI.title='提交推送';
  await streamThink(a,'用户要提交并推送。先全部暂存，按改动写一条 feat(home) 说明，提交后推送到 origin/dev。推送会改远端，要先问。');
  a.steps=[{t:'暂存全部改动',s:'run'},{t:'写提交说明',s:'wait'},{t:'提交并推送',s:'wait'}];aiUpdate(a);
  await wait(700);a.steps[0]={t:'暂存全部改动',d:'已暂存 '+files.length+' 个文件',s:'done'};a.steps[1].s='run';aiUpdate(a);
  await wait(800);a.steps[1]={t:'写提交说明',d:'feat(home): 首页与继续工作卡片',s:'done'};aiUpdate(a);
  a.confirm={title:'提交并推送到 origin/dev',body:'提交暂存的 '+files.length+' 个文件 → dev，并推送 origin/dev；领先 0 / 落后 0',paths:files.slice(0,3).map(f=>f[1]+f[2]).concat(files.length>3?['… 还有 '+(files.length-3)+' 个文件']:[])};
  a.live=false;aiUpdate(a);AI.busy=false;
}
async function decide(m,yes){
  if(AI.busy)return;AI.busy=true;m.confirm.done=true;
  if(!yes){m.steps[2].s='wait';m.steps[2].d='已取消';aiUpdate(m);const r=msg('assistant',{live:true});AI.msgs.push(r);aiRender();await stream(r,'好的，先不提交。改动都还在工作区，想好了再叫我。');r.live=false;r.chips=['帮我写提交说明并提交'];aiUpdate(r);AI.busy=false;return}
  m.live=true;m.steps[2].s='run';m.working='正在提交并推送…';aiUpdate(m);
  await wait(1100);
  const n=files.length;files=[];checked=new Set();sel=0;commitCount++;todayCount++;ahead=0;S.tone='calm';syncTone();
  m.steps[2]={t:'提交并推送',d:'a1f3c9e → origin/dev',s:'done'};
  await stream(m,'已提交并推送：'+n+' 个文件，提交 `a1f3c9e`。`dev` 与 `origin/dev` 同步，工作区干净。');
  m.live=false;m.chips=['解释最近一次提交'];aiUpdate(m);AI.busy=false;
  moment({scene:'push',title:'提交并推送成功',sub:'feat(home): 首页与继续工作卡片 · 今日第 '+todayCount+' 次提交'});
}
async function regenerate(m){
  AI.busy=true;const text=m.text;m.live=true;m.chips=[];aiUpdate(m);await wait(500);
  await stream(m,text);m.live=false;m.chips=AI.msgs.indexOf(m)===AI.msgs.length-1?['帮我写提交说明并提交','先看 diff']:[];aiUpdate(m);AI.busy=false;
}

/* 控制台 */
document.querySelector('#console .opt[data-k=dlg]').previousElementSibling.insertAdjacentHTML('beforebegin',`<h2>小獭 AI 助手</h2><div class="opt" data-k="ai"><button data-v="open">打开</button><button data-v="closed">收起</button><button data-ai="demo">示例对话</button><button data-ai="empty">新对话</button><button data-ai="run">一键演示提交</button></div><p>点工具栏右侧「小獭」也能开关。回复建议、确认卡、复制、重新生成都能点。</p>`);
document.getElementById('console').addEventListener('click',e=>{
  const b=e.target.closest('[data-k=ai] button');if(!b)return;e.stopImmediatePropagation();
  const v=b.dataset.v,x=b.dataset.ai;
  if(v)return setOpen(v==='open');
  setOpen(true);
  if(x==='demo')aiReset(true);else if(x==='empty')aiReset(false);
  else if(x==='run'){if(!files.length){files=[['M','lib/views/home/','home_view.dart'],['A','lib/widgets/otter/','ambient_backdrop.dart'],['A','lib/core/ui/','ripple.dart']];checked=new Set([0,1,2]);S.tone='warm';syncTone()}aiReset(true);setTimeout(()=>send('帮我写提交说明并提交'),300)}
},true);
const _mark=markConsole;markConsole=()=>{_mark();S.ai=AI.open?'open':'closed';document.querySelectorAll('#console [data-k=ai] [data-v]').forEach(b=>b.classList.toggle('on',S.ai===b.dataset.v))};
document.querySelectorAll('#aiPanel img[data-scene]').forEach(im=>face(im,im.dataset.scene));
