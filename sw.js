const CACHE_PREFIX='modern-snake-';
const CACHE_NAME=CACHE_PREFIX+'2026-11-26-seo-offline-v5';
const APP_ENTRY = new URL('./', self.location.href).href;
const APP_PATH = new URL(APP_ENTRY).pathname;
const LEGACY_PATH = new URL('index.html', APP_ENTRY).pathname;
const entryRequest = () => new Request(APP_ENTRY, { cache: 'reload', redirect: 'error' });
const cachedEntry = async () => (await caches.open(CACHE_NAME)).match(APP_ENTRY);
async function navigationNetworkFirst(request) {
  let response;
  try { response = await fetch(request); }
  catch { return (await cachedEntry()) || Response.error(); }
  if (response.ok && !response.redirected && response.url === APP_ENTRY &&
      (response.headers.get('content-type') || '').toLowerCase().includes('text/html')) {
    try { await (await caches.open(CACHE_NAME)).put(APP_ENTRY, response.clone()); } catch {}
  }
  return response;
}
const CORE=[
  entryRequest(),
  './ag-language-menu.js',
  './pwa.js',
  './snake-adsterra-loader.js',
  './manifest.webmanifest',
  './icons/modern-snake-180.png',
  './icons/modern-snake-192.png',
  './icons/modern-snake-512.png'
];

self.addEventListener('install',(event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache)=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',(event)=>{
  event.waitUntil(
    caches.keys()
      .then((keys)=>Promise.all(keys.filter((key)=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map((key)=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

function networkFirst(request){
  return fetch(request)
    .then(async(response)=>{
      if(response&&response.ok){
        const cache=await caches.open(CACHE_NAME);
        await cache.put(request,response.clone());
      }
      return response;
    })
    .catch(()=>caches.match(request));
}

self.addEventListener('fetch',(event)=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    if(url.pathname!==APP_PATH&&url.pathname!==LEGACY_PATH)return;
    event.respondWith(navigationNetworkFirst(request));
    return;
  }

  if(request.destination==='script'||request.destination==='manifest'){
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached)=>cached||fetch(request).then(async(response)=>{
      if(response&&response.ok){
        const cache=await caches.open(CACHE_NAME);
        await cache.put(request,response.clone());
      }
      return response;
    }))
  );
});
