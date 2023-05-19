/** @type {any} */
const x = self;
/** @type {ServiceWorkerGlobalScope} */
const s = x;

/** 
 * @param {Request} request
 * @param {Response} response
 */
const putInCache = async (request, response) => {
    const cache = await caches.open("v1");

    const url = new URL(request.url)

    if (url.pathname.startsWith("/api/auth")) return;

    if (request.method !== "GET") return;

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    await cache.put(request.clone(), response);
};

s.addEventListener("install", (event) => {
    console.log("SW OK")
    event.waitUntil(new Promise((resolve) => resolve(true)));
})

/** @param {FetchEvent} event */
const handleFetch = async (event) => {
    try {
        const fromNetwork = await fetch(event.request);
        putInCache(event.request, fromNetwork)
        return fromNetwork;
    } catch (error) {
        const fromCache = await caches.match(event.request);
        if (fromCache) {
            return fromCache;
        }
        throw error;
    }
}



s.addEventListener("fetch", async (event) => {
    event.respondWith(handleFetch(event));
});


