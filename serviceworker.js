const CACHE_NAME = 'organizador-cache-v3';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// Instalação
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Ativação
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});

// Recebe dados do app
let contas = [];
let lembretes = [];

self.addEventListener('message', event => {
    if(event.data.type === 'atualizar-dados'){
        contas = event.data.contas;
        lembretes = event.data.lembretes;
    }
});

// Alertas diários (experimental, pode não funcionar em todos browsers)
self.addEventListener('periodicsync', event => {
    if(event.tag === 'alertas-diarios'){
        event.waitUntil(alertasDiarios());
    }
});

async function alertasDiarios(){
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    contas.forEach(conta => {
        const partes = conta.split(' - ');
        const nome = partes[0];
        const valor = partes[1];
        const status = partes[2];
        const vencimento = partes[3];
        if(status === 'nao-paga' && vencimento <= hoje){
            self.registration.showNotification("💰 Conta vencida!", {
                body: `${nome} - R$${valor} - Venceu em ${vencimento}`,
                icon: 'icons/icon-192.png',
                badge: 'icons/icon-192.png'
            });
        }
    });
    lembretes.forEach(texto => {
        if(texto.includes(hoje)){
            self.registration.showNotification("📋 Lembrete do dia", {
                body: texto,
                icon: 'icons/icon-192.png',
                badge: 'icons/icon-192.png'
            });
        }
    });
}
