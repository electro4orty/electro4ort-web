self.addEventListener('push', (e) => {
  const message = e.data.json();

  e.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: './favicon.svg',
      data: message.data,
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  e.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            client.url.includes(self.registration.scope) &&
            'focus' in client
          ) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(
            `/${e.notification.data.hubSlug}/rooms/${e.notification.data.roomId}`
          );
        }
      })
  );
});
