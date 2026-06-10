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

// ── Notification reçue en arrière-plan (app fermée / onglet inactif)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW MEDIACO] Message background:', payload);
  const title = (payload.notification && payload.notification.title) || 'MEDIACO';
  const body  = (payload.notification && payload.notification.body)  || '';
  self.registration.showNotification(title, {
    body:    body,
    icon:    'https://www.mediaco-groupe.com/favicon.ico',
    badge:   'https://www.mediaco-groupe.com/favicon.ico',
    tag:     'mediaco-notif',
    vibrate: [200, 100, 200]
  });
});

// ── Clic sur la notification → ouvre l'app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (const client of list) {
        if (client.url.includes('mediaco') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
