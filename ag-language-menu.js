(() => {
  'use strict';

  const LANGUAGES = [
    {
      value: 'en',
      code: 'EN',
      label: 'English',
      flag: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3.4"/><path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" stroke-width="1.4"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.8"/></svg>'
    },
    {
      value: 'hr',
      code: 'HR',
      label: 'Hrvatski',
      flag: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#ff0000"/><rect width="24" height="5.34" y="5.33" fill="#fff"/><rect width="24" height="5.34" y="10.66" fill="#171796"/><path d="M9 5.1h6v5.8c0 2.2-1.3 3.6-3 4.3-1.7-.7-3-2.1-3-4.3z" fill="#fff" stroke="#d00" stroke-width=".45"/><path d="M9.35 5.45h1.1v1.1h-1.1zm2.2 0h1.1v1.1h-1.1zm2.2 0h.9v1.1h-.9zm-3.3 1.1h1.1v1.1h-1.1zm2.2 0h1.1v1.1h-1.1z" fill="#d00"/></svg>'
    },
    {
      value: 'de',
      code: 'DE',
      label: 'Deutsch',
      flag: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.34" fill="#000"/><rect width="24" height="5.34" y="5.33" fill="#dd0000"/><rect width="24" height="5.34" y="10.66" fill="#ffce00"/></svg>'
    },
    {
      value: 'it',
      code: 'IT',
      label: 'Italiano',
      flag: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#009246"/><rect width="8" height="16" x="8" fill="#fff"/><rect width="8" height="16" x="16" fill="#ce2b37"/></svg>'
    },
    {
      value: 'es',
      code: 'ES',
      label: 'Español',
      flag: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="4" fill="#aa151b"/><rect width="24" height="8" y="4" fill="#f1bf00"/><rect width="24" height="4" y="12" fill="#aa151b"/></svg>'
    }
  ];

  const BY_VALUE = new Map(LANGUAGES.map((item) => [item.value, item]));
  const STYLE_ID = 'ag-language-menu-style';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .ag-language-menu{
        --ag-lang-bg:var(--panel2,#122040);
        --ag-lang-trigger-bg:rgba(255,255,255,.07);
        --ag-lang-hover:rgba(255,255,255,.11);
        --ag-lang-selected:rgba(99,245,164,.12);
        --ag-lang-border:var(--line,rgba(255,255,255,.10));
        --ag-lang-text:var(--text,#eef5ff);
        --ag-lang-muted:var(--muted,#9fb0c8);
        --ag-lang-accent:var(--accent,#63f5a4);
        position:relative;
        display:inline-flex;
        align-items:center;
        color:var(--ag-lang-text);
        font:inherit
      }
      .ag-language-native{
        position:absolute!important;
        width:1px!important;
        height:1px!important;
        margin:-1px!important;
        padding:0!important;
        border:0!important;
        clip:rect(0 0 0 0)!important;
        clip-path:inset(50%)!important;
        overflow:hidden!important;
        white-space:nowrap!important
      }
      .ag-language-trigger{
        min-width:176px;
        height:42px;
        display:flex;
        align-items:center;
        gap:8px;
        padding:0 11px;
        border:1px solid var(--ag-lang-border);
        border-radius:13px;
        background:var(--ag-lang-trigger-bg);
        color:var(--ag-lang-text);
        font:inherit;
        font-weight:750;
        cursor:pointer
      }
      .ag-language-trigger:hover{background:var(--ag-lang-hover)}
      .ag-language-trigger:focus-visible,.ag-language-option:focus-visible{
        outline:3px solid var(--accent2,#4dc9ff);
        outline-offset:2px
      }
      .ag-language-flag{
        width:24px;
        height:16px;
        display:inline-flex;
        flex:0 0 auto;
        overflow:hidden;
        border-radius:3px;
        box-shadow:0 0 0 1px rgba(255,255,255,.18)
      }
      .ag-language-flag svg{display:block;width:24px;height:16px}
      .ag-language-code{
        min-width:22px;
        font-size:11px;
        font-weight:900;
        letter-spacing:.07em;
        color:var(--ag-lang-muted)
      }
      .ag-language-name{white-space:nowrap}
      .ag-language-chevron{margin-left:auto;font-size:11px;color:var(--ag-lang-muted)}
      .ag-language-list{
        position:absolute;
        top:calc(100% + 7px);
        right:0;
        z-index:1000;
        min-width:210px;
        max-width:calc(100vw - 16px);
        margin:0;
        padding:6px;
        border:1px solid var(--ag-lang-border);
        border-radius:14px;
        background:var(--ag-lang-bg);
        box-shadow:0 18px 46px rgba(0,0,0,.38)
      }
      .ag-language-list[hidden]{display:none!important}
      .ag-language-option{
        width:100%;
        min-height:42px;
        display:flex;
        align-items:center;
        gap:9px;
        padding:8px 10px;
        border:0;
        border-radius:10px;
        background:transparent;
        color:var(--ag-lang-text);
        font:inherit;
        text-align:left;
        cursor:pointer
      }
      .ag-language-option:hover,.ag-language-option:focus-visible{background:var(--ag-lang-hover)}
      .ag-language-option[aria-selected="true"]{background:var(--ag-lang-selected);font-weight:850}
      .ag-language-check{margin-left:auto;color:var(--ag-lang-accent);font-weight:900}
      @media(max-width:620px){
        .ag-language-trigger{min-width:164px;height:39px;padding:0 9px}
        .ag-language-list{min-width:202px}
      }
    `;
    document.head.appendChild(style);
  }

  function enhance(select, index) {
    if (!select || select.dataset.agEnhanced === 'true') return;
    select.dataset.agEnhanced = 'true';

    const wrap = document.createElement('div');
    wrap.className = 'ag-language-menu';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add('ag-language-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ag-language-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const list = document.createElement('div');
    list.className = 'ag-language-list';
    list.id = 'ag-language-list-' + index;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', select.getAttribute('aria-label') || 'Language');
    list.hidden = true;
    trigger.setAttribute('aria-controls', list.id);

    const optionButtons = LANGUAGES
      .filter((language) => Array.from(select.options).some((option) => option.value === language.value))
      .map((language) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ag-language-option';
        button.dataset.value = language.value;
        button.setAttribute('role', 'option');
        button.tabIndex = -1;
        button.innerHTML =
          '<span class="ag-language-flag">' + language.flag + '</span>' +
          '<span class="ag-language-code">' + language.code + '</span>' +
          '<span class="ag-language-name">' + language.label + '</span>' +
          '<span class="ag-language-check" aria-hidden="true"></span>';
        list.appendChild(button);
        return button;
      });

    wrap.appendChild(trigger);
    wrap.appendChild(list);

    function activeLanguage() {
      return BY_VALUE.get(select.value) || BY_VALUE.get('en');
    }

    function selectedIndex() {
      return Math.max(0, optionButtons.findIndex((button) => button.dataset.value === select.value));
    }

    function sync() {
      const language = activeLanguage();
      trigger.innerHTML =
        '<span class="ag-language-flag">' + language.flag + '</span>' +
        '<span class="ag-language-code">' + language.code + '</span>' +
        '<span class="ag-language-name">' + language.label + '</span>' +
        '<span class="ag-language-chevron" aria-hidden="true">▾</span>';
      trigger.setAttribute(
        'aria-label',
        (select.getAttribute('aria-label') || 'Language') + ': ' + language.code + ' ' + language.label
      );

      optionButtons.forEach((button) => {
        const selected = button.dataset.value === select.value;
        button.setAttribute('aria-selected', selected ? 'true' : 'false');
        button.querySelector('.ag-language-check').textContent = selected ? '✓' : '';
      });
    }

    function keepInsideViewport() {
      list.style.transform = '';
      const rect = list.getBoundingClientRect();
      let shift = 0;
      if (rect.right > window.innerWidth - 8) shift += window.innerWidth - 8 - rect.right;
      if (rect.left + shift < 8) shift += 8 - (rect.left + shift);
      if (shift) list.style.transform = 'translateX(' + Math.round(shift) + 'px)';
    }

    function open(focusSelected = false) {
      list.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      keepInsideViewport();
      if (focusSelected) optionButtons[selectedIndex()]?.focus();
    }

    function close(returnFocus = false) {
      list.hidden = true;
      list.style.transform = '';
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }

    function choose(value) {
      if (!BY_VALUE.has(value)) return;
      if (select.value !== value) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
      close(true);
    }

    optionButtons.forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.value));
    });

    trigger.addEventListener('click', () => {
      if (list.hidden) open(false);
      else close(false);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(true);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close(false);
      }
    });

    list.addEventListener('keydown', (event) => {
      const current = Math.max(0, optionButtons.indexOf(document.activeElement));
      let next = current;

      if (event.key === 'ArrowDown') next = (current + 1) % optionButtons.length;
      else if (event.key === 'ArrowUp') next = (current - 1 + optionButtons.length) % optionButtons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = optionButtons.length - 1;
      else if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(document.activeElement?.dataset?.value);
        return;
      } else if (event.key === 'Tab') {
        close(false);
        return;
      } else {
        return;
      }

      event.preventDefault();
      optionButtons[next]?.focus();
    });

    select.addEventListener('change', sync);

    document.addEventListener('pointerdown', (event) => {
      if (!wrap.contains(event.target)) close(false);
    });

    window.addEventListener('resize', () => {
      if (!list.hidden) keepInsideViewport();
    });

    const langObserver = new MutationObserver(() => {
      const htmlLang = document.documentElement.lang.toLowerCase().split('-')[0];
      if (BY_VALUE.has(htmlLang) && select.value !== htmlLang) select.value = htmlLang;
      sync();
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    sync();
  }

  addStyles();
  document.querySelectorAll('select[data-ag-language-menu]').forEach(enhance);
})();