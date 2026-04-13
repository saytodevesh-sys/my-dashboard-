// firebase-messaging-sw.js
// Place this file in the ROOT of your GitHub Pages / Netlify repo
// (same folder as your dashboard HTML file)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyAh-Hg563uWQLHETQDUlScfEHaxb9JDBMg",
  authDomain:        "daily-self-evaluation-fcfba.firebaseapp.com",
  databaseURL:       "https://daily-self-evaluation-fcfba-default-rtdb.firebaseio.com",
  projectId:         "daily-self-evaluation-fcfba",
  storageBucket:     "daily-self-evaluation-fcfba.firebasestorage.app",
  messagingSenderId: "44383620869",
  appId:             "1:44383620869:web:966935db604ddad5abf16c"
});

const messaging = firebase.messaging();

// Handle background push messages (browser closed / tab hidden)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Reminder';
  const body  = payload.notification?.body  || payload.data?.body  || '';

  self.registration.showNotification(title, {
    body,
    icon:  '/favicon.ico',   // swap with your own icon path if you have one
    badge: '/favicon.ico',
    tag:   'dashboard-reminder',
    renotify: true,
    data: { url: self.location.origin }
  });
});

// Clicking the notification opens / focuses the dashboard
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(target) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
