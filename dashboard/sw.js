// DEMIR Dashboard - Service Worker v2
// Guarda recordatorios pendientes en memoria y los revisa periódicamente

let pendingReminders = [];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Recibe mensajes del dashboard
self.addEventListener('message', e => {
  const { type, payload, id } = e.data;

  if (type === 'SCHEDULE_REMINDER') {
    // Eliminar si ya existía
    pendingReminders = pendingReminders.filter(r => r.id !== payload.id);
    // Agregar nuevo
    pendingReminders.push(payload);
    console.log('[SW] Recordatorio guardado:', payload.title, 'en', new Date(payload.timestamp).toLocaleTimeString());
  }

  if (type === 'CANCEL_REMINDER') {
    pendingReminders = pendingReminders.filter(r => r.id !== id);
    console.log('[SW] Recordatorio cancelado:', id);
  }

  if (type === 'GET_PENDING') {
    // El dashboard pregunta cuántos recordatorios hay
    e.source.postMessage({ type: 'PENDING_COUNT', count: pendingReminders.length });
  }
});

// Revisar recordatorios cada 30 segundos (sync periódico)
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-reminders') {
    e.waitUntil(checkReminders());
  }
});

// También revisar con push (si llega algún push vacío)
self.addEventListener('push', e => {
  e.waitUntil(checkReminders());
});

// Revisar cuando el SW se activa o recibe fetch
self.addEventListener('fetch', e => {
  checkReminders();
});

async function checkReminders() {
  const now = Date.now();
  const due = pendingReminders.filter(r => r.timestamp <= now + 5000); // margen 5s
  for (const r of due) {
    await self.registration.showNotification(r.title, {
      body: r.body,
      icon: '/assets/logo-demir.png',
      badge: '/assets/logo-demir.png',
      tag: r.id,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    });
    pendingReminders = pendingReminders.filter(p => p.id !== r.id);
  }
}

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
