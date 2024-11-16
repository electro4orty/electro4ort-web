let timeoutId;

self.addEventListener('push', (e) => {
  const message = e.data.json();

  e.waitUntil(
    (() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = self.setTimeout(() => {
        self.registration.showNotification(message.title, {
          body: message.body,
          icon: './favicon.svg',
        });
      }, 1000);

      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'check-user-activity',
          });
        });
      });
    })()
  );
});

self.addEventListener('message', (e) => {
  if (e.data?.type === 'user-activity') {
    if (timeoutId && e.data.documentVisibility === 'visible') {
      e.waitUntil(self.clearTimeout(timeoutId));
    }
  }
});
