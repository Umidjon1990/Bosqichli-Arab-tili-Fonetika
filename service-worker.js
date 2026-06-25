const CACHE_NAME = "fonetika-reading-v5";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./stage2.css",
  "./stage3.css",
  "./stage4.css",
  "./stage5.css",
  "./stage6.css",
  "./advanced-stages.css",
  "./advanced-stages.js",
  "./assets/vocabulary/tut.jpg",
  "./assets/vocabulary/uy.jpg",
  "./assets/vocabulary/sobit.jpg",
  "./assets/vocabulary/isbot.jpg",
  "./assets/vocabulary5/aka.jpg",
  "./assets/vocabulary5/javob-berdi.jpg",
  "./assets/vocabulary5/tagida.jpg",
  "./assets/vocabulary5/singil.jpg",
  "./assets/vocabulary6/pashsha.jpg",
  "./assets/vocabulary6/olmoq.jpg",
  "./assets/vocabulary6/odob.jpg",
  "./assets/vocabulary6/bir.jpg",
  "./assets/vocabulary7/xabar.jpg",
  "./assets/vocabulary7/shamol.jpg",
  "./assets/vocabulary7/non.jpg",
  "./assets/vocabulary7/guruch.jpg",
  "./assets/vocabulary8/dars.jpg",
  "./assets/vocabulary8/olti.jpg",
  "./assets/vocabulary8/xalq.jpg",
  "./assets/vocabulary8/ichdi.jpg",
  "./assets/vocabulary9/yer.jpg",
  "./assets/vocabulary9/urdi.jpg",
  "./assets/vocabulary9/sabr.jpg",
  "./assets/vocabulary9/koradigan.jpg",
  "./assets/vocabulary10/xatar.jpg",
  "./assets/vocabulary10/qaradi.jpg",
  "./assets/vocabulary10/shifokor.jpg",
  "./assets/vocabulary10/yol.jpg",
  "./assets/vocabulary11/qarga.jpg",
  "./assets/vocabulary11/kichik.jpg",
  "./assets/vocabulary11/qul.jpg",
  "./assets/vocabulary11/uzum.jpg",
  "./assets/vocabulary12/safar.jpg",
  "./assets/vocabulary12/kambagal.jpg",
  "./assets/vocabulary12/lugat.jpg",
  "./assets/vocabulary12/qafas.jpg",
  "./assets/vocabulary13/it.jpg",
  "./assets/vocabulary13/kitob.jpg",
  "./assets/vocabulary13/sut.jpg",
  "./assets/vocabulary13/tun.jpg",
  "./assets/vocabulary14/ofis.jpg",
  "./assets/vocabulary14/qiz.jpg",
  "./assets/vocabulary14/bank.jpg",
  "./assets/vocabulary14/manzil.jpg",
  "./assets/vocabulary15/huwa.jpg",
  "./assets/vocabulary15/hiya.jpg",
  "./assets/vocabulary15/hum.jpg",
  "./assets/vocabulary15/hunna.jpg",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request))
  );
});
