from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if 'snake-standard-info' in s:
    print('Modern Snake Info already upgraded')
    raise SystemExit(0)

css = r'''

  /* Apps & Games standard Info / Donations */
  #infoModal .modal-card{width:min(800px,100%);max-height:90dvh;overflow:auto}
  .snake-info-section{margin-top:18px}
  .snake-charity{padding:15px 16px;border:1px solid rgba(99,245,164,.24);border-radius:16px;background:rgba(99,245,164,.055)}
  .snake-charity strong{display:block;color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.09em;margin-bottom:8px}
  .snake-charity p{margin:7px 0;color:#dbe7f7}
  .snake-section-title{margin:18px 0 10px;color:var(--muted);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.10em}
  .snake-payment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .snake-payment-card{min-width:0;padding:15px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.035);display:flex;flex-direction:column;gap:10px}
  .snake-payment-brand{display:flex;align-items:center;gap:9px}.snake-payment-symbol{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:rgba(77,201,255,.09);border:1px solid rgba(77,201,255,.26);color:var(--accent2);font-weight:900}.snake-payment-brand strong{font-size:16px}
  .snake-payment-desc{color:#dbe7f7;font-size:13px;line-height:1.55;flex:1}.snake-payment-badges{display:flex;flex-wrap:wrap;gap:6px}.snake-payment-badge{padding:4px 8px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.055);color:#dbe7f7;font-size:10px;font-weight:800}
  .snake-payment-action{display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:12px;text-decoration:none;font-weight:900;color:#052013;background:linear-gradient(90deg,var(--accent),var(--accent2));text-align:center;padding:9px 12px}.snake-payment-card.stripe .snake-payment-action{background:linear-gradient(90deg,#ffd76a,#ffb15f)}
  .snake-payment-note{margin-top:10px;color:var(--muted);font-size:11px;line-height:1.45}
  .snake-crypto-list{display:flex;flex-direction:column;gap:8px}.snake-crypto-row{display:grid;grid-template-columns:64px minmax(0,1fr) auto;align-items:center;gap:10px;padding:11px 12px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.03)}.snake-crypto-code{color:var(--accent2);font-weight:900;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.snake-crypto-address{min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#b9ffd8;overflow-wrap:anywhere;user-select:text}.snake-copy-btn{min-width:78px;padding:7px 9px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--text);font-size:11px;font-weight:850}.snake-copy-btn.copied{color:var(--accent);border-color:rgba(99,245,164,.45);background:rgba(99,245,164,.09)}
  @media(max-width:640px){.snake-payment-grid{grid-template-columns:1fr}.snake-crypto-row{grid-template-columns:52px minmax(0,1fr)}.snake-copy-btn{grid-column:2;justify-self:end}}
'''

style_end = s.rfind('</style>')
if style_end < 0:
    raise SystemExit('No </style> found')
s = s[:style_end] + css + '\n' + s[style_end:]

labels = r'''
  const INFO_PAYMENT_I18N = {
    en:{charityTitle:'Charity purpose',direct:'Direct online payments',paypalDesc:'Pay securely with PayPal or other payment options offered by PayPal Checkout.',stripeDesc:'Pay securely by card or with payment methods available through Stripe Checkout.',cards:'Debit / Credit Card',wallets:'Digital wallets',paypalButton:'Donate with PayPal ↗',stripeButton:'Donate with Stripe ↗',note:'Available payment methods can vary by country, device and payment provider.',crypto:'Crypto Wallets',copy:'Copy',copied:'Copied!'},
    hr:{charityTitle:'Humanitarna svrha',direct:'Izravna online plaćanja',paypalDesc:'Platite sigurno putem PayPala ili drugim načinima plaćanja koje nudi PayPal Checkout.',stripeDesc:'Platite sigurno karticom ili načinima plaćanja dostupnima putem Stripe Checkouta.',cards:'Debitna / kreditna kartica',wallets:'Digitalni novčanici',paypalButton:'Doniraj putem PayPala ↗',stripeButton:'Doniraj putem Stripea ↗',note:'Dostupni načini plaćanja mogu se razlikovati ovisno o državi, uređaju i pružatelju plaćanja.',crypto:'Kripto novčanici',copy:'Kopiraj',copied:'Kopirano!'},
    de:{charityTitle:'Wohltätiger Zweck',direct:'Direkte Online-Zahlungen',paypalDesc:'Sicher mit PayPal oder weiteren von PayPal Checkout angebotenen Zahlungsmethoden bezahlen.',stripeDesc:'Sicher per Karte oder mit den über Stripe Checkout verfügbaren Zahlungsmethoden bezahlen.',cards:'Debit- / Kreditkarte',wallets:'Digitale Wallets',paypalButton:'Mit PayPal spenden ↗',stripeButton:'Mit Stripe spenden ↗',note:'Verfügbare Zahlungsmethoden können je nach Land, Gerät und Zahlungsanbieter variieren.',crypto:'Krypto-Wallets',copy:'Kopieren',copied:'Kopiert!'},
    it:{charityTitle:'Scopo benefico',direct:'Pagamenti online diretti',paypalDesc:'Paga in modo sicuro con PayPal o con gli altri metodi disponibili tramite PayPal Checkout.',stripeDesc:'Paga in modo sicuro con carta o con i metodi disponibili tramite Stripe Checkout.',cards:'Carta di debito / credito',wallets:'Portafogli digitali',paypalButton:'Dona con PayPal ↗',stripeButton:'Dona con Stripe ↗',note:'I metodi di pagamento disponibili possono variare in base al Paese, al dispositivo e al fornitore di pagamento.',crypto:'Portafogli crypto',copy:'Copia',copied:'Copiato!'},
    es:{charityTitle:'Finalidad benéfica',direct:'Pagos directos en línea',paypalDesc:'Paga de forma segura con PayPal u otros métodos disponibles mediante PayPal Checkout.',stripeDesc:'Paga de forma segura con tarjeta o con los métodos disponibles mediante Stripe Checkout.',cards:'Tarjeta de débito / crédito',wallets:'Carteras digitales',paypalButton:'Donar con PayPal ↗',stripeButton:'Donar con Stripe ↗',note:'Los métodos de pago disponibles pueden variar según el país, el dispositivo y el proveedor de pago.',crypto:'Carteras de criptomonedas',copy:'Copiar',copied:'¡Copiado!'}
  };
'''
marker = '  let settings = loadJSON(STORAGE.settings, DEFAULT_SETTINGS);'
pos = s.find(marker)
if pos < 0:
    raise SystemExit('Settings marker not found')
s = s[:pos] + labels + '\n' + s[pos:]

new_render = r'''  function renderInfo(){
    const title=$('#infoTitle'), content=$('#infoContent');
    if(!title||!content)return;
    title.textContent=t('infoTitle');
    const i=INFO_PAYMENT_I18N[settings.lang]||INFO_PAYMENT_I18N.en;
    const wallets=[
      ['BTC','bc1qwlrxrh64peukga0fp59m9yg7gpf0yj8q7fxnsc'],
      ['ETH','0xA99A52085c6725854daa46bb302041569c8bA4E3'],
      ['XRP','rP43SsrkhPkxTsFohMAm32sAQg7vqwmDpr'],
      ['SOL','8xkdVTEaDGuWu4aE3HpEx8r9Aux98JZbdsMiDQvJWBWR'],
      ['DOGE','DGAT32ku8WmFaTDxCgVuRuVpUFmfdmD5Jb'],
      ['XLM','GCYH4OD4I2GNRKFFOYROE3N3S2HCT5RXIML3TZV5DP3TLTLXPXQXIJZ3'],
      ['LTC','LWtaFniqdYpv2xJtqo9WqDwCsQ2cW6PYWi'],
      ['RVN','RAtXzKZyB3awfq2u2cK8YppC9kJamU5tPQ']
    ];
    const walletHtml=wallets.map(([coin,address])=>`<div class="snake-crypto-row"><div class="snake-crypto-code">${coin}</div><div class="snake-crypto-address">${address}</div><button type="button" class="snake-copy-btn" data-address="${address}">${i.copy}</button></div>`).join('');
    content.innerHTML=`
      <div id="snake-standard-info">
        <h3>🎯 ${t('howToPlayTitle')}</h3><p>${t('howToPlayInfo')}</p>
        <h3>❤️ ${t('lifeRulesTitle')}</h3><p>${t('lifeRulesInfo')}</p>
        <h3>⭐ ${t('bonusTitle')}</h3><p>${t('bonusInfo')}</p>
        <h3>🎮 ${t('controlInfoTitle')}</h3><p>${t('controlInfo')}</p>
        <div class="snake-info-section snake-charity"><strong>${i.charityTitle}</strong><p>${t('donationLine1')}</p><p>${t('donationLine2')}</p></div>
        <div class="snake-section-title">${i.direct}</div>
        <div class="snake-payment-grid">
          <div class="snake-payment-card"><div class="snake-payment-brand"><span class="snake-payment-symbol">P</span><strong>PayPal</strong></div><div class="snake-payment-desc">${i.paypalDesc}</div><div class="snake-payment-badges"><span class="snake-payment-badge">PayPal</span><span class="snake-payment-badge">${i.cards}</span><span class="snake-payment-badge">Apple Pay</span></div><a class="snake-payment-action" href="https://www.paypal.com/ncp/payment/RU2CWCNVQ7XD6" target="_blank" rel="noopener noreferrer">${i.paypalButton}</a></div>
          <div class="snake-payment-card stripe"><div class="snake-payment-brand"><span class="snake-payment-symbol">S</span><strong>Stripe</strong></div><div class="snake-payment-desc">${i.stripeDesc}</div><div class="snake-payment-badges"><span class="snake-payment-badge">${i.cards}</span><span class="snake-payment-badge">Link</span><span class="snake-payment-badge">${i.wallets}</span></div><a class="snake-payment-action" href="https://buy.stripe.com/7sYeVd7Blfe89cm0k02kw00" target="_blank" rel="noopener noreferrer">${i.stripeButton}</a></div>
        </div>
        <div class="snake-payment-note">${i.note}</div>
        <div class="snake-section-title">${i.crypto}</div>
        <div class="snake-crypto-list">${walletHtml}</div>
      </div>`;
    $$('.snake-copy-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      const address=btn.dataset.address||'';
      try{await navigator.clipboard.writeText(address);}catch{
        const ta=document.createElement('textarea');ta.value=address;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
      }
      const original=i.copy;btn.textContent=i.copied;btn.classList.add('copied');setTimeout(()=>{btn.textContent=original;btn.classList.remove('copied');},1300);
    }));
  }
'''
start = s.find('  function renderInfo(){')
end = s.find('\n\n  function initialState', start)
if start < 0 or end < 0:
    raise SystemExit(f'renderInfo boundaries not found: {start}, {end}')
s = s[:start] + new_render + s[end:]

p.write_text(s, encoding='utf-8')
print('Modern Snake Info upgraded')
