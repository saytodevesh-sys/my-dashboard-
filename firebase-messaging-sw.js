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

// ── Background message handler ───────────────────────────────────────────────
// Called when a push arrives and the app is in the background / closed.
// We manually show the notification so we can attach the reflId in data.
messaging.onBackgroundMessage(function(payload) {
  const title  = payload.notification?.title || payload.data?.title || 'Reminder';
  const body   = payload.notification?.body  || payload.data?.body  || '';
  const reflId = payload.data?.reflId || '';

  return self.registration.showNotification(title, {
    body:    body,
    icon:    '/favicon.ico',
    badge:   '/favicon.ico',
    vibrate: [200, 100, 200],
    data:    { reflId: reflId }   // ← carries reflId through to notificationclick
  });
});

// ── Notification tap handler ─────────────────────────────────────────────────
// When user taps the notification:
//   • If app window is already open  → focus it + postMessage to navigate
//   • If app is closed               → open /?openRefl=<id> so app can deep-link
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const reflId    = event.notification.data?.reflId || '';
  const targetUrl = reflId ? ('/?openRefl=' + encodeURIComponent(reflId)) : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // App is already open in some tab — focus it and tell it to navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if (reflId) {
            client.postMessage({ type: 'OPEN_REFL', reflId: reflId });
          }
          return;
        }
      }
      // App is closed — open it with the deep-link URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
