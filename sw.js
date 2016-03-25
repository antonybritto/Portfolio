importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'React-FullStack-7';
// The files we want to cache
var urlsToCache = [
  '/Portfolio/',
  'build/bundle7.min.css',
  'build/bundle7.min.js',
  '/Portfolio/img/',
];

self.addEventListener('install', (event) => {
  //self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache)=> {
      return cache.addAll(urlsToCache);
    })
  );

});


self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

// Set the callback when the files get fetched
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cached files available, return those
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        // Start request again since there are no files in the cache
        return fetch(fetchRequest).then(
          function(response) {
            // If response is invalid, throw error
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            // Otherwise cache the downloaded files
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            // And return the network response
            return response;
          }
        );
      })
    );
});

self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  var title = 'Added to Homescreen';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: 'Thanks for adding. Please check your homescreen for avatar icon.',
      icon: 'avatar-48.png',
      tag: 'my-tag'
    }));
});
