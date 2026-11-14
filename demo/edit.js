/* ═══ 编辑页 v5：仓库设置 · 远程账号 · Git-flow 分支设置 · 忽略规则（方案.md §8） ═══
   规范要点：
   - 两档尺寸：表单 600 宽（单列分组）/ 工作台 880×640（左编辑 + 右侧栏）
   - 头部 = 彩色图标块 + 标题 + 副标题 + 圆形关闭；分组 = 圆点小标题 + 分组卡
   - 输入框 40 高、14 号字、标签在上；地址 / 前缀 / 规则用等宽
   - 列表项「原地编辑」：点铅笔或双击，行展开为输入框（原值预填、全选），回车保存、Esc 取消
   - 底栏：左「未保存」琥珀点，右 取消 + 保存（slab）；无改动时保存禁用
   - 密钥：眼睛 / 复制钮 28×28 收在输入框右侧，图标 16 居中 */
Object.assign(IC,{
  view:'<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  hide:'<path d="M2.5 12s3.5-6.5 9.5-6.5c1.6 0 3 .4 4.2 1M21.5 12s-1.2 2.3-3.6 4.1M9.9 18.2c.7.2 1.4.3 2.1.3 6 0 9.5-6.5 9.5-6.5"/><path d="M4 20L20 4"/>',
  enter:'<path d="M20 5v7a3 3 0 0 1-3 3H5M9 11l-4 4 4 4"/>',file:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>'
});

document.head.insertAdjacentHTML('beforeend',`<style>
.dlg.ed{width:600px;max-height:720px;display:flex;flex-direction:column;--tone:var(--accent)}
.dlg.ed.wb{width:880px;height:640px}
.ed .dh{padding:18px 16px 12px 20px}
.ed .ebody{flex:1;overflow:auto;padding:4px 20px 8px;position:relative}
.ed .efoot{display:flex;align-items:center;gap:10px;padding:12px 16px 16px 20px;position:relative;border-top:.5px solid var(--line)}
.ed .efoot .est{flex:1;font-size:12px;color:var(--lo);display:flex;align-items:center;gap:8px}
.ed .efoot .est i{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 50%,transparent);animation:edPulse 1.6s infinite}
@keyframes edPulse{70%{box-shadow:0 0 0 6px transparent}}
.ed .efoot .est.dirty{color:var(--accent)}
.ed .efoot .est:not(.dirty) i{display:none}
.ed .slabel{margin:16px 2px 8px}
.ed .slabel .c{margin-left:auto;font-weight:600;letter-spacing:0;color:var(--lo)}
.ed .slabel .lk{margin-left:auto;font-weight:700;letter-spacing:0;color:var(--accent);cursor:pointer}
.egroup{border-radius:16px;border:.5px solid var(--line);background:var(--pane);position:relative;overflow:hidden;isolation:isolate}
.egroup::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--card);pointer-events:none}
.egroup.pad{padding:14px 16px 4px}
.erow{display:flex;align-items:center;gap:12px;padding:11px 12px 11px 14px;position:relative;transition:background .12s}
.erow+.erow,.erow+.eadd{border-top:.5px solid var(--line)}
.erow:hover{background:rgba(var(--ink),.03)}
.erow .b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none}
.erow .b svg,.eib svg,.eadd svg,.ein .sfx svg,.tchip svg,.tmode svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.erow .tx{flex:1;min-width:0}
.erow .tx b{display:block;font-size:14px;font-weight:700}
.erow .tx span{display:block;font:12.5px var(--mono);color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.erow .tx span.sans{font-family:inherit}
.erow .ops{display:flex;gap:4px;opacity:.0;transition:opacity .12s}
.erow:hover .ops,.erow .ops.keep{opacity:1}
.eib{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:var(--mid);transition:background .12s,color .12s,transform .12s}
.eib svg{width:16px;height:16px}
.eib:hover{background:rgba(var(--ink),.09);color:var(--hi)} .eib:active{transform:scale(.92)}
.eib.dz:hover{background:color-mix(in srgb,var(--danger) 14%,transparent);color:var(--danger)}
.eib.ok{color:var(--onAccent);background:var(--accent)} .eib.ok:hover{filter:brightness(1.08);color:var(--onAccent);background:var(--accent)}
.erow.edit{background:color-mix(in srgb,var(--accent) 6%,transparent);align-items:flex-start;flex-wrap:wrap;animation:rise .26s var(--ease)}
.erow.edit .tx{display:flex;flex-direction:column;gap:8px}
.erow.edit .ops{opacity:1;margin-top:5px}
.erow .kbd{font:11px var(--mono);color:var(--lo)} .erow .kbd b{display:inline-block;padding:1px 6px;border-radius:5px;background:rgba(var(--ink),.08);color:var(--mid);font-weight:600;margin:0 2px}
.erow.flash{animation:edFlash .9s var(--ease)}
@keyframes edFlash{0%{background:color-mix(in srgb,var(--ok) 22%,transparent)}100%{background:transparent}}
.eadd{display:flex;align-items:center;gap:10px;padding:11px 14px;color:var(--mid);cursor:pointer;font-size:13px;font-weight:600;transition:color .12s,background .12s}
.eadd:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent)}
.eadd .pl{width:34px;height:34px;border-radius:11px;border:1.2px dashed currentColor;display:grid;place-items:center;opacity:.8}
.ein{position:relative;display:flex;align-items:center;height:40px;border-radius:var(--r-sm);border:.5px solid var(--line);background:var(--field);transition:border-color .15s,box-shadow .15s}
.ein:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent)}
.ein input{flex:1;min-width:0;height:100%;background:none;border:0;outline:none;color:var(--hi);font:inherit;font-size:14px;padding:0 12px}
.ein.mono input{font-family:var(--mono);font-size:13px}
.ein .pre{padding-left:12px;color:var(--lo);font:13px var(--mono)}
.ein .pre+input{padding-left:2px}
.ein .sfx{display:flex;gap:2px;padding-right:6px}
.ein .sfx button{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:var(--lo)}
.ein .sfx button svg{width:16px;height:16px}
.ein .sfx button:hover{background:rgba(var(--ink),.08);color:var(--hi)}
.ein[aria-disabled]{opacity:.65}
.efield{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.efield>label{font-size:12px;font-weight:700;color:var(--mid);display:flex;gap:8px;align-items:baseline}
.efield>label small{font-weight:500;color:var(--lo)}
.efield .help{font-size:11.5px;color:var(--lo)}
.erow2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.hosts{display:flex;gap:6px;flex-wrap:wrap}
.hosts button{height:28px;padding:0 12px;border-radius:999px;font:12px var(--mono);color:var(--mid);background:rgba(var(--ink),.05);border:.5px solid var(--line);transition:.15s}
.hosts button:hover{color:var(--hi)} .hosts button.on{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 50%,transparent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
/* 工作台：左编辑 + 右侧栏 */
.wbg{flex:1;display:grid;grid-template-columns:1fr 280px;grid-template-rows:minmax(0,1fr);min-height:0;border-top:.5px solid var(--line)}
.wbg .main{display:flex;flex-direction:column;min-height:0;padding:12px 16px 12px 20px}
.wbg .side{border-left:.5px solid var(--line);padding:14px 16px;overflow:auto;background:rgba(var(--ink),.015)}
.wbg .side h5{font-size:11px;font-weight:700;letter-spacing:.4px;color:var(--lo);margin:4px 0 8px;display:flex;align-items:center;gap:8px}
.wbg .side h5 .mk{margin-left:auto;color:var(--accent);letter-spacing:0;opacity:0;transition:opacity .15s}
.wbg .side h5 .mk.on{opacity:1}
.wbg .side h5+*{margin-bottom:16px}
.etbar{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.etbar .ein{height:34px;flex:1;min-width:0} .etbar .ein input{font-size:13px}
.etbar .ein svg.lead{width:15px;height:15px;stroke:var(--lo);fill:none;stroke-width:2;margin-left:10px}
.tmode{display:flex;flex:none;padding:3px;gap:2px;border-radius:999px;background:rgba(var(--ink),.06)}
.tmode button{flex:none;white-space:nowrap;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:700;color:var(--mid);display:flex;align-items:center;gap:6px;cursor:pointer;transition:color .2s,background .24s var(--ease),box-shadow .24s}
.tmode button:not(.on):hover{color:var(--hi);background:rgba(var(--ink),.06)}
.tmode button svg{width:14px;height:14px}
.tmode button.on{color:var(--onAccent);background:var(--accent);box-shadow:0 1px 3px rgba(0,0,0,.18)}
.rules{flex:1;overflow:auto;border-radius:14px;border:.5px solid var(--line);background:var(--pane)}
.rule{display:flex;align-items:center;gap:10px;height:38px;padding:0 8px 0 10px;font:13px var(--mono);position:relative;cursor:text}
.rule+.rule{border-top:.5px solid rgba(var(--ink),.04)}
.rule:hover{background:rgba(var(--ink),.03)}
.rule .no{width:24px;text-align:right;color:var(--lo);font-size:11px}
.rule .kd{font:700 10.5px -apple-system,"PingFang SC",sans-serif;padding:2px 7px;border-radius:999px;flex:none;letter-spacing:.3px}
.rule .kd.k-ig{color:var(--del);background:color-mix(in srgb,var(--del) 14%,transparent)}
.rule .kd.k-ex{color:var(--add);background:color-mix(in srgb,var(--add) 14%,transparent)}
.rule .kd.k-cm{color:var(--lo);background:rgba(var(--ink),.06)}
.rule .p{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rule.rc .p{color:var(--lo);font-style:italic}
.rule.rx .p{color:var(--add)}
.rule .ops{display:flex;gap:2px;opacity:0;transition:opacity .12s} .rule:hover .ops{opacity:1}
.rule .eib{width:26px;height:26px} .rule .eib svg{width:14px;height:14px}
.rule.edit{background:color-mix(in srgb,var(--accent) 7%,transparent);height:auto;padding:6px 8px 6px 10px}
.rule.edit .ein{flex:1;height:32px}
.rule.new{animation:rise .32s var(--ease)}
.rule.hit{background:color-mix(in srgb,var(--memory) 14%,transparent)}
.rule.hit::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;border-radius:2px;background:var(--memory)}
.radd{display:flex;gap:8px;margin-top:10px}
.radd .ein{flex:1;height:36px}
.ted{flex:1;display:flex;border-radius:14px;border:.5px solid var(--line);background:var(--field);overflow:auto;font:13px/22px var(--mono)}
.ted .ln{padding:10px 8px 10px 12px;text-align:right;color:var(--lo);user-select:none;border-right:.5px solid var(--line);font-size:11.5px}
.ted textarea{flex:1;border:0;outline:none;resize:none;background:none;color:var(--hi);font:inherit;padding:10px 12px;white-space:pre;overflow:hidden}
.tchips{display:flex;flex-wrap:wrap;gap:6px}
.tchip{height:30px;padding:0 10px;border-radius:10px;display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--hi);background:rgba(var(--ink),.05);border:.5px solid var(--line);cursor:pointer;transition:.15s}
.tchip svg{width:13px;height:13px;color:var(--accent)}
.tchip:hover{border-color:color-mix(in srgb,var(--accent) 45%,transparent);background:color-mix(in srgb,var(--accent) 8%,transparent)}
.tchip.on{opacity:.45;pointer-events:none}
.cheat{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;font-size:12px;color:var(--mid)}
.cheat code{font:12px var(--mono);color:var(--hi);background:rgba(var(--ink),.07);padding:1px 6px;border-radius:5px;justify-self:start}
.tryres{margin-top:8px;font-size:12px;color:var(--mid);display:flex;gap:6px;align-items:center;min-height:20px}
.tryres b{font-family:var(--mono);font-weight:600}
.tryres .y{color:var(--del)} .tryres .n{color:var(--add)}
/* Git-flow */
.ftypes{display:grid;gap:0}
.ftype{display:grid;grid-template-columns:96px 1fr 150px;gap:12px;align-items:center;padding:10px 14px}
.ftype+.ftype{border-top:.5px solid var(--line)}
.ftype .nm{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13.5px}
.ftype .nm i{width:9px;height:9px;border-radius:50%}
.ftype .ein{height:36px}
.ftype .ex{font:12px var(--mono);color:var(--lo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ftype .ex b{color:var(--hi);font-weight:500}
.wbg .main.scroll{overflow:auto}
.wbg .main.scroll>*{flex:none}
.wbg.flow{grid-template-columns:1fr 316px}
.fcode{font:11.5px/20px var(--mono);color:var(--mid);background:var(--field);border:.5px solid var(--line);border-radius:12px;padding:10px 0;white-space:pre;overflow-x:auto}
.fcode .ln{padding:0 12px 0 9px;border-left:3px solid transparent;transition:background .5s,border-color .5s}
.fcode .ln.chg{background:color-mix(in srgb,var(--accent) 10%,transparent);border-left-color:var(--accent)}
.fcode .k{color:var(--lo)} .fcode .v{color:var(--hi);font-weight:600} .fcode .chg .v{color:var(--accent)}
.fl-dash{animation:fldash .9s linear infinite}
@keyframes fldash{to{stroke-dashoffset:-7}}
.fl-breath{animation:flbreath 1.6s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes flbreath{0%{transform:scale(1);opacity:.35}100%{transform:scale(2.75);opacity:0}}
@media (prefers-reduced-motion:reduce){.fl-dash,.fl-breath{animation:none}.fl-breath{opacity:0}}
.ftype .ex b{transition:color .2s}
.ftype .ex.swap{animation:flswap .22s ease-out}
@keyframes flswap{from{opacity:0;transform:translateX(4px)}to{opacity:1;transform:none}}
.fhint{grid-column:2/-1;display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--warn,#c98a2b);margin-top:-4px;animation:flswap .2s ease-out}
.fhint.bad{color:var(--danger)} .fhint .lk{margin-left:auto;color:var(--accent);font-weight:700;cursor:pointer}
.fdev{display:flex;gap:6px;align-items:flex-start;font-size:11.5px;line-height:1.4;color:var(--lo);margin-top:6px;animation:flswap .2s ease-out}
.fdev.new{color:var(--memory)} .fdev.bad{color:var(--danger)}
.fmap{position:relative;height:150px}
.fmap svg{width:100%;height:100%}
</style>`);

/* ── 积木 ── */
const ein=(v,{mono=1,ph='',id='',pre='',sfx='',type='text',dis=0}={})=>`<div class="ein ${mono?'mono':''}" ${dis?'aria-disabled="true"':''}>${pre?`<span class="pre">${pre}</span>`:''}<input ${id?`id="${id}"`:''} type="${type}" value="${v}" placeholder="${ph}" ${dis?'disabled':''}>${sfx?`<span class="sfx">${sfx}</span>`:''}</div>`;
const efield=(label,body,{small='',help=''}={})=>`<div class="efield"><label>${label}${small?`<small>${small}</small>`:''}</label>${body}${help?`<div class="help">${help}</div>`:''}</div>`;
const eib=(ic,tip,cls='',attr='')=>`<button class="eib ${cls}" title="${tip}" ${attr}>${svg(ic)}</button>`;
const tint=c=>`background:color-mix(in srgb,${c} 16%,transparent);color:color-mix(in srgb,${c} var(--tt),var(--hi))`;
function edShell(icon,color,title,sub,body,{wb=0,foot=''}={}){
  openDlg(`<div class="dh"><div class="blk" style="${tint(color)}">${svg(icon)}</div><h3>${title}${sub?`<small>${sub}</small>`:''}</h3><button class="ib" data-close>${svg('x')}</button></div>${wb?body:`<div class="ebody">${body}</div>`}<div class="efoot"><span class="est" id="edSt"><i></i><span>${foot}</span></span><button class="ghost rp" data-close>取消</button><button class="slab rp" id="edSave" disabled>保存</button></div>`,'ed'+(wb?' wb':''));
  scrim.querySelector('#edSave').onclick=()=>{closeDlg();setTimeout(()=>moment({scene:'info',title:'已保存',sub:title}),280)};
}
function edDirty(on,msg){const st=document.getElementById('edSt');if(!st)return;st.classList.toggle('dirty',on);st.querySelector('span').textContent=on?(msg||'有未保存的更改'):st.dataset.idle||'';document.getElementById('edSave').disabled=!on}
function selectEnd(inp){inp.focus();inp.select()}

/* ── 仓库设置：远程地址原地编辑 ── */
const RMT=[['origin','https://github.com/ShaoAsher/otter-git.git'],['upstream','git@gitee.com:shaw/otter-git.git']];
function repoSettings(){
  const remoteRows=()=>RMT.map(([n,u],i)=>`<div class="erow" data-r="${i}"><div class="b" style="${tint('var(--memory)')}">${svg('cloud')}</div><div class="tx"><b>${n}</b><span>${u}</span></div><div class="ops">${eib('copy','复制地址')}${eib('edit','编辑地址','','data-ed')}${eib('trash','移除远程','dz','data-rm')}</div></div>`).join('')+`<div class="eadd" id="rAdd"><span class="pl">${svg('plus')}</span>添加远程仓库</div>`;
  edShell('folder','var(--accent)','仓库设置','OtterGitApp',`
    <div class="slabel">位置</div>
    <div class="egroup"><div class="erow"><div class="b" style="${tint('var(--accent)')}">${svg('folder')}</div><div class="tx"><b>本地路径</b><span>~/Desktop/code/OtterGit/OtterGitApp</span></div><div class="ops keep">${eib('copy','复制路径')}${eib('finder','在访达中显示')}</div></div></div>
    <div class="slabel">远程仓库<span class="c">${RMT.length} 个</span></div>
    <div class="egroup" id="rList">${remoteRows()}</div>
    <div class="slabel">提交身份<span class="c">只对本仓库生效</span></div>
    <div class="egroup pad"><div class="erow2">${efield('名字',ein('shaw',{mono:0,ph:'留空则用全局',id:'idName'}),{small:'user.name'})}${efield('邮箱',ein('shaw@otter.dev',{ph:'留空则用全局',id:'idMail'}),{small:'user.email'})}</div><div class="efield"><div class="help">全局身份：shaw · shaw@otter.dev（在「设置 › Git」里改）</div></div></div>
    <div class="slabel">远程账号<span class="c">github.com · 钥匙串</span></div>
    <div class="egroup"><div class="erow"><div class="b" style="${tint('var(--info)')}">${svg('key')}</div><div class="tx"><b>ShaoAsher</b><span>令牌 ghp_••••••••••••••••7Kq2</span></div><div class="ops keep">${eib('view','显示令牌','','id="tokEye"')}${eib('copy','复制令牌')}<button class="ghost sm rp" id="accEdit">编辑</button></div></div></div>`,{foot:'远程地址按 ✓ 立即生效；提交身份改完点保存'});
  document.getElementById('edSt').dataset.idle='远程地址按 ✓ 立即生效；提交身份改完点保存';
  const list=document.getElementById('rList');
  ['idName','idMail'].forEach(id=>document.getElementById(id).oninput=()=>edDirty(true));
  const tok=document.getElementById('tokEye');let shown=0;tok.onclick=()=>{shown^=1;tok.innerHTML=svg(shown?'hide':'view');tok.title=shown?'隐藏令牌':'显示令牌';tok.closest('.erow').querySelector('.tx span').textContent=shown?'令牌 ghp_8fJ2mQ0wZ4cR9sT1uV6xY3aB7Kq2':'令牌 ghp_••••••••••••••••7Kq2'};
  document.getElementById('accEdit').onclick=()=>accountEdit(true);
  const wire=()=>{
    list.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>editRow(b.closest('.erow')));
    list.querySelectorAll('.erow[data-r]').forEach(r=>r.ondblclick=()=>editRow(r));
    list.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{const r=b.closest('.erow');r.style.transition='opacity .2s,transform .2s';r.style.opacity=0;r.style.transform='translateX(12px)';setTimeout(()=>{RMT.splice(+r.dataset.r,1);list.innerHTML=remoteRows();wire()},200)});
    document.getElementById('rAdd').onclick=()=>{const add=document.getElementById('rAdd');add.insertAdjacentHTML('beforebegin',`<div class="erow edit" data-new><div class="b" style="${tint('var(--memory)')}">${svg('cloud')}</div><div class="tx"><div class="erow2" style="grid-template-columns:140px 1fr;gap:8px">${ein('',{ph:'名称，如 origin',id:'nName'})}${ein('',{ph:'https://… 或 git@…',id:'nUrl'})}</div><span class="kbd sans"><b>↵</b>添加 <b>Esc</b>取消</span></div><div class="ops">${eib('check','添加','ok','data-ok')}${eib('x','取消','','data-no')}</div></div>`);add.style.display='none';
      const row=list.querySelector('[data-new]');selectEnd(document.getElementById('nName'));
      const ok=()=>{const n=document.getElementById('nName').value.trim(),u=document.getElementById('nUrl').value.trim();if(!n||!u)return;RMT.push([n,u]);list.innerHTML=remoteRows();wire();list.querySelector(`[data-r="${RMT.length-1}"]`).classList.add('flash')};
      const no=()=>{list.innerHTML=remoteRows();wire()};
      row.querySelector('[data-ok]').onclick=ok;row.querySelector('[data-no]').onclick=no;row.onkeydown=e=>{if(e.key==='Enter')ok();if(e.key==='Escape'){e.stopPropagation();no()}}};
  };
  function editRow(r){
    if(list.querySelector('.edit'))return;
    const i=+r.dataset.r,[n,u]=RMT[i];r.classList.add('edit');
    r.querySelector('.tx').innerHTML=`<b>${n}</b>${ein(u,{id:'rUrl'})}<span class="kbd sans"><b>↵</b>保存 <b>Esc</b>取消 · 同时修改 fetch 与 push 地址</span>`;
    r.querySelector('.ops').innerHTML=eib('check','保存','ok','data-ok')+eib('x','取消','','data-no');
    const inp=document.getElementById('rUrl');selectEnd(inp);
    const ok=()=>{const v=inp.value.trim();if(!v)return;const ch=v!==u;RMT[i][1]=v;list.innerHTML=remoteRows();wire();if(ch)list.querySelector(`[data-r="${i}"]`).classList.add('flash')};
    const no=()=>{list.innerHTML=remoteRows();wire()};
    r.querySelector('[data-ok]').onclick=ok;r.querySelector('[data-no]').onclick=no;
    inp.onkeydown=e=>{if(e.key==='Enter')ok();if(e.key==='Escape'){e.stopPropagation();no()}};
  }
  wire();
}

/* ── 远程账号：编辑 ── */
function accountEdit(edit){
  edShell(edit?'edit':'user','var(--info)',edit?'编辑远程账号':'添加远程账号',edit?'ShaoAsher@github.com':'凭据保存在系统钥匙串',`
    ${efield('主机',`<div class="hosts" id="hosts">${['github.com','gitee.com','gitlab.com'].map(h=>`<button class="${h==='github.com'?'on':''}">${h}</button>`).join('')}</div>`)}
    ${efield('',ein('github.com',{id:'aHost',ph:'例如 github.com'}))}
    ${efield('用户名',ein(edit?'ShaoAsher':'',{mono:0,ph:'登录名或邮箱',id:'aUser'}))}
    ${efield('密码 / 访问令牌',ein('',{type:'password',ph:edit?'修改时需重新输入':'推荐使用访问令牌',id:'aPw',sfx:`<button id="aEye" title="显示">${svg('view')}</button>`}),{help:'GitHub 已不再支持密码推送，请使用 Personal access token。'})}`);
  const host=document.getElementById('aHost');
  document.querySelectorAll('#hosts button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#hosts button').forEach(x=>x.classList.toggle('on',x===b));host.value=b.textContent;edDirty(true)});
  const pw=document.getElementById('aPw'),eye=document.getElementById('aEye');
  eye.onclick=()=>{const s=pw.type==='password';pw.type=s?'text':'password';eye.innerHTML=svg(s?'hide':'view');eye.title=s?'隐藏':'显示'};
  [host,document.getElementById('aUser'),pw].forEach(i=>i.oninput=()=>edDirty(!!pw.value));
  scrim.querySelector('.efield label:empty')?.remove();
}

/* ── Git-flow 分支设置 ── */
function flowSettings(){
  const T=[['feature','功能','var(--ok)','login'],['release','发布','var(--memory)','2.1.0'],['hotfix','热修复','var(--danger)','2.0.2'],['support','支持','var(--alt)','1.x']];
  const BR={main:'2 小时前',dev:'3 天前',release:'5 天前'};
  let master='main',develop='dev';
  edShell('flow','var(--ok)','Git-flow 分支设置','决定 开始 / 完成 时分支从哪里来、合到哪里去',`<div class="wbg flow"><div class="main scroll">
    <div class="slabel" style="margin-top:2px">主干分支</div>
    <div class="egroup pad"><div class="erow2">${efield('生产分支',selBtn('branch','main'),{small:'发布后合入'})}<div>${efield('开发分支',ein('dev',{id:'fp-dev'}),{small:'日常集成'})}<div class="fdev" id="fdev"></div></div></div></div>
    <div class="slabel">分支前缀<span class="lk" id="fReset" style="display:none">↺ 恢复默认</span><span class="c" id="fNote">右侧是开始时会创建的分支名</span></div>
    <div class="egroup ftypes">${T.map(([k,l,c,ex])=>`<div class="ftype"><span class="nm"><i style="background:${c};box-shadow:0 0 6px ${c}"></i>${l}</span>${ein(k+'/',{id:'fp-'+k})}<span class="ex" data-ex="${k}"><b style="color:${c}">${k}/</b>${ex}</span><div data-h="${k}"></div></div>`).join('')}</div>
    <div class="slabel">版本标签</div>
    <div class="egroup pad">${efield('标签前缀',ein('v',{id:'fp-tag',ph:'可留空'}),{small:'完成 release / hotfix 时打的标签',help:'例：完成 release/2.1.0 → 打标签 <b style="font-family:var(--mono);color:var(--hi)" id="tagEx">v2.1.0</b>'})}</div>
  </div><div class="side" style="--tone:var(--ok)"><h5>分支走向</h5><div class="fmap" id="fmap"></div><h5>将写入 .git/config · [gitflow]<span class="mk" id="fMk">已修改</span></h5><div class="fcode" id="fcode"></div></div></div>`,{wb:1});
  const g=k=>document.getElementById('fp-'+k).value.trim();
  const pairs=()=>[['branch.master',master],['branch.develop',g('dev')],['prefix.feature',g('feature')||'feature/'],['prefix.release',g('release')||'release/'],['prefix.hotfix',g('hotfix')||'hotfix/'],['prefix.support',g('support')||'support/'],['prefix.versiontag',g('tag')]];
  const saved=Object.fromEntries(pairs());
  const draw=()=>{
    T.forEach(([k,l,c,ex])=>{const el=document.querySelector(`[data-ex="${k}"]`),pre=g(k)||k+'/';
      if(el.dataset.p!==pre){el.dataset.p=pre;el.innerHTML=`<b style="color:${c}">${pre}</b>${ex}`;el.classList.remove('swap');void el.offsetWidth;el.classList.add('swap')}
      const v=g(k),dup=v&&T.find(([o])=>o!==k&&g(o)===v),h=document.querySelector(`[data-h="${k}"]`);
      const html=dup?`<div class="fhint bad">⚠ 和「${dup[1]}」的前缀重复了</div>`:(v&&!v.endsWith('/')?`<div class="fhint">⚠ 建议以 / 结尾，同类分支会归到一个文件夹里<span class="lk" data-fix="${k}">✓ 加上 /</span></div>`:'');
      if(h.dataset.s!==html){h.dataset.s=html;h.innerHTML=html;h.style.display=html?'contents':'none'}});
    scrim.querySelectorAll('[data-fix]').forEach(b=>b.onclick=()=>{const i=document.getElementById('fp-'+b.dataset.fix);i.value=i.value.trim()+'/';draw()});
    const isDef=T.every(([k])=>g(k)===k+'/');document.getElementById('fReset').style.display=isDef?'none':'';document.getElementById('fNote').style.display=isDef?'':'none';
    const dev=g('dev'),fd=document.getElementById('fdev');
    fd.className='fdev'+(dev===master?' bad':(dev&&!BR[dev]?' new':''));
    fd.innerHTML=dev===master?'⚠ 生产分支和开发分支不能是同一个':!dev?'填写开发分支名':BR[dev]?`✓ 已存在 · 最后提交 ${BR[dev]}`:`✦ ${dev} 还不存在，保存时会从 ${master} 创建`;
    document.getElementById('tagEx').textContent=g('tag')+'2.1.0';
    const ps=pairs(),chg=ps.filter(([k,v])=>saved[k]!==v).map(([k])=>k);
    document.getElementById('fcode').innerHTML=ps.map(([k,v])=>`<div class="ln ${chg.includes(k)?'chg':''}"><span class="k">${k}</span> = <span class="v">${v||'""'}</span></div>`).join('');
    document.getElementById('fMk').classList.toggle('on',chg.length>0);
    edDirty(chg.length>0&&dev!==master,`改了 ${chg.length} 项 · 保存后写入本仓库配置`);
    const fe=g('feature')||'feature/',re=g('release')||'release/';
    document.getElementById('fmap').innerHTML=`<svg viewBox="0 0 248 150" fill="none" stroke-linecap="round">
      <text x="0" y="22" fill="var(--mid)" font-size="11" font-weight="700">${master}</text><path d="M44 18H244" stroke="var(--memory)" stroke-width="2"/>
      <text x="0" y="74" fill="var(--mid)" font-size="11" font-weight="700">${dev||'develop'}</text><path d="M44 70H244" stroke="var(--accent)" stroke-width="2"/>
      <path class="fl-dash" d="M70 70c0 30 20 50 40 50h40c20 0 30-20 30-50" stroke="var(--ok)" stroke-width="1.6" stroke-dasharray="4 3"/><text x="96" y="140" fill="var(--ok)" font-size="10" font-family="SF Mono,Menlo,monospace">${fe}…</text>
      <path class="fl-dash" d="M196 70c0-30 20-52 34-52" stroke="var(--memory)" stroke-width="1.6" stroke-dasharray="4 3"/><text x="150" y="44" fill="var(--memory)" font-size="10" font-family="SF Mono,Menlo,monospace">${re}…</text>
      <circle class="fl-breath" cx="180" cy="70" r="4" fill="var(--ok)"/><circle class="fl-breath" cx="230" cy="18" r="4" fill="var(--memory)"/>
      ${[70,180,196].map(x=>`<circle cx="${x}" cy="70" r="4" fill="var(--raised)" stroke="var(--accent)" stroke-width="2"/>`).join('')}<circle cx="230" cy="18" r="4" fill="var(--raised)" stroke="var(--memory)" stroke-width="2"/></svg>`;
  };
  document.getElementById('fReset').onclick=()=>{T.forEach(([k])=>document.getElementById('fp-'+k).value=k+'/');draw()};
  scrim.querySelectorAll('.ein input').forEach(i=>i.oninput=draw);
  wireForm();draw();
}

/* ── 忽略规则编辑器：规则列表 / 文本 双模式 + 模板 + 试一下 ── */
let IGN=['# 构建产物','build/','.dart_tool/','*.log','','# 系统与编辑器','.DS_Store','.idea/','.vscode/','!.vscode/settings.json','','# 本地配置','.env','*.local'];
function ignoreEditor(scope='repo'){
  const global=scope==='global';
  const TPL=[['macOS','.DS_Store'],['Flutter','build/'],['Node','node_modules/'],['日志','*.log'],['环境变量','.env'],['JetBrains','.idea/'],['VS Code','.vscode/'],['Xcode','xcuserdata/']];
  edShell('eye','var(--ok)',global?'全局忽略规则':'本仓库忽略规则',global?'~/.gitignore_global · 对所有仓库生效':'.gitignore · 会随仓库提交',`<div class="wbg"><div class="main">
    <div class="etbar"><div class="tmode" id="tmode"><button class="on" data-m="list">${svg('list')}规则</button><button data-m="text">${svg('file')}文本</button></div><div class="ein" style="margin-left:auto"><svg class="lead" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg><input id="rq" placeholder="筛选规则"></div></div>
    <div id="rview" style="flex:1;display:flex;flex-direction:column;min-height:0"></div>
  </div><div class="side" style="--tone:var(--ok)">
    <h5>常用规则</h5><div class="tchips" id="tpl">${TPL.map(([l,r])=>`<span class="tchip" data-r="${r}" title="${r}">${svg('plus')}${l}</span>`).join('')}</div>
    <h5>试一下</h5><div>${ein('lib/build/app.dill',{id:'tryP',ph:'输入文件路径'})}<div class="tryres" id="tryR"></div></div>
    <h5>写法</h5><div class="cheat"><code>build/</code><span>忽略整个目录</span><code>*.log</code><span>匹配任意 .log 文件</span><code>/todo.txt</code><span>只匹配根目录</span><code>!keep.log</code><span>例外：不要忽略</span><code># …</code><span>注释</span></div>
  </div></div>`,{wb:1,foot:'规则 '+IGN.filter(l=>l&&!l.startsWith('#')).length+' 条'});
  const st=document.getElementById('edSt');let mode='list',q='',editing=-1,hits=new Set();
  const kind=l=>!l.trim()?'':l.startsWith('#')?'cm':l.startsWith('!')?'ex':'ig';
  const count=()=>{st.dataset.idle='规则 '+IGN.filter(l=>l&&!l.startsWith('#')).length+' 条';if(!st.classList.contains('dirty'))st.querySelector('span').textContent=st.dataset.idle};
  const touch=()=>{edDirty(true,'有未保存的更改 · 规则 '+IGN.filter(l=>l&&!l.startsWith('#')).length+' 条');syncTpl();tryIt()};
  const syncTpl=()=>document.querySelectorAll('#tpl .tchip').forEach(c=>{const on=IGN.includes(c.dataset.r);c.classList.toggle('on',on);c.querySelector('svg').innerHTML=IC[on?'check':'plus'];c.title=on?`已包含 ${c.dataset.r}`:`添加 ${c.dataset.r}`});
  const view=document.getElementById('rview');
  const ruleHTML=(l,i)=>{const k=kind(l);if(!k)return'';if(i===editing)return`<div class="rule edit" data-i="${i}"><span class="no">${i+1}</span>${ein(l,{id:'reIn'})}${eib('check','保存','ok','data-ok')}${eib('x','取消','','data-no')}</div>`;
    return`<div class="rule ${k==="cm"?"rc":k==="ex"?"rx":""} ${hits.has(i)?'hit':''}" data-i="${i}"><span class="no">${i+1}</span><span class="kd k-${k}">${{ig:'忽略',ex:'例外',cm:'注释'}[k]}</span><span class="p">${l.replace(/</g,'&lt;')}</span><span class="ops">${eib('edit','编辑','','data-ed')}${eib('trash','删除','dz','data-rm')}</span></div>`};
  const render=()=>{
    if(mode==='text'){view.innerHTML=`<div class="ted"><div class="ln" id="tln"></div><textarea id="tta" spellcheck="false"></textarea></div>`;const ta=document.getElementById('tta'),ln=document.getElementById('tln');
      const fit=()=>{ln.innerHTML=ta.value.split('\n').map((_,i)=>i+1).join('<br>');ta.style.height='auto';ta.style.height=ta.scrollHeight+'px'};ta.value=IGN.join('\n');fit();ta.oninput=()=>{IGN=ta.value.split('\n');fit();touch()};ta.focus();return}
    const list=IGN.map((l,i)=>[l,i]).filter(([l])=>!q||l.toLowerCase().includes(q));
    view.innerHTML=`<div class="rules">${list.map(([l,i])=>ruleHTML(l,i)).join('')||'<div class="mempty">没有匹配的规则</div>'}</div><div class="radd">${ein('',{id:'rNew',ph:'添加一条规则，如 coverage/ 或 *.tmp'})}<button class="slab rp" id="rNewGo" style="height:36px">添加</button></div>`;
    view.querySelectorAll('.rule:not(.edit)').forEach(r=>{r.ondblclick=()=>{editing=+r.dataset.i;render()};});
    view.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>{editing=+b.closest('.rule').dataset.i;render()});
    view.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{IGN.splice(+b.closest('.rule').dataset.i,1);render();touch()});
    const ed=document.getElementById('reIn');if(ed){selectEnd(ed);const ok=()=>{const v=ed.value.trim();if(v&&v!==IGN[editing]){IGN[editing]=v;touch()}editing=-1;render()};const no=()=>{editing=-1;render()};
      ed.onkeydown=e=>{if(e.key==='Enter')ok();if(e.key==='Escape'){e.stopPropagation();no()}};view.querySelector('[data-ok]').onclick=ok;view.querySelector('[data-no]').onclick=no}
    const nw=document.getElementById('rNew'),add=v=>{v=v.trim();if(!v||IGN.includes(v))return;IGN.push(v);q='';document.getElementById('rq').value='';render();touch();const rs=view.querySelector('.rules');rs.lastElementChild.classList.add('new');rs.scrollTop=rs.scrollHeight};
    document.getElementById('rNewGo').onclick=()=>add(nw.value);nw.onkeydown=e=>{if(e.key==='Enter')add(nw.value)};
    view._add=add;
  };
  const tm=document.getElementById('tmode');
  tm.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.m===mode)return;tm.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));mode=b.dataset.m;IGN=IGN.slice();editing=-1;render()});
  document.getElementById('rq').oninput=e=>{q=e.target.value.toLowerCase();if(mode==='list')render()};
  document.querySelectorAll('#tpl .tchip').forEach(c=>c.onclick=()=>{if(mode==='text'){IGN.push(c.dataset.r);render();touch()}else view._add(c.dataset.r)});
  const glob=p=>new RegExp('^'+p.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*\*/g,'§').replace(/\*/g,'[^/]*').replace(/§/g,'.*').replace(/\?/g,'[^/]')+'$');
  const match=(rule,path)=>{let r=rule.replace(/^!/,'');const dir=r.endsWith('/');r=r.replace(/\/$/,'');const anchored=r.startsWith('/')||r.slice(0,-1).includes('/');r=r.replace(/^\//,'');const segs=path.split('/');
    if(anchored)return glob(r).test(path)||(dir&&path.startsWith(r+'/'));
    return segs.some((s,i)=>glob(r).test(s)&&(!dir||i<segs.length-1))};
  function tryIt(){const p=document.getElementById('tryP').value.trim(),out=document.getElementById('tryR');hits=new Set();if(!p){out.innerHTML='';return}
    let last=-1;IGN.forEach((l,i)=>{if(kind(l)==='ig'||kind(l)==='ex'){if(match(l,p))last=i}});
    if(last<0)out.innerHTML=`<span class="n">●</span>不会被忽略`;else{hits.add(last);out.innerHTML=IGN[last].startsWith('!')?`<span class="n">●</span>被例外放行 · 第 ${last+1} 行 <b>${IGN[last]}</b>`:`<span class="y">●</span>会被忽略 · 第 ${last+1} 行 <b>${IGN[last]}</b>`}
    if(mode==='list'&&editing<0)render()}
  document.getElementById('tryP').oninput=tryIt;
  render();syncTpl();count();tryIt();
}

Object.assign(DLG,{repoSettings,accountEdit:()=>accountEdit(true),flowSettings,ignoreRepo:()=>ignoreEditor('repo'),ignoreGlobal:()=>ignoreEditor('global')});

/* 入口：仓库右键「仓库设置…」、设置 › 忽略规则 的两行 */
scrim.addEventListener('click',e=>{const r=e.target.closest('.srow');if(!r)return;const t=r.querySelector('.tx b')?.textContent;
  if(t==='本仓库规则'||t==='全局 .gitignore'){closeDlg();setTimeout(()=>ignoreEditor(t==='本仓库规则'?'repo':'global'),280)}});

document.querySelector('#console h2:last-of-type').insertAdjacentHTML('beforebegin',`<h2>编辑页（v5 规范）</h2><div class="opt" data-k="edit">${[['repoSettings','仓库设置'],['accountEdit','远程账号'],['flowSettings','Git-flow 分支设置'],['ignoreRepo','忽略规则'],['ignoreGlobal','全局忽略']].map(([k,l])=>`<button data-e="${k}">${l}</button>`).join('')}</div><p>远程地址：点铅笔或双击行原地编辑，回车保存、Esc 取消。忽略规则：双击规则编辑，右侧「试一下」会高亮命中的那一行。</p>`);
document.getElementById('console').addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(!b)return;e.stopImmediatePropagation();if(S.page==='home')go('files');DLG[b.dataset.e]()},true);
