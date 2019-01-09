// Expose unhandled promise rejections:
if (typeof addEventListener === "function") {
  addEventListener("unhandledrejection", function (event) {
    event.preventDefault();
    console.log(event.reason);
  });
}

var CACHE = 'network-or-cache';

// On install, cache some resource.
self.addEventListener('install', function(event) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  event.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(event) {
  // Try network and if it fails, go for the cached copy.
  event.respondWith(fromNetwork(event.request, 400).catch(function () {
    return fromCache(event.request);
  })).catch(event => {
    console.log(event);
  });
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      './magna-carta.html',
      './service-worker.js',
      './manifest.json',
      './icons/scroll-36x36.png',
      './icons/scroll-48x48.png',
      './icons/scroll-72x72.png',
      './icons/scroll-96x96.png',
      './icons/scroll-144x144.png',
      './icons/scroll-192x192.png',
      './icons/scroll-256x256.png',
      './icons/scroll-384x384.png',
      './icons/scroll-512x512.png'
    ]);
  });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    var timeoutId = setTimeout(reject, timeout);
    // Fulfill in case of success.
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
