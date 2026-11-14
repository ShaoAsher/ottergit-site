/* v5 · Git-flow 操作页：开始（选类型 / 命名 / 选起点分支或节点 + 节点预览）、完成（选分支 / 选项 / 会发生什么） */
(()=>{
document.head.insertAdjacentHTML('beforeend',`<style>
.fl-types{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.fl-type{padding:10px 12px;border-radius:14px;border:.5px solid var(--line);background:var(--pane);cursor:pointer;transition:border-color .18s,background .18s,box-shadow .18s;display:flex;flex-direction:column;gap:3px;min-width:0}
.fl-type b{display:flex;align-items:center;gap:7px;font-size:13.5px;color:var(--hi)}
.fl-type b i{width:8px;height:8px;border-radius:50%;background:var(--c);flex:none}
.fl-type span{font:11.5px var(--mono);color:var(--lo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fl-type:hover{border-color:color-mix(in srgb,var(--c) 40%,var(--line))}
.fl-type.on{border-color:color-mix(in srgb,var(--c) 65%,transparent);background:color-mix(in srgb,var(--c) 9%,var(--pane));box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 14%,transparent)}
.fl-msg{font-size:12px;margin-top:-4px;display:flex;align-items:center;gap:6px;color:var(--lo);min-height:18px}
.fl-msg b{font-family:var(--mono);color:var(--hi)}
.fl-msg.err{color:var(--danger)} .fl-msg.err b{color:var(--danger)}
.fl-msg .fix{margin-left:4px;font:600 12px var(--mono);padding:1px 8px;border-radius:999px;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);cursor:pointer}
.fl-sug{display:flex;gap:6px;flex-wrap:wrap;margin:-2px 0 12px}
.fl-sug span{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font:12px var(--mono);background:rgba(var(--ink),.06);border:.5px solid var(--line);cursor:pointer;color:var(--mid);transition:.15s}
.fl-sug span:hover{color:var(--hi);border-color:color-mix(in srgb,var(--accent) 45%,transparent)}
.fl-opt{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;cursor:pointer;transition:background .15s}
.fl-opt+.fl-opt,.fl-opt+.fl-pick+.fl-opt{border-top:.5px solid rgba(var(--ink),.06)}
.fl-opt:hover{background:rgba(var(--ink),.025)}
.fl-opt .rd{width:18px;height:18px;border-radius:50%;border:1.6px solid var(--lo);flex:none;margin-top:1px;display:grid;place-items:center;transition:.2s}
.fl-opt.on .rd{border-color:var(--accent)} .fl-opt.on .rd::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.fl-opt .tx{flex:1;min-width:0} .fl-opt .tx b{display:block;font-size:13.5px;color:var(--hi)}
.fl-opt .tx>span{display:block;font-size:12px;color:var(--lo);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fl-opt .tx code{font:12px var(--mono);color:var(--mid)}
.fl-opt .warn{color:var(--warn,#e0a63a)}
.fl-pick{padding:0 14px 12px 44px;display:none}
.fl-pick.on{display:block;animation:rise .28s var(--ease)}
.fl-pbar{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.fl-pbar .ein{height:34px;flex:1;min-width:0}
.fl-list{max-height:208px;overflow:auto;border-radius:12px;border:.5px solid var(--line);background:var(--field)}
.fl-row{display:grid;grid-template-columns:14px 64px 1fr auto;gap:10px;align-items:center;height:36px;padding:0 10px;cursor:pointer;font-size:12.5px;position:relative}
.fl-row+.fl-row{border-top:.5px solid rgba(var(--ink),.04)}
.fl-row:hover{background:rgba(var(--ink),.04)}
.fl-row .g{width:9px;height:9px;border-radius:50%;border:2px solid var(--c,var(--accent));background:var(--raised);justify-self:center}
.fl-row .h{font:12px var(--mono);color:var(--lo)}
.fl-row .m{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--hi)}
.fl-row .m .ref{font:11px var(--mono);padding:1px 6px;border-radius:999px;margin-right:6px;background:color-mix(in srgb,var(--c,var(--accent)) 15%,transparent);color:color-mix(in srgb,var(--c,var(--accent)) var(--tt),var(--hi))}
.fl-row .t{font-size:11.5px;color:var(--lo)}
.fl-row.on{background:color-mix(in srgb,var(--accent) 12%,transparent)}
.fl-row.on::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;border-radius:2px;background:var(--accent)}
.fl-tg{display:flex;align-items:center;gap:12px;padding:11px 14px;cursor:pointer}
.fl-tg+.fl-tg{border-top:.5px solid rgba(var(--ink),.06)}
.fl-tg .tx{flex:1} .fl-tg .tx b{display:block;font-size:13.5px;color:var(--hi)} .fl-tg .tx span{font-size:12px;color:var(--lo)}
.fl-tg .tx code{font:11.5px var(--mono);color:var(--mid)}
.fl-tg.dis{opacity:.45;pointer-events:none}
.fl-graph svg{width:100%;display:block}
.fl-card{border-radius:14px;border:.5px solid var(--line);background:var(--pane);padding:12px 14px}
.fl-card .hd{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.fl-card .hd code{font:12px var(--mono);padding:2px 8px;border-radius:999px;background:rgba(var(--ink),.07);color:var(--hi)}
.fl-card .hd span{font-size:11.5px;color:var(--lo);margin-left:auto}
.fl-card .msg{font-size:13.5px;font-weight:600;color:var(--hi);line-height:1.4}
.fl-card .by{font-size:12px;color:var(--lo);margin-top:4px}
.fl-card .files{margin-top:10px;display:flex;flex-direction:column;gap:4px;font:12px var(--mono);color:var(--mid)}
.fl-card .files div{display:flex;gap:8px} .fl-card .files i{font-style:normal;width:14px;font-weight:700}
.fl-card .files .A{color:var(--add)} .fl-card .files .M{color:var(--mod,var(--memory))} .fl-card .files .D{color:var(--del)}
.fl-card .dirty{margin-top:10px;padding:8px 10px;border-radius:10px;font-size:12px;background:color-mix(in srgb,var(--warn,#e0a63a) 12%,transparent);color:color-mix(in srgb,var(--warn,#e0a63a) var(--tt),var(--hi))}
.fl-brs .fl-opt .tx b{font-family:var(--mono);font-size:13px;display:flex;align-items:center;gap:8px}
.fl-brs .fl-opt .tx b i{width:8px;height:8px;border-radius:50%;background:var(--c);flex:none}
.fl-brs .cur{font:700 10.5px -apple-system,"PingFang SC",sans-serif;padding:2px 7px;border-radius:999px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent);margin-left:auto}
.fl-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.fl-steps li{display:grid;grid-template-columns:22px 1fr;gap:10px;position:relative;padding-bottom:12px;font-size:12.5px;color:var(--hi);line-height:1.45}
.fl-steps li::before{content:attr(data-n);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font:700 11px var(--mono);background:color-mix(in srgb,var(--c,var(--accent)) 16%,transparent);color:color-mix(in srgb,var(--c,var(--accent)) var(--tt),var(--hi))}
.fl-steps li:not(:last-child)::after{content:"";position:absolute;left:10.5px;top:24px;bottom:2px;width:1px;background:var(--line)}
.fl-steps li code{font:12px var(--mono);color:var(--mid)}
.fl-steps li.off{opacity:.4;text-decoration:line-through}
.fl-ok{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:12px;font-size:12.5px;line-height:1.45;background:color-mix(in srgb,var(--add) 11%,transparent);color:color-mix(in srgb,var(--add) var(--tt),var(--hi))}
.fl-ok.w{background:color-mix(in srgb,var(--warn,#e0a63a) 12%,transparent);color:color-mix(in srgb,var(--warn,#e0a63a) var(--tt),var(--hi))}
.fl-ok svg{width:15px;height:15px;flex:none;margin-top:1px;stroke:currentColor;fill:none;stroke-width:2}
.fl-cm{display:flex;flex-direction:column;border-radius:12px;border:.5px solid var(--line);background:var(--pane);overflow:hidden}
.fl-cm div{display:flex;gap:8px;padding:7px 10px;font-size:12px;align-items:center}
.fl-cm div+div{border-top:.5px solid rgba(var(--ink),.05)}
.fl-cm code{font:11.5px var(--mono);color:var(--lo)} .fl-cm span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--hi)}
</style>`);

const TYPES={
  feature:{lb:'功能',c:'var(--ok)',from:'dev',ex:'login',sub:'从 dev 开出 · 完成后合回 dev'},
  release:{lb:'发布',c:'var(--memory)',from:'dev',ex:'2.1.0',sub:'从 dev 开出 · 完成后合入 main 并打标签'},
  hotfix:{lb:'热修复',c:'var(--danger)',from:'main',ex:'2.0.2',sub:'从 main 开出 · 修完合入 main 和 dev'},
  support:{lb:'支持',c:'var(--alt)',from:'main',ex:'1.x',sub:'从 main 或旧标签开出 · 长期维护'},
};
const CM=[
  ['a1b2c3d','feat(home): 首页与继续工作卡片','Shaw','12 分钟前',['dev'],[['M','lib/home/home_page.dart'],['A','lib/home/resume_card.dart'],['M','lib/文案/home_zh-CN.json']]],
  ['9f8e7d6','fix(sidebar): 分支树展开状态丢失','Shaw','2 小时前',[],[['M','lib/sidebar/branch_tree.dart']]],
  ['5c4b3a2','chore: 升级 flutter 3.38','Shaw','昨天',['origin/dev'],[['M','pubspec.yaml'],['M','pubspec.lock']]],
  ['e1d2c3b','Merge release/2.0.1','Shaw','今天 13:40',['main','v2.0.1'],[['M','CHANGELOG.md'],['M','pubspec.yaml']]],
  ['7a6b5c4','feat(otter): 步骤气泡可展开','Shaw','11-06',[],[['M','lib/otter/otter_panel.dart'],['A','lib/otter/step_bubble.dart']]],
  ['3e2f1a0','Merge release/2.0.0','Shaw','11-02',['v2.0.0'],[['M','CHANGELOG.md']]],
  ['0b9c8d7','feat(windows): 托盘菜单','Shaw','10-30',['feat/windows'],[['A','windows/runner/tray.cpp']]],
  ['6d5e4f3','release: 1.9.3','Shaw','10-12',['v1.9.3'],[['M','pubspec.yaml']]],
];
const REFS={branch:[['dev',0],['main',3],['feat/windows',6],['origin/dev',2],['origin/main',3]],tag:[['v2.0.1',3],['v2.0.0',5],['v1.9.3',7]]};
const TIP={dev:0,main:3};
const TAKEN=['feature/repo-list','feature/ambient-backdrop','release/2.1.0','hotfix/2.0.2'];
const refColor=r=>r.startsWith('v')?'var(--memory)':r.includes('main')?'var(--memory)':r.startsWith('feat')?'var(--ok)':'var(--accent)';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

function commitCard(i,{dirty=0}={}){const [h,m,a,t,,files]=CM[i];
  return `<div class="fl-card"><div class="hd"><code>${h}</code>${CM[i][4].map(r=>`<code style="color:${refColor(r)}">${r}</code>`).join('')}<span>${t}</span></div><div class="msg">${esc(m)}</div><div class="by">${a} · ${files.length} 个文件</div><div class="files">${files.map(([k,f])=>`<div><i class="${k}">${k}</i>${esc(f)}</div>`).join('')}</div>${dirty?`<div class="dirty">还会带上工作副本里 12 个未提交的改动</div>`:''}</div>`}

function graph(type,name,baseIdx){const T=TYPES[type];const line=T.from==='main'?'var(--memory)':'var(--accent)';
  const xs=[200,166,132,98,64,30];const pos=Math.min(baseIdx,5);const bx=xs[pos];
  const label=(TYPES[type]&&name)?esc(prefixOf(type)+name):esc(prefixOf(type))+'…';
  return `<svg viewBox="0 0 284 150" fill="none" stroke-linecap="round">
    <text x="0" y="14" fill="var(--lo)" font-size="10.5">← 更早</text><text x="284" y="14" fill="var(--lo)" font-size="10.5" text-anchor="end">最新 →</text>
    <path d="M18 52H214" stroke="${line}" stroke-width="2"/><path d="M214 52H270" stroke="${line}" stroke-width="2" stroke-dasharray="2 4" opacity=".5"/>
    <text x="270" y="40" fill="var(--mid)" font-size="11" font-weight="700" text-anchor="end">${T.from}</text>
    <path d="M${bx} 52c0 34 16 58 40 58H252" stroke="${T.c}" stroke-width="2" stroke-dasharray="5 4"/>
    ${xs.map((x,i)=>`<circle cx="${x}" cy="52" r="${i===pos?6:4}" fill="var(--raised)" stroke="${i===pos?T.c:line}" stroke-width="${i===pos?2.6:2}"/>`).join('')}
    <circle cx="258" cy="110" r="5" fill="${T.c}"/>
    <text x="250" y="134" fill="${T.c}" font-size="11" font-family="SF Mono,Menlo,monospace" text-anchor="end">${label}</text>
    <text x="${bx}" y="76" fill="var(--lo)" font-size="10" font-family="SF Mono,Menlo,monospace" text-anchor="middle">${CM[baseIdx][0]}</text>
  </svg>`}

let CFG={feature:'feature/',release:'release/',hotfix:'hotfix/',support:'support/'};
const prefixOf=t=>CFG[t];

function flowStart(type='feature'){
  let base='tip',pickTab='branch',pickQ='',picked=['branch','dev',0],name='',pushUp=false,fetchFirst=true;
  edShell('flow','var(--ok)','开始新的工作分支','Git-flow · 起个名字、选好从哪里开出',`<div class="wbg flow"><div class="main scroll">
    <div class="slabel" style="margin-top:2px">类型</div>
    <div class="fl-types" id="flTypes">${Object.entries(TYPES).map(([k,v])=>`<div class="fl-type ${k===type?'on':''}" data-t="${k}" style="--c:${v.c}"><b><i></i>${v.lb}</b><span>${prefixOf(k)}</span></div>`).join('')}</div>
    <div class="slabel">名称</div>
    <div class="egroup pad"><div class="efield">${ein('',{id:'flName',pre:prefixOf(type),ph:TYPES[type].ex})}</div><div class="fl-sug" id="flSug"></div><div class="fl-msg" id="flMsg" style="margin-bottom:12px"></div></div>
    <div class="slabel">从哪里开出<span class="c" id="flBaseHint"></span></div>
    <div class="egroup" id="flBase"></div>
    <div class="slabel">开始时</div>
    <div class="egroup">
      <div class="fl-tg" data-tg="fetch"><div class="tx"><b>先获取远程最新</b><span>避免从过期的 <code id="flFromCode">dev</code> 开出</span></div><span class="sw on"></span></div>
      <div class="fl-tg" data-tg="push"><div class="tx"><b>推送并建立跟踪</b><span>同事可以马上看到这个分支 · <code>git push -u origin</code></span></div><span class="sw"></span></div>
    </div>
  </div><div class="side" id="flSide" style="--tone:var(--ok)"></div></div>`,{wb:1});
  const save=document.getElementById('edSave'),st=document.getElementById('edSt');
  const nameIn=document.getElementById('flName');
  const baseIdx=()=>base==='tip'||base==='head'?TIP[TYPES[type].from]:picked[2];
  const baseLabel=()=>base==='tip'?`${TYPES[type].from} 最新`:base==='head'?'当前工作副本（HEAD）':picked[0]==='commit'?picked[1]:picked[1];
  const check=()=>{const raw=nameIn.value;const v=raw.trim();
    if(!v)return {ok:false,msg:'输入名称，比如 '+TYPES[type].ex};
    if(/[\s~^:?*\[\\]|\.\.|\/$|^\//.test(v)){const fix=v.replace(/[\s~^:?*\[\\]+/g,'-').replace(/\.\.+/g,'.').replace(/^\/+|\/+$/g,'');return {ok:false,err:1,msg:`不能有空格和 ~ ^ : ? * [ \\，也不能以 / 开头或结尾${fix?`<span class="fix" data-fix="${esc(fix)}">改成 ${esc(fix)}</span>`:''}`}}
    const full=prefixOf(type)+v;if(TAKEN.includes(full))return {ok:false,err:1,msg:`已经有 <b>${full}</b> 了，换个名字或去完成它`};
    return {ok:true,msg:`将创建 <b>${esc(full)}</b>`}};
  const renderBase=()=>{const T=TYPES[type];const tip=CM[TIP[T.from]];
    document.getElementById('flBaseHint').textContent=`${T.lb}默认从 ${T.from} 开出`;
    document.getElementById('flFromCode').textContent=T.from;
    const list=pickTab==='commit'?CM.map((c,i)=>[c[0],i]):REFS[pickTab];
    const rows=list.filter(([r,i])=>!pickQ||(r+' '+CM[i][1]).toLowerCase().includes(pickQ)).map(([r,i])=>{const c=CM[i];const on=picked[0]===pickTab&&picked[1]===r;
      return `<div class="fl-row ${on?'on':''}" data-r="${r}" data-i="${i}" style="--c:${pickTab==='commit'?'var(--accent)':refColor(r)}"><span class="g"></span><span class="h">${c[0]}</span><span class="m">${pickTab!=='commit'?`<span class="ref">${r}</span>`:c[4].map(x=>`<span class="ref" style="--c:${refColor(x)}">${x}</span>`).join('')}${esc(c[1])}</span><span class="t">${c[3]}</span></div>`}).join('')||'<div class="mempty">没有匹配的结果</div>';
    document.getElementById('flBase').innerHTML=`
      <div class="fl-opt ${base==='tip'?'on':''}" data-b="tip"><span class="rd"></span><div class="tx"><b>${T.from} 最新</b><span><code>${tip[0]}</code> ${esc(tip[1])}</span></div></div>
      <div class="fl-opt ${base==='head'?'on':''}" data-b="head"><span class="rd"></span><div class="tx"><b>当前工作副本</b><span>在 <code>dev</code> 上 · <span class="warn">12 个未提交改动会一起带过去</span></span></div></div>
      <div class="fl-opt ${base==='pick'?'on':''}" data-b="pick"><span class="rd"></span><div class="tx"><b>指定分支、标签或提交</b><span>${base==='pick'?`已选 <code>${picked[1]}</code> · ${esc(CM[picked[2]][1])}`:'比如从旧版本标签开出 support 分支'}</span></div></div>
      <div class="fl-pick ${base==='pick'?'on':''}"><div class="fl-pbar"><div class="tmode" id="flTabs">${[['branch','branch','分支'],['tag','tag','标签'],['commit','commit','提交']].map(([k,ic,l])=>`<button class="${k===pickTab?'on':''}" data-p="${k}">${svg(ic)}${l}</button>`).join('')}</div><div class="ein"><svg class="lead" viewBox="0 0 24 24" style="width:15px;height:15px;stroke:var(--lo);fill:none;stroke-width:2;margin-left:10px"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg><input id="flQ" placeholder="搜索名称、哈希或提交说明" value="${esc(pickQ)}"></div></div><div class="fl-list">${rows}</div></div>`;
    const box=document.getElementById('flBase');
    box.querySelectorAll('.fl-opt').forEach(o=>o.onclick=()=>{base=o.dataset.b;renderBase();refresh()});
    box.querySelectorAll('#flTabs button').forEach(b=>b.onclick=e=>{e.stopPropagation();pickTab=b.dataset.p;renderBase()});
    box.querySelectorAll('.fl-row').forEach(r=>r.onclick=()=>{picked=[pickTab,r.dataset.r,+r.dataset.i];renderBase();refresh()});
    const q=document.getElementById('flQ');if(q){q.oninput=()=>{pickQ=q.value.toLowerCase();const pos=q.selectionStart;renderBase();const n=document.getElementById('flQ');n.focus();n.setSelectionRange(pos,pos)}}
  };
  const renderSug=()=>{const s={release:['2.1.0','2.0.2','3.0.0'],hotfix:['2.0.2','2.0.1-1'],support:['1.x','2.0.x']}[type]||[];
    document.getElementById('flSug').innerHTML=s.map(v=>`<span data-v="${v}">${v}</span>`).join('');
    document.getElementById('flSug').style.display=s.length?'flex':'none';
    document.querySelectorAll('#flSug span').forEach(x=>x.onclick=()=>{nameIn.value=x.dataset.v;refresh();nameIn.focus()})};
  const refresh=()=>{const T=TYPES[type];const c=check();name=nameIn.value.trim();
    const m=document.getElementById('flMsg');m.className='fl-msg'+(c.err?' err':'');m.innerHTML=c.msg;m.querySelector('[data-fix]')?.addEventListener('click',e=>{nameIn.value=e.target.dataset.fix;refresh();nameIn.focus()});
    save.disabled=!c.ok;save.textContent='开始 '+type;
    st.classList.toggle('dirty',c.ok);st.querySelector('span').textContent=c.ok?`${prefixOf(type)}${name} ← ${baseLabel()}`:'起好名字就能开始';
    const bi=baseIdx();const from=base==='tip'?'':base==='head'?' HEAD':' '+(picked[0]==='commit'?CM[bi][0]:picked[1]);
    const cmds=[fetchFirst?['git fetch origin','']:null,[`git flow ${type} start ${name||'<名称>'}${from}`,''],pushUp?[`git push -u origin ${prefixOf(type)}${name||'<名称>'}`,'']:null].filter(Boolean);
    document.getElementById('flSide').style.setProperty('--tone',T.c);
    document.getElementById('flSide').innerHTML=`<h5>分支预览</h5><div class="fl-graph">${graph(type,name,bi)}</div><h5>起点节点</h5>${commitCard(bi,{dirty:base==='head'})}<h5 style="margin-top:16px">将执行</h5><div class="fcode">${cmds.map(([c])=>esc(c)).join('\n')}</div>`};
  document.querySelectorAll('#flTypes .fl-type').forEach(el=>el.onclick=()=>{type=el.dataset.t;document.querySelectorAll('#flTypes .fl-type').forEach(x=>x.classList.toggle('on',x===el));
    nameIn.closest('.ein').querySelector('.pre').textContent=prefixOf(type);nameIn.placeholder=TYPES[type].ex;renderSug();renderBase();refresh();nameIn.focus()});
  document.querySelectorAll('[data-tg]').forEach(r=>r.onclick=()=>{const s=r.querySelector('.sw');s.classList.toggle('on');if(r.dataset.tg==='push')pushUp=s.classList.contains('on');else fetchFirst=s.classList.contains('on');refresh()});
  nameIn.oninput=refresh;nameIn.onkeydown=e=>{if(e.key==='Enter'&&!save.disabled)save.click()};
  save.onclick=()=>{const full=prefixOf(type)+name;closeDlg();setTimeout(()=>moment({scene:'branch',title:`已开始 ${full}`,sub:`从 ${baseLabel()} 开出，已切换到新分支`}),280)};
  renderSug();renderBase();refresh();setTimeout(()=>nameIn.focus(),60);
}

const WIP=[
  ['feature','ambient-backdrop',4,'2 小时前',1],
  ['feature','repo-list',2,'昨天',0],
  ['release','2.1.0',6,'3 天前',0],
  ['hotfix','2.0.2',1,'刚刚',0],
];
function flowFinish(init=0){
  let sel=init,keep=false,fetchFirst=true,push=true,squash=false,noTag=false;
  edShell('check','var(--ok)','完成工作分支','Git-flow · 合回主干、打标签、清理分支',`<div class="wbg flow"><div class="main scroll">
    <div class="slabel" style="margin-top:2px">进行中的分支<span class="c">${WIP.length} 个</span></div>
    <div class="egroup fl-brs" id="ffList"></div>
    <div class="slabel">选项</div>
    <div class="egroup" id="ffOpts"></div>
    <div id="ffTag"></div>
  </div><div class="side" id="ffSide" style="--tone:var(--ok)"></div></div>`,{wb:1});
  const save=document.getElementById('edSave'),st=document.getElementById('edSt');
  const tg=(k,on,b,s,dis)=>`<div class="fl-tg ${dis?'dis':''}" data-k="${k}"><div class="tx"><b>${b}</b><span>${s}</span></div><span class="sw ${on?'on':''}"></span></div>`;
  const render=()=>{const [type,n,ahead]=WIP[sel];const T=TYPES[type];const full=prefixOf(type)+n;const rel=type==='release'||type==='hotfix';
    const target=type==='feature'?'dev':'main';
    document.getElementById('ffList').innerHTML=WIP.map(([t,nm,a,when,cur],i)=>`<div class="fl-opt ${i===sel?'on':''}" data-i="${i}" style="--c:${TYPES[t].c}"><span class="rd"></span><div class="tx"><b><i></i>${prefixOf(t)}${nm}${cur?'<span class="cur">当前分支</span>':''}</b><span>领先 ${TYPES[t].from} ${a} 个提交 · 最后提交 ${when}</span></div></div>`).join('');
    document.getElementById('ffOpts').innerHTML=
      tg('fetch',fetchFirst,'先获取远程最新','合并前同步 origin，减少冲突 · <code>-F</code>')+
      (type==='feature'?tg('squash',squash,'压缩成一个提交','dev 上只留下一条干净的记录 · <code>-S</code>'):'')+
      tg('keep',keep,'保留分支','默认完成后删除本地和远程的 '+full+' · <code>-k</code>')+
      tg('push',push,'完成后推送',`推送 ${rel?'main、dev 和标签':'dev'} 到 origin`)+
      (rel?tg('notag',noTag,'不打版本标签','只合并，不创建 v'+n+' · <code>-n</code>'):'');
    document.getElementById('ffTag').innerHTML=rel&&!noTag?`<div class="slabel">版本标签</div><div class="egroup pad"><div class="erow2">${efield('标签名',ein('v'+n,{id:'ffTagName'}))}${efield('标签说明',ein(type==='release'?'Release '+n:'Hotfix '+n,{mono:0}),{small:'可留空'})}</div></div>`:'';
    const steps=[
      fetchFirst&&['获取 origin 最新',T.c],
      [`切到 <code>${target}</code>，合并 <code>${full}</code>${squash?'（压缩）':'（--no-ff）'}`,T.c],
      rel&&!noTag&&[`在 <code>main</code> 上打标签 <code>v${n}</code>`,'var(--memory)'],
      rel&&[`把 <code>main</code> 合回 <code>dev</code>`,'var(--accent)'],
      !keep&&[`删除 <code>${full}</code>（本地 + 远程）`,'var(--danger)'],
      push&&[`推送 ${rel?'<code>main</code> <code>dev</code> 和标签':'<code>dev</code>'}`,'var(--accent)'],
    ].filter(Boolean);
    const commits=CM.slice(0,ahead).map(c=>`<div><code>${c[0]}</code><span>${esc(c[1])}</span></div>`).join('');
    const side=document.getElementById('ffSide');side.style.setProperty('--tone',T.c);
    side.innerHTML=`<h5>会发生什么</h5><ol class="fl-steps">${steps.map(([s,c],i)=>`<li data-n="${i+1}" style="--c:${c}"><span>${s}</span></li>`).join('')}</ol>
      <h5>预检</h5>${type==='hotfix'?`<div class="fl-ok w">${svg('info')}<span>dev 比 main 多 3 个提交，合回 dev 时可能需要处理冲突</span></div>`:`<div class="fl-ok">${svg('check')}<span>与 ${target} 没有冲突，可以直接完成</span></div>`}
      <h5 style="margin-top:16px">将合入的提交 · ${ahead}</h5><div class="fl-cm">${commits}</div>`;
    save.disabled=false;save.textContent='完成 '+type;
    st.classList.add('dirty');st.querySelector('span').textContent=`${full} → ${target}${rel&&!noTag?' · 标签 v'+n:''}`;
    document.querySelectorAll('#ffList .fl-opt').forEach(o=>o.onclick=()=>{sel=+o.dataset.i;squash=false;noTag=false;render()});
    document.querySelectorAll('#ffOpts .fl-tg').forEach(r=>r.onclick=()=>{const k=r.dataset.k;
      if(k==='fetch')fetchFirst=!fetchFirst;if(k==='keep')keep=!keep;if(k==='push')push=!push;if(k==='squash')squash=!squash;if(k==='notag')noTag=!noTag;render()});
  };
  save.onclick=()=>{const [type,n]=WIP[sel];closeDlg();setTimeout(()=>moment({scene:'merge',title:`已完成 ${prefixOf(type)}${n}`,sub:type==='feature'?'已合回 dev':'已合入 main 并打标签 v'+n}),280)};
  render();
}

Object.assign(DLG,{flowStart,flowFinish});
document.querySelector('#console .opt[data-k=edit]')?.insertAdjacentHTML('beforeend',[['flowStart','开始 feature'],['flowRelease','开始 release'],['flowFinish','完成分支']].map(([k,l])=>`<button data-fx="${k}">${l}</button>`).join(''));
document.addEventListener('click',e=>{const b=e.target.closest('[data-fx]');if(!b)return;e.stopImmediatePropagation();({flowStart:()=>flowStart('feature'),flowRelease:()=>flowStart('release'),flowFinish:()=>flowFinish()})[b.dataset.fx]()},true);
})();
