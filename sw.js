const CACHE = "ziya-island-v3-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/strokes-manifest.json"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Network-first for HTML and JSON, cache fallback for assets
  event.respondWith(fetch(event.request).then(res => {
    const copy=res.clone();
    caches.open(CACHE).then(c=>c.put(event.request, copy));
    return res;
  }).catch(()=>caches.match(event.request).then(c=>c||caches.match("./index.html"))));
});