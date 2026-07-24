const CACHE_NAME='lcy-workbench-v1';
const ASSETS=[
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetched=fetch(e.request).then(resp=>{
        if(resp.ok){
          const clone=resp.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(e.request,clone));
        }
        return resp;
      });
      return cached||fetched;
    })
  );
});
