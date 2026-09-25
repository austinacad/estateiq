# EstateIQ consultation booking

The service page offers an intro call about hands-on help for agents. The booking page is ready to use an external scheduling provider. No appointment can be booked until Austin supplies a public event link and publishes the reviewed changes.

1. Create a free 20-minute event with Cal.com, Calendly, or Google Calendar Appointment Schedules. Set your availability, time zone, notification email, and meeting location in the provider.
2. Copy the public event URL into `window.ESTATEIQ_BOOKING_URL` in `booking-config.js`. Use the complete `https://` link. The page accepts provider links from `cal.com`, `calendly.com`, `calendar.google.com`, or `calendar.app.google`.
3. Preview `booking.html` and make a test booking. Check that the calendar blocks the slot, the invite/notifications arrive, and the cancellation or reschedule links work.
4. After Austin approves a production release, deploy the reviewed revision through the existing guarded process. No customer or lead data is stored by EstateIQ's static site; the booking provider manages the booking details.

The existing trial form is separate and still does not deliver submissions on Vercel. This change does not add agent-to-lead appointment automation, billing, or active client accounts.
