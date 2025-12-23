(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // Mark JS-enabled for reveal fallback.
  document.documentElement.classList.add("js");

  // ---------- Theme ----------
  const THEME_KEY = "nx_theme";
  const themeNameEl = $("#themeName");

  function setTheme(theme) {
    const t = (theme === "void") ? "void" : "neon";
    document.documentElement.dataset.theme = t;
    localStorage.setItem(THEME_KEY, t);
    if (themeNameEl) themeNameEl.textContent = t === "void" ? "Void" : "Neon";
  }
  setTheme(localStorage.getItem(THEME_KEY) || "neon");

  $("#themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "neon";
    setTheme(current === "neon" ? "void" : "neon");
  });
  $("#themeToggleMobile")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "neon";
    setTheme(current === "neon" ? "void" : "neon");
  });

  // ---------- Scroll progress ----------
  const progress = $("#progress");
  function onScroll() {
    if (!progress) return;
    const h = document.documentElement;
    const sc = h.scrollTop || document.body.scrollTop || 0;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const r = Math.min(1, Math.max(0, sc / max));
    progress.style.transform = `scaleX(${r})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Reveal ----------
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("on"));
  }

  // ---------- Cursor glow ----------
  const glow = $("#cursorGlow");
  if (glow && matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf = 0, x = 0, y = 0, tx = -9999, ty = -9999;
    const step = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x - 260}px, ${y - 260}px)`;
      raf = requestAnimationFrame(step);
    };
    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(step); }, { passive: true });
    window.addEventListener("mouseleave", () => { tx = -9999; ty = -9999; }, { passive: true });
  }

  // ---------- Mobile drawer ----------
  const drawer = $("#drawer");
  function openDrawer() {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#openDrawer")?.addEventListener("click", openDrawer);
  $("#closeDrawer")?.addEventListener("click", closeDrawer);
  drawer?.addEventListener("click", (e) => {
    if (e.target?.classList?.contains("drawerBackdrop")) closeDrawer();
  });
  $$("[data-close-drawer]").forEach(a => a.addEventListener("click", closeDrawer));

  // ---------- Modal (Work blueprints) ----------
  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  function openModal(title, html) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title || "Details";
    if (modalBody) modalBody.innerHTML = html || "";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#modalClose")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target?.classList?.contains("modalBackdrop")) closeModal();
  });

  const blueprints = [
    {
      title: "Restaurant — Menu + Google presence",
      body: `
        <div class="tagRow" style="margin-bottom:12px">
          <span class="tag">fast landing</span><span class="tag">menu</span><span class="tag">google business</span><span class="tag">seo basics</span>
        </div>
        <div class="split">
          <div class="panel"><div class="panelInner">
            <b>What we ship (7–10 days)</b>
            <div class="list">
              <div class="item"><span class="bullet"></span><div><b>Premium single-page or mini-site</b><small>Hero, story, location, hours, CTA — built to convert calls & bookings.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Menu module</b><small>Editable sections (starters, mains, drinks). Option for seasonal specials.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Google Business setup</b><small>Categories, photos, services, UTM links, and posting cadence template.</small></div></div>
            </div>
          </div></div>
          <div class="panel"><div class="panelInner">
            <b>Outcome targets</b>
            <div class="hr"></div>
            <div class="grid2">
              <div class="kpi"><b>More calls</b><small>Clear CTA + sticky actions</small></div>
              <div class="kpi"><b>Better maps presence</b><small>Complete GBP + reviews flow</small></div>
              <div class="kpi"><b>Higher trust</b><small>Photos + story + social proof</small></div>
              <div class="kpi"><b>Faster updates</b><small>Menu changes without headaches</small></div>
            </div>
          </div></div>
        </div>
      `
    },
    {
      title: "Dentist — credibility + inbound leads",
      body: `
        <div class="tagRow" style="margin-bottom:12px">
          <span class="tag">service pages</span><span class="tag">reviews</span><span class="tag">local seo</span><span class="tag">conversion</span>
        </div>
        <div class="split">
          <div class="panel"><div class="panelInner">
            <b>What we ship (10–14 days)</b>
            <div class="list">
              <div class="item"><span class="bullet"></span><div><b>Service layout</b><small>Whitening, implants, emergency — each with copy structure that converts.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Review engine</b><small>SMS/email review request flow + embedded testimonials.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Scheduling integration</b><small>Calendly or practice software — tracked and clean.</small></div></div>
            </div>
          </div></div>
          <div class="panel"><div class="panelInner">
            <b>Outcome targets</b>
            <div class="hr"></div>
            <div class="grid2">
              <div class="kpi"><b>More consults</b><small>Frictionless booking</small></div>
              <div class="kpi"><b>Trust spike</b><small>Before/after + credentials</small></div>
              <div class="kpi"><b>Local rankings</b><small>Schema + GBP + content</small></div>
              <div class="kpi"><b>Better ROI</b><small>Track leads precisely</small></div>
            </div>
          </div></div>
        </div>
      `
    },
    {
      title: "Law firm — high-intent acquisition",
      body: `
        <div class="tagRow" style="margin-bottom:12px">
          <span class="tag">authority</span><span class="tag">content</span><span class="tag">tracking</span><span class="tag">compliance</span>
        </div>
        <div class="split">
          <div class="panel"><div class="panelInner">
            <b>What we ship (14–21 days)</b>
            <div class="list">
              <div class="item"><span class="bullet"></span><div><b>Practice-area pages</b><small>Structured for search + conversion. Clear next steps.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Lead capture + routing</b><small>Forms → email/CRM, plus spam protection.</small></div></div>
              <div class="item"><span class="bullet"></span><div><b>Analytics baseline</b><small>Events, call tracking options, funnels.</small></div></div>
            </div>
          </div></div>
          <div class="panel"><div class="panelInner">
            <b>Outcome targets</b>
            <div class="hr"></div>
            <div class="grid2">
              <div class="kpi"><b>Higher-value cases</b><small>Positioning + clarity</small></div>
              <div class="kpi"><b>Trust</b><small>Authority signals</small></div>
              <div class="kpi"><b>Less wasted spend</b><small>Track what converts</small></div>
              <div class="kpi"><b>Ready for ads</b><small>Landing pages prepared</small></div>
            </div>
          </div></div>
        </div>
      `
    }
  ];

  $$("[data-work]").forEach(card => {
    card.addEventListener("click", () => {
      const i = parseInt(card.getAttribute("data-work") || "0", 10);
      const bp = blueprints[Math.max(0, Math.min(blueprints.length - 1, i))];
      openModal(bp.title, bp.body);
    });
  });

  // ---------- Command palette ----------
  const palette = $("#palette");
  const paletteInput = $("#paletteInput");
  const paletteList = $("#paletteList");

  const commands = [
    { label: "Home", hint: "index.html", run: () => (location.href = "index.html") },
    { label: "Services", hint: "services.html", run: () => (location.href = "services.html") },
    { label: "Work", hint: "work.html", run: () => (location.href = "work.html") },
    { label: "Pricing", hint: "pricing.html", run: () => (location.href = "pricing.html") },
    { label: "Contact", hint: "contact.html", run: () => (location.href = "contact.html") },
    { label: "Privacy", hint: "privacy.html", run: () => (location.href = "privacy.html") },
    { label: "Toggle theme", hint: "Neon/Void", run: () => {
      const current = document.documentElement.dataset.theme || "neon";
      setTheme(current === "neon" ? "void" : "neon");
    }},
    { label: "Copy email", hint: "info@nexoid.dev", run: async () => {
      try { await navigator.clipboard.writeText("info@nexoid.dev"); toast("Copied: info@nexoid.dev"); } catch { toast("Copy failed"); }
    }},
  ];

  let pIndex = 0;
  function openPalette() {
    if (!palette) return;
    palette.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    pIndex = 0;
    renderPalette("");
    setTimeout(() => paletteInput?.focus(), 0);
  }
  function closePalette() {
    if (!palette) return;
    palette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function score(q, text) {
    if (!q) return 1;
    q = q.toLowerCase().trim();
    text = text.toLowerCase();
    if (text.startsWith(q)) return 3;
    if (text.includes(q)) return 2;
    // fuzzy: all chars in order
    let ti = 0;
    for (const c of q) {
      ti = text.indexOf(c, ti);
      if (ti === -1) return 0;
      ti++;
    }
    return 1;
  }

  let visible = commands.slice();
  function renderPalette(query) {
    if (!paletteList) return;
    const q = (query || "").trim();
    visible = commands
      .map(c => ({...c, s: score(q, c.label + " " + (c.hint || ""))}))
      .filter(c => c.s > 0)
      .sort((a,b) => b.s - a.s)
      .slice(0, 12);

    paletteList.innerHTML = visible.map((c, i) => `
      <div class="pItem ${i === pIndex ? "active" : ""}" data-i="${i}">
        <div><b>${escapeHtml(c.label)}</b><div style="margin-top:2px; color: rgba(240,244,255,.58); font-size: 12px">${escapeHtml(c.hint || "")}</div></div>
        <small>↵</small>
      </div>
    `).join("");

    $$(".pItem", paletteList).forEach(el => {
      el.addEventListener("mousemove", () => { pIndex = parseInt(el.getAttribute("data-i") || "0", 10); highlight(); });
      el.addEventListener("click", () => { runSelected(); });
    });
  }

  function highlight() {
    if (!paletteList) return;
    $$(".pItem", paletteList).forEach((el, i) => {
      el.classList.toggle("active", i === pIndex);
    });
  }

  function runSelected() {
    const cmd = visible[pIndex];
    if (!cmd) return;
    closePalette();
    try { cmd.run(); } catch {}
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  }

  $("#openPalette")?.addEventListener("click", openPalette);
  $("#openPaletteMobile")?.addEventListener("click", openPalette);

  palette?.addEventListener("click", (e) => {
    if (e.target?.classList?.contains("paletteBackdrop")) closePalette();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePalette();
      closeDrawer();
      closeModal();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette();
    }
    if (palette && palette.getAttribute("aria-hidden") === "false") {
      if (e.key === "ArrowDown") { e.preventDefault(); pIndex = Math.min(visible.length - 1, pIndex + 1); highlight(); }
      if (e.key === "ArrowUp") { e.preventDefault(); pIndex = Math.max(0, pIndex - 1); highlight(); }
      if (e.key === "Enter") { e.preventDefault(); runSelected(); }
    }
  });

  paletteInput?.addEventListener("input", () => renderPalette(paletteInput.value || ""));

  // ---------- Cookie banner ----------
  const COOKIE_KEY = "nx_cookie";
  const cookie = $("#cookie");
  function showCookie() {
    if (!cookie) return;
    cookie.classList.add("show");
  }
  function hideCookie() {
    if (!cookie) return;
    cookie.classList.remove("show");
  }
  const cookieState = localStorage.getItem(COOKIE_KEY);
  if (!cookieState) {
    // show with small delay so it feels intentional
    setTimeout(showCookie, 650);
  }
  $("#cookieAccept")?.addEventListener("click", () => { localStorage.setItem(COOKIE_KEY, "all"); hideCookie(); });
  $("#cookieEssential")?.addEventListener("click", () => { localStorage.setItem(COOKIE_KEY, "essential"); hideCookie(); });
  $("#cookieManage")?.addEventListener("click", () => { localStorage.setItem(COOKIE_KEY, "essential"); hideCookie(); toast("Saved: essential only"); });

  // ---------- Toast (tiny) ----------
  let toastEl = null, toastT = 0;
  function toast(msg) {
    if (!msg) return;
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.position = "fixed";
      toastEl.style.left = "50%";
      toastEl.style.bottom = "18px";
      toastEl.style.transform = "translateX(-50%)";
      toastEl.style.zIndex = "2000";
      toastEl.style.padding = "10px 12px";
      toastEl.style.borderRadius = "14px";
      toastEl.style.border = "1px solid rgba(255,255,255,.14)";
      toastEl.style.background = "rgba(10,12,20,.82)";
      toastEl.style.backdropFilter = "blur(12px)";
      toastEl.style.color = "rgba(240,244,255,.88)";
      toastEl.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
      toastEl.style.fontSize = "12px";
      toastEl.style.boxShadow = "0 24px 80px rgba(0,0,0,.55)";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    clearTimeout(toastT);
    toastT = setTimeout(() => { if (toastEl) toastEl.style.opacity = "0"; }, 1400);
  }

  // ---------- Growth simulator (index) ----------
  const sVisitors = $("#sVisitors");
  const sClarity = $("#sClarity");
  const sSpeed = $("#sSpeed");
  const sTrust = $("#sTrust");
  const vVisitors = $("#vVisitors");
  const vClarity = $("#vClarity");
  const vSpeed = $("#vSpeed");
  const vTrust = $("#vTrust");
  const vLeads = $("#vLeads");
  const vRevenue = $("#vRevenue");
  const btnBoost = $("#btnBoost");

  function fmtInt(n) { return Math.round(n).toLocaleString(); }
  function fmtMoney(n) { return "$" + Math.round(n).toLocaleString(); }

  function recompute() {
    if (!sVisitors || !sClarity || !sSpeed || !sTrust) return;

    const visitors = parseInt(sVisitors.value, 10);
    const clarity = parseInt(sClarity.value, 10) / 100;
    const speed = parseInt(sSpeed.value, 10) / 100;
    const trust = parseInt(sTrust.value, 10) / 100;

    if (vVisitors) vVisitors.textContent = fmtInt(visitors);
    if (vClarity) vClarity.textContent = Math.round(clarity * 100);
    if (vSpeed) vSpeed.textContent = Math.round(speed * 100);
    if (vTrust) vTrust.textContent = Math.round(trust * 100);

    // A deliberately simple "conversion physics":
    // base conversion 0.7%..2.2% depending on clarity/speed/trust interaction
    const base = 0.007 + (clarity * 0.008) + (speed * 0.004) + (trust * 0.006);
    const synergy = 1 + (clarity * speed * 0.35) + (trust * speed * 0.25);
    const conv = Math.min(0.035, base * synergy);

    const leads = visitors * conv;
    // assumed average first-month value per lead (varies), we show an estimate
    const valuePerLead = 120 + (trust * 180) + (clarity * 140);
    const revenue = leads * valuePerLead;

    if (vLeads) vLeads.textContent = fmtInt(leads);
    if (vRevenue) vRevenue.textContent = fmtMoney(revenue);
  }

  [sVisitors, sClarity, sSpeed, sTrust].forEach(el => el?.addEventListener("input", recompute));
  recompute();

  btnBoost?.addEventListener("click", () => {
    // a tiny "boost" animation: nudge up clarity/speed slightly
    if (!sClarity || !sSpeed || !sTrust) return;
    const bump = (el, d) => {
      const v = Math.min(parseInt(el.max, 10), parseInt(el.value, 10) + d);
      el.value = String(v);
    };
    bump(sClarity, 8);
    bump(sSpeed, 6);
    bump(sTrust, 6);
    recompute();
    toast("Boost applied (demo)");
  });

  // ---------- Scope builder (contact) ----------
  const scopeForm = $("#scopeForm");
  const scopeOutput = $("#scopeOutput");
  const scopeCopy = $("#scopeCopy");
  const scopeDownload = $("#scopeDownload");

  function buildScope(data) {
    const lines = [];
    lines.push("NEXXOID — PROJECT SCOPE (DRAFT)");
    lines.push("================================");
    lines.push("");
    lines.push(`Client name: ${data.client || "[Client]"}`);
    lines.push(`Business type: ${data.type || "[Type]"}`);
    lines.push(`Primary goal: ${data.goal || "[Goal]"}`);
    lines.push(`Timeline target: ${data.timeline || "[Timeline]"}`);
    lines.push("");
    lines.push("Deliverables");
    lines.push("- " + data.package);
    if (data.addons.length) {
      lines.push("");
      lines.push("Add-ons");
      data.addons.forEach(a => lines.push("- " + a));
    }
    lines.push("");
    lines.push("Notes");
    lines.push("- We'll confirm scope after a 15–20 min audit call.");
    lines.push("- This draft is not a contract; final terms go into the signed agreement.");
    lines.push("");
    lines.push("Contact: info@nexoid.dev");
    return lines.join("\n");
  }

  scopeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(scopeForm);
    const addons = [];
    scopeForm.querySelectorAll('input[name="addon"]:checked').forEach((x) => addons.push(x.value));
    const data = {
      client: String(fd.get("client") || "").trim(),
      type: String(fd.get("type") || "").trim(),
      goal: String(fd.get("goal") || "").trim(),
      timeline: String(fd.get("timeline") || "").trim(),
      package: String(fd.get("package") || "").trim(),
      addons
    };
    const out = buildScope(data);
    if (scopeOutput) scopeOutput.textContent = out;
    toast("Scope draft generated");
  });

  scopeCopy?.addEventListener("click", async () => {
    if (!scopeOutput) return;
    try { await navigator.clipboard.writeText(scopeOutput.textContent || ""); toast("Copied"); } catch { toast("Copy failed"); }
  });

  scopeDownload?.addEventListener("click", () => {
    if (!scopeOutput) return;
    const blob = new Blob([scopeOutput.textContent || ""], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nexxoid_scope_draft.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // ---------- Canvas FX ----------
  const canvas = $("#fx");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const particles = [];
    const P = 42;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function init() {
      particles.length = 0;
      for (let i = 0; i < P; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(1.2, 2.6),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.20, 0.20),
          k: rand(0, Math.PI * 2)
        });
      }
    }

    let t0 = performance.now();
    function step(t) {
      const dt = Math.min(32, t - t0);
      t0 = t;

      ctx.clearRect(0, 0, w, h);

      // Soft wash
      const g = ctx.createRadialGradient(w * 0.25, h * 0.10, 0, w * 0.25, h * 0.10, Math.max(w, h));
      g.addColorStop(0, "rgba(0,229,255,.08)");
      g.addColorStop(0.45, "rgba(124,92,255,.06)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Particles
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.k += dt * 0.0006;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // gentle orbital drift
        p.x += Math.cos(p.k) * 0.015 * dt;
        p.y += Math.sin(p.k) * 0.012 * dt;

        if (p.x < -40) p.x = w + 40;
        if (p.x > w + 40) p.x = -40;
        if (p.y < -40) p.y = h + 40;
        if (p.y > h + 40) p.y = -40;

        const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 140);
        gg.addColorStop(0, "rgba(124,92,255,.07)");
        gg.addColorStop(0.45, "rgba(0,229,255,.05)");
        gg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(step);
    }

    resize();
    init();
    window.addEventListener("resize", () => { resize(); init(); }, { passive: true });
    requestAnimationFrame(step);
  }
})();