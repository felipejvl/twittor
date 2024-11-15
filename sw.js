//imports
importScripts("js/sw-utils.js");
const STATIC_CACHE = "static-v5";
const DYNAMIC_CACHE = "dynamic-v2";
const INMUTABLE_CACHE = "imutable-v2";

//Esto es para saber que es lo más importante que voy a utilizar
//Static es algo que nosotros hicimos

const APP_SHELL = [
  //"/",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });
  const cacheImutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheImutable]));
});

//Borrar caches que ya no me van aservir
self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
      if (key !== STATIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  const resputa = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      //console.log(e.request.url);
      return fetch(e.request).then((newRes) => {
        return actulizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
      });
    }
  });

  e.waitUntil(resputa);
});
