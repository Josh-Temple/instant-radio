const LEGACY_CACHES = ["instant-radio-v1","instant-radio-v2","instant-radio-v3","instant-radio-v4"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      ...LEGACY_CACHES.map((name) => caches.delete(name)),
      self.registration.unregister()
    ])
  );
});
