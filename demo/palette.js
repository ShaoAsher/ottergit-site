/* ═══ 家族主题色：一套配色同时定义 Git / 水獭游时 / 工具 三个产品 ═══
   每套：git/gt/tl 圆盘渐变（图标 + 品牌），acc 界面强调色（夜/昼），on 强调色上的字色。 */
const PALETTES=[
  {id:'final',name:'定稿',git:['#E89B0C','#FFD66B'],acc:['#FFC23D','#A86A00'],on:['#2A1A00','#FFFFFF'],gt:['#1E94C8','#5CD6E6'],tl:['#FA5A1E','#FFB04A'],mod:['#7AA2FF','#3F63C9'],
   note:'水獭 Git：琥珀金 · 水獭工具：獭橙（原 Git 的颜色）· 水獭游时：磁青不变。琥珀金和原来的「修改」黄几乎一样，所以 Git 里「修改 M」改用蓝紫色，保证状态一眼能分清。'},
  {id:'old',name:'原配色（对照）',git:['#FA5A1E','#FFB04A'],acc:['#FF8A3D','#D9581C'],on:['#1A0E06','#FFFFFF'],gt:['#1E94C8','#5CD6E6'],tl:['#6F37B6','#A46DD9'],
   note:'改动前：Git 獭橙 · 工具紫 · 水獭游时磁青。'}
];
const GLYPH={git:'<path d="M8 5v14M8 12h6"/><circle cx="8" cy="5" r="1.7"/><circle cx="8" cy="19" r="1.7"/><circle cx="16.5" cy="12" r="1.9"/>',gt:'<rect x="4" y="8" width="16" height="9" rx="4.5"/><path d="M8 11v3M6.5 12.5h3M15 12h.01M17 13.5h.01"/>',tl:'<path d="M14 6a4 4 0 0 0 5 5l-8 8-3-3 8-8a4 4 0 0 0-2-2z"/>'};
function famIcon(k,s=40,extra=''){return `<span class="ficon k-${k} ${extra}" style="--s:${s}px"><i class="d"></i><i class="o"></i><i class="g"><svg viewBox="0 0 24 24">${GLYPH[k]}</svg></i></span>`}

document.head.insertAdjacentHTML('beforeend',`<style>
.ficon{width:var(--s);height:var(--s);border-radius:calc(var(--s)*.225);background:radial-gradient(circle at 50% 45%,#17152a,#0B0A14);position:relative;flex:none;display:inline-block;vertical-align:middle}
.ficon .d{position:absolute;inset:7.5%;border-radius:50%;background:linear-gradient(45deg,var(--c1),var(--c2));box-shadow:inset calc(var(--s)*-.05) calc(var(--s)*-.07) calc(var(--s)*.15) rgba(0,0,0,.18),inset calc(var(--s)*.05) calc(var(--s)*.05) calc(var(--s)*.12) rgba(255,255,255,.18);transition:background .62s}
.ficon .o{position:absolute;left:20%;top:20%;width:60%;height:60%;background:#0B0A14;-webkit-mask:url(assets/brand/otter_white.png) center/contain no-repeat;mask:url(assets/brand/otter_white.png) center/contain no-repeat}
.ficon .g{position:absolute;left:72.5%;top:72.5%;width:21%;height:21%;border-radius:50%;background:#fff;box-shadow:0 0 0 calc(var(--s)*.02) #0B0A14;display:grid;place-items:center}
.ficon .g svg{width:64%;height:64%;stroke:#0B0A14;stroke-width:2.6;fill:none;stroke-linecap:round;stroke-linejoin:round}
.k-git{--c1:var(--git1);--c2:var(--git2)} .k-gt{--c1:var(--gt1);--c2:var(--gt2)} .k-tl{--c1:var(--tl1);--c2:var(--tl2)}
.ficon.pop{animation:fpop .62s var(--pop)} @keyframes fpop{0%{transform:scale(.6) rotate(-14deg)}}
.mark{background:none!important;display:grid;place-items:center}
.logo .disc{background:linear-gradient(45deg,var(--git1),var(--git2))!important;transition:background .62s}
.logo .ring{border-color:var(--git2)!important} .logo .ring.r2{border-color:#fff!important}
.commit-dot{background:radial-gradient(circle at 35% 30%,#fff,color-mix(in srgb,var(--git2) 40%,#fff) 40%,var(--git2) 75%,var(--git1))!important;box-shadow:0 0 12px var(--git2)!important}
#console .opt button.on{background:var(--accent)!important;border-color:var(--accent)!important;color:var(--onAccent)!important}
.family .ficon{display:block;margin:0 auto 8px}
.home-card .ficon{flex:none}
#famPreview{display:flex;gap:10px;margin-top:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
#famPreview div{flex:1;text-align:center;font-size:11px;color:#a09bb4}
#famPreview .ficon{display:block;margin:0 auto 6px}
#famPreview .sw3{display:flex;height:6px;border-radius:3px;overflow:hidden;margin-top:4px}
</style>`);

/* 控制台：主题色区块 */
document.querySelector('#console .opt[data-k=theme]').insertAdjacentHTML('afterend',`<h2>主题色 · 全家族</h2><div class="opt" data-k="pal">${PALETTES.map(p=>`<button data-v="${p.id}">${p.name}</button>`).join('')}</div><div id="famPreview"></div><p id="palNote"></p>`);

function applyPalette(id){
  const p=PALETTES.find(x=>x.id===id)||PALETTES[0],day=S.theme==='day'?1:0,r=document.documentElement.style;
  if(p.mod)r.setProperty('--mod',p.mod[day]);else r.removeProperty('--mod');
  S.pal=p.id;
  r.setProperty('--git1',p.git[0]);r.setProperty('--git2',p.git[1]);
  r.setProperty('--gt1',p.gt[0]);r.setProperty('--gt2',p.gt[1]);r.setProperty('--tl1',p.tl[0]);r.setProperty('--tl2',p.tl[1]);
  r.setProperty('--accent',p.acc[day]);r.setProperty('--accent2',p.git[1]);r.setProperty('--onAccent',p.on[day]);
  TONES.night.dawn[0]=p.acc[0]+'2E';TONES.night.dawn[3]=p.git[1]+'14';TONES.night.calm[1]=p.acc[0]+'14';
  TONES.day.dawn[0]=p.git[1]+'66';CUR.night.dawn=p.git[1];CUR.day.dawn=p.acc[1];
  LANE[0]=p.acc[day];AUTHOR.shaw[0]=p.acc[day];REPOS[0][3]=p.acc[day];
  const mg=document.querySelector('#repoGrid .mg');if(mg)mg.style.background=p.acc[day];
  document.getElementById('famPreview').innerHTML=[['gt','水獭游时'],['tl','水獭工具'],['git','水獭 Git']].map(([k,n])=>`<div>${famIcon(k,40,'pop')}${n}<div class="sw3"><i style="flex:1;background:${p[k][0]}"></i><i style="flex:1;background:${p[k][1]}"></i></div></div>`).join('');
  document.getElementById('palNote').textContent=p.note;
  setEnv();if(S.page==='history')renderHistory();markConsole();
  document.querySelectorAll('#app .ficon,.scrim .ficon').forEach(f=>{f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop')});
}
document.querySelector('#console .opt[data-k=pal]').addEventListener('click',e=>{const b=e.target.closest('button');if(b)applyPalette(b.dataset.v)});
const _setTheme=setTheme;setTheme=t=>{_setTheme(t);applyPalette(S.pal)};

document.querySelector('.mark').innerHTML=famIcon('git',32);
applyPalette('final');
