// DEMIR Dashboard - Service Worker para recordatorios
const reminderTimeouts = {};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
  const { type, payload, id } = e.data;

  if (type === 'SCHEDULE_REMINDER') {
    const ms = payload.timestamp - Date.now();
    if (ms <= 0) return;
    if (reminderTimeouts[payload.id]) clearTimeout(reminderTimeouts[payload.id]);
    reminderTimeouts[payload.id] = setTimeout(() => {
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: '/assets/logo-demir.png',
        badge: '/assets/logo-demir.png',
        tag: payload.id,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
      delete reminderTimeouts[payload.id];
    }, ms);
  }

  if (type === 'CANCEL_REMINDER') {
    if (reminderTimeouts[id]) {
      clearTimeout(reminderTimeouts[id]);
      delete reminderTimeouts[id];
    }
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes('/dashboard/'));
      if (existing) return existing.focus();
      return self.clients.openWindow('/dashboard/');
    })
  );
});
