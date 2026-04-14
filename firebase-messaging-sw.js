// firebase-messaging-sw.js
// Deploy this file to the ROOT of your Netlify site (same level as index.html)

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

// Handle background notifications (when app/browser tab is not in focus)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Reminder';
  const body  = payload.notification?.body  || payload.data?.body  || '';
  const icon  = payload.notification?.icon  || '/favicon.ico';

  return self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
  });
});

// Handle notification click — open deeplink if present, else focus/open app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // If notification carries a deeplink (e.g. /?openRefl=rem_xxx), open it
  const data    = event.notification.data || {};
  const deepUrl = data.deeplink || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If app is already open, navigate it to the deeplink
      for (const client of clientList) {
        if ('navigate' in client && 'focus' in client) {
          return client.navigate(deepUrl).then(() => client.focus());
        }
        if ('focus' in client) return client.focus();
      }
      // App not open — open a new window with the deeplink
      if (clients.openWindow) return clients.openWindow(deepUrl);
    })
  );
});
