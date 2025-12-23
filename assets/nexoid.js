(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const THEME_KEY = 'nexoid_theme';
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    if (themeBtn) themeBtn.querySelector('[data-theme-label]').textContent = t === 'light' ? 'Light' : 'Dark';
  };
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || 'dark');
  themeBtn?.addEventListener('click', () => {
    const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Reveal
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Mobile menu
  const menuBtn = document.querySelector('[data-menu-open]');
  const menu = document.querySelector('[data-menu]');
  const menuClose = document.querySelectorAll('[data-menu-close]');
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('flex', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => setMenu(true));
  menuClose.forEach(b => b.addEventListener('click', () => setMenu(false)));

  // Command palette
  const kBackdrop = document.querySelector('[data-kbar-backdrop]');
  const kbar = document.querySelector('[data-kbar]');
  const kInput = document.querySelector('[data-kbar-input]');
  const kList = document.querySelector('[data-kbar-list]');
  const kTrigger = document.querySelectorAll('[data-kbar-open]');
  let kItems = [];
  let activeIndex = 0;

  const commands = () => {
    const links = Array.from(document.querySelectorAll('a[data-kcmd]')).map(a => ({
      label: a.getAttribute('data-kcmd'),
      hint: a.getAttribute('data-khint') || 'Go',
      action: () => { window.location.href = a.getAttribute('href'); }
    }));

    const anchors = Array.from(document.querySelectorAll('[data-section]')).map(s => ({
      label: s.getAttribute('data-section'),
      hint: 'Scroll',
      action: () => { s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }));

    return [
      ...anchors,
      ...links,
      { label: 'Toggle Theme', hint: 'Action', action: () => themeBtn?.click() },
      { label: 'Open Scope Builder', hint: 'Action', action: () => document.querySelector('[data-open-scope]')?.click() },
      { label: 'Contact', hint: 'Action', action: () => document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}) || (window.location.href='/contact') }
    ];
  };

  const renderK = (q='') => {
    const list = commands().filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
    kItems = list;
    activeIndex = 0;
    if (!kList) return;
    kList.innerHTML = '';
    list.slice(0, 10).forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'item' + (idx === 0 ? ' active' : '');
      div.innerHTML = `<span>${escapeHtml(c.label)}</span><span class="badge">${escapeHtml(c.hint)}</span>`;
      div.addEventListener('click', () => { closeK(); c.action(); });
      kList.appendChild(div);
    });
  };

  const openK = () => {
    if (!kbar || !kBackdrop) return;
    renderK('');
    kBackdrop.classList.add('show');
    kbar.classList.add('show');
    setTimeout(() => kInput?.focus(), 0);
  };
  const closeK = () => {
    kBackdrop?.classList.remove('show');
    kbar?.classList.remove('show');
    if (kInput) kInput.value = '';
  };

  const setActive = (i) => {
    if (!kList) return;
    const nodes = Array.from(kList.querySelectorAll('.item'));
    nodes.forEach(n => n.classList.remove('active'));
    const clamped = Math.max(0, Math.min(i, nodes.length-1));
    activeIndex = clamped;
    nodes[clamped]?.classList.add('active');
    nodes[clamped]?.scrollIntoView({ block: 'nearest' });
  };

  const runActive = () => {
    const cmd = kItems[activeIndex];
    if (cmd) { closeK(); cmd.action(); }
  };

  kTrigger.forEach(t => t.addEventListener('click', openK));
  kBackdrop?.addEventListener('click', closeK);

  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const combo = isMac ? e.metaKey : e.ctrlKey;
    if (combo && e.key.toLowerCase() === 'k') { e.preventDefault(); openK(); }
    if (e.key === 'Escape') closeK();

    if (!kbar?.classList.contains('show')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
    if (e.key === 'Enter') { e.preventDefault(); runActive(); }
  });

  kInput?.addEventListener('input', () => renderK(kInput.value || ''));

  // Hero canvas (lightweight)
  const canvas = document.querySelector('[data-hero-canvas]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const state = { w: 0, h: 0, pts: [] };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.w = Math.floor(rect.width);
      state.h = Math.floor(rect.height);
      canvas.width = Math.floor(state.w * DPR);
      canvas.height = Math.floor(state.h * DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
      const n = Math.max(26, Math.floor(state.w / 50));
      state.pts = [*range(n)]  # placeholder
    };
  }

  // Scope Builder
  const scopeModal = document.querySelector('[data-scope-modal]');
  const openScopeBtns = document.querySelectorAll('[data-open-scope]');
  const closeScopeBtns = document.querySelectorAll('[data-close-scope]');
  const scopeSteps = Array.from(document.querySelectorAll('[data-scope-step]'));
  const scopeNext = document.querySelector('[data-scope-next]');
  const scopeBack = document.querySelector('[data-scope-back]');
  const scopeOut = document.querySelector('[data-scope-output]');
  const scopeDraft = document.querySelector('[data-scope-draft]');
  const scopeCopy = document.querySelector('[data-scope-copy]');
  const scopeDownload = document.querySelector('[data-scope-download]');
  const scopeToContact = document.querySelector('[data-scope-to-contact]');
  const scopeHidden = document.querySelector('[data-scope-hidden]');

  let step = 0;
  const scope = { website: 'standard', pages: '5-7', seo: 'optional', gmb: 'optional', automations: 'none', integrations: 'none', maintenance: 'recommended', timeline: '4-6 weeks' };

  const showStep = (i) => {
    step = Math.max(0, Math.min(i, scopeSteps.length-1));
    scopeSteps.forEach((s, idx) => s.classList.toggle('hidden', idx !== step));
    if (scopeBack) scopeBack.disabled = step === 0;
    if (scopeNext) scopeNext.textContent = (step === scopeSteps.length-1) ? 'Generate' : 'Next';
  };

  const openScope = () => {
    if (!scopeModal) return;
    scopeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    showStep(0);
  };
  const closeScope = () => {
    scopeModal?.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openScopeBtns.forEach(b => b.addEventListener('click', openScope));
  closeScopeBtns.forEach(b => b.addEventListener('click', closeScope));

  const readAnswers = () => {
    const get = (name) => document.querySelector(`[name="${name}"]:checked`)?.value;
    scope.website = get('website') || scope.website;
    scope.pages = get('pages') || scope.pages;
    scope.seo = get('seo') || scope.seo;
    scope.gmb = get('gmb') || scope.gmb;
    scope.automations = get('automations') || scope.automations;
    scope.integrations = get('integrations') || scope.integrations;
    scope.maintenance = get('maintenance') || scope.maintenance;
    scope.timeline = get('timeline') || scope.timeline;
  };

  const estimate = () => {
    let base = 3500;
    const add = (v) => base += v;
    if (scope.website === 'landing') add(-1200);
    if (scope.website === 'premium') add(3500);

    if (scope.pages === '1-3') add(-700);
    if (scope.pages === '5-7') add(400);
    if (scope.pages === '8-12') add(1400);

    if (scope.seo === 'included') add(900);
    if (scope.gmb === 'included') add(450);

    if (scope.automations === 'basic') add(1200);
    if (scope.automations === 'advanced') add(2600);

    if (scope.integrations === 'basic') add(900);
    if (scope.integrations === 'advanced') add(2200);

    if (scope.timeline === '2-3 weeks') add(1200);
    const low = Math.round(base * 0.9);
    const high = Math.round(base * 1.25);
    return { low, high };
  };

  const buildDraft = (rng) => {
    const date = new Date().toISOString().slice(0,10);
    return `NEXOID — PROJECT SCOPE DRAFT (non-binding) — ${date}

Client: ______________________
Project: Website & Growth System Setup

1) Deliverables
- Website type: ${scope.website}
- Pages: ${scope.pages}
- Design: premium UI, responsive, performance-first
- SEO: ${scope.seo}
- Google Business Profile: ${scope.gmb}
- Automations: ${scope.automations}
- Integrations: ${scope.integrations}
- Maintenance: ${scope.maintenance}

2) Timeline (estimate)
- ${scope.timeline} from kickoff & content delivery

3) Investment (estimate)
- Build: $${rng.low.toLocaleString()} – $${rng.high.toLocaleString()}
- Optional monthly care plan: from $199 (depends on scope)

4) Assumptions
- Client provides brand assets + content or requests copywriting add-on.
- Revisions: 2 rounds included (additional billed hourly).
- Integrations may require 3rd-party subscriptions.

5) Next steps
- Confirm scope + timeline
- Sign simple service agreement
- Pay deposit
- Kickoff call
`;
  };

  const renderResult = () => {
    readAnswers();
    const rng = estimate();
    if (scopeOut) scopeOut.textContent = `$${rng.low.toLocaleString()} – $${rng.high.toLocaleString()}`;
    const draft = buildDraft(rng);
    if (scopeDraft) scopeDraft.value = draft;
    if (scopeHidden) scopeHidden.value = JSON.stringify({ scope, rng });
  };

  scopeBack?.addEventListener('click', () => showStep(step - 1));
  scopeNext?.addEventListener('click', () => {
    if (step < scopeSteps.length - 1) return showStep(step + 1);
    renderResult();
    document.querySelector('[data-scope-result]')?.classList.remove('hidden');
  });

  scopeCopy?.addEventListener('click', async () => {
    if (!scopeDraft) return;
    try { await navigator.clipboard.writeText(scopeDraft.value); scopeCopy.textContent = 'Copied'; setTimeout(()=>scopeCopy.textContent='Copy',1200); }
    catch {}
  });

  scopeDownload?.addEventListener('click', () => {
    if (!scopeDraft) return;
    const blob = new Blob([scopeDraft.value], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nexoid-scope-draft.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  scopeToContact?.addEventListener('click', () => {
    closeScope();
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({behavior:'smooth'});
    else window.location.href = '/contact';
  });



  // ----- COOKIE CONSENT -----
  const CK = 'nexoid_cookie';
  const cookie = document.querySelector('[data-cookie]');
  const accept = document.querySelector('[data-cookie-accept]');
  const decline = document.querySelector('[data-cookie-decline]');
  if (cookie) {
    const v = localStorage.getItem(CK);
    if (!v) cookie.classList.remove('hidden');
    const done = (val) => { localStorage.setItem(CK, val); cookie.classList.add('hidden'); };
    accept?.addEventListener('click', () => done('accept'));
    decline?.addEventListener('click', () => done('decline'));
  }

  // flash message
  const flash = document.querySelector('[data-flash]');
  if (flash) {
    setTimeout(() => flash.classList.add('opacity-0'), 2600);
    setTimeout(() => flash.classList.add('hidden'), 3400);
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  }
})();
