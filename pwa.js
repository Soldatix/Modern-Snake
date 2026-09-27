(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const installRequested = params.get('install') === 'web';
  const COPY = {
    en:{title:'Install Modern Snake',description:'Install Modern Snake as a Web App for quick access from your device.',checking:'Checking whether your browser can offer the install dialog…',ready:'Ready to install.',installed:'Modern Snake is already installed.',unavailable:'Automatic installation is not available here. You can continue in the browser or use your browser menu to install the Web App.',install:'Install Web App',continue:'Continue in browser'},
    hr:{title:'Instaliraj Modern Snake',description:'Instaliraj Modern Snake kao Web App za brzi pristup s uređaja.',checking:'Provjerava se može li preglednik ponuditi dijalog za instalaciju…',ready:'Spremno za instalaciju.',installed:'Modern Snake je već instaliran.',unavailable:'Automatska instalacija ovdje trenutačno nije dostupna. Možeš nastaviti u pregledniku ili instalirati Web App iz izbornika preglednika.',install:'Instaliraj Web App',continue:'Nastavi u pregledniku'},
    de:{title:'Modern Snake installieren',description:'Installiere Modern Snake als Web App für schnellen Zugriff auf deinem Gerät.',checking:'Es wird geprüft, ob der Browser den Installationsdialog anbieten kann…',ready:'Bereit zur Installation.',installed:'Modern Snake ist bereits installiert.',unavailable:'Die automatische Installation ist hier derzeit nicht verfügbar. Du kannst im Browser fortfahren oder die Web App über das Browsermenü installieren.',install:'Web App installieren',continue:'Im Browser fortfahren'},
    it:{title:'Installa Modern Snake',description:'Installa Modern Snake come Web App per accedervi rapidamente dal dispositivo.',checking:'Verifica della disponibilità della finestra di installazione del browser…',ready:'Pronto per l’installazione.',installed:'Modern Snake è già installato.',unavailable:'L’installazione automatica non è disponibile qui al momento. Puoi continuare nel browser o installare la Web App dal menu del browser.',install:'Installa Web App',continue:'Continua nel browser'},
    es:{title:'Instalar Modern Snake',description:'Instala Modern Snake como Web App para acceder rápidamente desde tu dispositivo.',checking:'Comprobando si el navegador puede ofrecer el diálogo de instalación…',ready:'Listo para instalar.',installed:'Modern Snake ya está instalado.',unavailable:'La instalación automática no está disponible aquí en este momento. Puedes continuar en el navegador o instalar la Web App desde el menú del navegador.',install:'Instalar Web App',continue:'Continuar en el navegador'}
  };

  let deferredWebInstallPrompt = null;
  let dismissedForThisPage = false;
  let installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  let installState = installed ? 'installed' : 'checking';
  let unavailableTimer = 0;
  let panel = null;
  let status = null;
  let installButton = null;
  let continueButton = null;

  function language(){
    const raw=(document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return COPY[raw] ? raw : 'en';
  }
  function text(){ return COPY[language()]; }

  function removeInstallParam(){
    try{
      const url=new URL(location.href);
      url.searchParams.delete('install');
      const next=url.pathname+(url.search||'')+url.hash;
      history.replaceState(history.state,'',next);
    }catch{}
  }

  function updatePanelTop(){
    if(!panel)return;
    if(window.matchMedia('(max-width:590px)').matches){
      const topbar=document.querySelector('.topbar');
      const bottom=topbar ? Math.ceil(topbar.getBoundingClientRect().bottom) : 60;
      panel.style.setProperty('--ag-install-mobile-top',Math.max(70,bottom+10)+'px');
    }else{
      panel.style.removeProperty('--ag-install-mobile-top');
    }
  }

  function ensurePanel(){
    if(panel || !installRequested || dismissedForThisPage)return;
    const style=document.createElement('style');
    style.id='ag-web-install-style';
    style.textContent=`
      .web-install-banner{position:fixed;left:50%;top:max(18px,env(safe-area-inset-top));transform:translateX(-50%);z-index:15;width:min(410px,calc(100vw - 24px));padding:16px;border:1px solid var(--line,rgba(255,255,255,.10));border-radius:18px;background:var(--panel2,#122040);color:var(--text,#eef5ff);box-shadow:0 20px 52px rgba(0,0,0,.42);backdrop-filter:blur(18px)}
      .web-install-head{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center}
      .web-install-icon{width:48px;height:48px;border-radius:13px;display:block}
      .web-install-title{margin:0;font-size:17px;font-weight:900;line-height:1.2}
      .web-install-description{margin:4px 0 0;color:var(--muted,#9fb0c8);font-size:13px;line-height:1.4}
      .web-install-status{margin:12px 0;padding:10px 11px;border:1px solid var(--line,rgba(255,255,255,.10));border-radius:12px;background:rgba(255,255,255,.045);color:var(--muted,#9fb0c8);font-size:13px;line-height:1.4}
      .web-install-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .web-install-actions button{min-height:44px;border-radius:12px;padding:9px 12px;font:inherit;font-weight:850}
      .web-install-primary{background:linear-gradient(135deg,var(--accent,#63f5a4),#39d98a);color:#052013}
      .web-install-secondary{background:rgba(255,255,255,.07);color:var(--text,#eef5ff);border:1px solid var(--line,rgba(255,255,255,.10))}
      .web-install-actions button:disabled{opacity:.55;cursor:not-allowed}
      .web-install-actions button:focus-visible{outline:3px solid var(--accent2,#4dc9ff);outline-offset:3px}
      @media(max-width:590px){.web-install-banner{top:var(--ag-install-mobile-top,70px);width:calc(100vw - 20px);padding:14px}.web-install-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    panel=document.createElement('section');
    panel.className='web-install-banner';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-labelledby','agInstallTitle');
    panel.innerHTML=`
      <div class="web-install-head">
        <img class="web-install-icon" src="./icons/modern-snake-192.png" alt="">
        <div><h2 class="web-install-title" id="agInstallTitle"></h2><p class="web-install-description" id="agInstallDescription"></p></div>
      </div>
      <div class="web-install-status" id="agInstallStatus" role="status" aria-live="polite"></div>
      <div class="web-install-actions">
        <button class="web-install-primary" id="agInstallButton" type="button"></button>
        <button class="web-install-secondary" id="agInstallContinue" type="button"></button>
      </div>
    `;
    document.body.appendChild(panel);
    status=panel.querySelector('#agInstallStatus');
    installButton=panel.querySelector('#agInstallButton');
    continueButton=panel.querySelector('#agInstallContinue');

    installButton.addEventListener('click',async()=>{
      if(!deferredWebInstallPrompt || installed)return;
      installButton.disabled=true;
      try{
        await deferredWebInstallPrompt.prompt();
        const choice=await deferredWebInstallPrompt.userChoice;
        deferredWebInstallPrompt=null;
        installState=choice && choice.outcome==='accepted' ? 'checking' : 'unavailable';
      }catch{
        installState='unavailable';
      }
      render();
    });

    continueButton.addEventListener('click',()=>{
      dismissedForThisPage=true;
      removeInstallParam();
      if(unavailableTimer)clearTimeout(unavailableTimer);
      panel.remove();
      panel=null;
      const styleNode=document.getElementById('ag-web-install-style');
      if(styleNode)styleNode.remove();
    });

    updatePanelTop();
  }

  function render(){
    if(!installRequested || dismissedForThisPage)return;
    ensurePanel();
    if(!panel)return;
    const t=text();
    panel.querySelector('#agInstallTitle').textContent=t.title;
    panel.querySelector('#agInstallDescription').textContent=t.description;
    installButton.textContent=t.install;
    continueButton.textContent=t.continue;

    if(installed || installState==='installed'){
      status.textContent=t.installed;
      installButton.hidden=true;
      installButton.disabled=true;
    }else if(installState==='ready' && deferredWebInstallPrompt){
      status.textContent=t.ready;
      installButton.hidden=false;
      installButton.disabled=false;
    }else if(installState==='unavailable'){
      status.textContent=t.unavailable;
      installButton.hidden=false;
      installButton.disabled=true;
    }else{
      status.textContent=t.checking;
      installButton.hidden=false;
      installButton.disabled=true;
    }
    updatePanelTop();
  }

  window.addEventListener('beforeinstallprompt',(event)=>{
    event.preventDefault();
    deferredWebInstallPrompt=event;
    installState='ready';
    if(unavailableTimer)clearTimeout(unavailableTimer);
    render();
  });

  window.addEventListener('appinstalled',()=>{
    installed=true;
    installState='installed';
    deferredWebInstallPrompt=null;
    render();
  });

  window.addEventListener('resize',updatePanelTop);
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(render,0));
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js').catch((error)=>{
        console.warn('Modern Snake service worker registration failed.',error);
      });
    });
  }

  if(installRequested){
    ensurePanel();
    render();
    if(!installed){
      unavailableTimer=window.setTimeout(()=>{
        if(!deferredWebInstallPrompt){
          installState='unavailable';
          render();
        }
      },1600);
    }
  }
})();