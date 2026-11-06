/* ═══ 嵌入模式：官网用 iframe 载入 index.html?embed ═══
   ?embed           隐藏右侧控制台，窗口按 iframe 尺寸缩放
   &theme=day       浅色
   &page=files      起始页（home / files / history / repos）
   &nosplash        跳过启动动画
   外部控制：postMessage({type:'otter-demo',action,value}) 或 window.demo.<action>(value)
   状态回传：parent 收到 {type:'otter-demo-state',page,theme,tone,ai} */
(()=>{
  const q=new URLSearchParams(location.search);
  const actions={
    page:v=>go(v),
    theme:v=>setTheme(v==='day'?'day':'night'),
    tone:v=>{S.tone=v;if(S.page==='home'||S.page==='repos')go('files');syncTone()},
    commit:()=>{if(S.page!=='files')go('files');if(!files.length){files=[['M','lib/views/home/','home_view.dart'],['A','lib/widgets/otter/','ambient_backdrop.dart']];checked=new Set([0,1]);S.tone='warm';syncTone()}if(!checked.size)checked=new Set(files.map((_,i)=>i));setTimeout(doCommit,240)},
    push:()=>{if(S.page==='home')go('files');ahead=ahead||1;doPush()},
    conflict:()=>{S.tone='alert';if(S.page!=='files')go('files');syncTone()},
    resolve:()=>{const b=document.getElementById('resolveBtn');if(b)b.click()},
    ai:v=>{if(v==='run')document.querySelector('#console [data-ai=run]').click();else setOpen(v!=='close')},
    settings:()=>go('settings'),
    viewer:()=>{if(S.page!=='files')go('files');setTimeout(()=>document.getElementById('wcFull')?.click(),240)},
    reset:()=>location.reload()
  };
  window.demo=actions;
  addEventListener('message',e=>{const d=e.data;if(d&&d.type==='otter-demo'&&actions[d.action])actions[d.action](d.value)});
  const report=()=>{if(parent!==window)parent.postMessage({type:'otter-demo-state',page:S.page,theme:S.theme,tone:S.tone,ai:typeof AI!=='undefined'&&AI.open},'*')};
  const _m=markConsole;markConsole=()=>{_m();report()};

  if(!q.has('embed'))return;
  document.documentElement.classList.add('embed');
  document.head.insertAdjacentHTML('beforeend','<style>.embed #console{display:none}.embed #stage{padding:0}.embed,.embed body{background:transparent}.embed #win{box-shadow:0 30px 80px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.08)}</style>');
  const fit2=()=>{const k=Math.max(.2,Math.min((innerWidth-2)/1280,(innerHeight-2)/800,1.25));document.getElementById('win').style.transform=`scale(${k})`};
  addEventListener('resize',fit2);fit2();
  if(q.get('theme')==='day')setTheme('day');
  if(q.has('nosplash')){const sp=document.getElementById('splash');sp.classList.remove('on');sp.style.opacity=0}
  const p=q.get('page');if(p)go(p);
  report();
})();
