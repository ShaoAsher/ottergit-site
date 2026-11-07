/* v5 · 操作弹窗统一改造：分组卡片 + 单选行 / 开关行 + 实时「将执行」命令条 + 就地提示。
   同一能力只用一种组件（见 方案.md §9）：多选一 = .fl-opt，布尔 = .fl-tg，选分支 = selBtn，输入 = ein。 */
(()=>{
document.head.insertAdjacentHTML('beforeend',`<style>
.op-cmd{display:flex;align-items:center;gap:10px;margin:16px 0 4px;padding:9px 8px 9px 12px;border-radius:12px;background:var(--field);border:.5px solid var(--line);transition:background .5s}
.op-cmd .l{font-size:11px;font-weight:700;letter-spacing:.4px;color:var(--lo);flex:none}
.op-cmd code{flex:1;min-width:0;font:12px/18px var(--mono);color:var(--hi);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.op-cmd code i{font-style:normal;color:var(--lo)}
.op-cmd.flash{background:color-mix(in srgb,var(--accent) 14%,var(--field));transition:none}
.op-msg{font-size:12px;display:flex;align-items:center;gap:6px;color:var(--lo);min-height:18px;margin:-4px 0 12px;animation:flswap .2s ease-out}
.op-msg b{font-family:var(--mono);color:var(--hi);font-weight:600}
.op-msg.err{color:var(--danger)} .op-msg.err b{color:var(--danger)} .op-msg.ok{color:var(--add)}
.op-msg .fix,.op-chip{font:600 12px var(--mono);padding:2px 9px;border-radius:999px;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);cursor:pointer;transition:.15s}
.op-chip{background:rgba(var(--ink),.06);color:var(--mid);border:.5px solid var(--line);font-weight:500}
.op-chip:hover{color:var(--hi);border-color:color-mix(in srgb,var(--accent) 45%,transparent)}
.op-chip.on{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 50%,transparent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.op-chips{display:flex;gap:6px;flex-wrap:wrap;margin:-2px 0 12px}
.op-flow{display:grid;grid-template-columns:1fr 44px 1fr;align-items:end;gap:6px}
.op-flow .ar{height:40px;display:grid;place-items:center}
.op-flow .ar svg{width:40px;height:14px}
.op-flow .ar path{stroke:var(--accent);stroke-width:1.8;fill:none;stroke-dasharray:4 3;animation:fldash .9s linear infinite}
.op-fixed{height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:var(--r-sm);border:.5px dashed var(--line);font:13px var(--mono);color:var(--mid)}
.op-fixed svg{width:16px;height:16px;stroke:var(--lo);fill:none;stroke-width:1.8}
.op-kv{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:12.5px;padding:12px 16px}
.op-kv span{color:var(--lo)} .op-kv b{font-weight:600;color:var(--hi);font-family:var(--mono);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.op-host{display:inline-flex;align-items:center;gap:6px;font:600 11.5px -apple-system,"PingFang SC",sans-serif;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--c,var(--accent)) 14%,transparent);color:color-mix(in srgb,var(--c,var(--accent)) var(--tt),var(--hi))}
.op-sw{display:flex;gap:10px}
.op-sw span{width:28px;height:28px;border-radius:9px;cursor:pointer;transition:transform .18s var(--ease),box-shadow .18s}
.op-sw span:hover{transform:translateY(-2px)}
.op-sw span.on{box-shadow:0 0 0 2px var(--raised),0 0 0 4px var(--c);transform:scale(1.06)}
.op-fold{overflow:hidden;transition:max-height .28s var(--ease),opacity .2s;max-height:240px}
.op-fold.off{max-height:0;opacity:0}
.op-rb{display:grid;grid-template-columns:16px 86px 64px 1fr;gap:10px;align-items:center;padding:9px 14px;cursor:grab;transition:background .15s,opacity .2s}
.op-rb+.op-rb{border-top:.5px solid rgba(var(--ink),.06)}
.op-rb:hover{background:rgba(var(--ink),.025)}
.op-rb.drag{opacity:.4} .op-rb.over{box-shadow:inset 0 2px 0 var(--accent)}
.op-rb svg.gp{width:14px;height:14px;stroke:var(--lo);fill:none;stroke-width:2}
.op-rb .op{height:26px;border-radius:999px;border:.5px solid var(--line);background:var(--field);font:600 12px var(--mono);color:var(--c,var(--hi));cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px}
.op-rb .h{font:12px var(--mono);color:var(--lo)}
.op-rb .s{font-size:13px;color:var(--hi);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.op-rb.drop .s,.op-rb.drop .h{text-decoration:line-through;opacity:.5}
.op-rb.fold .s{padding-left:14px;position:relative} .op-rb.fold .s::before{content:"↳";position:absolute;left:0;color:var(--lo)}
.op-found .fl-tg .tx b{font-family:var(--mono);font-size:13px}
.op-found .fl-tg.dis{opacity:.45}
</style>`);

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const BAD=/[\s~^:?*\[\\]|\.\.|^\/|\/$|\.lock$|@\{/;
const fixName=v=>v.replace(/[\s~^:?*\[\\]+/g,'-').replace(/\.{2,}/g,'.').replace(/^\/+|\/+$/g,'').replace(/\.lock$/,'');
const BRANCHES=['dev','main','release','feat/windows','feat/tray'];
const TAGS=['v2.0.1','v2.0.0','v1.9.3'];

/* 操作页外壳：沿用编辑页的头 / 底栏，主按钮按场景改名、可标危险；done() 返回结果页参数。 */
function opShell({icon,color,title,sub,body,go,idle='',w=600,done}){
  edShell(icon,color,title,sub,body,{foot:idle});
  const dlg=scrim.querySelector('.dlg');if(w!==600)dlg.style.width=w+'px';
  const save=document.getElementById('edSave'),st=document.getElementById('edSt');st.dataset.idle=idle;
  save.textContent=go;
  const api={save,st,
    set(ok,msg,{label,danger}={}){save.disabled=!ok;st.classList.toggle('dirty',!!ok);st.querySelector('span').textContent=msg||idle;if(label)save.textContent=label;save.classList.toggle('danger',!!danger)}};
  save.onclick=()=>{const r=done();closeDlg();setTimeout(()=>moment(r),280)};
  scrim.querySelectorAll('.ein input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'&&!save.disabled)save.click()}));
  wireForm();
  return api;
}
const opt=(k,on,b,s,{dz}={})=>`<div class="fl-opt ${on?'on':''}" data-k="${k}"><span class="rd"></span><div class="tx"><b${dz?' style="color:var(--danger)"':''}>${b}</b><span>${s}</span></div></div>`;
const tg=(k,on,b,s,dis)=>`<div class="fl-tg ${dis?'dis':''}" data-k="${k}"><div class="tx"><b>${b}</b><span>${s}</span></div><span class="sw ${on?'on':''}"></span></div>`;
const cmdBar=id=>`<div class="op-cmd" id="${id}"><span class="l">将执行</span><code></code>${eib('copy','复制命令','','data-cp')}</div>`;
function setCmd(id,lines){const bar=document.getElementById(id);if(!bar)return;const html=lines.filter(Boolean).map(l=>`<i>$</i> ${esc(l)}`).join('<br>');const c=bar.querySelector('code');
  if(c.innerHTML!==html){c.innerHTML=html;c.style.whiteSpace=lines.filter(Boolean).length>1?'normal':'nowrap';bar.classList.add('flash');requestAnimationFrame(()=>requestAnimationFrame(()=>bar.classList.remove('flash')))}
  bar.querySelector('[data-cp]').onclick=e=>{e.stopPropagation();const b=e.currentTarget;b.innerHTML=svg('check');setTimeout(()=>b.innerHTML=svg('copy'),1100)}}
function wireOpts(box,cb){box.querySelectorAll('.fl-opt').forEach(o=>o.onclick=()=>{box.querySelectorAll('.fl-opt').forEach(x=>x.classList.toggle('on',x===o));cb(o.dataset.k)})}
function wireTgs(box,state,cb){box.querySelectorAll('.fl-tg').forEach(r=>r.onclick=()=>{if(r.classList.contains('dis'))return;const k=r.dataset.k;state[k]=!state[k];r.querySelector('.sw').classList.toggle('on',state[k]);cb(k)})}
const msg=(el,cls,html)=>{if(el.dataset.h===cls+html)return;el.dataset.h=cls+html;el.className='op-msg '+cls;el.innerHTML=html};
const selVal=id=>scrim.querySelector(`[data-sel="${id}"] .v`)?.textContent;
/* 选择器（selBtn）的值变了也要刷新：菜单项点完才写回，轮询比改 wireForm 更省事。 */
function watchSel(cb){let last='';const t=setInterval(()=>{if(!scrim.querySelector('.dlg.ed')){clearInterval(t);return}const now=[...scrim.querySelectorAll('[data-sel] .v')].map(v=>v.textContent).join('|');if(now!==last){last=now;cb()}},150)}

/* 新建分支 */
function branch(){
  const S={sw:true,push:false};let from='cur';
  const api=opShell({icon:'branch',color:'var(--accent)',title:'新建分支',sub:'从当前位置或指定分支开出',go:'创建',idle:'起个名字就能创建',
    body:`<div class="slabel" style="margin-top:2px">名称</div><div class="egroup pad">${efield('分支名',ein('',{id:'nbName',ph:'feat/ambient-backdrop'}))}
      <div class="op-chips" id="nbPre">${['feat/','fix/','chore/','docs/','refactor/'].map(p=>`<span class="op-chip" data-p="${p}">${p}</span>`).join('')}</div><div class="op-msg" id="nbMsg"></div></div>
      <div class="slabel">从哪里开出</div><div class="egroup" id="nbFrom">${opt('cur',1,'当前分支 dev 最新','<code>a1f3c9e</code> feat(home): 首页与继续工作卡片')}${opt('pick',0,'指定分支','比如从 main 开出修复分支')}
      <div class="op-fold off" id="nbPick" style="padding:0 14px 12px 44px">${selBtn('branch','main')}</div></div>
      <div class="slabel">创建后</div><div class="egroup" id="nbTg">${tg('sw',1,'切换到新分支','马上在新分支上工作 · <code>git switch</code>')}${tg('push',0,'推送并建立跟踪','同事可以看到这个分支 · <code>git push -u origin</code>')}</div>${cmdBar('nbCmd')}`,
    done:()=>({scene:'ok',title:'已创建 '+name(),sub:S.sw?'已切换到新分支':'仍停在 dev'})});
  const inp=document.getElementById('nbName'),name=()=>inp.value.trim();
  const base=()=>from==='cur'?'dev':selVal('branch');
  const refresh=()=>{const v=name(),m=document.getElementById('nbMsg');let ok=false;
    if(!v)msg(m,'','分支名一般用「类型/简述」，点上面的前缀快速开头');
    else if(BAD.test(v)){const f=fixName(v);msg(m,'err',`不能有空格和 ~ ^ : ? * [ \\，也不能以 / 开头或结尾${f?`<span class="fix" data-fix="${esc(f)}">改成 ${esc(f)}</span>`:''}`)}
    else if(BRANCHES.includes(v))msg(m,'err',`已经有 <b>${esc(v)}</b> 了，换个名字`);
    else{ok=true;msg(m,'ok',`✓ 将从 <b>${base()}</b> 开出 <b>${esc(v)}</b>`)}
    m.querySelector('[data-fix]')?.addEventListener('click',e=>{inp.value=e.target.dataset.fix;refresh();inp.focus()});
    document.querySelectorAll('#nbPre .op-chip').forEach(c=>c.classList.toggle('on',v.startsWith(c.dataset.p)));
    api.set(ok,ok?`${v} ← ${base()}`:'');
    const n=v||'<分支名>';setCmd('nbCmd',[S.sw?`git switch -c ${n} ${base()}`:`git branch ${n} ${base()}`,S.push&&`git push -u origin ${n}`]);};
  document.querySelectorAll('#nbPre .op-chip').forEach(c=>c.onclick=()=>{const rest=name().replace(/^[a-z]+\//,'');inp.value=c.dataset.p+rest;inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);refresh()});
  wireOpts(document.getElementById('nbFrom'),k=>{from=k;document.getElementById('nbPick').classList.toggle('off',k!=='pick');refresh()});
  wireTgs(document.getElementById('nbTg'),S,refresh);inp.oninput=refresh;watchSel(refresh);refresh();setTimeout(()=>inp.focus(),60);
}

/* 打标签：版本号建议、附注/轻量、可选推送 */
function tag(){
  const h=typeof HASH!=='undefined'?HASH[hsel]:'a1f3c9e',c=typeof COMMITS!=='undefined'?COMMITS[hsel][0]:'feat(home): 首页';
  const S={push:true};let kind='a';
  const api=opShell({icon:'tag',color:'var(--memory)',title:'打标签',sub:`目标 <span class="chip">${h}</span> ${esc(c)}`,go:'创建标签',idle:'填好标签名就能创建',
    body:`<div class="slabel" style="margin-top:2px">标签名</div><div class="egroup pad">${efield('名称',ein('',{id:'tgName',ph:'v2.0.2'}))}
      <div class="op-chips">${[['v2.0.2','补丁'],['v2.1.0','次版本'],['v3.0.0','主版本']].map(([v,l])=>`<span class="op-chip" data-v="${v}" title="${l}">${v}<small style="margin-left:6px;opacity:.6;font-family:-apple-system">${l}</small></span>`).join('')}</div><div class="op-msg" id="tgMsg"></div></div>
      <div class="slabel">类型</div><div class="egroup" id="tgKind">${opt('a',1,'附注标签（推荐）','带说明和打标签的人，发布版本用这个 · <code>-a</code>')}
      <div class="op-fold" id="tgNote" style="padding:0 14px 12px 44px">${ein('',{id:'tgMsgIn',mono:0,ph:'这一版改了什么，比如：琥珀金主题 + 全屏对比'})}</div>${opt('l',0,'轻量标签','只是一个名字指向这个提交')}</div>
      <div class="slabel">创建后</div><div class="egroup" id="tgTg">${tg('push',1,'推送到 origin','别人拉取后就能看到 · <code>git push origin &lt;标签&gt;</code>')}</div>${cmdBar('tgCmd')}`,
    done:()=>({scene:'proud',title:'标签已创建',sub:name()+(S.push?' · 已推送到 origin':'')})});
  const inp=document.getElementById('tgName'),note=document.getElementById('tgMsgIn'),name=()=>inp.value.trim();
  const refresh=()=>{const v=name(),m=document.getElementById('tgMsg');let ok=false;
    if(!v)msg(m,'','最近的标签是 <b>v2.0.1</b>，点上面的建议直接用');
    else if(BAD.test(v))msg(m,'err','标签名不能有空格和 ~ ^ : ? * [ \\');
    else if(TAGS.includes(v))msg(m,'err',`<b>${esc(v)}</b> 已经存在，打在 e03f5b2 上`);
    else{ok=true;msg(m,'ok',`✓ 将在 <b>${h}</b> 上打 <b>${esc(v)}</b>`)}
    document.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on',x.dataset.v===v));
    api.set(ok,ok?`${v} → ${h}`:'');
    const n=v||'<标签>',mm=note.value.trim();
    setCmd('tgCmd',[kind==='a'?`git tag -a ${n} ${h} -m "${mm||n}"`:`git tag ${n} ${h}`,S.push&&`git push origin ${n}`])};
  document.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{inp.value=x.dataset.v;refresh();note.focus()});
  wireOpts(document.getElementById('tgKind'),k=>{kind=k;document.getElementById('tgNote').classList.toggle('off',k!=='a');refresh()});
  wireTgs(document.getElementById('tgTg'),S,refresh);inp.oninput=refresh;note.oninput=refresh;refresh();setTimeout(()=>inp.focus(),60);
}

/* 克隆：识别地址（平台 / 协议 / 仓库名），自动填文件夹名，提示重名 */
function clone(){
  const S={sub:true,shallow:false,open:true};
  const api=opShell({icon:'clone',color:'var(--memory)',title:'克隆远程仓库',sub:'粘贴地址就行，HTTPS 和 SSH 都可以',go:'克隆',idle:'粘贴一个仓库地址',
    body:`<div class="slabel" style="margin-top:2px">仓库地址</div><div class="egroup pad">${efield('地址',ein('',{id:'clUrl',ph:'https://github.com/owner/repo.git'}))}<div class="op-msg" id="clMsg"></div></div>
      <div class="slabel">保存到</div><div class="egroup pad"><div class="erow2">${efield('位置',selBtn('path','~/Desktop/code','folder'))}${efield('文件夹名',ein('',{id:'clName',ph:'repo'}))}</div><div class="op-msg" id="clPath"></div></div>
      <div class="slabel">选项</div><div class="egroup" id="clTg">${tg('sub',1,'同时克隆子模块','仓库里引用的其它仓库一起拉下来 · <code>--recurse-submodules</code>')}${tg('shallow',0,'浅克隆','只取最近 1 个提交，大仓库更快 · <code>--depth 1</code>')}${tg('open',1,'克隆后立即打开','完成后直接进入这个仓库')}</div>${cmdBar('clCmd')}`,
    done:()=>({scene:'great',title:'克隆完成',sub:(document.getElementById('clName').value||'repo')+' 已添加到「仓库」'})});
  const url=document.getElementById('clUrl'),nm=document.getElementById('clName');let touched=false;
  const parse=u=>{u=u.trim();let m=u.match(/^(?:https?:\/\/)(?:[^@/]+@)?([^/]+)\/(.+?)\/([^/]+?)(?:\.git)?\/?$/);if(m)return{proto:'HTTPS',host:m[1],owner:m[2],repo:m[3]};
    m=u.match(/^(?:ssh:\/\/)?git@([^:/]+)[:/](.+?)\/([^/]+?)(?:\.git)?$/);if(m)return{proto:'SSH',host:m[1],owner:m[2],repo:m[3]};return null};
  const HOST={'github.com':['GitHub','var(--hi)'],'gitee.com':['Gitee','var(--danger)'],'gitlab.com':['GitLab','var(--warn,#e0a63a)']};
  const refresh=()=>{const p=parse(url.value),m=document.getElementById('clMsg');
    if(!url.value.trim())msg(m,'','支持 GitHub / Gitee / GitLab 和自建服务器');
    else if(!p)msg(m,'err','看起来不像仓库地址，应该类似 <b>https://github.com/owner/repo.git</b>');
    else{const [hn,hc]=HOST[p.host]||[p.host,'var(--accent)'];msg(m,'ok',`<span class="op-host" style="--c:${hc}">${hn}</span><span class="op-host">${p.proto}</span><b>${esc(p.owner)}/${esc(p.repo)}</b>${p.proto==='SSH'?'<span style="color:var(--lo)">· 需要已配置 SSH 密钥</span>':''}`)}
    if(p&&!touched)nm.value=p.repo;
    const n=nm.value.trim(),dir=selVal('path'),pm=document.getElementById('clPath'),exists=['otter-notes','OtterGitApp'].includes(n);
    if(!n)msg(pm,'','');else if(exists)msg(pm,'err',`<b>${dir}/${esc(n)}</b> 已经存在，换个文件夹名`);else msg(pm,'',`会放在 <b>${dir}/${esc(n)}</b>`);
    const ok=!!p&&!!n&&!exists;api.set(ok,ok?`${p.owner}/${p.repo} → ${dir}/${n}`:'');
    setCmd('clCmd',[`git clone${S.sub?' --recurse-submodules':''}${S.shallow?' --depth 1':''} ${url.value.trim()||'<地址>'} ${dir}/${n||'<文件夹>'}`])};
  url.oninput=refresh;nm.oninput=()=>{touched=!!nm.value;refresh()};wireTgs(document.getElementById('clTg'),S,refresh);watchSel(refresh);refresh();setTimeout(()=>url.focus(),60);
  const old=api.save.onclick;api.save.onclick=()=>{const n=nm.value.trim();progress(['连接远端','接收对象 1,284 / 1,284','解析差异','检出 main'],()=>{if(typeof RLIST!=='undefined')RLIST.unshift([n,'~/Desktop/code/'+n,'main','个人','#4FD79A',0,0,0,'Initial commit','刚刚','刚刚',0]);old()})};
}

/* 扫描文件夹 */
function scan(){
  const S={skip:true};let depth='3';
  const api=opShell({icon:'scan',color:'var(--alt)',title:'扫描文件夹',sub:'找出目录里所有的 Git 仓库，一次加进来',go:'开始扫描',idle:'选好目录就能开始',
    body:`<div class="slabel" style="margin-top:2px">范围</div><div class="egroup pad">${efield('扫描目录',selBtn('path','~/Desktop/code','folder'))}${efield('最大深度',`<div class="tmode" id="scDepth">${['2','3','5'].map(d=>`<button class="${d===depth?'on':''}" data-d="${d}">${d} 层</button>`).join('')}</div>`,{small:'层数越多越慢'})}</div>
      <div class="egroup" id="scTg" style="margin-top:12px">${tg('skip',1,'跳过依赖和构建目录','node_modules、build、.dart_tool 里不会有你的仓库')}</div>`,
    done:()=>({scene:'great',title:'已添加仓库',sub:'可以在「仓库」里给它们分组'})});
  const upd=()=>api.set(true,`扫描 ${selVal('path')} · 最多 ${depth} 层${S.skip?' · 跳过依赖目录':''}`);
  document.querySelectorAll('#scDepth button').forEach(b=>b.onclick=()=>{depth=b.dataset.d;document.querySelectorAll('#scDepth button').forEach(x=>x.classList.toggle('on',x===b));upd()});
  wireTgs(document.getElementById('scTg'),S,upd);watchSel(upd);upd();
  api.save.onclick=()=>progress(['遍历目录','识别 .git','读取分支与状态'],()=>{
    const F=[['otter-notes','~/Desktop/code/otter-notes',1],['Game','~/Desktop/code/Game',1],['Apple','~/Desktop/code/Apple',1],['_gen_raw','~/Desktop/code/_gen_raw',0],['legacy-site','~/Desktop/code/old/legacy-site',1],['OtterGitApp','已在列表中',-1],['GameTime','已在列表中',-1]];
    const Sel={};F.forEach(([n,,s])=>Sel[n]=s>0);
    scrim.querySelector('.ebody').innerHTML=`<div class="fl-ok" style="margin-top:4px">${svg('check')}<span>找到 ${F.length} 个仓库，其中 ${F.filter(f=>f[2]>=0).length} 个还没添加</span></div>
      <div class="slabel">要添加的<span class="lk" id="scAll">全选</span></div><div class="egroup op-found" id="scF">${F.map(([n,p,s])=>tg(n,s>0,n,p,s<0)).join('')}</div>`;
    const cnt=()=>Object.values(Sel).filter(Boolean).length;
    const upd=()=>{api.set(cnt()>0,`将添加 ${cnt()} 个仓库`,{label:`添加 ${cnt()} 个仓库`})};
    wireTgs(document.getElementById('scF'),Sel,upd);
    document.getElementById('scAll').onclick=()=>{F.forEach(([n,,s])=>{if(s>=0)Sel[n]=true});document.querySelectorAll('#scF .fl-tg:not(.dis) .sw').forEach(x=>x.classList.add('on'));upd()};
    api.save.onclick=()=>{const n=cnt();closeDlg();setTimeout(()=>moment({scene:'great',title:`已添加 ${n} 个仓库`,sub:'可以在「仓库」里给它们分组'}),280)};
    upd();});
}

/* 合并：来源 → 当前（流动箭头），预演结果，策略 */
function merge(){
  const S={del:false};let how='noff';
  const PRE={'feat/windows':[3,5,0],'release':[6,14,0],'main':[1,2,0],'feat/tray':[4,7,2]};
  const api=opShell({icon:'merge',color:'var(--alt)',title:'合并分支',sub:'把另一个分支的提交合进当前分支',go:'合并',idle:'',
    body:`<div class="slabel" style="margin-top:2px">方向</div><div class="egroup pad"><div class="op-flow">${efield('合并',selBtn('branch','feat/windows'))}<div class="ar" style="margin-bottom:12px"><svg viewBox="0 0 40 14"><path d="M2 7H34M28 2l6 5-6 5"/></svg></div>${efield('到当前分支',`<div class="op-fixed">${svg('branch')}dev</div>`)}</div></div>
      <div id="mgPre" style="margin-top:12px"></div>
      <div class="slabel">方式</div><div class="egroup" id="mgHow">${opt('ff',0,'能快进就快进','历史保持一条直线，不能快进时再创建合并提交 · <code>--ff</code>')}${opt('noff',1,'总是创建合并提交（推荐）','保留分支的完整形状，以后好追溯 · <code>--no-ff</code>')}${opt('squash',0,'压缩成一个提交','所有改动作为一次新提交，原分支历史不带过来 · <code>--squash</code>')}</div>
      <div class="egroup" id="mgTg" style="margin-top:12px"></div>${cmdBar('mgCmd')}`,
    done:()=>{const b=selVal('branch');return{scene:'great',title:'合并完成',sub:`${b} → dev · ${PRE[b]?.[0]??1} 个提交`}}});
  const refresh=()=>{const b=selVal('branch'),[n,f,cf]=PRE[b]||[1,1,0];
    document.getElementById('mgPre').innerHTML=b==='dev'?`<div class="fl-ok w">${svg('info')}<span>不能把分支合并到它自己，换一个来源分支</span></div>`:cf?`<div class="fl-ok w">${svg('info')}<span>预演发现 ${cf} 个文件会冲突（<code>theme.dart</code> 等），合并后需要先解决</span></div>`:`<div class="fl-ok">${svg('check')}<span>将合入 ${n} 个提交 · ${f} 个文件 · 已预演，没有冲突</span></div>`;
    document.getElementById('mgTg').innerHTML=tg('del',S.del,`合并后删除 ${esc(b)}`,'只删本地分支，远程的保留');wireTgs(document.getElementById('mgTg'),S,refresh);
    api.set(b!=='dev',b!=='dev'?`${b} → dev${cf?' · 有冲突需处理':''}`:'');
    setCmd('mgCmd',[`git merge ${how==='ff'?'--ff':how==='noff'?'--no-ff':'--squash'} ${b}`,how==='squash'&&'git commit',S.del&&`git branch -d ${b}`])};
  wireOpts(document.getElementById('mgHow'),k=>{how=k;refresh()});watchSel(refresh);refresh();
}

/* 重置：三种方式，硬重置变危险按钮 + 说清楚会丢什么 */
function reset(mode='mixed'){
  const h=typeof HASH!=='undefined'?HASH[hsel]:'7be2d40',c=typeof COMMITS!=='undefined'?COMMITS[hsel][0]:'';
  const after=typeof hsel!=='undefined'?hsel:2;
  const api=opShell({icon:'reset',color:'var(--warn)',title:'重置 dev 到此提交',sub:`<span class="chip">${h}</span> ${esc(c)}`,go:'重置',idle:'',w:600,
    body:`<div class="slabel" style="margin-top:2px">${after?`之后的 ${after} 个提交怎么处理`:'重置方式'}</div><div class="egroup" id="rsHow">${opt('soft',mode==='soft','软重置','提交撤掉，改动保留并且已暂存，适合重新整理提交 · <code>--soft</code>')}${opt('mixed',mode==='mixed','混合重置（默认）','提交撤掉，改动保留在工作区未暂存 · <code>--mixed</code>')}${opt('hard',mode==='hard','硬重置','提交和工作区里所有未提交的改动都丢掉 · <code>--hard</code>',{dz:1})}</div>
      <div id="rsWarn" style="margin-top:12px"></div>${cmdBar('rsCmd')}`,
    done:()=>({scene:'relief',title:'已重置',sub:`dev → ${h}（可在 Reflog 中找回）`})});
  const refresh=()=>{const hard=mode==='hard';
    document.getElementById('rsWarn').innerHTML=hard?`<div class="fl-ok w" style="background:color-mix(in srgb,var(--danger) 12%,transparent);color:color-mix(in srgb,var(--danger) var(--tt),var(--hi))">${svg('shield')}<span>会丢掉 <b>12 个未提交的改动</b>，这部分无法找回；撤掉的提交还能在 Reflog 里找到</span></div>`:`<div class="fl-ok">${svg('check')}<span>${mode==='soft'?'改动都会留在暂存区，随时可以重新提交':'改动都会留在工作区，什么都不会丢'}</span></div>`;
    api.set(true,`dev → ${h} · ${{soft:'软',mixed:'混合',hard:'硬'}[mode]}重置`,{label:hard?'硬重置':'重置',danger:hard});
    setCmd('rsCmd',[`git reset --${mode} ${h}`])};
  wireOpts(document.getElementById('rsHow'),k=>{mode=k;refresh()});refresh();
}

/* 暂存：自动起说明，文件构成一目了然 */
function stashSave(){
  const S={u:true,keep:false};
  const api=opShell({icon:'stash',color:'var(--win)',title:'暂存更改',sub:'先把没提交的改动收起来，之后随时放回',go:'暂存',idle:'',
    body:`<div class="slabel" style="margin-top:2px">说明</div><div class="egroup pad">${efield('写一句，方便以后认出来',ein('',{id:'stMsg',mono:0,ph:'WIP on dev: 首页与继续工作卡片'}),{small:'可留空'})}</div>
      <div class="slabel">要收起的改动</div><div class="egroup"><div class="op-kv" id="stKv"></div></div>
      <div class="slabel">选项</div><div class="egroup" id="stTg">${tg('u',1,'包含未跟踪的文件','新建还没加入 Git 的 3 个文件也一起收起 · <code>-u</code>')}${tg('keep',0,'保留已暂存的内容','已经 add 的部分留在原地 · <code>--keep-index</code>')}</div>${cmdBar('stCmd')}`,
    done:()=>({scene:'ok',title:'已暂存',sub:'stash@{0} · '+(document.getElementById('stMsg').value.trim()||'WIP on dev')})});
  const inp=document.getElementById('stMsg');
  const refresh=()=>{const n=8+(S.u?3:0)-(S.keep?2:0);
    document.getElementById('stKv').innerHTML=`<span>修改</span><b style="color:var(--mod,var(--memory))">6 个文件</b><span>删除</span><b style="color:var(--del)">2 个文件</b>${S.u?'<span>未跟踪</span><b style="color:var(--add)">3 个文件</b>':''}${S.keep?'<span>留在原地</span><b>2 个已暂存</b>':''}<span>暂存后</span><b style="font-family:inherit;color:var(--lo);font-weight:500">工作区${S.keep?'只剩已暂存的部分':'回到干净状态'}</b>`;
    api.set(true,`收起 ${n} 个文件`);
    setCmd('stCmd',[`git stash push${S.u?' -u':''}${S.keep?' --keep-index':''} -m "${inp.value.trim()||'WIP on dev: 首页与继续工作卡片'}"`])};
  inp.oninput=refresh;wireTgs(document.getElementById('stTg'),S,refresh);refresh();setTimeout(()=>inp.focus(),60);
}

/* 推送选项 */
function pushOpts(){
  const S={tags:false,up:true,force:false};
  const api=opShell({icon:'push',color:'var(--accent)',title:'推送',sub:'把本地提交送到远端',go:'推送',idle:'',
    body:`<div class="slabel" style="margin-top:2px">推到哪里</div><div class="egroup pad"><div class="op-flow">${efield('本地分支',`<div class="op-fixed">${svg('branch')}dev</div>`)}<div class="ar" style="margin-bottom:12px"><svg viewBox="0 0 40 14"><path d="M2 7H34M28 2l6 5-6 5"/></svg></div>${efield('远端',selBtn('remote','origin','cloud'))}</div>${efield('远端分支',selBtn('branch','dev'),{small:'一般和本地同名'})}</div>
      <div id="psSum" style="margin-top:12px"></div>
      <div class="slabel">选项</div><div class="egroup" id="psTg">${tg('up',1,'设为上游分支','以后直接点「推送 / 拉取」就是这里 · <code>-u</code>')}${tg('tags',0,'同时推送标签','本地新打的 1 个标签 v2.0.2 一起推上去 · <code>--tags</code>')}${tg('force',0,'强制推送（安全模式）','改写过历史时用；远端有别人新提交会拒绝 · <code>--force-with-lease</code>')}</div>${cmdBar('psCmd')}`,
    done:()=>({scene:'cheer',title:'推送完成',sub:`dev → ${selVal('remote')}/${selVal('branch')} · 3 个提交`})});
  const refresh=()=>{const r=selVal('remote'),b=selVal('branch');
    document.getElementById('psSum').innerHTML=S.force?`<div class="fl-ok w">${svg('shield')}<span>远端 ${r}/${b} 上有 1 个你本地没有的提交。安全模式下会被拒绝，先拉取再推更稳</span></div>`:`<div class="fl-ok">${svg('check')}<span>将推送 3 个提交到 <b>${r}/${b}</b>${b!=='dev'?' · 远端分支和本地不同名':''}</span></div>`;
    api.set(true,`dev → ${r}/${b}`,{label:S.force?'强制推送':'推送',danger:S.force});
    setCmd('psCmd',[`git push${S.up?' -u':''}${S.force?' --force-with-lease':''} ${r} dev${b!=='dev'?':'+b:''}`,S.tags&&`git push ${r} --tags`])};
  wireTgs(document.getElementById('psTg'),S,refresh);watchSel(refresh);refresh();
}

/* 拉取选项 */
function pullOpts(){
  const S={auto:true};let how='merge';
  const api=opShell({icon:'pull',color:'var(--accent)',title:'拉取',sub:'把远端的新提交取回并合进当前分支',go:'拉取',idle:'',
    body:`<div class="slabel" style="margin-top:2px">从哪里拉</div><div class="egroup pad"><div class="erow2">${efield('远端',selBtn('remote','origin','cloud'))}${efield('远端分支',selBtn('branch','dev'))}</div></div>
      <div id="plSum" style="margin-top:12px"></div>
      <div class="slabel">怎么合进来</div><div class="egroup" id="plHow">${opt('merge',1,'合并（默认）','两边都有新提交时生成一个合并提交')}${opt('rebase',0,'变基','把你的本地提交接到远端最新之后，历史是一条直线 · <code>--rebase</code>')}${opt('ff',0,'只允许快进','本地有新提交时直接停下，什么都不改 · <code>--ff-only</code>')}</div>
      <div class="egroup" id="plTg" style="margin-top:12px">${tg('auto',1,'自动暂存本地改动','拉之前把 12 个未提交改动收起来，拉完再放回 · <code>--autostash</code>')}</div>${cmdBar('plCmd')}`,
    done:()=>({scene:'clean',title:'拉取完成',sub:`${selVal('remote')}/${selVal('branch')} · 取回 2 个提交`})});
  const refresh=()=>{const r=selVal('remote'),b=selVal('branch');
    document.getElementById('plSum').innerHTML=how==='ff'?`<div class="fl-ok w">${svg('info')}<span>你本地有 3 个还没推送的提交，只允许快进时这次拉取会停下</span></div>`:`<div class="fl-ok">${svg('check')}<span>${r}/${b} 有 2 个新提交，你本地有 3 个未推送 · ${how==='rebase'?'你的 3 个会接到最后':'会生成一个合并提交'}</span></div>`;
    api.set(true,`${r}/${b} → dev`);
    setCmd('plCmd',[`git pull${how==='rebase'?' --rebase':how==='ff'?' --ff-only':''}${S.auto?' --autostash':''} ${r} ${b}`])};
  wireOpts(document.getElementById('plHow'),k=>{how=k;refresh()});wireTgs(document.getElementById('plTg'),S,refresh);watchSel(refresh);refresh();
}

/* 交互式变基：拖动排序、每行操作、实时结果小结 */
function rebaseI(){
  const OPS={pick:['保留','var(--hi)'],reword:['改说明','var(--accent)'],edit:['停下修改','var(--memory)'],squash:['合并（保留说明）','var(--alt)'],fixup:['合并（丢弃说明）','var(--alt)'],drop:['丢弃','var(--danger)']};
  const src=typeof COMMITS!=='undefined'?COMMITS:[['a'],['b'],['c'],['d'],['e']];
  const L=src.slice(0,5).map((c,i)=>({h:(typeof HASH!=='undefined'?HASH[i]:'0000000'),s:c[0],op:'pick'})).reverse();
  const api=opShell({icon:'edit',color:'var(--alt)',title:'交互式变基',sub:'dev 上最近 5 个提交 · 从旧到新，拖动调整顺序',go:'开始变基',idle:'',w:640,
    body:`<div class="slabel" style="margin-top:2px">提交<span class="c">点操作名切换</span></div><div class="egroup" id="rbL"></div><div id="rbSum" style="margin-top:12px"></div>${cmdBar('rbCmd')}`,
    done:()=>({scene:'great',title:'变基完成',sub:`${L.filter(r=>r.op!=='drop').length} 个提交 · ${L.filter(r=>/squash|fixup/.test(r.op)).length} 个已合并`})});
  const draw=()=>{const box=document.getElementById('rbL');
    box.innerHTML=L.map((r,i)=>`<div class="op-rb ${r.op==='drop'?'drop':''} ${/squash|fixup/.test(r.op)?'fold':''}" data-i="${i}" draggable="true"><svg class="gp" viewBox="0 0 24 24">${IC.grip||'<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>'}</svg><button class="op" data-op="${i}" style="--c:${OPS[r.op][1]}">${r.op}<span style="opacity:.5">▾</span></button><span class="h">${r.h}</span><span class="s">${esc(r.s)}</span></div>`).join('');
    box.querySelectorAll('[data-op]').forEach(b=>b.onclick=e=>{e.stopPropagation();const rr=rectOf(b),it=L[+b.dataset.op];openMenu(Object.entries(OPS).map(([o,[d]])=>({chk:o===it.op,lb:o,sm:d,danger:o==='drop',act:()=>{it.op=o;draw()}})),rr.l,rr.t+rr.h+4,{anchor:b})});
    let from;box.querySelectorAll('.op-rb').forEach(row=>{row.ondragstart=()=>{from=+row.dataset.i;row.classList.add('drag')};row.ondragend=()=>row.classList.remove('drag');
      row.ondragover=e=>{e.preventDefault();row.classList.add('over')};row.ondragleave=()=>row.classList.remove('over');row.ondrop=()=>{const to=+row.dataset.i;L.splice(to,0,L.splice(from,1)[0]);draw()}});
    const keep=L.filter(r=>r.op!=='drop').length,fold=L.filter(r=>/squash|fixup/.test(r.op)).length,drop=L.filter(r=>r.op==='drop').length,stop=L.filter(r=>/reword|edit/.test(r.op)).length;
    const first=/squash|fixup/.test(L[0].op);
    document.getElementById('rbSum').innerHTML=first?`<div class="fl-ok w">${svg('info')}<span>第一个提交前面没有可以合并进去的提交，改成 pick 或 reword</span></div>`:`<div class="fl-ok${drop?' w':''}">${svg(drop?'info':'check')}<span>变基后剩 <b>${keep-fold}</b> 个提交${fold?` · 合并 ${fold} 个`:''}${drop?` · 丢弃 ${drop} 个（可在 Reflog 找回）`:''}${stop?` · 中途会停下 ${stop} 次让你修改`:''}</span></div>`;
    api.set(!first,first?'':`${keep-fold} 个提交${drop?` · 丢弃 ${drop}`:''}`);
    setCmd('rbCmd',[`git rebase -i HEAD~${L.length}`])};
  draw();
}

/* 重命名仓库 / 新建分组：小表单也走同一套 */
function rename(){const r=typeof RLIST!=='undefined'?RLIST[RV.sel]:['otter-notes','~/Desktop/code/otter-notes'];
  const api=opShell({icon:'edit',color:'var(--accent)',title:'重命名仓库',sub:'只改列表里显示的名字，不动文件夹',go:'保存',idle:'',w:480,
    body:`<div class="egroup pad" style="margin-top:4px">${efield('显示名称',ein(r[0],{id:'rnName',mono:0}))}${efield('文件夹',`<div class="op-fixed">${svg('folder')}${esc(r[1])}</div>`,{small:'不会改动'})}</div>`,
    done:()=>({scene:'clean',title:'已重命名',sub:document.getElementById('rnName').value.trim()})});
  const inp=document.getElementById('rnName');const refresh=()=>{const v=inp.value.trim();api.set(!!v&&v!==r[0],v&&v!==r[0]?`${r[0]} → ${v}`:'')};inp.oninput=refresh;refresh();setTimeout(()=>selectEnd(inp),60)}
function newGroup(){const C=['#FFC23D','#6CC9FF','#B8A8FF','#4FD79A','#FF8AB8','#FF8A3D'];let c=C[0];
  const api=opShell({icon:'group',color:'var(--accent)',title:'新建分组',sub:'把相关的仓库放在一起',go:'创建',idle:'起个名字',w:480,
    body:`<div class="egroup pad" style="margin-top:4px">${efield('分组名',ein('',{id:'ngName',mono:0,ph:'比如：开源、公司、练手'}))}${efield('颜色',`<div class="op-sw" id="ngSw">${C.map((x,i)=>`<span class="${i?'':'on'}" data-c="${x}" style="background:${x};--c:${x}"></span>`).join('')}</div>`)}</div>`,
    done:()=>({scene:'ok',title:'分组已创建',sub:document.getElementById('ngName').value.trim()})});
  const inp=document.getElementById('ngName');const refresh=()=>{const v=inp.value.trim();api.set(!!v,v?`「${v}」`:'');api.st.querySelector('i').style.background=c};
  document.querySelectorAll('#ngSw span').forEach(s=>s.onclick=()=>{c=s.dataset.c;document.querySelectorAll('#ngSw span').forEach(x=>x.classList.toggle('on',x===s));refresh()});
  inp.oninput=refresh;refresh();setTimeout(()=>inp.focus(),60)}

/* 新建本地仓库：位置 + 名称、默认分支胶囊、README / .gitignore（按技术栈多选）/ 首个提交 */
function initRepo(){
  const S={readme:true,ign:true,commit:true},ST=new Set(['macOS']);let br='main';
  const api=opShell({icon:'plus',color:'var(--accent)',title:'新建本地仓库',sub:'在电脑上建一个新的 Git 仓库',go:'创建仓库',idle:'选好位置、起个名字',
    body:`<div class="slabel" style="margin-top:2px">放在哪里</div><div class="egroup pad"><div class="erow2">${efield('位置',selBtn('path','~/Desktop/code','folder'))}${efield('仓库名',ein('',{id:'irName',ph:'my-project'}))}</div><div class="op-msg" id="irMsg"></div></div>
      <div class="slabel">默认分支</div><div class="egroup pad">${ein('main',{id:'irBr'})}<div class="op-chips" style="margin-top:10px" id="irBrs">${['main','master','develop'].map(b=>`<span class="op-chip" data-b="${b}">${b}</span>`).join('')}</div></div>
      <div class="slabel">初始内容</div><div class="egroup" id="irTg">${tg('readme',1,'添加 README.md','写上仓库名，首页一眼认出')}${tg('ign',1,'添加 .gitignore','按项目类型忽略依赖和构建产物')}
      <div class="op-fold" id="irSt" style="padding:0 14px 10px"><div class="op-chips" style="margin:0">${['macOS','Flutter','Node','Python','Java','Go','Rust','IDE'].map(x=>`<span class="op-chip" data-s="${x}" style="font-family:-apple-system">${x}</span>`).join('')}</div></div>${tg('commit',1,'创建首个提交','把上面的文件提交为 Initial commit')}</div>${cmdBar('irCmd')}`,
    done:()=>({scene:'branch',title:'仓库已创建',sub:document.getElementById('irName').value.trim()+' · '+br})});
  const nm=document.getElementById('irName'),bi=document.getElementById('irBr');
  const refresh=()=>{const n=nm.value.trim(),m=document.getElementById('irMsg');br=bi.value.trim();const path=`${selVal('path')}/${n}`;
    if(!n)msg(m,'','仓库名就是文件夹名');else if(n==='OtterGitApp')msg(m,'err','这里已经是 Git 仓库，将直接打开');else msg(m,'ok',`✓ 将创建 <b>${esc(path)}</b>`);
    document.querySelectorAll('#irBrs .op-chip').forEach(c=>c.classList.toggle('on',c.dataset.b===br));
    document.querySelectorAll('#irSt .op-chip').forEach(c=>c.classList.toggle('on',ST.has(c.dataset.s)));
    document.getElementById('irSt').classList.toggle('off',!S.ign);
    api.set(!!n&&!!br,n?`${n} · ${br}`:'');
    const f=[S.readme&&'README.md',S.ign&&'.gitignore'].filter(Boolean);
    setCmd('irCmd',[`git init -b ${br||'main'} ${path}`,f.length&&`touch ${f.join(' ')}`,S.commit&&'git add -A && git commit -m "Initial commit"'])};
  document.querySelectorAll('#irBrs .op-chip').forEach(c=>c.onclick=()=>{bi.value=c.dataset.b;refresh()});
  document.querySelectorAll('#irSt .op-chip').forEach(c=>c.onclick=()=>{ST.has(c.dataset.s)?ST.delete(c.dataset.s):ST.add(c.dataset.s);refresh()});
  wireTgs(document.getElementById('irTg'),S,refresh);nm.oninput=refresh;bi.oninput=refresh;watchSel(refresh);refresh();setTimeout(()=>nm.focus(),60);
}

/* 添加本地仓库：选文件夹后自动识别（分支 / 远程 / 子目录 / 不是仓库可顺手初始化），可选分组 */
function addLocal(){
  const S={init:true};let g='';const PICK=['~/Desktop/code/otter-notes','~/Desktop/code/OtterGitApp/lib','~/Downloads/demo'];let i=-1;
  const api=opShell({icon:'folder',color:'var(--accent)',title:'添加本地仓库',sub:'把电脑上已有的仓库加到列表',go:'添加',idle:'选一个文件夹',
    body:`<div class="slabel" style="margin-top:2px">文件夹</div><div class="egroup pad"><div class="op-fixed" id="alPick" style="cursor:pointer;border-style:solid;background:var(--field)">${svg('folder')}<span id="alPath" style="flex:1">点这里选择文件夹</span><b style="font:600 12px -apple-system;color:var(--mid)">选择…</b></div><div id="alSt"></div></div>
      <div id="alInit" class="op-fold off"><div class="egroup" style="margin-top:12px" id="alTg">${tg('init',1,'初始化为 Git 仓库','在这里执行 git init，再加到列表')}</div></div>
      <div class="slabel">分组</div><div class="egroup pad"><div class="op-chips" style="margin:0" id="alG">${['','工作','开源','练手'].map(x=>`<span class="op-chip" data-g="${x}" style="font-family:-apple-system">${x||'不分组'}</span>`).join('')}</div></div>${cmdBar('alCmd')}`,
    done:()=>({scene:'ok',title:'已添加',sub:PICK[i]})});
  const refresh=()=>{const p=PICK[i],st=document.getElementById('alSt');let ok=false,go='添加',cmd=[];
    document.querySelectorAll('#alG .op-chip').forEach(c=>c.classList.toggle('on',c.dataset.g===g));
    document.getElementById('alInit').classList.toggle('off',i!==2);
    if(i<0){st.innerHTML='<div class="op-msg" style="margin:10px 0 0">点「选择…」找到仓库所在的文件夹（每点一次换一个示例）</div>'}
    else if(i===0){ok=true;st.innerHTML=`<div class="fl-ok" style="margin-top:12px">${svg('branch')}<span>Git 仓库 · 当前分支 <b>main</b> · 远程 <b>origin</b></span></div>`;cmd=[`git -C ${p} status`]}
    else if(i===1){ok=true;st.innerHTML=`<div class="fl-ok" style="margin-top:12px">${svg('branch')}<span>Git 仓库 · 当前分支 <b>dev</b><br>这是仓库里的子文件夹，将添加整个仓库 <b>~/Desktop/code/OtterGitApp</b></span></div>`;cmd=['git -C ~/Desktop/code/OtterGitApp status']}
    else{ok=S.init;go='初始化并添加';st.innerHTML=`<div class="fl-ok w" style="margin-top:12px">${svg('info')}<span>这个文件夹还不是 Git 仓库</span></div>`;cmd=[S.init&&`git init ${p}`,`git -C ${p} status`]}
    if(i>=0)document.getElementById('alPath').textContent=p;
    api.set(ok,ok?p.split('/').pop()+(g?` · ${g}`:''):'',{label:go});setCmd('alCmd',cmd.length?cmd:['git -C <文件夹> status'])};
  document.getElementById('alPick').onclick=()=>{i=(i+1)%PICK.length;refresh()};
  document.querySelectorAll('#alG .op-chip').forEach(c=>c.onclick=()=>{g=c.dataset.g;refresh()});
  wireTgs(document.getElementById('alTg'),S,refresh);refresh();
}

/* 新建远程仓库 + 关联：选平台 / 名称 / 可见性 → 打开网页 → 粘贴地址 → 关联当前仓库或克隆 */
function createRemote(){
  let host='GitHub',vis='private',after='link';
  const HC={GitHub:'var(--hi)',GitLab:'#FC6D26',Gitee:'#C71D23'};
  const api=opShell({icon:'cloud',color:'var(--memory)',title:'新建远程仓库',sub:'在托管平台建好后，关联当前仓库或克隆下来',go:'关联并推送',idle:'先在网页上建好仓库，再粘贴地址',
    body:`<div class="slabel" style="margin-top:2px">平台</div><div class="egroup pad"><div class="op-chips" id="crH">${Object.keys(HC).map(h=>`<span class="op-chip" data-h="${h}" style="font-family:-apple-system"><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${HC[h]};margin-right:6px"></i>${h}</span>`).join('')}</div>
      <div class="erow2">${efield('仓库名',ein('OtterGitApp',{id:'crName'}))}${efield('可见性',`<div class="tmode" id="crV"><button data-v="private" class="on">${svg('lock')}私有</button><button data-v="public">${svg('eye')}公开</button></div>`)}</div>
      <div style="display:flex;align-items:center;gap:10px"><button class="ghost rp" id="crOpen">在 GitHub 上创建 ↗</button><div class="op-msg" id="crOpenMsg" style="margin:0">会打开网页并填好名字，建好后把地址粘贴到下面</div></div></div>
      <div class="slabel">建好之后</div><div class="egroup pad">${efield('新仓库地址',ein('',{id:'crUrl',ph:'https://github.com/you/repo.git'}))}<div class="op-msg" id="crMsg"></div></div>
      <div class="egroup" id="crA" style="margin-top:12px">${opt('link',1,'关联当前仓库 OtterGitApp','已经有 origin 了，将以 github 添加并推送 dev')}${opt('clone',0,'克隆到本地','空仓库也能克隆，之后在里面开始写')}</div>${cmdBar('crCmd')}`,
    done:()=>after==='link'?{scene:'push',title:'已关联并推送',sub:'github → dev'}:{scene:'great',title:'去克隆',sub:document.getElementById('crUrl').value}});
  const url=document.getElementById('crUrl');
  const refresh=()=>{const u=url.value.trim(),m=document.getElementById('crMsg'),ok=/^(https?:\/\/|git@)/.test(u);
    document.querySelectorAll('#crH .op-chip').forEach(c=>c.classList.toggle('on',c.dataset.h===host));
    document.getElementById('crOpen').textContent=`在 ${host} 上创建 ↗`;
    if(!u)msg(m,'','粘贴新仓库的地址，HTTPS 和 SSH 都可以');else if(!ok)msg(m,'err','这看起来不像仓库地址');else{const r=u.replace(/\.git$/,'').split(/[/:]/).slice(-2).join('/');msg(m,'ok',`✓ ${host} · ${u.startsWith('git@')?'SSH':'HTTPS'} · <b>${esc(r)}</b>`)}
    api.set(ok,ok?(after==='link'?'github → '+u.split('/').pop():u.split('/').pop()):'',{label:after==='link'?'关联并推送':'去克隆'});
    setCmd('crCmd',after==='link'?[`git remote add github ${u||'<url>'}`,'git push -u github dev']:[`git clone ${u||'<url>'}`])};
  document.querySelectorAll('#crH .op-chip').forEach(c=>c.onclick=()=>{host=c.dataset.h;refresh()});
  document.querySelectorAll('#crV button').forEach(b=>b.onclick=()=>{vis=b.dataset.v;document.querySelectorAll('#crV button').forEach(x=>x.classList.toggle('on',x===b))});
  document.getElementById('crOpen').onclick=()=>{const mm=document.getElementById('crOpenMsg');mm.className='op-msg ok';mm.textContent='✓ 已打开网页，建好后把地址粘贴到下面';url.focus()};
  wireOpts(document.getElementById('crA'),k=>{after=k;refresh()});url.oninput=refresh;refresh();
}

/* 应用补丁：选文件后先读出涉及的文件和增删行，再决定怎么应用 */
function patch(){
  const S={three:true,index:false,rev:false};const F=[['fix-tray.patch','3 个文件','+42 −7'],['theme.diff','1 个文件','+5 −5']];let i=-1;
  const api=opShell({icon:'patch',color:'var(--alt)',title:'应用补丁',sub:'把 .patch / .diff 里的改动放进当前工作区',go:'应用',idle:'选一个补丁文件',
    body:`<div class="slabel" style="margin-top:2px">补丁文件</div><div class="egroup pad"><div class="op-fixed" id="paPick" style="cursor:pointer;border-style:solid;background:var(--field)">${svg('patch')}<span id="paName" style="flex:1">点这里选择文件</span><b style="font:600 12px -apple-system;color:var(--mid)">选择…</b></div><div id="paSt"></div></div>
      <div class="slabel">怎么应用</div><div class="egroup" id="paTg">${tg('three',1,'冲突时三方合并','对不上的地方写成冲突标记，而不是直接失败 · <code>--3way</code>')}${tg('index',0,'同时加入暂存区','应用完直接是已暂存状态 · <code>--index</code>')}${tg('rev',0,'反向应用','撤销这个补丁带来的改动 · <code>-R</code>')}</div>${cmdBar('paCmd')}`,
    done:()=>({scene:'ok',title:S.rev?'已撤销补丁':'补丁已应用',sub:F[i][0]+' · '+F[i][1]})});
  const refresh=()=>{const f=F[i],st=document.getElementById('paSt');
    if(!f)st.innerHTML='<div class="op-msg" style="margin:10px 0 0">支持 git format-patch 和 git diff 导出的文件</div>';
    else{document.getElementById('paName').textContent='~/Downloads/'+f[0];st.innerHTML=`<div class="fl-ok" style="margin-top:12px">${svg('check')}<span>${f[1]} · <b style="color:var(--add)">${f[2].split(' ')[0]}</b> <b style="color:var(--del)">${f[2].split(' ')[1]}</b> · 已试应用，可以干净地放进来</span></div>`}
    api.set(!!f,f?`${f[0]}${S.rev?' · 反向':''}`:'',{label:S.rev?'反向应用':'应用'});
    setCmd('paCmd',[`git apply${S.three?' --3way':''}${S.index?' --index':''}${S.rev?' -R':''} ${f?'~/Downloads/'+f[0]:'<补丁文件>'}`])};
  document.getElementById('paPick').onclick=()=>{i=(i+1)%F.length;refresh()};wireTgs(document.getElementById('paTg'),S,refresh);refresh();
}

/* 添加工作树：同一仓库再检出一份，用来并行处理另一个分支 */
function worktree(){
  let how='new';let touched=false;
  const api=opShell({icon:'work',color:'var(--accent)',title:'添加工作树',sub:'同一个仓库再检出一份，两个分支同时开着',go:'添加',idle:'填好分支和文件夹',
    body:`<div class="slabel" style="margin-top:2px">用哪个分支</div><div class="egroup" id="wtHow">${opt('new',1,'新建分支','从 dev 开出一个新分支放进去')}<div class="op-fold" id="wtNew" style="padding:0 14px 12px 44px">${ein('',{id:'wtBr',ph:'feat/hotfix'})}</div>${opt('old',0,'已有分支','检出一个现成的分支（不能是已经开着的）')}<div class="op-fold off" id="wtOld" style="padding:0 14px 12px 44px">${selBtn('branch','release')}</div></div>
      <div class="slabel">放在哪里</div><div class="egroup pad"><div class="erow2">${efield('位置',selBtn('path','~/Desktop/code','folder'))}${efield('文件夹名',ein('',{id:'wtDir',ph:'OtterGitApp-hotfix'}))}</div><div class="op-msg" id="wtMsg"></div></div>${cmdBar('wtCmd')}`,
    done:()=>({scene:'branch',title:'工作树已添加',sub:document.getElementById('wtDir').value.trim()})});
  const br=document.getElementById('wtBr'),dir=document.getElementById('wtDir');
  const refresh=()=>{const b=how==='new'?br.value.trim():selVal('branch'),m=document.getElementById('wtMsg');
    if(!touched)dir.value=b?'OtterGitApp-'+b.split('/').pop():'';
    const d=dir.value.trim(),bad=how==='new'&&b&&BAD.test(b),busy=how==='old'&&b==='dev';let ok=false;
    if(bad)msg(m,'err','分支名不能有空格和 ~ ^ : ? * [ \\');else if(busy)msg(m,'err','<b>dev</b> 已经在主工作区开着了，换一个分支');
    else if(!b||!d)msg(m,'','文件夹名默认跟着分支名走');else{ok=true;msg(m,'ok',`✓ 会在 <b>${selVal('path')}/${esc(d)}</b> 检出 <b>${esc(b)}</b>`)}
    api.set(ok,ok?`${b} → ${d}`:'');
    setCmd('wtCmd',[how==='new'?`git worktree add -b ${b||'<分支>'} ${selVal('path')}/${d||'<文件夹>'} dev`:`git worktree add ${selVal('path')}/${d||'<文件夹>'} ${b}`])};
  wireOpts(document.getElementById('wtHow'),k=>{how=k;document.getElementById('wtNew').classList.toggle('off',k!=='new');document.getElementById('wtOld').classList.toggle('off',k!=='old');refresh()});
  br.oninput=refresh;dir.oninput=()=>{touched=!!dir.value;refresh()};watchSel(refresh);refresh();setTimeout(()=>br.focus(),60);
}

/* 二分查错：标好「坏」和「好」两端，估算要试几步 */
function bisect(){
  const api=opShell({icon:'bisect',color:'var(--warn)',title:'二分查错',sub:'在一段提交里对半找，定位是哪次改坏的',go:'开始查找',idle:'',
    body:`<div class="slabel" style="margin-top:2px">范围</div><div class="egroup pad"><div class="op-flow">${efield('已知正常',selBtn('good','v2.0.0','tag'))}<div class="ar" style="margin-bottom:12px"><svg viewBox="0 0 40 14"><path d="M2 7H34M28 2l6 5-6 5"/></svg></div>${efield('出问题的',`<div class="op-fixed">${svg('branch')}dev · a1f3c9e</div>`)}</div>
      <div class="op-chips" id="bsG" style="margin:2px 0 0">${['v2.0.0','v1.9.3','main'].map(x=>`<span class="op-chip" data-g="${x}">${x}</span>`).join('')}</div></div>
      <div id="bsSum" style="margin-top:12px"></div>
      <div class="slabel">之后怎么做</div><div class="egroup pad"><div class="op-kv" style="padding:0">${['小獭会检出中间的一个提交','你试一下，点「正常」或「有问题」','重复几次就能找到第一个出问题的提交','随时可以结束，回到 dev'].map((t,k)=>`<span>${k+1}</span><b style="font-family:inherit;font-weight:500">${t}</b>`).join('')}</div></div>${cmdBar('bsCmd')}`,
    done:()=>({scene:'think',title:'开始二分查错',sub:'已检出中间的提交，试一下吧'})});
  const N={'v2.0.0':38,'v1.9.3':96,'main':6};
  const refresh=()=>{const g=selVal('good'),n=N[g]||20,steps=Math.ceil(Math.log2(n+1));
    document.querySelectorAll('#bsG .op-chip').forEach(c=>c.classList.toggle('on',c.dataset.g===g));
    document.getElementById('bsSum').innerHTML=`<div class="fl-ok">${svg('check')}<span>中间有 <b>${n}</b> 个提交，大约 <b>${steps}</b> 步就能找到</span></div>`;
    api.set(true,`${g} … dev · 约 ${steps} 步`);setCmd('bsCmd',['git bisect start',`git bisect bad a1f3c9e`,`git bisect good ${g}`])};
  document.querySelectorAll('#bsG .op-chip').forEach(c=>c.onclick=()=>{scrim.querySelector('[data-sel="good"] .v').textContent=c.dataset.g;refresh()});
  watchSel(refresh);refresh();
}

/* 添加子模块：地址 + 目录，目录默认用仓库名 */
function submodule(){
  let touched=false;
  const api=opShell({icon:'plus',color:'var(--alt)',title:'添加子模块',sub:'把另一个仓库放进这个仓库的子目录',go:'添加子模块',idle:'粘贴子模块的仓库地址',
    body:`<div class="egroup pad" style="margin-top:4px">${efield('仓库地址',ein('',{id:'smUrl',ph:'https://github.com/owner/lib.git'}))}<div class="op-msg" id="smMsg"></div>${efield('放在哪个目录',ein('',{id:'smDir',ph:'libs/name'}),{small:'默认用仓库名'})}<div class="op-msg" id="smDirMsg"></div></div>${cmdBar('smCmd')}`,
    done:()=>({scene:'ok',title:'子模块已添加',sub:document.getElementById('smDir').value.trim()})});
  const url=document.getElementById('smUrl'),dir=document.getElementById('smDir');
  const refresh=()=>{const u=url.value.trim(),ok=/^(https?:\/\/|git@)/.test(u),name=u.replace(/\.git$/,'').split(/[/:]/).pop();
    if(!touched)dir.value=ok?name:'';
    msg(document.getElementById('smMsg'),u?(ok?'ok':'err'):'',u?(ok?`✓ <b>${esc(u.replace(/\.git$/,'').split(/[/:]/).slice(-2).join('/'))}</b>`:'这看起来不像仓库地址'):'HTTPS 和 SSH 都可以');
    const d=dir.value.trim(),exists=['lib','docs','tool'].includes(d),dm=document.getElementById('smDirMsg');
    if(!d)msg(dm,'','');else if(exists)msg(dm,'err',`<b>${esc(d)}</b> 已经存在，换一个`);else msg(dm,'ok',`✓ 将添加到 <b>${esc(d)}</b>`);
    api.set(ok&&!!d&&!exists,ok&&d?d:'');setCmd('smCmd',[`git submodule add ${u||'<地址>'}${touched&&d?' '+d:''}`])};
  url.oninput=refresh;dir.oninput=()=>{touched=!!dir.value;refresh()};refresh();setTimeout(()=>url.focus(),60);
}

Object.assign(DLG,{branch,tag,clone,scan,merge,reset,stashSave,pushOpts,pullOpts,rebaseI,rename,newGroup,initRepo,addLocal,createRemote,patch,worktree,bisect,submodule});
})();
