function actulizaCacheDinamico(dynamicCache, req, res) {
  if (req.url.startsWith("https")) {
    return caches.open(dynamicCache).then((cache) => {
      cache.put(req, res.clone());
      return res.clone();
    });
  } else {
    return res;
  }
}
