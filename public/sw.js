self.addEventListener('push', (e) => {
  const message = e.data.json();

  e.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.message,
    })
  );
});
