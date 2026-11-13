/* ═══ 菜单系统（下拉 / 右键 / 二级联动 / 搜索）+ 仓库列表页 + 操作弹窗 ═══ */
Object.assign(IC,{
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',edit:'<path d="M4 20h4L20 8l-4-4L4 16z"/>',reset:'<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/>',
  cherry:'<circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M7 14c1-6 4-9 10-10M17 14c0-4-2-7-5-9"/>',revert:'<path d="M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  patch:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M12 10v6"/>',flow:'<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6c6 0 8 2 8 6M8 18c6 0 8-2 8-6"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',check:'<path d="M5 12l5 5 9-10"/>',group:'<rect x="3" y="4" width="8" height="7" rx="2"/><rect x="13" y="4" width="8" height="7" rx="2"/><rect x="3" y="13" width="8" height="7" rx="2"/><path d="M17 14v6M14 17h6"/>',
  compare:'<path d="M8 4v16M16 4v16M4 8h4M16 16h4M4 16l4-4-4-4M20 8l-4 4 4 4"/>',pr:'<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v8M18 16V9a3 3 0 0 0-3-3h-4M13 4l-2 2 2 2"/>',
  finder:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12 4c-2 4-2 10 0 16M8 10v1M16 10v1M8 15c2 1.5 6 1.5 8 0"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  bisect:'<path d="M12 3v18M5 8l-2 4 2 4M19 8l2 4-2 4"/>',grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',grid4:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  sort:'<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  cloud:'<path d="M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z"/>'
});

document.head.insertAdjacentHTML('beforeend',`<style>
.menu{position:absolute;z-index:45;min-width:228px;max-width:340px;padding:6px;border-radius:14px;background:color-mix(in srgb,var(--raised) 94%,transparent);backdrop-filter:blur(22px) saturate(1.5);border:.5px solid rgba(var(--ink),.13);box-shadow:0 18px 48px rgba(0,0,0,.42),0 2px 6px rgba(0,0,0,.22);transform-origin:var(--ox,0) var(--oy,0);animation:mIn .26s var(--ease)}
.menu.sub{animation:mSub .2s var(--ease)}
@keyframes mIn{from{opacity:0;transform:scale(.94)}} @keyframes mSub{from{opacity:0;transform:translateX(-6px)}}
.mi{display:flex;align-items:center;gap:10px;height:30px;padding:0 10px 0 12px;border-radius:9px;font-size:13px;color:var(--hi);cursor:default;position:relative;white-space:nowrap}
.mi::before{content:"";position:absolute;left:3px;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:50%;background:var(--accent);transform:scale(0);transition:transform .26s var(--pop)}
.mi svg{width:16px;height:16px;stroke:var(--mid);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.mi .l{flex:1;overflow:hidden;text-overflow:ellipsis} .mi .l small{color:var(--lo);margin-left:6px;font-size:11.5px}
.mi .k{font:11.5px var(--mono);color:var(--lo);margin-left:14px}
.mi .ar{width:12px;height:12px;stroke:var(--lo)}
.mi.hot{background:color-mix(in srgb,var(--accent) 16%,transparent)} .mi.hot::before{transform:scale(1)} .mi.hot svg{stroke:var(--accent)}
.mi.danger{color:var(--danger)} .mi.danger svg{stroke:var(--danger)} .mi.danger.hot{background:color-mix(in srgb,var(--danger) 14%,transparent)}
.mi.dis{opacity:.38;pointer-events:none}
.mi .ck{width:16px;flex:none;display:grid;place-items:center} .mi .ck svg{stroke:var(--accent);stroke-width:2.4}
.mi .dot{width:8px;height:8px;border-radius:50%;flex:none}
.ms{height:.5px;background:rgba(var(--ink),.12);margin:5px 8px}
.mh{font-size:11px;color:var(--lo);padding:7px 12px 3px;font-weight:700;letter-spacing:.4px;display:flex;justify-content:space-between}
.msearch{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:0 10px;height:34px;border-radius:10px;background:var(--field);border:.5px solid var(--line)}
.msearch svg{width:15px;height:15px;stroke:var(--lo);fill:none;stroke-width:2} .msearch input{flex:1;background:none;border:0;outline:none;color:var(--hi);font:inherit;font-size:13px}
.mlist{max-height:360px;overflow:auto}
.mempty{padding:14px;text-align:center;font-size:12px;color:var(--lo)}
.act .cv{position:absolute;right:1px;bottom:5px;width:8px;height:8px;stroke:var(--lo)!important;stroke-width:2.4!important}
#sbBranchBtn{cursor:pointer;padding:2px 8px;border-radius:999px;margin-left:-8px;transition:background .12s} #sbBranchBtn:hover{background:rgba(var(--ink),.08);color:var(--hi)}
/* 仓库列表页 · 结构不变，交互与层级做细 */
#p-repos{gap:8px}
#p-repos .rnav{width:228px;flex:none;padding:10px 8px 12px;display:flex;flex-direction:column;gap:2px;min-height:0}
.rnav .it{display:grid;grid-template-columns:14px minmax(0,1fr) auto;align-items:center;column-gap:8px;min-height:28px;height:28px;padding:0 8px;border-radius:8px;font-size:12.5px;color:var(--mid);cursor:pointer;position:relative;isolation:isolate;transition:background-color .12s ease,color .12s ease}
.rnav .it .lb{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rnav .it svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.rnav .it:hover{background:rgba(var(--ink),.05);color:var(--hi)}
.rnav .it.on{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--hi);font-weight:700}
.rnav .it.on::before{content:"";position:absolute;left:0;top:5px;bottom:5px;width:2px;border-radius:2px;background:var(--accent)}
.rnav .it.on svg{stroke:var(--accent)}
.rnav .it .n{justify-self:end;min-width:18px;height:18px;padding:0 5px;border-radius:999px;font:700 10.5px/18px var(--mono);color:var(--lo);background:rgba(var(--ink),.05);text-align:center;font-variant-numeric:tabular-nums;white-space:nowrap}
.rnav .it.on .n{color:var(--accent);background:color-mix(in srgb,var(--accent) 16%,transparent)}
.rnav .it .gd{width:8px;height:8px;border-radius:2px;box-shadow:0 0 0 2px color-mix(in srgb,currentColor 10%,transparent)}
.rnav h4{font-size:10.5px;color:var(--lo);letter-spacing:.4px;padding:10px 8px 4px;display:flex;justify-content:space-between;align-items:center;font-weight:800}
.rnav h4 button{color:var(--lo);font-size:15px;line-height:1;width:22px;height:22px;border-radius:7px} .rnav h4 button:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.rnav .scan{margin-top:auto;padding:12px;border-radius:14px;background:color-mix(in srgb,var(--alt) 10%,transparent);border:.5px solid color-mix(in srgb,var(--alt) 25%,transparent);font-size:12px;color:var(--mid);cursor:pointer;position:relative}
.rnav .scan b{display:block;color:var(--hi);font-size:13px;margin-bottom:2px}
.rnav .scan:hover{border-color:color-mix(in srgb,var(--alt) 45%,transparent)}
.rmain{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}
.rhead{display:flex;align-items:center;gap:8px;padding:12px 14px 10px;position:relative;flex:none;flex-wrap:wrap}
.rhead h2{font-size:18px;font-weight:800;letter-spacing:-.3px} .rhead .c{font-size:12px;color:var(--lo)}
.rsearch{display:flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;background:var(--field);border:.5px solid var(--line);width:min(280px,36vw);margin-left:auto}
.rsearch svg{width:15px;height:15px;stroke:var(--lo);fill:none;stroke-width:2} .rsearch input{flex:1;background:none;border:0;outline:none;color:var(--hi);font:inherit;font-size:13px}
.rsearch:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent)}
.tbtn{height:34px;padding:0 12px;border-radius:999px;display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--mid);background:rgba(var(--ink),.05);border:.5px solid rgba(var(--ink),.08);position:relative;overflow:hidden}
.tbtn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round} .tbtn:hover{color:var(--hi);background:rgba(var(--ink),.09)}
.vseg{display:flex;padding:3px;border-radius:999px;background:rgba(var(--ink),.05);border:.5px solid rgba(var(--ink),.08)}
.vseg button{width:30px;height:26px;border-radius:999px;display:grid;place-items:center;color:var(--mid)} .vseg button svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.8}
.vseg button.on{background:var(--accent);color:var(--onAccent)}
.rlist{flex:1;overflow:auto;padding:0 10px 12px;position:relative;min-height:0}
.rban{margin:0 6px 10px;padding:10px 12px;border-radius:12px;border:.5px solid color-mix(in srgb,var(--danger) 32%,transparent);background:color-mix(in srgb,var(--danger) 8%,transparent);display:flex;align-items:center;gap:12px}
.rban b{display:block;font-size:13px;color:var(--danger)} .rban span{font-size:12px;color:var(--mid)}
.rban .sp{flex:1} .rban button{height:30px}
.rcols{display:grid;grid-template-columns:36px minmax(200px,1.7fr) 110px 150px minmax(140px,1.3fr) 80px;align-items:center;gap:8px}
.rth{font-size:10.5px;color:var(--lo);font-weight:700;letter-spacing:.3px;padding:6px 8px;position:sticky;top:0;background:color-mix(in srgb,var(--pane) 92%,transparent);backdrop-filter:blur(8px);z-index:1;border-bottom:.5px solid var(--line);margin-bottom:6px}
.rrow{padding:7px 10px;min-height:44px;border-radius:10px;cursor:pointer;position:relative;isolation:isolate;animation:rise .32s var(--ease) both;transition:background-color .12s ease,border-color .12s ease,transform .15s ease;border:.5px solid rgba(var(--ink),.07);background:rgba(var(--ink),.025);margin-bottom:8px}
.rlist>.rrow:last-child,.rblock>.rrow:last-child{margin-bottom:0}
.rblock{display:flex;flex-direction:column;gap:8px;padding-bottom:6px}
.rblock .rrow{margin-bottom:0}
.rrow:hover{background:rgba(var(--ink),.055);border-color:rgba(var(--ink),.12)}
.rrow:active{transform:scale(.995)}
.rrow.sel{background:color-mix(in srgb,var(--accent) 12%,transparent);border-color:color-mix(in srgb,var(--accent) 28%,transparent)}
.rrow.sel::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:2px;border-radius:2px;background:var(--accent)}
.rrow.miss{background:color-mix(in srgb,var(--danger) 7%,transparent);border-color:color-mix(in srgb,var(--danger) 22%,transparent)}
.rrow.miss:hover{background:color-mix(in srgb,var(--danger) 11%,transparent)}
.rrow .mg{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:12px;color:#0b0a14;position:relative;flex:none}
.rrow .nm{font-weight:750;font-size:13px;display:flex;align-items:center;gap:5px;letter-spacing:-.2px;line-height:1.2}
.rrow .nm .star{width:12px;height:12px;stroke:var(--win);fill:var(--win)}
.rrow .pt{font:11px/1.25 var(--mono);color:var(--lo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.rrow.miss .pt{color:var(--danger)}
.rrow .br{font-size:12px;color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rrow .st{display:flex;flex-wrap:wrap;gap:3px;align-items:center}
.rrow .lc{font-size:12px;color:var(--mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.25} .rrow .lc small{display:block;color:var(--lo);font-size:10.5px;margin-top:0}
.rrow .acts{display:flex;align-items:center;justify-content:flex-end;gap:2px}
.rrow .open{height:24px;padding:0 8px;border-radius:6px;font-size:11.5px;font-weight:700;color:var(--accent);opacity:0;background:color-mix(in srgb,var(--accent) 12%,transparent);transition:opacity .12s ease,background-color .12s ease,transform .12s ease}
.rrow:hover .open,.rrow.sel .open,.rrow.miss .open{opacity:1}
.rrow .open:hover{background:color-mix(in srgb,var(--accent) 20%,transparent)}
.rrow .open:active{transform:scale(.96)}
.rrow .more{width:24px;height:24px;border-radius:6px;display:grid;place-items:center;opacity:0;transition:opacity .12s ease,background-color .12s ease} .rrow .more svg{width:14px;height:14px;stroke:var(--mid);fill:none;stroke-width:2}
.rrow:hover .more,.rrow .more.open,.rrow.sel .more{opacity:1} .rrow .more:hover{background:rgba(var(--ink),.1)}
.rgrp{font-size:11px;font-weight:800;color:var(--mid);padding:10px 6px 4px;display:flex;align-items:center;gap:6px;letter-spacing:.2px;cursor:pointer;user-select:none;border-radius:6px;min-height:22px}
@media (prefers-reduced-motion:reduce){.rrow{animation:none;transition:background-color .12s ease,border-color .12s ease}.rrow:active,.rrow .open:active{transform:none}}
.rgrp:hover{color:var(--hi);background:rgba(var(--ink),.03)}
.rgrp i{width:9px;height:9px;border-radius:3px;flex:none}
.rgrp .cnt{margin-left:auto;font:700 11px var(--mono);color:var(--lo);font-variant-numeric:tabular-nums}
.rgrp .caret{margin-left:6px;font-size:10px;color:var(--lo);transition:transform .2s} .rgrp.fold .caret{transform:rotate(-90deg)}
.rgrp.fold + .rblock{display:none}
.pill.ok{background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok)} .pill.dn{background:color-mix(in srgb,var(--warn) 16%,transparent);color:var(--warn)}
.pill.bad{background:color-mix(in srgb,var(--danger) 16%,transparent);color:var(--danger)}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;padding:4px 6px 12px}
.rgrid .repo{padding:14px;position:relative;transition:transform .2s var(--ease),box-shadow .2s ease}
.rgrid .repo:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.22)}
@media (prefers-reduced-motion:reduce){.rgrid .repo:hover{transform:none}}
.rgrid .repo .ops{position:absolute;top:10px;right:10px;display:flex;gap:2px;opacity:0;transition:opacity .12s}
.rgrid .repo:hover .ops{opacity:1}
.rgrid .repo .ops button{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:rgba(var(--ink),.06);color:var(--mid)}
.rgrid .repo .ops button:hover{background:rgba(var(--ink),.1);color:var(--hi)}
.rgrid .repo.miss{outline:1px solid color-mix(in srgb,var(--danger) 35%,transparent)}
/* 表单件 */
.sel{height:38px;width:100%;display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:var(--r-sm);border:.5px solid var(--line);background:var(--field);color:var(--hi);font-size:13.5px;text-align:left}
.sel svg{width:15px;height:15px;stroke:var(--mid);fill:none;stroke-width:1.8} .sel .v{flex:1} .sel .cv2{transform:rotate(90deg);width:12px;height:12px}
.sel:focus,.sel.open{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent);outline:none}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rcards{display:grid;gap:8px;margin-bottom:12px}
.rcard{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:14px;border:.5px solid var(--line);background:rgba(var(--ink),.03);cursor:pointer;position:relative;transition:border-color .2s,background .2s}
.rcard .rd{width:18px;height:18px;border-radius:50%;border:1.6px solid var(--lo);flex:none;margin-top:1px;display:grid;place-items:center;transition:.2s}
.rcard.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,transparent)} .rcard.on .rd{border-color:var(--accent)} .rcard.on .rd::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.rcard.dz.on{border-color:var(--danger);background:color-mix(in srgb,var(--danger) 8%,transparent)} .rcard.dz.on .rd{border-color:var(--danger)} .rcard.dz.on .rd::after{background:var(--danger)}
.rcard b{font-size:13.5px;display:block} .rcard span{font-size:12px;color:var(--mid)} .rcard code{font:11.5px var(--mono);color:var(--lo);margin-left:6px}
.ckr{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--mid);padding:6px 0;cursor:pointer} .ckr small{color:var(--lo);font-size:11.5px}
.note{font-size:12px;color:var(--mid);padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--memory) 10%,transparent);border:.5px solid color-mix(in srgb,var(--memory) 22%,transparent);margin-bottom:12px;display:flex;gap:8px;align-items:center}
.note svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.note.warn{color:var(--hi);background:color-mix(in srgb,var(--danger) 10%,transparent);border-color:color-mix(in srgb,var(--danger) 26%,transparent)}
.chip{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:999px;font:12px var(--mono);background:rgba(var(--ink),.07);color:var(--hi)}
.prog{height:6px;border-radius:3px;background:rgba(var(--ink),.08);overflow:hidden} .prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .3s var(--ease)}
.steps{display:flex;flex-direction:column;gap:8px;margin:14px 0} .steps div{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--lo)} .steps div.on{color:var(--hi)} .steps div.done{color:var(--mid)}
.steps i{width:18px;height:18px;border-radius:50%;border:1.6px solid currentColor;display:grid;place-items:center;font-size:10px;font-style:normal} .steps div.done i{background:var(--ok);border-color:var(--ok);color:#0b0a14}
.rb{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;border:.5px solid var(--line);background:rgba(var(--ink),.03);margin-bottom:6px;font-size:13px;transition:opacity .2s}
.rb .gp{width:14px;height:14px;stroke:var(--lo);fill:none;stroke-width:2;cursor:grab} .rb .op{min-width:76px;height:26px;border-radius:8px;font:12px var(--mono);display:flex;align-items:center;justify-content:space-between;padding:0 8px;background:rgba(var(--ink),.07);color:var(--hi)}
.rb .h{font:11.5px var(--mono);color:var(--lo)} .rb .s{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .rb.drop{opacity:.45} .rb.drop .s{text-decoration:line-through}
.op.squash,.op.fixup{color:var(--alt)!important} .op.drop{color:var(--danger)!important} .op.reword,.op.edit{color:var(--memory)!important}
.found{max-height:200px;overflow:auto;border-radius:12px;border:.5px solid var(--line)} .found .ckr{padding:8px 12px} .found .ckr+.ckr{border-top:.5px solid var(--line)}
</style>`);

/* ── 坐标：#win 被缩放，菜单放在窗口坐标系里 ── */
const WIN=document.getElementById('win');
function wk(){const r=WIN.getBoundingClientRect();return[r,r.width/1280]}
function rectOf(el){const[wr,k]=wk(),r=el.getBoundingClientRect();return{l:(r.left-wr.left)/k,t:(r.top-wr.top)/k,w:r.width/k,h:r.height/k}}
function ptOf(e){const[wr,k]=wk();return{x:(e.clientX-wr.left)/k,y:(e.clientY-wr.top)/k}}

/* ── 菜单 ── */
let MENUS=[],subTimer;
function closeMenus(from=0){MENUS.splice(from).forEach(m=>{m.el.remove();m.anchor&&m.anchor.classList.remove('open')})}
function itemHTML(it,i){
  if(it==='-')return '<div class="ms"></div>';
  if(it.h)return `<div class="mh">${it.h}${it.hr?`<span>${it.hr}</span>`:''}</div>`;
  return `<div class="mi ${it.danger?'danger':''} ${it.dis?'dis':''}" data-i="${i}">${it.chk!==undefined?`<span class="ck">${it.chk?svg('check'):''}</span>`:it.dot?`<span class="dot" style="background:${it.dot}"></span>`:it.ic?svg(it.ic):''}<span class="l">${it.lb}${it.sm?`<small>${it.sm}</small>`:''}</span>${it.k?`<span class="k">${it.k}</span>`:''}${it.sub?svg('chev','ar'):''}</div>`;
}
function openMenu(items,x,y,opt={}){
  const lvl=opt.level||0;closeMenus(lvl);clearTimeout(subTimer);
  const el=document.createElement('div');el.className='menu'+(lvl?' sub':'');
  const m={el,items,level:lvl,anchor:opt.anchor,q:''};MENUS.push(m);
  const draw=()=>{const q=m.q.toLowerCase(),vis=items.map((it,i)=>[it,i]).filter(([it])=>!q||(it!=='-'&&!it.h&&it.lb.toLowerCase().includes(q)));
    el.querySelector('.mlist').innerHTML=vis.length?vis.map(([it,i])=>itemHTML(it,i)).join(''):'<div class="mempty">没有匹配的项</div>'};
  el.innerHTML=(opt.search?`<div class="msearch">${svg('search')}<input placeholder="${opt.search}"></div>`:'')+'<div class="mlist"></div>';
  WIN.appendChild(el);draw();
  if(opt.minW)el.style.minWidth=opt.minW+'px';
  const w=el.offsetWidth,h=el.offsetHeight;
  let L=x,T=y;if(L+w>1272)L=opt.flipX!==undefined?opt.flipX-w:1272-w;if(T+h>792)T=Math.max(8,792-h);
  el.style.left=L+'px';el.style.top=T+'px';el.style.setProperty('--ox',(x-L)+'px');el.style.setProperty('--oy',(y-T)+'px');
  if(opt.anchor)opt.anchor.classList.add('open');
  if(opt.search){const inp=el.querySelector('input');setTimeout(()=>inp.focus(),30);inp.oninput=()=>{m.q=inp.value;draw()}}
  el.addEventListener('mouseover',e=>{const mi=e.target.closest('.mi');if(!mi||mi.classList.contains('hot'))return;el.querySelectorAll('.mi.hot').forEach(x=>x.classList.remove('hot'));mi.classList.add('hot');
    clearTimeout(subTimer);const it=items[+mi.dataset.i];if(it.sub)subTimer=setTimeout(()=>openSub(m,mi),120);else subTimer=setTimeout(()=>closeMenus(lvl+1),160)});
  el.addEventListener('click',e=>{const mi=e.target.closest('.mi');if(!mi)return;const it=items[+mi.dataset.i];if(it.sub)return openSub(m,mi);run(it)});
  return m;
}
function openSub(m,mi){const it=m.items[+mi.dataset.i],r=rectOf(mi),pr=rectOf(m.el);openMenu(it.sub,pr.l+pr.w-4,r.t-6,{level:m.level+1,flipX:pr.l+4})}
function run(it){closeMenus();if(it.act)return it.act();if(it.dlg)return DLG[it.dlg]();moment({scene:'ok',title:it.lb.replace(/…$/,''),sub:it.toast||'原型演示：这里会执行对应的 Git 操作'})}
function menuAt(el,items,opt={}){const r=rectOf(el);return openMenu(items,opt.right?r.l+r.w-(opt.minW||228):r.l,r.t+r.h+6,Object.assign({anchor:el},opt))}
document.addEventListener('pointerdown',e=>{if(MENUS.length&&!e.target.closest('.menu')&&!(MENUS[0].anchor&&MENUS[0].anchor.contains(e.target)))closeMenus()},true);
document.addEventListener('keydown',e=>{
  if(!MENUS.length)return;const top=MENUS[MENUS.length-1],els=[...top.el.querySelectorAll('.mi:not(.dis)')],cur=top.el.querySelector('.mi.hot'),i=els.indexOf(cur);
  const mv=d=>{cur&&cur.classList.remove('hot');const n=els[(i+d+els.length)%els.length];n&&n.classList.add('hot');n&&n.scrollIntoView({block:'nearest'})};
  if(e.key==='Escape'){e.stopImmediatePropagation();top.level?closeMenus(top.level):closeMenus()}
  else if(e.key==='ArrowDown'){e.preventDefault();mv(1)}else if(e.key==='ArrowUp'){e.preventDefault();mv(-1)}
  else if(e.key==='ArrowRight'&&cur&&top.items[+cur.dataset.i].sub){e.preventDefault();openSub(top,cur);setTimeout(()=>{const s=MENUS[MENUS.length-1].el.querySelector('.mi');s&&s.classList.add('hot')})}
  else if(e.key==='ArrowLeft'&&top.level){e.preventDefault();closeMenus(top.level)}
  else if(e.key==='Enter'&&cur){e.preventDefault();cur.click()}
},true);

/* ── 菜单内容（与 App 现有菜单一一对应） ── */
const REMOTES=['origin','upstream'];
const M={
  pull:()=>[{ic:'pull',lb:'拉取 origin/dev',k:'⌘⇧P',toast:'git pull（merge）'},{ic:'pull',lb:'拉取并变基',sm:'--rebase',toast:'git pull --rebase'},{ic:'fetch',lb:'获取所有远端',k:'⌘⇧F'},{ic:'trash',lb:'修剪已删除的远端分支',sm:'--prune'},'-',{ic:'wrench',lb:'拉取选项…',dlg:'pullOpts'}],
  push:()=>[{ic:'push',lb:'推送 dev → origin/dev',k:'⌘⇧U'},{ic:'push',lb:'推送到',sub:REMOTES.map(r=>({ic:'cloud',lb:r,sm:r==='origin'?'github.com/shaw/OtterGit':'github.com/otter/OtterGit'}))},{ic:'tag',lb:'推送所有标签'},'-',{ic:'push',lb:'强制推送…',sm:'--force-with-lease',danger:1,act:()=>DLG.danger()},{ic:'wrench',lb:'推送选项…',dlg:'pushOpts'}],
  stash:()=>[{ic:'stash',lb:'暂存更改…',k:'⌘⌥S',dlg:'stashSave'},{ic:'stash',lb:'快速暂存',sm:'含未跟踪'},'-',{h:'暂存列表',hr:'3'},
    ...[['stash@{0}','WIP on dev: 首页布局'],['stash@{1}','试验：背景动效速度'],['stash@{2}','On main: 修 tray 图标']].map(([s,m])=>({ic:'list',lb:m,sm:s,sub:[{ic:'eye',lb:'预览…'},{ic:'check',lb:'应用'},{ic:'pull',lb:'弹出（应用并删除）'},{ic:'branch',lb:'从这里创建分支…'},'-',{ic:'trash',lb:'删除',danger:1}]}))],
  more:()=>[{ic:'flow',lb:'Git-flow',sub:[{ic:'plus',lb:'开始 Feature…',act:()=>DLG.flowStart('feature')},{ic:'plus',lb:'开始 Release…',act:()=>DLG.flowStart('release')},{ic:'plus',lb:'开始 Hotfix…',act:()=>DLG.flowStart('hotfix')},{ic:'plus',lb:'开始 Support…',act:()=>DLG.flowStart('support')},'-',{ic:'check',lb:'完成 feature/ambient-backdrop…',act:()=>DLG.flowFinish()},'-',{ic:'wrench',lb:'分支设置…',act:()=>DLG.flowSettings()}]},
    {ic:'edit',lb:'交互式变基…',dlg:'rebaseI'},{ic:'bisect',lb:'二分查错…',dlg:'bisect'},{ic:'patch',lb:'应用补丁…',dlg:'patch'},{ic:'plus',lb:'添加子模块…',dlg:'submodule'},{ic:'reset',lb:'Reflog 恢复…'},{ic:'work',lb:'添加工作树…',dlg:'worktree'},
    {ic:'lock',lb:'Git LFS',sub:[{ic:'plus',lb:'跟踪文件类型…'},{ic:'x',lb:'取消跟踪…'},{ic:'lock',lb:'文件锁'},'-',{ic:'refresh',lb:'拉取 LFS 对象'}]},'-',
    {chk:true,lb:'显示小獭栏',k:'⌘⇧O'},{ic:'key',lb:'快捷键',k:'⌘/'}],
  branch:b=>[{ic:'check',lb:`切换到 ${b}`,dis:b==='dev'},{ic:'merge',lb:`合并 ${b} 到 dev…`,dis:b==='dev',dlg:'merge'},{ic:'edit',lb:`将 dev 变基到 ${b}`,dis:b==='dev'},{ic:'cherry',lb:`从 ${b} 拣选…`,dis:b==='dev'},{ic:'compare',lb:'与当前分支比较'},'-',
    {ic:'push',lb:'推送到',sub:REMOTES.map(r=>({ic:'cloud',lb:`${r}/${b}`}))},{ic:'pr',lb:'创建拉取请求…'},{ic:'reset',lb:'重置到远端版本…',danger:1},'-',{ic:'branch',lb:'从这里创建分支…',dlg:'branch'},{ic:'edit',lb:'重命名…'},{ic:'copy',lb:'复制分支名'},{ic:'trash',lb:`删除 ${b}…`,danger:1,dis:b==='dev',act:()=>DLG.danger()}],
  tag:t=>[{ic:'check',lb:`检出 ${t}`},{ic:'compare',lb:'与当前分支比较'},{ic:'push',lb:'推送到',sub:REMOTES.map(r=>({ic:'cloud',lb:r}))},'-',{ic:'copy',lb:'复制标签名'},{ic:'trash',lb:'删除本地标签',danger:1},{ic:'trash',lb:'删除远端标签…',danger:1}],
  file:f=>f[0]==='C'?[{ic:'edit',lb:'解决冲突…'},{ic:'compare',lb:'三方合并编辑…'},{ic:'check',lb:'使用',sub:[{ic:'check',lb:'我的版本',sm:'dev'},{ic:'check',lb:'对方的版本',sm:'feat/windows'},'-',{ic:'spark',lb:'自动解决无争议的块'}]},{ic:'ext',lb:'启动合并工具'},'-',{ic:'check',lb:'标记为已解决'},{ic:'spark',lb:'问小獭怎么解'}]:
    [{ic:'plus',lb:'暂存',k:'⌘S'},{ic:'x',lb:'取消暂存'},{ic:'revert',lb:'丢弃更改…',danger:1,act:()=>DLG.danger()},'-',
     {ic:'ext',lb:'打开方式',sub:[{ic:'ext',lb:'默认应用'},{ic:'compare',lb:'外部对比工具…'},{ic:'eye',lb:'快速查看',k:'Space'},'-',{ic:'finder',lb:'在访达中显示'},{ic:'term',lb:'在终端打开'}]},
     {ic:'eye',lb:'忽略',sub:[{ic:'eye',lb:`忽略 ${f[2]}`},{ic:'eye',lb:`忽略所有 *.${f[2].split('.').pop()}`},{ic:'folder',lb:`忽略目录 ${f[1]}`},'-',{ic:'spark',lb:'小獭建议的规则…'}]},
     {ic:'hist',lb:'文件历史…'},{ic:'user',lb:'逐行追溯（Blame）…'},{ic:'patch',lb:'创建补丁…'},'-',{ic:'copy',lb:'复制路径',k:'⌘⇧C'},{ic:'spark',lb:'问小獭'}],
  commit:c=>[{ic:'check',lb:'检出此提交…'},{ic:'branch',lb:'从这里创建分支…',dlg:'branch'},{ic:'tag',lb:'打标签…',dlg:'tag'},'-',{ic:'merge',lb:'合并到 dev…',dlg:'merge'},{ic:'edit',lb:'将 dev 变基到这里…'},{ic:'edit',lb:'交互式变基此后的提交…',dlg:'rebaseI'},{ic:'cherry',lb:'拣选到 dev'},{ic:'revert',lb:'还原此提交'},
    {ic:'reset',lb:'将 dev 重置到这里',sub:[{ic:'reset',lb:'软重置',sm:'--soft · 保留暂存',act:()=>DLG.reset('soft')},{ic:'reset',lb:'混合重置',sm:'--mixed · 保留工作区',act:()=>DLG.reset('mixed')},{ic:'reset',lb:'硬重置…',sm:'--hard · 丢弃更改',danger:1,act:()=>DLG.reset('hard')}]},'-',
    {ic:'copy',lb:'复制',sub:[{ic:'copy',lb:'完整 SHA'},{ic:'copy',lb:'短哈希',sm:HASH[hsel]},{ic:'copy',lb:'提交标题'}]},{ic:'patch',lb:'创建补丁…'},{ic:'reset',lb:'Reflog 恢复…'},{ic:'spark',lb:'问小獭这次改了什么'}],
  repo:r=>[{ic:'ext',lb:'打开',k:'↩',act:()=>go('files')},{ic:'finder',lb:'在访达中显示'},{ic:'term',lb:'在终端打开'},{ic:'copy',lb:'复制路径'},'-',{ic:'edit',lb:'重命名…',dlg:'rename'},
    {ic:'group',lb:'设置分组',sub:[...GROUPS.map(g=>({dot:g[1],lb:g[0],chk:undefined,sm:r&&r[3]===g[0]?'当前':''})),{dot:'transparent',lb:'不分组'},'-',{ic:'plus',lb:'新建分组…',dlg:'newGroup'}]},
    {ic:'star',lb:r&&r[11]?'取消置顶':'置顶'},{ic:'wrench',lb:'仓库设置…',act:()=>DLG.repoSettings()},'-',{ic:'x',lb:'从列表移除'},{ic:'trash',lb:'移到废纸篓…',danger:1,act:()=>DLG.danger()}],
  add:()=>[{ic:'clone',lb:'克隆远程仓库…',k:'⌘⇧O',dlg:'clone'},{ic:'folder',lb:'添加本地仓库…',k:'⌘O',dlg:'addLocal'},{ic:'scan',lb:'扫描文件夹…',dlg:'scan'},'-',{ic:'plus',lb:'新建本地仓库…',dlg:'initRepo'},{ic:'cloud',lb:'新建远程仓库…',dlg:'createRemote'}],
  switcher:()=>[{h:'本地分支',hr:'4'},...['dev','main','release','feat/windows'].map(b=>({chk:b==='dev',lb:b,sm:b==='dev'?'↑'+ahead:b==='feat/windows'?'↓2':''})),{h:'远端',hr:'origin'},...['origin/main','origin/dev','origin/release','origin/feat/tray'].map(b=>({ic:'cloud',lb:b})),'-',{ic:'plus',lb:'新建分支…',k:'⌘⇧N',dlg:'branch'},{ic:'list',lb:'查看当前分支历史',act:()=>go('history')}]
};

/* ── 接线：工具栏 / 右键 / 状态栏 ── */
['pull','push','stash','more'].forEach(k=>{const b=document.querySelector(`.act[data-act=${k}]`);b.insertAdjacentHTML('beforeend','<svg class="cv" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>')});
document.addEventListener('click',e=>{
  const a=e.target.closest('.act[data-act]');if(!a)return;const k=a.dataset.act;
  if(M[k]&&['pull','push','stash','more'].includes(k)){e.stopImmediatePropagation();if(a.classList.contains('open'))return closeMenus();menuAt(a,M[k]())}
  else if(k==='merge'){e.stopImmediatePropagation();DLG.merge()}
},true);
document.addEventListener('contextmenu',e=>{
  const p=ptOf(e);let items=null;
  const ti=e.target.closest('.tree .it');
  const fr=e.target.closest('#fileList .f[data-f]');
  const cm=e.target.closest('.cm[data-h]');
  const rr=e.target.closest('.rrow[data-r],.repo[data-r]');
  if(ti){
    const nm=ti.querySelector('.nm')?.textContent.trim()||'';
    const n=ti.dataset.branch||ti.dataset.tag||ti.dataset.repo||(ti.dataset.remote?ti.dataset.remote.replace(/^origin\//,''):'')||nm;
    if(ti.dataset.stash!=null){items=[{ic:'stash',lb:'弹出暂存…',act:()=>DLG.stashSave?.()||moment({scene:'ok',title:'已弹出暂存',sub:nm})},{ic:'trash',lb:'删除暂存',danger:1},'-',{ic:'copy',lb:'复制说明'}]}
    else if(ti.dataset.remote){items=[{ic:'branch',lb:`检出 ${n}…`,act:()=>go('files')},{ic:'pull',lb:'拉取到本地'},'-',{ic:'copy',lb:'复制远程名',act:()=>{}}]}
    else if(ti.dataset.repo)items=M.repo(RLIST.find(x=>x[0]===n)||[n])
    else items=/^v\d/.test(n)?M.tag(n):M.branch(n);
  }
  else if(fr){const list=S.tone==='alert'?conflicts.concat(files):files;items=M.file(list[+fr.dataset.f])}
  else if(cm){hsel=+cm.dataset.h;hfile=0;renderHistory();items=M.commit()}
  else if(rr){items=M.repo(RLIST[+rr.dataset.r])}
  if(!items)return;e.preventDefault();openMenu(items,p.x,p.y);
});
const sbB=document.getElementById('sbBranch').parentElement;sbB.id='sbBranchBtn';sbB.title='切换分支';
sbB.onclick=e=>{e.stopPropagation();const r=rectOf(sbB);const m=openMenu(M.switcher(),r.l,r.t-8,{search:'搜索分支…',anchor:sbB,minW:280});const h=m.el.offsetHeight;m.el.style.top=Math.max(8,r.t-h-8)+'px';m.el.style.setProperty('--oy',h+'px')};

/* ── 与 App 同步：列表头筛选 / 排序、行内「⋯」、提交选项、差异区操作、历史筛选栏 ── */
const FILTERS=['待提交的文件','冲突文件','未跟踪的文件','已忽略的文件','已删除的文件','已修改的文件','所有文件'];let fFilterI=0,fSortI=0;
document.addEventListener('click',e=>{
  const t=e.target;let el;
  if((el=t.closest('#fFilter'))){e.stopPropagation();return menuAt(el,FILTERS.map((l,i)=>({chk:i===fFilterI,lb:l,act:()=>{fFilterI=i;el.textContent=l}})))}
  if((el=t.closest('#fSort'))){e.stopPropagation();return menuAt(el,[{h:'排序'},...['路径 A→Z','路径 Z→A','文件名 A→Z','文件名 Z→A','状态','勾选优先'].map((l,i)=>({chk:i===fSortI,lb:l,act:()=>{fSortI=i}})),'-',{h:'筛选'},...FILTERS.slice(0,4).map((l,i)=>({chk:i===fFilterI,lb:l,act:()=>{fFilterI=i;document.getElementById('fFilter').textContent=l}}))],{right:1})}
  if((el=t.closest('[data-fm]'))){e.stopPropagation();const list=S.tone==='alert'?conflicts.concat(files):files;return menuAt(el,M.file(list[+el.dataset.fm]),{right:1})}
  if((el=t.closest('#commitOpts'))){e.stopPropagation();return menuAt(el,[{chk:false,lb:'修改上次提交',sm:'--amend'},{chk:false,lb:'提交后推送',sm:'origin/dev'},{chk:false,lb:'添加 Signed-off-by'},{chk:false,lb:'跳过钩子',sm:'--no-verify'},'-',{ic:'user',lb:'提交身份…',act:()=>{stab=3;openSettings()}}],{right:1})}
  if(t.closest('#wcDiscard')){e.stopPropagation();return DLG.danger()}
  if(t.closest('#wcStage')){e.stopPropagation();return moment({scene:'ok',title:'已暂存',sub:'home_view.dart'})}
  if((el=t.closest('#hfScope'))){e.stopPropagation();return menuAt(el,['所有提交','只看我的','合并提交','非合并提交'].map((l,i)=>({chk:el.textContent===l,lb:l,act:()=>{el.textContent=l;el.classList.toggle('on',i>0)}})))}
  if((el=t.closest('#hfSort'))){e.stopPropagation();return menuAt(el,['日期排序','拓扑排序','作者日期'].map(l=>({chk:el.textContent===l,lb:l,act:()=>{el.textContent=l}})))}
  if((el=t.closest('#hfBranch'))){e.stopPropagation();return menuAt(el,['所有分支','当前分支 dev','main','release','feat/windows'].map((l,i)=>({chk:el.textContent===l,lb:l,act:()=>{el.textContent=l;el.classList.toggle('on',i>0)}})),{search:'搜索分支…',minW:240})}
},true);

/* ── 仓库列表页（结构：左筛选 + 右列表/卡片；补路径丢失与悬停打开） ── */
const GROUPS=[['水獭家族','#FFC23D'],['工作','#6CC9FF'],['个人','#B8A8FF']];
/* [名称, 路径, 分支, 分组, 颜色, 未提交, 领先, 落后, 最近提交, 时间, 最近打开, 置顶, 路径OK] */
const RLIST=[
  ['OtterGitApp','~/Desktop/code/OtterGit/OtterGitApp','dev','水獭家族','var(--accent)',12,1,0,'feat(home): 首页与继续工作卡片','刚刚','刚刚',1,1],
  ['GameTime','~/Desktop/code/GameTime','feat/local-only','水獭家族','#5CD6E6',4,0,0,'fix(profile): 去掉重复头像','3 天前','1 小时前',1,1],
  ['MacToolsApp','~/Desktop/code/MacToolsApp','dev','水獭家族','#FFB04A',0,0,0,'fix(macos): 菜单栏后台刷新','3 天前','昨天',0,0],
  ['ottergit-site','~/Desktop/code/OtterGit/ottergit-site','main','水獭家族','#FFD66B',0,0,3,'docs: 下载页','1 周前','3 天前',0,1],
  ['shawWeb','~/Desktop/code/shawWeb','main','个人','#4FD79A',0,0,0,'添加人格图片','2026-04-10','上周',0,1],
  ['dotfiles','~/dotfiles','main','个人','#FF8AB8',2,0,0,'zsh: 换提示符','2 周前','2 周前',0,1],
  ['otter_icons','~/Desktop/code/otter_icons','main','个人','#B8A8FF',0,0,0,'表情 v3','5 天前','5 天前',0,1],
  ['ark-console','~/work/ark-console','release/3.2','工作','#6CC9FF',7,2,1,'feat(billing): 拆分账单','昨天','今天',0,1],
  ['ark-sdk-go','~/work/ark-sdk-go','main','工作','#78C8FF',0,0,0,'chore: v1.8.0','4 天前','4 天前',0,1],
  ['design-tokens','~/work/design-tokens','feat/amber','工作','#FFC23D',1,0,0,'tokens: 琥珀金','2 小时前','2 小时前',0,1]
];
let RV={nav:'all',q:'',view:'list',sort:'opened',sel:0};
const rFold={};
(document.querySelector('.main')||document.querySelector('.body')).insertAdjacentHTML('beforeend',`<section class="page" id="p-repos"><div class="cardp rnav" id="rnav"></div><div class="cardp rmain"><div class="rhead"><h2>仓库</h2><span class="c" id="rcount"></span>
  <label class="rsearch">${svg('search')}<input id="rq" placeholder="搜索名称、路径或分支"></label>
  <button class="tbtn rp" id="rsort">${svg('sort')}<span id="rsortL">最近打开</span></button>
  <div class="vseg"><button data-v="list" title="列表">${svg('list')}</button><button data-v="grid" title="卡片">${svg('grid4')}</button></div>
  <button class="slab rp" id="radd" style="height:34px">＋ 添加</button></div><div class="rlist" id="rlist"></div></div></section>`);
function rFilter(){
  let L=RLIST.map((r,i)=>[r,i]);const n=RV.nav,q=RV.q.toLowerCase();
  if(n==='recent')L=L.filter(([r])=>/刚刚|小时|今天|昨天/.test(r[10]));
  else if(n==='dirty')L=L.filter(([r])=>r[5]||r[6]||r[7]);
  else if(n==='pin')L=L.filter(([r])=>r[11]);
  else if(n==='miss')L=L.filter(([r])=>!r[12]);
  else if(n!=='all')L=L.filter(([r])=>r[3]===n);
  if(q)L=L.filter(([r])=>(r[0]+r[1]+r[2]).toLowerCase().includes(q));
  if(RV.sort==='name')L.sort((a,b)=>a[0][0].localeCompare(b[0][0]));
  else if(RV.sort==='status')L.sort((a,b)=>((b[0][12]?0:100)+(b[0][5]+b[0][6]*5))-((a[0][12]?0:100)+(a[0][5]+a[0][6]*5)));
  return L;
}
function pills(r){
  if(!r[12])return '<span class="pill bad">路径丢失</span>';
  return (r[5]?`<span class="pill w">${r[5]} 未提交</span>`:'')+(r[6]?`<span class="pill u">↑${r[6]}</span>`:'')+(r[7]?`<span class="pill dn">↓${r[7]}</span>`:'')||'<span class="pill ok">干净</span>';
}
function renderRepos(){
  const missN=RLIST.filter(r=>!r[12]).length;
  const cnt=k=>k==='all'?RLIST.length:k==='recent'?RLIST.filter(r=>/刚刚|小时|今天|昨天/.test(r[10])).length:k==='dirty'?RLIST.filter(r=>r[5]||r[6]||r[7]).length:k==='pin'?RLIST.filter(r=>r[11]).length:k==='miss'?missN:RLIST.filter(r=>r[3]===k).length;
  document.getElementById('rnav').innerHTML=
    [['all','folder','全部仓库'],['recent','clock','最近打开'],['dirty','edit','有改动'],['pin','star','置顶'],...(missN?[['miss','lock','路径丢失']]:[])].map(([k,ic,l])=>`<div class="it rp ${RV.nav===k?'on':''}" data-n="${k}">${svg(ic)}<span class="lb">${l}</span><span class="n">${cnt(k)}</span></div>`).join('')
    +`<h4>分组<button id="rnewg" title="新建分组">＋</button></h4>`
    +GROUPS.map(([g,c])=>`<div class="it rp ${RV.nav===g?'on':''}" data-n="${g}"><i class="gd" style="background:${c}"></i><span class="lb">${g}</span><span class="n">${cnt(g)}</span></div>`).join('')
    +`<div class="scan rp" id="rscan"><b>扫描文件夹</b>选一个目录，把里面的 Git 仓库都找出来</div>`;
  const L=rFilter();document.getElementById('rcount').textContent=`${L.length} / ${RLIST.length}`;
  document.querySelectorAll('#p-repos .vseg button').forEach(b=>b.classList.toggle('on',b.dataset.v===RV.view));
  const box=document.getElementById('rlist');
  const ban=missN&&RV.nav!=='miss'?`<div class="rban"><div><b>${missN} 个仓库找不到本地路径</b><span>可能被移走或重命名了，点「改路径」重新关联，对话和记忆会跟着走。</span></div><span class="sp"></span><button class="ghost rp" data-n="miss">查看</button><button class="slab rp" data-relocate="${RLIST.find(r=>!r[12])[0]}">改路径</button></div>`:'';
  if(!L.length){box.innerHTML=ban+`<div style="text-align:center;padding:70px 0;position:relative"><img src="${pick('emptySearch')}" style="width:110px"><p style="color:var(--mid);margin-top:8px">${RV.q?`没有匹配「${esc(RV.q)}」的仓库`:'这里还没有仓库'}</p><button class="slab rp" id="raddEmpty" style="margin-top:12px">＋ 添加仓库</button></div>`;return}
  if(RV.view==='grid'){
    box.innerHTML=ban+`<div class="rgrid">${L.map(([r,i],j)=>`<div class="repo cardp rp ${r[12]?'':'miss'}" data-r="${i}" style="animation-delay:${j*.03}s">
      <div class="ops"><button data-ro="${i}" title="${r[12]?'打开':'改路径'}">${r[12]?'↗':'修复'}</button><button data-rm="${i}" title="更多">${svg('more')}</button></div>
      <div class="hd"><div class="mg" style="background:${r[4]}">${r[0][0]}</div>
      <div style="min-width:0"><div class="nm">${r[0]}${r[11]?' ★':''}</div><div class="bra">⎇ ${r[2]}</div></div></div>
      <div class="last" style="position:relative">${r[12]?`${r[9]} · ${esc(r[8])}`:`路径丢失 · ${r[1]}`}</div>
      <div style="position:relative;margin-top:8px">${pills(r)}</div></div>`).join('')}</div>`;
    return;
  }
  const row=([r,i],j)=>`<div class="rrow rcols ${RV.sel===i?'sel':''} ${r[12]?'':'miss'}" data-r="${i}" style="animation-delay:${j*.025}s">
    <div class="mg" style="background:${r[4]}">${r[0][0]}</div>
    <div style="min-width:0"><div class="nm">${r[0]}${r[11]?`<svg class="star" viewBox="0 0 24 24">${IC.star}</svg>`:''}</div><div class="pt" title="${r[1]}">${r[1]}</div></div>
    <div class="br">⎇ ${r[2]}</div>
    <div class="st">${pills(r)}</div>
    <div class="lc">${r[12]?esc(r[8]):'本地文件夹找不到了'}<small>${r[12]?`${r[9]} · 打开于 ${r[10]}`:'点右侧「改路径」重新关联'}</small></div>
    <div class="acts">${r[12]?`<button class="open" data-ro="${i}">打开</button>`:`<button class="open" data-relocate="${r[0]}">改路径</button>`}<button class="more" data-rm="${i}" title="更多">${svg('more')}</button></div>
  </div>`;
  const head=`<div class="rth rcols"><span></span><span>名称 / 路径</span><span>分支</span><span>状态</span><span>最近活动</span><span></span></div>`;
  if(RV.nav==='all'&&!RV.q&&RV.sort==='opened'){
    box.innerHTML=ban+head+GROUPS.map(([g,c])=>{
      const sub=L.filter(([r])=>r[3]===g);if(!sub.length)return '';
      const fold=rFold[g]?' fold':'';
      return `<div class="rgrp${fold}" data-rg="${g}"><i style="background:${c}"></i>${g}<span class="cnt">${sub.length}</span><span class="caret">▾</span></div><div class="rblock">${sub.map(row).join('')}</div>`;
    }).join('');
  }else box.innerHTML=ban+head+L.map(row).join('');
}
document.getElementById('p-repos').addEventListener('click',e=>{
  const rg=e.target.closest('[data-rg]');if(rg){rFold[rg.dataset.rg]=!rFold[rg.dataset.rg];return renderRepos()}
  const n=e.target.closest('[data-n]');if(n){RV.nav=n.dataset.n;return renderRepos()}
  const ro=e.target.closest('[data-ro]');if(ro){e.stopPropagation();RV.sel=+ro.dataset.ro;const r=RLIST[RV.sel];if(!r[12])return DLG.relocate(r[0]);return go('files')}
  const rm=e.target.closest('[data-rm]');if(rm){e.stopPropagation();RV.sel=+rm.dataset.rm;renderRepos();const b=document.querySelector(`[data-rm="${rm.dataset.rm}"]`);const items=M.repo(RLIST[RV.sel]);if(!RLIST[RV.sel][12])items.unshift({ic:'folder',lb:'改路径关联…',act:()=>DLG.relocate(RLIST[RV.sel][0])},'-');return menuAt(b,items,{right:1})}
  const v=e.target.closest('.vseg button');if(v){RV.view=v.dataset.v;return renderRepos()}
  if(e.target.closest('#rnewg'))return DLG.newGroup();
  if(e.target.closest('#rscan'))return DLG.scan();
  if(e.target.closest('#radd,#raddEmpty'))return menuAt(document.getElementById('radd'),M.add(),{right:1});
  if(e.target.closest('#rsort')){const b=document.getElementById('rsort');return menuAt(b,[['opened','最近打开'],['name','名称'],['status','状态（有改动优先）']].map(([k,l])=>({chk:RV.sort===k,lb:l,act:()=>{RV.sort=k;document.getElementById('rsortL').textContent=l;renderRepos()}})))}
  const r=e.target.closest('[data-r]');if(r){RV.sel=+r.dataset.r;renderRepos()}
});
document.getElementById('p-repos').addEventListener('dblclick',e=>{
  const row=e.target.closest('[data-r]');if(!row)return;
  const r=RLIST[+row.dataset.r];if(!r[12])return DLG.relocate(r[0]);go('files');
});
document.getElementById('rq').oninput=e=>{RV.q=e.target.value;renderRepos()};
const sbar=document.querySelector('.statusbar');sbar.insertAdjacentHTML('beforeend','<span id="sbRepos" style="display:none"></span>');
const _go=go;go=p=>{closeMenus();_go(p);const rp=p==='repos';
  document.getElementById('sbRepos').style.display=rp?'':'none';
  if(rp){
    document.getElementById('sbRepos').innerHTML=`<b>${RLIST.length}</b> 个仓库 · <b>${RLIST.filter(r=>r[5]||r[6]||r[7]).length}</b> 个有改动${RLIST.some(r=>!r[12])?` · <b style="color:var(--danger)">${RLIST.filter(r=>!r[12]).length}</b> 个路径丢失`:''} · 双击打开`;
    ['panes','acts','panelToggles'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none'});
    document.querySelectorAll('.sep.ws').forEach(el=>el.style.display='none');
    document.getElementById('workspace')?.classList.add('home-mode');
    renderRepos();
  }else if(typeof syncPanels==='function')syncPanels();
};
document.querySelector('#p-home .sec .sp').insertAdjacentHTML('afterend','<button class="ghost rp" data-go="repos" style="margin-right:8px">全部仓库 →</button>');
document.querySelector('#console .opt[data-k=page] [data-v=home]').insertAdjacentHTML('afterend','<button data-v="repos">仓库列表</button>');
/* 仓库右键：路径丢失时优先改路径 */
const _repoMenu=M.repo;M.repo=r=>{const items=_repoMenu(r);if(r&&r[12]===0)items.splice(0,0,{ic:'folder',lb:'改路径关联…',act:()=>DLG.relocate(r[0])},'-');return items};

/* ── 操作弹窗 ── */
function form(icon,color,title,sub,body,acts,w=480){openDlg(`<div class="dh"><div class="blk" style="background:color-mix(in srgb,${color} 16%,transparent);color:color-mix(in srgb,${color} var(--tt),var(--hi))">${svg(icon)}</div><h3>${title}${sub?`<small>${sub}</small>`:''}</h3><button class="ib" data-close>${svg('x')}</button></div><div class="db" style="width:${w}px">${body}</div><div class="da">${acts}</div>`);wireForm()}
const selBtn=(id,v,ic='branch')=>`<button class="sel" data-sel="${id}">${svg(ic)}<span class="v">${v}</span>${svg('chev','cv2')}</button>`;
const ck=(l,on,sm='')=>`<label class="ckr"><span class="chk ${on?'on':''}"></span>${l}${sm?`<small>${sm}</small>`:''}</label>`;
const rcards=(name,list,on)=>`<div class="rcards" data-rc="${name}">${list.map(([k,b,s,code,dz])=>`<div class="rcard ${k===on?'on':''} ${dz?'dz':''}" data-k="${k}"><span class="rd"></span><div><b>${b}${code?`<code>${code}</code>`:''}</b><span>${s}</span></div></div>`).join('')}</div>`;
const OPTS={branch:['dev','main','release','feat/windows','origin/main','origin/feat/tray'],remote:['origin','upstream'],path:['~/Desktop/code','~/work','~/Documents/GitHub']};
function wireForm(){
  scrim.querySelectorAll('.ckr').forEach(l=>l.onclick=()=>l.querySelector('.chk').classList.toggle('on'));
  scrim.querySelectorAll('[data-rc]').forEach(g=>g.querySelectorAll('.rcard').forEach(c=>c.onclick=()=>{g.querySelectorAll('.rcard').forEach(x=>x.classList.toggle('on',x===c));g.dispatchEvent(new CustomEvent('pick',{detail:c.dataset.k}))}));
  scrim.querySelectorAll('[data-sel]').forEach(b=>b.onclick=e=>{e.stopPropagation();const list=OPTS[b.dataset.sel]||OPTS.branch;const v=b.querySelector('.v');
    const r=rectOf(b);openMenu(list.map(o=>({chk:o===v.textContent,lb:o,act:()=>{v.textContent=o}})),r.l,r.t+r.h+4,{anchor:b,minW:r.w,search:list.length>4?'搜索…':''})});
  scrim.querySelectorAll('.seg[data-seg]').forEach(seg=>{const th=seg.querySelector('.th');const place=()=>{const on=seg.querySelector('.on');th.style.left=on.offsetLeft+'px';th.style.width=on.offsetWidth+'px'};requestAnimationFrame(place);seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{seg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));place();seg.dispatchEvent(new CustomEvent('pick',{detail:b.textContent}))})});
}
const seg=(list,on)=>`<div class="seg" data-seg style="display:inline-flex"><span class="th"></span>${list.map(x=>`<button class="${x===on?'on':''}">${x}</button>`).join('')}</div>`;
const done=(t,s,sc='great')=>moment({scene:sc,title:t,sub:s});
function progress(stepsList,onEnd){const body=scrim.querySelector('.db');const acts=scrim.querySelector('.da');acts.innerHTML='<button class="ghost rp" data-close>在后台继续</button>';acts.querySelector('[data-close]').onclick=closeDlg;
  body.innerHTML=`<div style="display:flex;gap:14px;align-items:center"><img src="${pick('busy')}" style="width:64px;height:64px"><div style="flex:1"><b id="pgT" style="font-size:14px">${stepsList[0]}</b><div class="prog" style="margin-top:8px"><i id="pgI"></i></div><div id="pgP" style="font:12px var(--mono);color:var(--lo);margin-top:6px">0%</div></div></div><div class="steps">${stepsList.map((s,i)=>`<div data-s="${i}"><i>${i+1}</i>${s}</div>`).join('')}</div>`;
  let p=0;const iv=setInterval(()=>{p=Math.min(100,p+3+Math.random()*7);const st=Math.min(stepsList.length-1,Math.floor(p/100*stepsList.length));
    document.getElementById('pgI').style.width=p+'%';document.getElementById('pgP').textContent=p.toFixed(0)+'%';document.getElementById('pgT').textContent=stepsList[st];
    body.querySelectorAll('[data-s]').forEach((d,i)=>{d.className=i<st||p>=100?'done':i===st?'on':'';if(i<st||p>=100)d.querySelector('i').textContent='✓'});
    if(p>=100){clearInterval(iv);setTimeout(onEnd,400)}},120)}

Object.assign(DLG,{
  repos:()=>go('repos'),
  new:()=>menuAt(document.querySelector('[data-dlg=new]'),M.add()),
  clone:()=>{form('clone','var(--memory)','克隆远程仓库','支持 HTTPS / SSH',`<div class="field"><label>仓库地址</label><input id="cUrl" value="https://github.com/shaw/otter-notes.git"></div>
    <div class="row2"><div class="field"><label>保存到</label>${selBtn('path','~/Desktop/code','folder')}</div><div class="field"><label>文件夹名</label><input id="cName" value="otter-notes"></div></div>
    ${ck('递归克隆子模块',true,'--recurse-submodules')}${ck('浅克隆，只取最近 1 个提交',false,'--depth 1')}${ck('克隆后立即打开',true)}`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="cGo">克隆</button>`);
    document.getElementById('cUrl').oninput=e=>{document.getElementById('cName').value=(e.target.value.split('/').pop()||'').replace(/\.git$/,'')};
    document.getElementById('cGo').onclick=()=>{const cn=document.getElementById('cName').value||'otter-notes';progress(['连接远端','接收对象 1,284 / 1,284','解析差异','检出 main'],()=>{const n=cn;RLIST.unshift([n,'~/Desktop/code/'+n,'main','个人','#4FD79A',0,0,0,'Initial commit','刚刚','刚刚',0]);done('克隆完成',n+' 已添加到「仓库」','great');if(S.page==='repos')go('repos')})}},
  scan:()=>{form('scan','var(--alt)','扫描文件夹','找出目录里所有的 Git 仓库',`<div class="field"><label>扫描目录</label>${selBtn('path','~/Desktop/code','folder')}</div><div class="row2"><div class="field"><label>最大深度</label>${seg(['2','3','5'],'3')}</div><div class="field"><label>跳过</label>${ck('node_modules / build',true)}</div></div>`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="sGo">开始扫描</button>`);
    document.getElementById('sGo').onclick=()=>progress(['遍历目录','识别 .git','读取分支与状态'],()=>{const body=scrim.querySelector('.db');body.innerHTML=`<div class="note">${svg('check')}找到 7 个仓库，其中 5 个还没添加</div><div class="found">${[['otter-notes','~/Desktop/code/otter-notes',1],['Game','~/Desktop/code/Game',1],['Apple','~/Desktop/code/Apple',1],['_gen_raw','~/Desktop/code/_gen_raw',0],['legacy-site','~/Desktop/code/old/legacy-site',1],['OtterGitApp','已在列表中',-1],['GameTime','已在列表中',-1]].map(([n,p,s])=>`<label class="ckr" style="${s<0?'opacity:.45;pointer-events:none':''}"><span class="chk ${s>0?'on':''}"></span><b style="color:var(--hi);font-weight:600">${n}</b><small style="margin-left:auto;font-family:var(--mono)">${p}</small></label>`).join('')}</div>`;
      scrim.querySelector('.da').innerHTML='<button class="ghost rp" data-close>取消</button><button class="slab rp" id="sAdd">添加 4 个仓库</button>';wireForm();scrim.querySelector('.da [data-close]').onclick=closeDlg;document.getElementById('sAdd').onclick=()=>done('已添加 4 个仓库','可以在「仓库」里给它们分组','great')})},
  merge:()=>{form('merge','var(--alt)','合并分支','把另一个分支的提交合进当前分支',`<div class="row2"><div class="field"><label>合并</label>${selBtn('branch','feat/windows')}</div><div class="field"><label>到当前分支</label><button class="sel" disabled style="opacity:.7">${svg('branch')}<span class="v">dev</span></button></div></div>
    <div class="note">${svg('info')}将合入 3 个提交 · 5 个文件 · 无冲突（已预演）</div>
    ${rcards('ms',[['ff','快进优先','能快进就快进，不能就创建合并提交','--ff'],['noff','总是创建合并提交','保留分支的完整形状','--no-ff'],['squash','压缩为一个提交','把所有改动作为一次新提交','--squash']],'noff')}${ck('合并后删除 feat/windows',false)}`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="mGo">合并</button>`);document.getElementById('mGo').onclick=()=>done('合并完成','feat/windows → dev · 3 个提交','great')},
  reset:(mode='mixed')=>{const c=COMMITS[hsel];form('reset','var(--warn)','重置 dev 到此提交',`<span class="chip">${HASH[hsel]}</span> ${c[0]}`,
    rcards('rs',[['soft','软重置','之后的提交变成已暂存的更改','--soft'],['mixed','混合重置','之后的提交变成未暂存的更改','--mixed'],['hard','硬重置','丢弃之后的提交和工作区里的所有更改','--hard',1]],mode)+`<div class="note warn" id="rWarn" style="display:${mode==='hard'?'flex':'none'}">${svg('shield')}硬重置会丢掉 12 个未提交的更改，无法用撤销找回（可以通过 Reflog 恢复提交）</div>`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp ${mode==='hard'?'danger':''}" id="rGo">${mode==='hard'?'硬重置':'重置'}</button>`,520);
    const g=scrim.querySelector('[data-rc=rs]'),b=document.getElementById('rGo');g.addEventListener('pick',e=>{const h=e.detail==='hard';b.classList.toggle('danger',h);b.textContent=h?'硬重置':'重置';document.getElementById('rWarn').style.display=h?'flex':'none'});
    b.onclick=()=>done('已重置','dev → '+HASH[hsel]+'（可在 Reflog 中找回）','relief')},
  tag:()=>{form('tag','var(--memory)','打标签',`目标 <span class="chip">${HASH[hsel]}</span>`,`<div class="field"><label>标签名</label><input value="v1.3.0"></div><div class="field"><label>附注（可选）</label><input value="琥珀金主题 + 全屏对比"></div>${ck('创建附注标签',true,'-a')}${ck('同时推送到 origin',true)}`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="tGo">创建标签</button>`);document.getElementById('tGo').onclick=()=>done('标签已创建','v1.3.0 · 已推送到 origin','proud')},
  stashSave:()=>{form('stash','var(--win)','暂存更改','把未提交的更改先收起来',`<div class="field"><label>说明</label><input value="WIP: 仓库列表页"></div>${ck('包含未跟踪的文件',true,'-u')}${ck('保留已暂存的内容',false,'--keep-index')}<div class="note">${svg('info')}12 个文件 · 暂存后工作区会回到干净状态</div>`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="stGo">暂存</button>`);document.getElementById('stGo').onclick=()=>done('已暂存','stash@{0} · WIP: 仓库列表页','ok')},
  pushOpts:()=>{form('push','var(--accent)','推送选项','',`<div class="row2"><div class="field"><label>远端</label>${selBtn('remote','origin','cloud')}</div><div class="field"><label>远端分支</label>${selBtn('branch','dev')}</div></div>${ck('推送所有标签',false,'--tags')}${ck('设置为上游分支',true,'-u')}${ck('强制推送（安全模式）',false,'--force-with-lease')}`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="poGo">推送</button>`);document.getElementById('poGo').onclick=()=>{closeDlg();setTimeout(doPush,280)}},
  pullOpts:()=>{form('pull','var(--memory)','拉取选项','',`<div class="row2"><div class="field"><label>远端</label>${selBtn('remote','origin','cloud')}</div><div class="field"><label>分支</label>${selBtn('branch','dev')}</div></div><div class="field"><label>方式</label>${seg(['merge','rebase','仅快进'],'merge')}</div>${ck('自动暂存本地更改',true,'--autostash')}${ck('拉取后修剪远端分支',false,'--prune')}`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="plGo">拉取</button>`);document.getElementById('plGo').onclick=()=>done('拉取完成','origin/dev · 已是最新','clean')},
  flowStart:()=>{form('flow','var(--ok)','Git-flow · 开始','从开发分支开出新的工作分支',`<div class="field"><label>类型</label>${seg(['feature','release','hotfix','support'],'feature')}</div><div class="field"><label>名称</label><div style="display:flex;gap:8px;align-items:center"><span class="chip" id="fPre">feature/</span><input style="flex:1;height:38px;border-radius:12px;border:.5px solid var(--line);background:var(--field);color:var(--hi);padding:0 12px;font:inherit;outline:none" value="repo-list"></div></div><div class="field"><label>基于</label>${selBtn('branch','dev')}</div>`,
    `<button class="ghost rp" data-close>取消</button><button class="slab rp" id="fGo">开始</button>`);scrim.querySelector('.seg').addEventListener('pick',e=>{document.getElementById('fPre').textContent=e.detail+'/'});document.getElementById('fGo').onclick=()=>done('已开始','切换到 '+document.getElementById('fPre').textContent+'repo-list','cheer')},
  rebaseI:()=>{const ops=['pick','reword','edit','squash','fixup','drop'];const L=COMMITS.slice(0,5).map((c,i)=>({h:HASH[i],s:c[0],op:'pick'}));
    form('edit','var(--alt)','交互式变基','dev 上最近 5 个提交 · 拖动调整顺序',`<div id="rbL"></div><div class="note" style="margin-top:8px">${svg('info')}squash / fixup 会合并到上一个提交；drop 会丢弃该提交</div>`,`<button class="ghost rp" data-close>取消</button><button class="slab rp" id="rbGo">开始变基</button>`,560);
    const draw=()=>{document.getElementById('rbL').innerHTML=L.map((r,i)=>`<div class="rb ${r.op==='drop'?'drop':''}" data-i="${i}" draggable="true"><svg class="gp" viewBox="0 0 24 24">${IC.grip}</svg><button class="op ${r.op}" data-op="${i}">${r.op}<span>▾</span></button><span class="h">${r.h}</span><span class="s">${r.s}</span></div>`).join('');
      scrim.querySelectorAll('[data-op]').forEach(b=>b.onclick=e=>{e.stopPropagation();const r=rectOf(b),it=L[+b.dataset.op];openMenu(ops.map(o=>({chk:o===it.op,lb:o,sm:{pick:'保留',reword:'改说明',edit:'停下修改',squash:'合并（保留说明）',fixup:'合并（丢弃说明）',drop:'丢弃'}[o],danger:o==='drop',act:()=>{it.op=o;draw()}})),r.l,r.t+r.h+4,{anchor:b})});
      let from;scrim.querySelectorAll('.rb').forEach(row=>{row.ondragstart=()=>from=+row.dataset.i;row.ondragover=e=>e.preventDefault();row.ondrop=()=>{const to=+row.dataset.i;L.splice(to,0,L.splice(from,1)[0]);draw()}})};draw();
    document.getElementById('rbGo').onclick=()=>done('变基完成',L.filter(r=>r.op!=='drop').length+' 个提交 · '+L.filter(r=>/squash|fixup/.test(r.op)).length+' 个已合并','great')},
  rename:()=>{const r=RLIST[RV.sel];form('edit','var(--accent)','重命名仓库','只改列表里显示的名字，不动文件夹',`<div class="field"><label>显示名称</label><input value="${r[0]}"></div><div class="field"><label>路径</label><input value="${r[1]}" disabled style="opacity:.6"></div>`,`<button class="ghost rp" data-close>取消</button><button class="slab rp" data-close>保存</button>`,420)},
  newGroup:()=>{form('group','var(--accent)','新建分组','',`<div class="field"><label>分组名</label><input value="开源"></div><div class="field"><label>颜色</label><div style="display:flex;gap:8px">${['#FFC23D','#6CC9FF','#B8A8FF','#4FD79A','#FF8AB8','#FF8A3D'].map((c,i)=>`<span style="width:26px;height:26px;border-radius:8px;background:${c};cursor:pointer;box-shadow:${i?'none':'0 0 0 2px var(--raised),0 0 0 4px '+c}"></span>`).join('')}</div></div>`,`<button class="ghost rp" data-close>取消</button><button class="slab rp" data-close>创建</button>`,400)}
});

/* 控制台入口 */
document.querySelector('#console .opt[data-k=dlg]').insertAdjacentHTML('beforeend',['clone','initRepo','addLocal','createRemote','scan','merge','reset','tag','stashSave','pushOpts','pullOpts','flowStart','rebaseI','patch','worktree','bisect','submodule'].map(k=>`<button data-x="${k}" data-v="x-${k}">${{clone:'克隆',initRepo:'新建仓库',addLocal:'添加仓库',createRemote:'远程新建',scan:'扫描',merge:'合并',reset:'重置',tag:'标签',stashSave:'暂存',pushOpts:'推送选项',pullOpts:'拉取选项',flowStart:'Git-flow',rebaseI:'交互式变基',patch:'补丁',worktree:'工作树',bisect:'二分查错',submodule:'子模块'}[k]}</button>`).join(''));
document.querySelector('#console .opt[data-k=dlg]').insertAdjacentHTML('afterend',`<h2>菜单（含二级联动）</h2><div class="opt" data-k="menu">${[['more','更多 ▸ Git-flow'],['push','推送 ▸ 远端'],['stash','暂存列表 ▸'],['file','右键文件'],['commit','右键提交'],['branch','右键分支'],['switch','分支切换'],['repo','右键仓库']].map(([k,l])=>`<button data-m="${k}" data-v="m-${k}">${l}</button>`).join('')}</div><p>窗口里也可以直接右键：文件、提交、侧栏分支 / 标签、仓库行；状态栏的分支名可以点。菜单支持 ↑↓ ← → 回车 Esc。</p>`);
document.getElementById('console').addEventListener('click',e=>{
  const x=e.target.closest('[data-x]');if(x){e.stopImmediatePropagation();if(x.dataset.x==='reset'&&S.page!=='history')go('history');return DLG[x.dataset.x]()}
  const b=e.target.closest('[data-m]');if(!b)return;e.stopImmediatePropagation();const k=b.dataset.m;
  setTimeout(()=>{
    if(['more','push','stash'].includes(k)){if(S.page==='home'||S.page==='repos')go('files');const a=document.querySelector(`.act[data-act=${k}]`);const m=menuAt(a,M[k]());const first=[...m.el.querySelectorAll('.mi')].find(mi=>M[k]()[+mi.dataset.i].sub);if(first){first.classList.add('hot');openSub(m,first)}}
    else if(k==='file'){go('files');const f=document.querySelector('#fileList .f');const r=rectOf(f);const m=openMenu(M.file(files[0]),r.l+120,r.t+r.h/2);const s=[...m.el.querySelectorAll('.mi')].find(mi=>m.items[+mi.dataset.i].sub);if(s){s.classList.add('hot');openSub(m,s)}}
    else if(k==='commit'){go('history');setTimeout(()=>{const c=document.querySelector('.cm[data-h="2"]');hsel=2;renderHistory();const r=rectOf(document.querySelector('.cm[data-h="2"]'));const m=openMenu(M.commit(),r.l+260,r.t+r.h/2);const s=[...m.el.querySelectorAll('.mi')].find(mi=>m.items[+mi.dataset.i].lb.startsWith('将 dev 重置'));if(s){s.classList.add('hot');openSub(m,s)}},80)}
    else if(k==='branch'){if(S.page==='home'||S.page==='repos')go('files');const it=[...document.querySelectorAll('#sidebar .tree .it')].find(x=>x.textContent.includes('windows'));const r=rectOf(it);const m=openMenu(M.branch('feat/windows'),r.l+r.w-20,r.t+(r.h||0)/2);const s=[...m.el.querySelectorAll('.mi')].find(mi=>m.items[+mi.dataset.i].sub);if(s){s.classList.add('hot');openSub(m,s)}}
    else if(k==='switch'){if(S.page==='home'||S.page==='repos')go('files');sbB.click()}
    else if(k==='repo'){go('repos');setTimeout(()=>{const b=document.querySelector('[data-rm="1"]');RV.sel=1;const m=menuAt(b,M.repo(RLIST[1]),{right:1});const s=[...m.el.querySelectorAll('.mi')].find(mi=>m.items[+mi.dataset.i].sub);if(s){s.classList.add('hot');openSub(m,s)}},60)}
  },30);
},true);
