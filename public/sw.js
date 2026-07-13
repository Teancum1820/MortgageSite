const CACHE_NAME = "mortgage-site-v1";
const BASE_PATH = self.registration.scope.endsWith("/")
  ? new URL(self.registration.scope).pathname.replace(/\/$/, "")
  : new URL(self.registration.scope).pathname;
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/hero-home.svg`,
  `${BASE_PATH}/icons/icon.svg`,
  `${BASE_PATH}/privacy/`,
  `${BASE_PATH}/terms/`,
  `${BASE_PATH}/licensing/`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET" || new URL(request.url).pathname.startsWith(`${BASE_PATH}/api/`)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(`${BASE_PATH}/`));
    })
  );
});
