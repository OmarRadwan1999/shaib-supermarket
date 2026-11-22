/* Service Worker — سوبر ماركت الشايب
   مبدأ الأمان: لا يعترض ولا يخزّن أي بيانات حسابات (أرصدة، ديون، دفعات).
   كل طلبات البيانات تذهب دائماً إلى الشبكة مباشرة حتى لا تظهر أرقام قديمة.
   يخزّن فقط هيكل الصفحة والأصول الثابتة (الأيقونات وملف التعريف) لتسريع الفتح. */
const CACHE_NAME = "shaib-shell-v1";
const SHELL_ASSETS = [
  "./",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // البيانات وطلبات الخادم: شبكة فقط، دون أي تخزين
  if (request.method !== "GET" || new URL(request.url).pathname.includes("/api")) {
    return;
  }
  // الأصول الثابتة: من الذاكرة أولاً ثم الشبكة
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
