let CACHE_NAME = "Sample Tracker";
let urlsToCache = [
];

// Install a service worker
this.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache and return requests
this.addEventListener('fetch', function (event) {

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

// Update a service worker
this.addEventListener('activate', event => {
    let cacheWhitelist = ['your-app-name'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

this.addEventListener("push", function (event) {
    // const data = event.data.json();
    console.log("data: ", event.data);

    this.registration.showNotification("Welcome back", {
        body: JSON.stringify(event.data || "Welcome to Sample Tracker"),
    });
});