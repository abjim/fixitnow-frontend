# FixItNow Frontend

This is the frontend of FixItNow (Assignment 5). The backend is my Assignment 4 project so
both are connected.

Customer books a technician, technician accepts the job, then customer pays with SSLCommerz
or Stripe. Admin manages users and categories.

- Backend API: https://fixitnow-backend-two.vercel.app
- Backend repo: https://github.com/abjim/fixitnow-backend

## Admin Credentials

```
Email: admin@fixitnow.com
Password: Admin@1234
```

Other demo accounts (same seed data as the backend):

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@fixitnow.com | Customer@123 |
| Technician | rakib@fixitnow.com | Tech@1234 |

These are on the live db and everyone uses them, so please do not change the password. You
can register a new account also.

## Stack

Next.js 16 (app router), TypeScript, Tailwind v4, shadcn/ui, sonner for the toast, date-fns
and lucide icons. No extra state library, the server components do the fetching.

## Features

**Public** - home page, service browsing with search and category / city / rating / price
filter, sorting, pagination, technician list and the technician details page with the
booking box.

**Customer** - register and login, book a technician on a free time slot, pay after the
technician accepts, booking history with status badge and cancel button, payment history,
review after the job is completed.

**Technician** - dashboard with new requests and earnings, profile form, add/edit/delete own
services, weekly availability, and accept / decline / start / complete on the bookings.

**Admin**

- platform stats (users, bookings, revenue, booking status count)
- user table with search, role / status filter and ban/unban
- all bookings and all payments table
- category create, edit, delete

## Run Locally

```bash
npm install
```

Make a `.env.local` file, the keys are in `.env.example`:

```
NEXT_PUBLIC_API_URL=https://fixitnow-backend-two.vercel.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

## Folder Structure

```
src/
  actions/      server actions
  app/          routes
  components/   ui/ is shadcn, the rest is mine
  lib/          api wrapper, queries, session, types, helpers
  proxy.ts      route protection
```

In Next.js 16 the middleware file is `proxy.ts`, not `middleware.ts`. Took me a long time to
understand why my middleware was never running.

## Auth

Login is done in a server action. Backend gives the access token and sets a refresh token
cookie, both of them are saved again as httpOnly cookies by the next server, so nothing is
kept in localStorage.

`proxy.ts` runs on `/dashboard/*`, `/login` and `/register`. It reads the role from the
token and sends the user to his own dashboard. If the access token is expired it calls the
refresh endpoint and sets a new cookie.

## Why everything is server side

The backend CORS only allows `localhost:3000` and `localhost:5173`. I did not want to touch
the backend again after submitting it, so every api call is done from the next server
(server component or server action) and the browser never calls the backend directly. Good
side effect is the token never goes to the client.

## Payment

Pay button comes only after the booking is `ACCEPTED`. Backend returns a `paymentUrl` and
the browser is sent to the gateway page.

After paying, the gateway comes back to `SERVER_URL/api/payments/...` which is the backend,
and the backend only answers with json. So I made the same routes in the frontend under
`src/app/api/payments/` and changed `SERVER_URL` of the backend to the frontend url. Those
routes forward the gateway data to the backend and then redirect to `/payment/success` or
`/payment/cancel`.

SSLCommerz is on sandbox. Stripe webhook sometimes takes few seconds, so the success page
shows "Payment is being confirmed" with a button to check it again.

## Known Issues

- availability is weekly only, can not block a single date
- no profile picture upload for technician, avatar is just the name initials
- totals on the admin payment page are counted from the current page only
- dark mode css variables are there but there is no toggle in the ui

## TODO

- dark mode toggle
- notification when the booking status changes
