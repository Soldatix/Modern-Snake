const CACHE_PREFIX='modern-snake-';
const CACHE_NAME=CACHE_PREFIX+'2026-09-27-v1';
const CORE=[
  './',
  './index.html',
  './ag-language-menu.js',
  './pwa.js',
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

self.addEventListener('fetch',(event)=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request)
        .then((response)=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE_NAME).then((cache)=>cache.put('./index.html',copy));
          }
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached)=>cached||fetch(request).then((response)=>{
      if(response&&response.ok){
        const copy=response.clone();
        caches.open(CACHE_NAME).then((cache)=>cache.put(request,copy));
      }
      return response;
    }))
  );
});