/* 水獭 Git 官网交互
   - 背景环境层：颜色读当前章节的 data-tone（与 App 的 RepoTone 同一套）
   - 小獭问候与表情（只有问候语可以活泼一点）
   - 状态章节：步骤进入视口时切换右侧截图、表情与背景色调
   - 在线试用：iframe 载入 demo/，按钮经 postMessage 控制
   - GSAP 动效全部在 matchMedia(no-preference) 里注册；减少动态效果时内容直接落位 */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EXPR = "demo/assets/expr/";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ── 背景环境层 ─────────────────────────────────────────── */
  var TONES = {
    dawn: { g: [[255, 194, 61], [176, 124, 255], [255, 138, 61]], l: [255, 214, 107], s: 1 },
    calm: { g: [[63, 169, 245], [122, 162, 255], [92, 214, 230]], l: [108, 201, 255], s: .8 },
    warm: { g: [[255, 176, 32], [255, 122, 69], [255, 214, 107]], l: [255, 214, 107], s: 1 },
    alert: { g: [[255, 107, 107], [255, 159, 107], [255, 90, 120]], l: [255, 138, 138], s: 1.2 },
    busy: { g: [[63, 169, 245], [176, 124, 255], [122, 162, 255]], l: [157, 180, 255], s: 2.2 }
  };
  var cv = $("#ambient");
  var cx = cv.getContext("2d");
  var W = 0, H = 0;
  var tone = "dawn";
  var cur = JSON.parse(JSON.stringify(TONES.dawn));
  var clock = 0, last = 0, raf = 0;

  function resize() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    if (reduced) draw(true);
  }

  function mix(a, b, k) { return a + (b - a) * k; }

  function rgba(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }

  function draw(snap) {
    var t = TONES[tone];
    var k = snap ? 1 : .05;
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) cur.g[i][j] = mix(cur.g[i][j], t.g[i][j], k);
    for (j = 0; j < 3; j++) cur.l[j] = mix(cur.l[j], t.l[j], k);
    cur.s = mix(cur.s, t.s, k);

    cx.fillStyle = "#0e0c16";
    cx.fillRect(0, 0, W, H);
    var R = Math.max(W, H) * .6;
    var alpha = [.17, .12, .09];
    for (i = 0; i < 3; i++) {
      var px = W * (.5 + .38 * Math.sin(clock * .045 + i * 2.1));
      var py = H * (.32 + .28 * Math.cos(clock * .037 + i * 1.7));
      var gr = cx.createRadialGradient(px, py, 0, px, py, R);
      gr.addColorStop(0, rgba(cur.g[i], alpha[i]));
      gr.addColorStop(1, rgba(cur.g[i], 0));
      cx.fillStyle = gr;
      cx.fillRect(0, 0, W, H);
    }
    var lg = cx.createLinearGradient(0, 0, W, 0);
    lg.addColorStop(0, rgba(cur.l, 0));
    lg.addColorStop(.5, rgba(cur.l, .26));
    lg.addColorStop(1, rgba(cur.l, 0));
    cx.strokeStyle = lg;
    cx.lineWidth = 1.2;
    for (i = 0; i < 3; i++) {
      var base = H - 72 + i * 20;
      var amp = 9 - i * 2;
      var len = W / (1.3 + i * .25);
      cx.beginPath();
      for (var x = 0; x <= W; x += 8) {
        var y = base + amp * Math.sin((x / len) * Math.PI * 2 - clock * (.55 + i * .12) * cur.s);
        x ? cx.lineTo(x, y) : cx.moveTo(x, y);
      }
      cx.stroke();
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 33) return;
    clock += Math.min(now - last, 100) / 1000;
    last = now;
    draw(false);
  }

  function setTone(next) {
    if (!TONES[next] || next === tone) return;
    tone = next;
    if (reduced) draw(true);
  }

  window.addEventListener("resize", resize);
  resize();
  if (!reduced) {
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function () {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
  }

  /* 章节色调：视口中线所在的 [data-tone] 生效 */
  var toneIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setTone(e.target.dataset.tone); });
  }, { rootMargin: "-48% 0px -48% 0px" });
  $$("[data-tone]").forEach(function (el) { toneIO.observe(el); });

  /* ── 导航底色 ── */
  var nav = $("#nav");
  var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── 小獭问候（按时段）与表情 ── */
  var hour = new Date().getHours();
  var GREET = hour < 5 ? ["夜深了，提交完早点休息呀", "这么晚还在写代码？我陪你"]
    : hour < 11 ? ["早上好，先拉一下远程再开工吧", "早呀，今天也一起写点好代码"]
      : hour < 14 ? ["中午好，吃过饭再继续也不迟", "午安，改动我帮你看着"]
        : hour < 18 ? ["下午好，今天也一起写点好代码", "下午好，记得提交得勤一点"]
          : ["晚上好，提交完别忘了推送", "晚上好，今天辛苦啦"];
  var PET = ["laugh", "love", "shy", "happy", "great", "hi"];
  var LINES = ["你好呀，我是小獭", "别戳啦，我在帮你看着分支呢", "推送之前我会先问你的", "今天的提交也辛苦啦", "冲突别怕，我们一块一块来"];
  var gi = 0;
  var greetText = $("#greet-text");
  greetText.textContent = GREET[0];
  $("#greet").addEventListener("click", function () {
    gi = (gi + 1) % GREET.length;
    greetText.textContent = GREET[gi];
  });

  var peek = $("#peek");
  var peekImg = $("img", peek);
  var bubble = $("#bubble");
  var lastPet = "", bubbleTimer = 0, li = 0;

  function say(text) {
    bubble.textContent = text;
    bubble.hidden = false;
    if (window.gsap && !reduced) gsap.fromTo(bubble, { autoAlpha: 0, y: 6, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .25, ease: "power2.out" });
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      if (window.gsap && !reduced) gsap.to(bubble, { autoAlpha: 0, duration: .15, onComplete: function () { bubble.hidden = true; } });
      else bubble.hidden = true;
    }, 2800);
  }

  peek.addEventListener("click", function () {
    var k;
    do { k = PET[Math.random() * PET.length | 0]; } while (k === lastPet);
    lastPet = k;
    peekImg.src = EXPR + k + ".webp";
    say(LINES[li++ % LINES.length]);
    if (window.gsap && !reduced) gsap.fromTo(peekImg, { scale: .82, rotate: -8 }, { scale: 1, rotate: 0, duration: .5, ease: "back.out(2.4)" });
  });

  /* ── 系统识别：下载卡片与首屏主按钮 ── */
  var ua = navigator.userAgent;
  var isWin = /Windows/i.test(ua);
  var isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua);
  if (isWin) {
    $("#dl-win").classList.add("mine");
    var main = $("#cta-main"), alt = $("#cta-alt");
    var href = main.href, file = main.dataset.dl;
    main.href = alt.href;
    main.dataset.dl = alt.dataset.dl;
    alt.href = href;
    alt.dataset.dl = file;
    $("span", main).textContent = "下载 Windows 预览版";
    $("span", alt).textContent = "macOS 版";
  } else if (isMac) {
    $("#dl-mac").classList.add("mine");
  }

  /* ── 下载源：默认 Gitee，IP 查到不在中国大陆时换 GitHub ──
     查询失败、超时或被墙都保持 Gitee。data-dl 为文件名，空串表示 Release 页。 */
  var MIRRORS = {
    gitee: { file: "https://gitee.com/shaw2026/ottergit-site/releases/download/latest/", page: "https://gitee.com/shaw2026/ottergit-site/releases/latest" },
    github: { file: "https://github.com/ShaoAsher/ottergit-site/releases/latest/download/", page: "https://github.com/ShaoAsher/ottergit-site/releases/latest" }
  };
  function useMirror(name) {
    var m = MIRRORS[name];
    $$("[data-dl]").forEach(function (a) {
      a.href = a.dataset.dl ? m.file + a.dataset.dl : m.page;
    });
  }
  function country(url, pick) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 2500);
    return fetch(url, { signal: ctl && ctl.signal, cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) { clearTimeout(timer); return pick(d) || Promise.reject(); });
  }
  var cached = null;
  try { cached = sessionStorage.getItem("og-mirror"); } catch (e) {}
  if (cached) {
    useMirror(cached);
  } else if (window.fetch) {
    country("https://api.country.is/", function (d) { return d.country; })
      .catch(function () { return country("https://get.geojs.io/v1/ip/country.json", function (d) { return d.country; }); })
      .then(function (cc) {
        var name = String(cc).toUpperCase() === "CN" ? "gitee" : "github";
        try { sessionStorage.setItem("og-mirror", name); } catch (e) {}
        useMirror(name);
      })
      .catch(function () {});
  }

  /* ── 状态章节 ── */
  var steps = $$(".step");
  var screens = $$("#screens img");
  var stateOtter = $("#state-otter");
  var stepIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      steps.forEach(function (s) { s.classList.toggle("on", s === el); });
      screens.forEach(function (im, i) { im.classList.toggle("on", i === +el.dataset.shot); });
      var src = EXPR + el.dataset.otter + ".webp";
      if (stateOtter.getAttribute("src") !== src) {
        stateOtter.src = src;
        if (window.gsap && !reduced) gsap.fromTo(stateOtter, { scale: .8, y: 8 }, { scale: 1, y: 0, duration: .45, ease: "back.out(2)" });
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(function (s) { stepIO.observe(s); });

  /* ── 浅色 / 深色对比 ── */
  var compare = $("#compare");
  $("input", compare).addEventListener("input", function (e) {
    compare.style.setProperty("--p", e.target.value + "%");
  });

  /* ── 短片章节 ── */
  var video = $("#promo");
  $$(".chapters a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      video.preload = "auto";
      video.currentTime = +a.dataset.t;
      video.play().catch(function () {});
      video.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    });
  });

  /* ── 在线试用 ── */
  var view = $("#demo-view");
  var panel = $("#panel");
  var frame = null;
  var PAGE = { home: "首页", files: "工作副本", history: "历史", repos: "仓库列表", settings: "设置", about: "关于" };
  var TONE_TEXT = { calm: "工作区干净", warm: "有未提交的更改", alert: "合并冲突", busy: "同步中" };
  var TONE_DOT = { calm: "var(--sky)", warm: "var(--amber)", alert: "var(--coral)", busy: "var(--violet)" };

  function send(action, value) {
    if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: "otter-demo", action: action, value: value }, "*");
  }

  $("#demo-start").addEventListener("click", function () {
    frame = document.createElement("iframe");
    frame.src = "demo/index.html?embed&nosplash&page=files";
    frame.title = "水獭 Git 交互演示";
    frame.setAttribute("allow", "autoplay");
    view.appendChild(frame);
    var poster = $("#demo-start");
    $("#ro-text").textContent = "正在载入…";
    frame.addEventListener("load", function () {
      poster.remove();
      $$("button[disabled]", panel).forEach(function (b) { b.disabled = false; });
      frame.focus();
    });
  });

  panel.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-a]");
    if (!b || b.disabled) return;
    var a = b.dataset.a;
    if (a === "reset") { frame.src = frame.src; return; }
    send(a, b.dataset.v);
  });

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.type !== "otter-demo-state" || !frame || e.source !== frame.contentWindow) return;
    $$('[data-group="page"] .chip').forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.v === d.page)); });
    $$('[data-group="theme"] .chip').forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.v === d.theme)); });
    $("#ro-text").textContent = (PAGE[d.page] || d.page) + " · " + (TONE_TEXT[d.tone] || "首页") + (d.ai ? " · 小獭面板已打开" : "");
    $("#ro-dot").style.background = TONE_DOT[d.tone] || "var(--amber)";
  });

  /* ── 动效 ───────────────────────────────────────────────── */
  var oc = $("#oc");

  function ocFinal() {
    $(".busy", oc).style.display = "none";
    $(".done", oc).style.display = "grid";
  }

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion");
    ocFinal();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    root.classList.remove("motion");
    ocFinal();
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    /* 首屏入场：100ms 错开，12px 位移 + 4px 模糊 */
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo("[data-in]", { autoAlpha: 0, y: 18, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .7, stagger: .1, clearProps: "filter" })
      .fromTo("[data-in-stage]", { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1 }, "-=.45")
      .fromTo("#peek", { autoAlpha: 0, y: 40, rotate: 10 }, { autoAlpha: 1, y: 0, rotate: 0, duration: .7, ease: "back.out(1.8)" }, "-=.5")
      .add(function () { say(LINES[li++]); }, "+=.2");

    /* 首屏窗口：从倾斜放平 */
    gsap.fromTo("#hero-frame", { rotateX: 14, scale: .94 }, {
      rotateX: 0, scale: 1, ease: "none",
      scrollTrigger: { trigger: "#hero-frame", start: "top 95%", end: "top 25%", scrub: .6 }
    });

    /* 小獭轻微浮动 */
    gsap.to("#peek img", { y: -6, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    /* 章节内容进入视口 */
    gsap.set(".rise", { autoAlpha: 0, y: 16 });
    var reveal = function (batch) {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: .6, stagger: .1, ease: "power3.out", overwrite: true });
    };
    /* 点导航直接跳过某段时只会触发 onLeave，三种都要落位，否则跳过的内容回看时是空的 */
    ScrollTrigger.batch(".rise", { start: "top 88%", onEnter: reveal, onLeave: reveal, onEnterBack: reveal });

    /* 数字滚动 */
    $$("[data-count]").forEach(function (el) {
      var n = +el.dataset.count;
      var o = { v: 0 };
      gsap.to(o, {
        v: n, duration: 1.4, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.textContent = Math.round(o.v); }
      });
    });

    /* 结果页：进度条 → 原地切换为里程碑 */
    var busy = $(".busy", oc), done = $(".done", oc);
    var burst = [];
    for (var i = 0; i < 10; i++) {
      var d = document.createElement("i");
      d.className = "burst";
      $("#oc-stage").appendChild(d);
      burst.push(d);
    }
    var ocTl = gsap.timeline({ paused: true });
    ocTl
      .set(busy, { display: "grid", autoAlpha: 1 })
      .set(done, { display: "none" })
      .fromTo(oc, { scale: .9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .35, ease: "back.out(1.6)" })
      .fromTo(".oc .bar i", { xPercent: -110 }, { xPercent: 260, duration: .9, ease: "power1.inOut", repeat: 1 }, "<")
      .to(busy, { autoAlpha: 0, duration: .15 })
      .set(busy, { display: "none" })
      .set(done, { display: "grid" })
      .fromTo(done, { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: .4, ease: "back.out(1.8)" })
      .fromTo(".oc .done img", { scale: .5, rotate: -12 }, { scale: 1, rotate: 0, duration: .6, ease: "back.out(2.6)" }, "<")
      .fromTo(burst, { autoAlpha: 1, x: 0, y: 0, scale: 1 }, {
        autoAlpha: 0, scale: .3, duration: .9, ease: "power2.out",
        x: function (i) { return Math.cos(i / 10 * Math.PI * 2) * 150; },
        y: function (i) { return Math.sin(i / 10 * Math.PI * 2) * 110; }
      }, "<")
      .fromTo(".oc .btns span", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .08 }, "-=.6");
    ScrollTrigger.create({
      trigger: "#oc-stage", start: "top 70%",
      onEnter: function () { ocTl.restart(); },
      onEnterBack: function () { ocTl.restart(); }
    });

    root.classList.add("ready");
    return function () { burst.forEach(function (b) { b.remove(); }); };
  });
})();
