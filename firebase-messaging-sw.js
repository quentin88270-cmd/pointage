importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLjmeAbZEUNrskkn-THIFzY7d8Brk4nAI",
  authDomain: "pointage-mediaco.firebaseapp.com",
  projectId: "pointage-mediaco",
  storageBucket: "pointage-mediaco.firebasestorage.app",
  messagingSenderId: "123659872809",
  appId: "1:123659872809:web:6d94c82b2585652899ca38"
});

const messaging = firebase.messaging();

// Notif background ET foreground (data-only payload)
// Un seul endroit affiche la notif → plus de doublon
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW MEDIACO] Message reçu:', payload);

  // Lire depuis data (payload data-only) ou notification (fallback)
  const title = (payload.data && payload.data.title)
    || (payload.notification && payload.notification.title)
    || 'MEDIACO';
  const body = (payload.data && payload.data.body)
    || (payload.notification && payload.notification.body)
    || '';
  const icon = (payload.data && payload.data.icon)
    || './icon-192.png';

  return self.registration.showNotification(title, {
    body:     body,
    icon:     icon,
    badge:    './icon-192.png',
    tag:      'mediaco-notif',   // même tag = remplace au lieu de doubler
    renotify: true,
    vibrate:  [200, 100, 200],
    data:     { url: '/pointage/' }
  });
});

// Clic sur la notification → ouvre l'app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url.includes('mediaco') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/pointage/');
    })
  );
});
