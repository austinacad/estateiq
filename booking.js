'use strict';
const bookingLink = document.getElementById('bookingLink');
const bookingStatus = document.getElementById('bookingStatus');
try {
  const url = new URL(window.ESTATEIQ_BOOKING_URL);
  const host = url.hostname.toLowerCase();
  const provider = ['cal.com', 'calendly.com', 'calendar.google.com', 'calendar.app.google'].some(domain => host === domain || host.endsWith(`.${domain}`));
  if (url.protocol === 'https:' && provider && url.pathname !== '/') {
    bookingLink.href = url.href;
    bookingLink.hidden = false;
    bookingStatus.textContent = 'Available times and confirmation are handled securely by the scheduling provider.';
  }
} catch {
  // Keep booking closed until a real scheduling page is configured.
}
