/* SoriArchive — shared header/footer, language switch, search, and page logic */
(function () {
  "use strict";
  var FORM_EMAIL = "bubble.youthimpact@gmail.com";
  var D = window.SORI || { genres: [], regions: [], sounds: [] };
  var body = document.body;
  var BASE = body.getAttribute("data-base") || "";
  var PREVIEW = !!window.SORI_PREVIEW;

  /* ---------- icons ---------- */
  var I = {
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5a2 2 0 0 0-2-2h-7L10 5H5a2 2 0 0 0-2 2"/><path d="M6 7.5V6.6A1.6 1.6 0 0 1 7.6 5H9"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 5v14l11-7z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/></svg>',
    headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  window.SORI_ICONS = I;

  /* ---------- language ---------- */
  var LANG = "en";
  var saved = null;
  try { saved = localStorage.getItem("sori-lang"); } catch (e) {}
  LANG = saved || ((navigator.language || "").slice(0, 2) === "ko" ? "ko" : "en");
  if (LANG !== "ko") LANG = "en";
  function t(en, ko) { return LANG === "ko" ? ko : en; }

  function applyLang() {
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-ko]").forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = LANG === "ko" ? el.dataset.ko : el.dataset.en;
    });
    document.querySelectorAll("[data-ko-ph]").forEach(function (el) {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.placeholder;
      el.placeholder = LANG === "ko" ? el.dataset.koPh : el.dataset.enPh;
    });
    document.querySelectorAll(".lang-code").forEach(function (el) { el.textContent = LANG.toUpperCase(); });
    document.querySelectorAll(".mm-lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === LANG)); });
    rerender.forEach(function (fn) { fn(); });
  }
  function setLang(l) { LANG = l; try { localStorage.setItem("sori-lang", l); } catch (e) {} applyLang(); }
  var rerender = [];

  /* ---------- links ---------- */
  var PAGES = [
    { id: "home", href: "", en: "Home", ko: "홈" },
    { id: "about", href: "about/", en: "About Us", ko: "소개" },
    { id: "sounds", href: "sounds/", en: "Sounds", ko: "소리" },
    { id: "news", href: "news/", en: "News Coverage", ko: "언론 보도" },
    { id: "partnerships", href: "partnerships/", en: "Partnerships", ko: "파트너십" },
    { id: "contact", href: "contact/", en: "Contact", ko: "문의" }
  ];
  function url(p) { return BASE + p || "./"; }
  function link(id, q) { var p = PAGES.filter(function (x) { return x.id === id; })[0]; return url(p ? p.href : "") + (q || ""); }

  /* ---------- header / footer ---------- */
  function renderChrome() {
    var cur = body.getAttribute("data-page");
    var nav = PAGES.map(function (p) {
      return '<a href="' + url(p.href) + '" data-route="' + p.id + '"' + (p.id === cur ? ' aria-current="page"' : "") + ' data-ko="' + p.ko + '">' + p.en + "</a>";
    }).join("");
    var header = document.getElementById("site-header");
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="' + url("") + '" data-route="home" aria-label="SoriArchive home"><span class="brand-mark">' + I.folder + "</span>SoriArchive</a>" +
      '<nav class="nav" aria-label="Main">' + nav + "</nav>" +
      '<div class="header-tools">' +
      '<form class="search" role="search" data-search>' + I.search +
      '<input id="hdr-search" name="q" type="search" placeholder="Search sounds..." data-ko-ph="소리 검색..." aria-label="Search sounds"></form>' +
      '<a class="icon-btn search-btn" href="' + link("sounds", "?focus=1") + '" data-route="sounds" data-q="?focus=1" aria-label="Search sounds">' + I.search + "</a>" +
      '<button class="lang-pill" type="button" data-lang-toggle aria-label="Change language">' + I.globe + '<span class="lang-code">EN</span></button>' +
      '<button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open>' + I.menu + "</button>" +
      "</div></div>";

    var mm = document.createElement("div");
    mm.className = "mobile-menu"; mm.id = "mobile-menu"; mm.hidden = true;
    mm.setAttribute("role", "dialog"); mm.setAttribute("aria-modal", "true"); mm.setAttribute("aria-label", "Menu");
    mm.innerHTML =
      '<div class="mm-top"><a class="brand" href="' + url("") + '" data-route="home"><span class="brand-mark">' + I.folder + '</span>SoriArchive</a>' +
      '<button class="mm-close" type="button" aria-label="Close menu" data-menu-close>' + I.close + "</button></div>" +
      '<div class="mm-lang" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="ko">한국어</button></div>' +
      '<ul class="mm-links">' + PAGES.map(function (p) {
        return '<li><a href="' + url(p.href) + '" data-route="' + p.id + '"' + (p.id === cur ? ' aria-current="page"' : "") + '><span data-ko="' + p.ko + '">' + p.en + "</span>" + I.arrow + "</a></li>";
      }).join("") + "</ul>";
    body.appendChild(mm);

    var footer = document.getElementById("site-footer");
    footer.className = "site-footer";
    footer.innerHTML = '<div class="wrap"><span>©SoriArchive. <span data-ko="모든 권리 보유.">All rights reserved.</span></span>' +
      '<nav aria-label="Footer">' + PAGES.slice(1).map(function (p) { return '<a href="' + url(p.href) + '" data-route="' + p.id + '" data-ko="' + p.ko + '">' + p.en + "</a>"; }).join("") + "</nav></div>";

    // menu
    var openBtn = header.querySelector("[data-menu-open]");
    function openMenu() { mm.hidden = false; body.classList.add("menu-open"); openBtn.setAttribute("aria-expanded", "true"); mm.querySelector(".mm-close").focus(); }
    function closeMenu() { mm.hidden = true; body.classList.remove("menu-open"); openBtn.setAttribute("aria-expanded", "false"); }
    openBtn.addEventListener("click", openMenu);
    mm.querySelector("[data-menu-close]").addEventListener("click", closeMenu);
    mm.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mm.hidden) closeMenu(); });
    window.SORI_closeMenu = closeMenu;

    // language
    header.querySelector("[data-lang-toggle]").addEventListener("click", function () { setLang(LANG === "en" ? "ko" : "en"); });
    mm.querySelectorAll(".mm-lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });

    // search
    header.querySelector("[data-search]").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = this.q.value.trim();
      go("sounds", q ? "?q=" + encodeURIComponent(q) : "");
    });
  }

  /* ---------- navigation (real pages; in preview, swaps views) ---------- */
  function go(id, q) {
    if (PREVIEW && window.SORI_route) return window.SORI_route(id, q || "");
    location.href = link(id, q);
  }
  function getParams() { return new URLSearchParams(PREVIEW ? (window.SORI_query || "") : location.search); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function genreOf(id) { return D.genres.filter(function (g) { return g.id === id; })[0]; }
  function regionOf(id) { return D.regions.filter(function (r) { return r.id === id; })[0]; }

  function regionName(id) { var r = regionOf(id); return r ? t(r.en, r.id) : id; }
  function countBy(key, val) { var n = 0; for (var i = 0; i < D.sounds.length; i++) if (D.sounds[i][key] === val) n++; return n; }
  function img(path, alt, cls) { return '<img' + (cls ? ' class="' + cls + '"' : "") + ' src="' + BASE + path + '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async">'; }

  /* ---------- home ---------- */
  var PIN = '<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 31C6 23 2 18 2 12a10 10 0 0 1 20 0c0 6-4 11-10 19z"/><circle cx="12" cy="12" r="4"/></svg>';
  function initHome() {
    document.querySelectorAll("[data-total]").forEach(function (el) { el.textContent = D.sounds.length; });
    var mapEl = document.getElementById("korea-map");
    if (mapEl && !mapEl.dataset.ready) {
      mapEl.dataset.ready = "1";
      mapEl.innerHTML = '<img class="map-img" src="' + BASE + 'assets/img/korea-map.png" alt="Map of South Korea" width="385" height="650">' +
        D.regions.map(function (r, i) {
          return '<button type="button" class="pin" data-region="' + esc(r.id) + '" style="left:' + r.x + "%;top:" + r.y + "%;--d:" + (i * 0.28).toFixed(2) + 's">' +
            '<span class="halo"></span>' + PIN + '<span class="pin-tip"></span></button>';
        }).join("");
      mapEl.querySelectorAll(".pin").forEach(function (p) {
        p.addEventListener("click", function () { go("sounds", "?region=" + encodeURIComponent(p.dataset.region)); });
      });
    }
    var legend = document.getElementById("region-legend");
    function drawPins() {
      if (mapEl) mapEl.querySelectorAll(".pin").forEach(function (p) {
        var n = countBy("r", p.dataset.region);
        var label = regionName(p.dataset.region) + " · " + n + t(n === 1 ? " sound" : " sounds", "곡");
        p.setAttribute("aria-label", label);
        p.querySelector(".pin-tip").textContent = label;
      });
      if (legend) legend.innerHTML = D.regions.map(function (r) {
        return '<a class="region-chip" href="' + link("sounds", "?region=" + encodeURIComponent(r.id)) + '" data-route="sounds" data-q="?region=' + encodeURIComponent(r.id) + '" data-region="' + esc(r.id) + '">' + esc(regionName(r.id)) + " <b>" + countBy("r", r.id) + "</b></a>";
      }).join("");
    }
    if (legend && !legend.dataset.ready) {
      legend.dataset.ready = "1";
      // hovering a chip lights up its pin
      legend.addEventListener("mouseover", function (e) { var c = e.target.closest(".region-chip"); lightPin(c && c.dataset.region); });
      legend.addEventListener("mouseleave", function () { lightPin(null); });
      legend.addEventListener("focusin", function (e) { var c = e.target.closest(".region-chip"); lightPin(c && c.dataset.region); });
      legend.addEventListener("focusout", function () { lightPin(null); });
    }
    function lightPin(id) { if (mapEl) mapEl.querySelectorAll(".pin").forEach(function (p) { p.classList.toggle("lit", p.dataset.region === id); }); }

    var grid = document.getElementById("genre-grid");
    function drawGenres() {
      if (!grid) return;
      grid.innerHTML = D.genres.map(function (g) {
        var n = countBy("g", g.id);
        return '<a class="genre-card" href="' + link("sounds", "?genre=" + encodeURIComponent(g.id)) + '" data-route="sounds" data-q="?genre=' + encodeURIComponent(g.id) + '">' +
          '<span class="genre-emoji" aria-hidden="true">' + img(g.img, "") + '</span><span class="genre-ko">' + esc(g.id) + '</span><span class="genre-en">' + esc(g.en) + "</span>" +
          '<span class="genre-count">' + n + t(n === 1 ? " recording" : " recordings", "개 기록") + "</span>" +
          '<span class="btn btn-sm">' + I.play + t("Explore", "둘러보기") + "</span></a>";
      }).join("");
    }
    if (!initHome.done) { rerender.push(drawGenres, drawPins); initHome.done = true; }
    drawGenres(); drawPins();
  }

  /* ---------- sounds ---------- */
  var PAGE = 12;
  function md(s) { return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
  function driveId(u) { var m = /\/d\/([\w-]+)/.exec(u || "") || /[?&]id=([\w-]+)/.exec(u || ""); return m ? m[1] : null; }
  function initSounds() {
    var gSel = document.getElementById("f-genre"), rSel = document.getElementById("f-region");
    var qIn = document.getElementById("f-q");
    var list = document.getElementById("sound-list"), bar = document.getElementById("result-bar"), more = document.getElementById("load-more");
    if (!gSel) return;
    var q = "", shown = PAGE, items = [];
    function fillSelects() {
      var gv = gSel.value, rv = rSel.value;
      gSel.innerHTML = '<option value="">' + t("All genres", "모든 장르") + "</option>" + D.genres.map(function (g) { return '<option value="' + esc(g.id) + '">' + esc(g.id) + " · " + esc(g.en) + " (" + countBy("g", g.id) + ")</option>"; }).join("");
      rSel.innerHTML = '<option value="">' + t("All regions", "모든 지역") + "</option>" + D.regions.map(function (r) { return '<option value="' + esc(r.id) + '">' + esc(r.id) + " · " + esc(r.en) + " (" + countBy("r", r.id) + ")</option>"; }).join("");
      gSel.value = gv; rSel.value = rv;
    }
    function hl(text, rich) {
      var safe = esc(text);
      if (rich) safe = md(safe);
      if (!q) return safe;
      var rx = new RegExp("(" + esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![^<]*>)", "gi");
      return safe.replace(rx, "<mark>$1</mark>");
    }
    function filter() {
      var ql = q.toLowerCase();
      items = D.sounds.filter(function (s) {
        if (gSel.value && s.g !== gSel.value) return false;
        if (rSel.value && s.r !== rSel.value) return false;
        if (ql) {
          var g = genreOf(s.g) || {}, r = regionOf(s.r) || {};
          if ([s.t, s.l, s.r, s.s, s.d, s.c, g.en, r.en].join(" ").toLowerCase().indexOf(ql) < 0) return false;
        }
        return true;
      });
    }
    function card(s, i) {
      var r = regionOf(s.r), id = "s" + i;
      var g = genreOf(s.g);
      var rows = "<dt>" + t("Region:", "지역:") + '</dt><dd class="region">' + (s.r ? hl(s.r) + (r && LANG === "en" ? ' <span class="muted">· ' + esc(r.en) + "</span>" : "") : '<span class="muted">—</span>') + "</dd>" +
        "<dt>" + t("Title:", "제목:") + '</dt><dd class="title">' + hl(s.t) + (g && LANG === "en" ? ' <span class="muted">· ' + esc(g.en) + "</span>" : "") + "</dd>";
      if (s.l) {
        var long = s.l.split("\n").length > 8 || s.l.length > 420;
        rows += "<dt>" + t("Lyrics:", "가사:") + '</dt><dd><div class="lyrics' + (long ? " clamp" : "") + '" id="' + id + 'l">' + hl(s.l) + "</div>" +
          (long ? '<button class="more-btn" type="button" data-expand="' + id + 'l" aria-expanded="false">' + t("Show full lyrics", "가사 전체 보기") + "</button>" : "") + "</dd>";
      }
      rows += "<dt>" + t("Dialect:", "방언:") + "</dt><dd>" + (s.d
        ? '<button class="dialect-toggle" type="button" aria-expanded="false" aria-controls="' + id + 'd">' + t("Click to read dialect", "방언 해설 보기") + " " + I.chev + '</button><div class="dialect-body" id="' + id + 'd" hidden>' + hl(s.d, true) + "</div>"
        : '<span class="muted">' + t("Not yet annotated", "해설 준비 중") + "</span>") + "</dd>";
      if (s.c) rows += "<dt>" + t("Context:", "해석:") + '</dt><dd><button class="dialect-toggle" type="button" aria-expanded="false" aria-controls="' + id + 'c">' + t("Read cultural context", "사회문화적 해석 보기") + " " + I.chev + '</button><div class="dialect-body" id="' + id + 'c" hidden>' + hl(s.c, true) + "</div></dd>";
      var did = driveId(s.u);
      rows += "<dt>" + t("Sound:", "음원:") + "</dt><dd>" + (s.u
        ? '<div class="sound-actions"><a class="listen" href="' + esc(s.u) + '" target="_blank" rel="noopener">' + I.headphones + "음원듣기</a>" +
          (did && !PREVIEW ? '<button class="play-here" type="button" data-drive="' + did + '">' + I.play + t("Play here", "여기서 재생") + "</button>" : "") + "</div>"
        : '<span class="muted">' + t("Audio coming soon", "음원 준비 중") + "</span>") + "</dd>";
      if (s.s) rows += "<dt>" + t("Source:", "출처:") + "</dt><dd>" + hl(s.s) + "</dd>";
      return '<article class="sound">' + (g ? '<span class="sound-badge" aria-hidden="true">' + img(g.img, "") + "</span>" : "") + "<dl>" + rows + "</dl></article>";
    }
    function chipsHtml() {
      var c = [];
      if (q) c.push('<button class="chip" type="button" data-clear="q">“' + esc(q) + '” ' + I.x + "</button>");
      if (gSel.value) c.push('<button class="chip" type="button" data-clear="genre">' + esc(gSel.value) + " " + I.x + "</button>");
      if (rSel.value) c.push('<button class="chip" type="button" data-clear="region">' + esc(rSel.value) + " " + I.x + "</button>");
      return c.join("");
    }
    function draw() {
      gSel.classList.toggle("empty", !gSel.value); rSel.classList.toggle("empty", !rSel.value);
      bar.innerHTML = "<span>" + t("Showing ", "") + "<strong>" + Math.min(shown, items.length) + "</strong> " + t("of", "/") + " <strong>" + items.length + "</strong>" + t(items.length === 1 ? " sound" : " sounds", "개의 소리") + '</span><div class="chips">' + chipsHtml() + "</div>";
      if (!items.length) {
        list.innerHTML = '<div class="empty-state"><div class="big" aria-hidden="true">🎧</div><p>' + t("No sounds match these filters.", "조건에 맞는 소리가 없습니다.") + '</p><button class="btn btn-ghost" type="button" data-reset>' + I.reset + t("Reset filters", "필터 초기화") + "</button></div>";
        more.hidden = true; return;
      }
      list.innerHTML = items.slice(0, shown).map(card).join("");
      more.hidden = shown >= items.length;
      more.textContent = t("Load more", "더 보기") + " (" + (items.length - shown) + ")";
    }
    function syncUrl() {
      var p = new URLSearchParams();
      if (gSel.value) p.set("genre", gSel.value);
      if (rSel.value) p.set("region", rSel.value);
      if (q) p.set("q", q);
      var s = p.toString();
      if (!s) s = "";
      if (PREVIEW) { window.SORI_query = s ? "?" + s : ""; return; }
      history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
    }
    function setQ(v) { q = v; qIn.value = v; var hs = document.getElementById("hdr-search"); if (hs) hs.value = ""; }
    function update() { shown = PAGE; filter(); syncUrl(); draw(); }
    function load() {
      var p = getParams();
      fillSelects();
      gSel.value = p.get("genre") || ""; rSel.value = p.get("region") || ""; setQ(p.get("q") || "");
      shown = PAGE; filter(); draw();
      if (p.get("focus")) setTimeout(function () { qIn.focus(); }, 50);
    }
    function resetAll() { gSel.value = ""; rSel.value = ""; setQ(""); update(); }
    gSel.addEventListener("change", update);
    rSel.addEventListener("change", update);
    var deb;
    qIn.addEventListener("input", function () { clearTimeout(deb); deb = setTimeout(function () { q = qIn.value.trim(); update(); }, 200); });
    document.getElementById("f-reset").addEventListener("click", resetAll);
    more.addEventListener("click", function () { shown += PAGE; draw(); });
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".dialect-toggle");
      if (b) { var open = b.getAttribute("aria-expanded") === "true"; b.setAttribute("aria-expanded", String(!open)); document.getElementById(b.getAttribute("aria-controls")).hidden = open; }
      var x = e.target.closest("[data-expand]");
      if (x) { var el = document.getElementById(x.dataset.expand), o = x.getAttribute("aria-expanded") === "true"; el.classList.toggle("clamp", o); x.setAttribute("aria-expanded", String(!o)); x.textContent = o ? t("Show full lyrics", "가사 전체 보기") : t("Show less", "접기"); }
      var pl = e.target.closest(".play-here");
      if (pl) {
        var wrap = pl.closest("dd"), ex = wrap.querySelector(".player");
        if (ex) { ex.remove(); pl.classList.remove("on"); return; }
        var f = document.createElement("div"); f.className = "player";
        f.innerHTML = '<iframe src="https://drive.google.com/file/d/' + pl.dataset.drive + '/preview" allow="autoplay" title="Audio player" loading="lazy"></iframe>';
        wrap.appendChild(f); pl.classList.add("on");
      }
      if (e.target.closest("[data-reset]")) resetAll();
    });
    bar.addEventListener("click", function (e) {
      var c = e.target.closest("[data-clear]"); if (!c) return;
      var k = c.dataset.clear;
      if (k === "q") setQ(""); if (k === "genre") gSel.value = ""; if (k === "region") rSel.value = "";
      update();
    });
    rerender.push(function () { fillSelects(); draw(); });
    window.SORI_soundsLoad = load;
    load();
  }

  /* ---------- contact (FormSubmit) ---------- */
  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form || form.dataset.ready) return;
    form.dataset.ready = "1";
    form.action = "https://formsubmit.co/" + FORM_EMAIL;
    var file = document.getElementById("c-file"), drop = document.getElementById("c-drop"), fname = document.getElementById("c-fname");
    var fnameDefault = function () { return t("Click to upload a file", "클릭하거나 파일을 끌어다 놓으세요"); };
    function showFile() {
      var f = file.files && file.files[0];
      if (!f) { fname.textContent = fnameDefault(); return; }
      if (f.size > 5 * 1024 * 1024) { file.value = ""; fname.textContent = t("File is over 5 MB. Choose a smaller file.", "5MB를 넘는 파일입니다. 더 작은 파일을 선택하세요."); return; }
      fname.innerHTML = '<span class="fname">' + esc(f.name) + "</span> · " + Math.max(1, Math.round(f.size / 1024)) + " KB";
    }
    file.addEventListener("change", showFile);
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer.files.length) { file.files = e.dataTransfer.files; showFile(); } });

    // live character count on message
    var msg = document.getElementById("c-message"), cc = document.getElementById("c-count");
    if (msg && cc) msg.addEventListener("input", function () { cc.textContent = msg.value.length + " / 2000"; });

    var next = form.querySelector('input[name="_next"]');
    if (!PREVIEW) next.value = location.origin + location.pathname + "?sent=1";

    var note = document.getElementById("form-note");
    form.addEventListener("submit", function (e) {
      if (PREVIEW) {
        e.preventDefault();
        note.className = "form-note info"; note.hidden = false;
        note.textContent = t("Preview only. On your live site this sends to " + FORM_EMAIL + " through FormSubmit.", "미리보기입니다. 실제 사이트에서는 FormSubmit을 통해 " + FORM_EMAIL + "로 전송됩니다.");
        return;
      }
      var btn = form.querySelector(".send"); btn.disabled = true;
      btn.textContent = t("Sending…", "전송 중…");
    });

    if (!PREVIEW && new URLSearchParams(location.search).get("sent") === "1") {
      form.hidden = true;
      document.getElementById("form-success").hidden = false;
    }
  }

  /* ---------- news & partners ---------- */
  var C = window.SORI_CONTENT || { news: [], partners: [] };
  function fmtDate(d) {
    var p = d.split("-");
    if (LANG === "ko") return p[0] + "년 " + (+p[1]) + "월 " + (+p[2]) + "일";
    return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function clipping(n, i) {
    var tags = (LANG === "ko" ? n.tags : n.tagsEn) || [];
    return '<article class="clip' + (i === 0 ? " clip-lead" : "") + '">' +
      '<div class="clip-tape" aria-hidden="true"></div>' +
      '<header class="clip-head"><span class="clip-outlet">' + esc(LANG === "ko" ? n.outlet : n.outletEn) + '</span><time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></header>" +
      '<h3 class="clip-title" lang="ko">' + esc(n.title) + "</h3>" +
      (LANG === "en" && n.titleEn ? '<p class="clip-title-en">' + esc(n.titleEn) + "</p>" : "") +
      '<p class="clip-byline">' + t("Reporter ", "기자 ") + esc(n.reporter) + "</p>" +
      '<p class="clip-summary">' + esc(LANG === "ko" ? n.summary : n.summaryEn) + "</p>" +
      '<footer class="clip-foot"><div class="chips">' + tags.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" +
      '<a class="btn btn-sm" href="' + esc(n.url) + '" target="_blank" rel="noopener">' + t("Read the article", "기사 원문 보기") + " " + I.arrow + "</a></footer>" +
      '<div class="clip-src">' + esc(host(n.url)) + "</div></article>";
  }
  function initNews() {
    var el = document.getElementById("news-list"); if (!el) return;
    function draw() {
      var items = C.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      el.innerHTML = items.length ? items.map(clipping).join("") : '<div class="empty-state"><p>' + t("No coverage yet.", "아직 보도가 없습니다.") + "</p></div>";
      var c = document.getElementById("news-count"); if (c) c.textContent = items.length;
    }
    if (!initNews.done) { rerender.push(draw); initNews.done = true; }
    draw();
  }
  function partnerCard(p, compact) {
    // if the logo file is missing, fall back to a name badge
    var badge = '<span class="mono">' + esc(p.nameEn) + "</span>";
    var logo = p.logo ? '<img src="' + BASE + p.logo + '" alt="' + esc(p.nameEn) + ' logo" loading="lazy" onerror="this.outerHTML=this.nextElementSibling.innerHTML"><template>' + badge + "</template>" : badge;
    var name = LANG === "ko" ? p.name : p.nameEn;
    var inner = '<div class="p-logo">' + logo + "</div>" +
      '<div class="p-body"><span class="p-type">' + esc(LANG === "ko" ? p.type : p.typeEn) + "</span>" +
      "<h3>" + esc(name) + "</h3>" + (name !== p.nameEn ? '<span class="p-en">' + esc(p.nameEn) + "</span>" : (p.name !== p.nameEn ? '<span class="p-en" lang="ko">' + esc(p.name) + "</span>" : "")) +
      (compact ? "" : '<p>' + esc(LANG === "ko" ? p.about : p.aboutEn) + "</p>") +
      (p.url && !compact ? '<a class="p-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + t("Visit website", "웹사이트 방문") + " " + I.arrow + "</a>" : "") + "</div>";
    return '<article class="p-card' + (compact ? " compact" : "") + '">' + inner + "</article>";
  }
  function initPartners() {
    var full = document.getElementById("partner-list"), mini = document.getElementById("partner-mini");
    function draw() {
      if (full) full.innerHTML = C.partners.map(function (p) { return partnerCard(p, false); }).join("");
      if (mini) mini.innerHTML = C.partners.map(function (p) { return partnerCard(p, true); }).join("");
    }
    if (!initPartners.done) { rerender.push(draw); initPartners.done = true; }
    draw();
  }

  /* ---------- boot ---------- */
  function initPage(id) {
    if (id === "home") { initHome(); initPartners(); }
    if (id === "news") initNews();
    if (id === "partnerships") initPartners();
    if (id === "sounds") { if (window.SORI_soundsLoad) window.SORI_soundsLoad(); else initSounds(); }
    if (id === "contact") initContact();
  }
  window.SORI_initPage = initPage;
  window.SORI_applyLang = applyLang;

  renderChrome();
  initPage(body.getAttribute("data-page"));
  applyLang();
})();
