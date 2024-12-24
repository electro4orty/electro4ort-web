function debounce(cb, timeout) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb.apply(this, ...args);
      }, timeout);
    }
  };
}

const handleNotification = debounce((message) => {
  self.registration.showNotification(message.title, {
    body: message.body,
    icon: './favicon.svg',
    data: message.data,
  });
}, 1000);

self.addEventListener('push', (e) => {
  const message = e.data.json();

  e.waitUntil(() => handleNotification(message));
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
            `/${e.notification.data.hubSlug}/rooms/${e.notification.data.roomId}`,
          );
        }
      }),
  );
});
