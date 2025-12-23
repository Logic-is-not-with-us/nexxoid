(function(){
  const $=(q,el=document)=>el.querySelector(q), $$=(q,el=document)=>Array.from(el.querySelectorAll(q));
  const themeKey="nexxoid_theme", root=document.documentElement, themeNameEl=$("#themeName");
  function setTheme(t){root.setAttribute("data-theme",t==="void"?"void":"neon");try{localStorage.setItem(themeKey,t)}catch(e){}; if(themeNameEl) themeNameEl.textContent=t==="void"?"Void":"Neon";}
  function toggleTheme(){const cur=root.getAttribute("data-theme")==="void"?"void":"neon";setTheme(cur==="void"?"neon":"void")}
  const saved=(()=>{try{return localStorage.getItem(themeKey)}catch(e){return null}})(); setTheme(saved||"neon");
  $$("#themeToggle,#themeToggleMobile,#toggleThemeInline").forEach(b=>b?.addEventListener("click",toggleTheme));

  const path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  $$(".menu a,.drawerNav a").forEach(a=>{const href=(a.getAttribute("href")||"").toLowerCase(); if(href.endsWith(path)) a.classList.add("active"); if(path===""&&href.endsWith("index.html")) a.classList.add("active");});

  const drawer=$("#drawer"), openDrawer=$("#openDrawer"), closeDrawer=$("#closeDrawer");
  function setDrawer(open){ if(!drawer) return; drawer.setAttribute("aria-hidden",open?"false":"true"); document.body.style.overflow=open?"hidden":"";}
  openDrawer?.addEventListener("click",()=>setDrawer(true)); closeDrawer?.addEventListener("click",()=>setDrawer(false));
  drawer?.addEventListener("click",(e)=>{ if(e.target===drawer) setDrawer(false); }); $$("[data-close-drawer]").forEach(a=>a.addEventListener("click",()=>setDrawer(false)));

  const progress=$("#progress");
  function onScroll(){ if(!progress) return; const h=document.documentElement; const sc=(h.scrollTop||document.body.scrollTop); const max=(h.scrollHeight-h.clientHeight)||1; progress.style.transform=`scaleX(${Math.min(1,Math.max(0,sc/max))})`;}
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  const io=("IntersectionObserver"in window)?new IntersectionObserver((entries)=>{for(const e of entries){ if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target);} }},{threshold:.12}):null;
  $$(".reveal").forEach(el=>{ if(io) io.observe(el); else el.classList.add("on"); });

  const glow=$("#cursorGlow");
  if(glow && matchMedia("(hover:hover)").matches){
    let raf=0,x=0,y=0;
    const move=(ev)=>{ x=ev.clientX;y=ev.clientY; glow.style.opacity="1"; if(!raf){ raf=requestAnimationFrame(()=>{glow.style.transform=`translate(${x}px, ${y}px) translate(-50%,-50%)`; raf=0;});}};
    window.addEventListener("pointermove",move,{passive:true});
    window.addEventListener("pointerleave",()=>{glow.style.opacity="0"},{passive:true});
  }

  $$(".magnetic").forEach(btn=>{
    if(!matchMedia("(hover:hover)").matches) return;
    let rect=null;
    btn.addEventListener("pointerenter",()=>{rect=btn.getBoundingClientRect()},{passive:true});
    btn.addEventListener("pointermove",(e)=>{
      rect=rect||btn.getBoundingClientRect();
      const mx=((e.clientX-rect.left)/rect.width)*100, my=((e.clientY-rect.top)/rect.height)*100;
      btn.style.setProperty("--mx",mx+"%"); btn.style.setProperty("--my",my+"%");
      const dx=e.clientX-(rect.left+rect.width/2), dy=e.clientY-(rect.top+rect.height/2);
      btn.style.transform=`translate(${dx*0.06}px, ${dy*0.06}px)`;
    });
    btn.addEventListener("pointerleave",()=>{btn.style.transform="";rect=null},{passive:true});
  });

  $$(".card[data-tilt], .heroCard[data-tilt], .work[data-tilt]").forEach(card=>{
    if(!matchMedia("(hover:hover)").matches) return;
    let r=null;
    card.addEventListener("pointermove",(e)=>{
      r=r||card.getBoundingClientRect();
      const px=((e.clientX-r.left)/r.width)*100, py=((e.clientY-r.top)/r.height)*100;
      card.style.setProperty("--px",px+"%"); card.style.setProperty("--py",py+"%");
      const rx=((py-50)/50)*-6, ry=((px-50)/50)*8;
      card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
    },{passive:true});
    card.addEventListener("pointerleave",()=>{card.style.transform="";r=null},{passive:true});
  });

  const palette=$("#palette"), paletteInput=$("#paletteInput"), paletteList=$("#paletteList");
  const openPaletteBtns=[$("#openPalette"),$("#openPaletteMobile")].filter(Boolean);
  const commands=(window.NEXXOID_COMMANDS||[]).map(c=>({id:c.id,title:c.title,hint:c.hint||"",run:c.run}));
  let selected=0;
  const escapeHtml=(s)=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  function render(list){
    if(!paletteList) return;
    paletteList.innerHTML="";
    list.forEach((c,idx)=>{
      const row=document.createElement("div");
      row.className="paletteItem";
      row.setAttribute("role","option");
      row.setAttribute("aria-selected",idx===selected?"true":"false");
      row.innerHTML=`<div><b>${escapeHtml(c.title)}</b><div style="margin-top:4px"><small>${escapeHtml(c.hint)}</small></div></div><small>${escapeHtml(c.id)}</small>`;
      row.addEventListener("click",()=>{selected=idx; runSelected(list);});
      paletteList.appendChild(row);
    });
  }
  function openPalette(){
    if(!palette) return;
    palette.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
    selected=0; paletteInput.value=""; render(commands); setTimeout(()=>paletteInput?.focus(),0);
  }
  function closePalette(){ if(!palette) return; palette.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  function filterCommands(q){ const s=(q||"").trim().toLowerCase(); if(!s) return commands; return commands.filter(c=>(c.title+" "+c.hint+" "+c.id).toLowerCase().includes(s));}
  function runSelected(list){ const c=list[selected]; if(!c) return; closePalette(); try{c.run&&c.run()}catch(e){} }
  openPaletteBtns.forEach(b=>b.addEventListener("click",openPalette));
  palette?.addEventListener("click",(e)=>{ if(e.target===palette) closePalette(); });
  window.addEventListener("keydown",(e)=>{
    const isMac=/Mac|iPhone|iPad/.test(navigator.platform), k=e.key.toLowerCase();
    if((isMac?e.metaKey:e.ctrlKey) && k==="k"){ e.preventDefault(); (palette?.getAttribute("aria-hidden")==="false")?closePalette():openPalette(); }
    if(k==="escape"){ if(palette?.getAttribute("aria-hidden")==="false") closePalette(); if($("#modal")?.getAttribute("aria-hidden")==="false") closeModal(); if(drawer?.getAttribute("aria-hidden")==="false") setDrawer(false); if($("#cookie")?.getAttribute("aria-hidden")==="false") hideCookie(); }
  });
  paletteInput?.addEventListener("input",()=>{ const list=filterCommands(paletteInput.value); selected=0; render(list); });
  paletteInput?.addEventListener("keydown",(e)=>{
    const list=filterCommands(paletteInput.value);
    if(e.key==="ArrowDown"){ e.preventDefault(); selected=Math.min(list.length-1,selected+1); render(list); }
    if(e.key==="ArrowUp"){ e.preventDefault(); selected=Math.max(0,selected-1); render(list); }
    if(e.key==="Enter"){ e.preventDefault(); runSelected(list); }
  });

  const modal=$("#modal"), modalTitle=$("#modalTitle"), modalBody=$("#modalBody"), modalClose=$("#modalClose");
  function openModal(title,html){ if(!modal) return; modalTitle.textContent=title||"Details"; modalBody.innerHTML=html||""; modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function closeModal(){ if(!modal) return; modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  modalClose?.addEventListener("click",closeModal); modal?.addEventListener("click",(e)=>{ if(e.target===modal) closeModal(); });

  $$(".work[data-work]").forEach(card=>card.addEventListener("click",()=>{
    const i=parseInt(card.getAttribute("data-work"),10), data=(window.NEXXOID_WORK||[])[i]; if(!data) return; openModal(data.title,data.html);
  }));

  const boost=$("#btnBoost"); boost?.addEventListener("click",()=>{
    boost.textContent="Boosting…"; let t=0; const id=setInterval(()=>{t++; root.style.filter=t%2?"saturate(1.15) contrast(1.08)":""; if(t>10){clearInterval(id); root.style.filter=""; boost.textContent="Run “wow” booster ✦";}},90);
  });

  const heroType=$("#heroType");
  if(heroType){
    const words=["restaurants","dentists","law firms","local services","boutiques","clinics","studios"];
    let wi=0,ci=0,dir=1;
    const tick=()=>{ const w=words[wi]; ci+=dir; heroType.textContent=w.slice(0,ci);
      if(ci===w.length){dir=-1; setTimeout(tick,900); return;}
      if(ci===0){dir=1; wi=(wi+1)%words.length; setTimeout(tick,250); return;}
      setTimeout(tick,42);
    }; tick();
  }

  const sVisitors=$("#sVisitors"), sClarity=$("#sClarity"), sSpeed=$("#sSpeed"), sTrust=$("#sTrust");
  const fmt=(n)=>{try{return n.toLocaleString(undefined,{maximumFractionDigits:0})}catch(e){return String(n)}};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function updateSim(){
    if(!sVisitors) return;
    const visitors=parseInt(sVisitors.value,10);
    const clarity=parseInt(sClarity.value,10)/100;
    const speed=parseInt(sSpeed.value,10)/100;
    const trust=parseInt(sTrust.value,10)/100;
    const base=0.010;
    const cr=clamp(base+0.025*clarity+0.022*trust,0.006,0.065)*(0.65+0.7*speed);
    const leads=Math.round(visitors*cr);
    const quality=(clarity+trust)/2;
    const qLabel=quality>.74?"high":quality>.52?"medium":"low";
    const action=quality>.74?"scale traffic + add retargeting":quality>.52?"add proof + tighten CTA":"rewrite offer + add proof";
    $("#vVisitors")&&( $("#vVisitors").textContent=fmt(visitors));
    $("#vClarity")&&( $("#vClarity").textContent=String(Math.round(clarity*100)));
    $("#vSpeed")&&( $("#vSpeed").textContent=String(Math.round(speed*100)));
    $("#vTrust")&&( $("#vTrust").textContent=String(Math.round(trust*100)));
    $("#rLeads")&&( $("#rLeads").textContent=String(leads));
    $("#barFill")&&( $("#barFill").style.width=(clamp(cr*100/6.5,0.08,1)*100).toFixed(1)+"%");
    $("#rCR")&&( $("#rCR").textContent=`Conv: ${(cr*100).toFixed(1)}%`);
    $("#rQuality")&&( $("#rQuality").textContent=`Lead quality: ${qLabel}`);
    $("#rNote")&&( $("#rNote").textContent=`Action: ${action}`);
    $("#rHint")&&( $("#rHint").textContent= speed>0.82 ? "Speed is a weapon. Now stack proof and a direct CTA." : "Speed multiplies everything. Fix speed, then tighten offer + trust.");
  }
  [sVisitors,sClarity,sSpeed,sTrust].forEach(s=>s?.addEventListener("input",updateSim)); updateSim();

  const contactForm=$("#contactForm");
  contactForm?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const fd=new FormData(contactForm);
    const name=(fd.get("name")||"").toString().trim();
    const company=(fd.get("company")||"").toString().trim();
    const website=(fd.get("website")||"").toString().trim();
    const goal=(fd.get("goal")||"").toString().trim();
    const budget=(fd.get("budget")||"").toString().trim();
    const msg=(fd.get("message")||"").toString().trim();
    const subject=encodeURIComponent(`[Nexxoid] Project inquiry — ${company||name||"New lead"}`);
    const body=encodeURIComponent(`Name: ${name}\nCompany: ${company}\nWebsite: ${website}\nGoal: ${goal}\nBudget: ${budget}\n\nMessage:\n${msg}\n\n— Sent from nexxoid site`);
    const to=(window.NEXXOID_EMAIL||"info@nexoid.dev");
    window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
  });

  const scopeForm=$("#scopeForm"), scopeOut=$("#scopeOutput"), scopeCopy=$("#scopeCopy"), scopeDownload=$("#scopeDownload");
  function genScope(){
    if(!scopeForm||!scopeOut) return;
    const fd=new FormData(scopeForm);
    const pkg=fd.get("package"), timeline=fd.get("timeline"), pages=fd.get("pages");
    const addons=fd.getAll("addons");
    const notes=(fd.get("notes")||"").toString().trim();
    const price=(fd.get("price")||"").toString().trim();
    const currency=(fd.get("currency")||"USD").toString();
    const add=addons.length?`Add‑ons: ${addons.join(", ")}.`:"Add‑ons: none.";
    const scope=`NEXXOID — PROJECT SCOPE (DRAFT)\n\nPackage: ${pkg}\nTimeline: ${timeline}\nEstimated pages/sections: ${pages}\n${add}\nEstimated project fee: ${price?`${currency} ${price}`:"TBD (quote after audit)"}\n\nDeliverables:\n- Strategy + content structure (offer, proof, CTA)\n- UI design + responsive build (mobile-first)\n- Performance pass (Core Web Vitals focus)\n- Basic SEO setup (titles/meta, indexability, structured data)\n- Lead capture flow (form → email). Optional CRM/automation integration available.\n\nClient provides:\n- Logo (optional), brand assets, photos (or we use clean placeholders)\n- Business info (services, pricing if public, location/service area)\n- Access to domain + hosting when ready to launch\n\nAssumptions:\n- One primary revision cycle per section. Extra revisions billed or scheduled.\n- Integrations/automations are scoped separately (depends on tools).\n- Content writing beyond structure can be added as an option.\n\nNotes:\n${notes||"—"}\n\nNext step:\nReply “APPROVED” with your preferred start date. We’ll send a short service agreement and invoice.\n`;
    scopeOut.textContent=scope;
  }
  scopeForm?.addEventListener("input",genScope); genScope();

  scopeCopy?.addEventListener("click",async()=>{
    if(!scopeOut) return;
    try{ await navigator.clipboard.writeText(scopeOut.textContent); scopeCopy.textContent="Copied ✓"; setTimeout(()=>scopeCopy.textContent="Copy scope",900);}
    catch(e){ openModal("Copy failed", `<p>Clipboard access was blocked by the browser. You can manually select and copy from the scope box.</p>`); }
  });
  scopeDownload?.addEventListener("click",()=>{
    if(!scopeOut) return;
    const blob=new Blob([scopeOut.textContent],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download="nexxoid-scope-draft.txt";
    document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},0);
  });

  const cookie=$("#cookie"), cookieKey="nexxoid_cookie_choice";
  function showCookie(){ if(!cookie) return; cookie.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function hideCookie(){ if(!cookie) return; cookie.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  window.hideCookie=hideCookie;
  const setCookieChoice=(val)=>{try{localStorage.setItem(cookieKey,val)}catch(e){}};
  const hasChoice=(()=>{try{return !!localStorage.getItem(cookieKey)}catch(e){return false}})();
  $("#cookieAccept")?.addEventListener("click",()=>{setCookieChoice("all"); hideCookie();});
  $("#cookieEssential")?.addEventListener("click",()=>{setCookieChoice("essential"); hideCookie();});
  $("#cookieManage")?.addEventListener("click",()=>{ openModal("Cookie preferences", `<p>Static site: no third‑party trackers by default. If you add analytics later (GA, Meta Pixel, etc.), update your cookie settings and Privacy Policy.</p><div class="cols"><div class="codeblock">ESSENTIAL\n- Theme preference\n- Cookie consent choice</div><div class="codeblock">OPTIONAL\n- Analytics (future)\n- Advertising pixels (future)</div></div>`); });
  if(cookie && !hasChoice) setTimeout(showCookie,900);
})();

  const canvas=$("#fx");
  if(canvas){
    const ctx=canvas.getContext("2d",{alpha:true});
    let w=0,h=0,dpr=1,particles=[];
    const maxP=matchMedia("(max-width: 700px)").matches?40:70;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    function rand(a,b){ return a+Math.random()*(b-a); }
    function spawn(initial=false){
      const side=Math.random();
      return {
        x: initial?rand(0,w):(side<.5?-50*dpr:w+50*dpr),
        y: rand(0,h),
        vx: rand(.08,.25)*dpr*(Math.random()<.5?1:-1),
        vy: rand(-.06,.06)*dpr,
        r: rand(1.3,2.6)*dpr,
        a: rand(.08,.20),
        hue: rand(165,315)
      };
    }
    function resize(){
      dpr=Math.min(2, window.devicePixelRatio||1);
      w=canvas.width=Math.floor(innerWidth*dpr);
      h=canvas.height=Math.floor(innerHeight*dpr);
      canvas.style.width=innerWidth+"px";
      canvas.style.height=innerHeight+"px";
      particles=Array.from({length:maxP},()=>spawn(true));
    }
    function step(){
      if(reduced) return;
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation="source-over";
      ctx.fillStyle="rgba(0,0,0,.10)";
      ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation="lighter";
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-80*dpr||p.x>w+80*dpr||p.y<-80*dpr||p.y>h+80*dpr) Object.assign(p, spawn(false));
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*22);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.a})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle=g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    window.addEventListener("resize", resize, {passive:true});
    resize();
    requestAnimationFrame(step);
  }
