const cacheName = 'v1';

const cacheFiles = [
	'./',
	'./index.html',
	'./js/app.js',
	'./css/reset.css',
	'./css/style.css',
	'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic'
]

self.addEventListener('install',(e) => {
	console.log("[Service Work] instalado");

	e.waitUntil(

		caches.open(cacheName).then(() => {
			console.log('[ServiceWorker] cache realizdo com sucesso');
		})
	);
});

self.addEventListener('activate', (e) => {
	console.log("[ServiceWorker] Ativado");

	e.waitUntil(

		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.map((thisCacheName) => {

				if(thisCacheName !== cacheName){
					console.log('[ServiceWorker]', thisCacheName);
					return caches.delete(thisCacheName);
				}

			}));
		})
	);
});


self.addEventListener('fetch', (e) =>{
	console.log("[Service Work] Atualizado", e.request.url);

	e.respondwith(
		caches.match(e.request)
			.then((response) => {
				if(response) {
					console.log('[ServiceWorker] nao foi atualizado');
					return response;
				}
				let responseClone = response.clone();
				return fetch(requestClone)
				.then((response) => {
					if ( !response ) {
						console.log("[ServiceWorker] No response from fetch ")
						return response;
					}

					caches.open(cacheName)
					.then(() => {
					
					cache.put(e.resquest, responseClone);
					console.log('[ServiceWorker] Novo cache Realizado', e.request.url);

					return response;
				});
			});
		}).catch((err) =>{
			console.log('[ServiceWorker] deu erro');
		})
	)
});
