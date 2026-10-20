# API Integration

Which part of the frontend calls which backend endpoint.

Backend: https://fixitnow-backend-two.vercel.app

Everything is called from the server side because the backend CORS only allows localhost.
The GET calls are in `src/lib/queries.ts` and run inside server components, the writes are
server actions in `src/actions/`. Both go through `src/lib/api.ts` which puts the
`Authorization: Bearer <token>` header from the cookie.

GET calls use `next: { tags: [...] }` and after a write the tag is updated with
`updateTag()`, so the list refreshes without reloading the page.

## Auth

| Where | Function | Endpoint |
|-------|----------|----------|
| `/login` form | `loginAction` (`src/actions/auth.ts`) | POST `/api/auth/login` |
| `/register` form | `registerAction` | POST `/api/auth/register` |
| Header, dashboard layout | `getCurrentUser` (`src/lib/session.ts`) | GET `/api/auth/me` |
| `src/proxy.ts` (middleware) | token refresh when access token expired | POST `/api/auth/refresh-token` |
| Logout button | `logoutAction` | no API call, only clears the cookies |

## Public pages

| Where | Function | Endpoint |
|-------|----------|----------|
| `/` home - popular services | `getServices` | GET `/api/services?sortBy=avgRating&limit=6` |
| `/` home - top technicians | `getTechnicians` | GET `/api/technicians?sortBy=avgRating` |
| `/` home - category grid | `getCategories` | GET `/api/categories` |
| `/services` list + filters | `getServices` | GET `/api/services?search=&category=&city=&minPrice=&maxPrice=&minRating=&sortBy=&page=` |
| `/services` filter dropdowns | `getCategories`, `getTechnicians` | GET `/api/categories`, GET `/api/technicians` |
| `/technicians` list + filters | `getTechnicians` | GET `/api/technicians?search=&city=&minRating=&page=` |
| `/technicians/[id]` profile | `getTechnician` | GET `/api/technicians/:id` |
| `/technicians/[id]` review list | `getTechnicianReviews` | GET `/api/reviews/technician/:id` |
| `BookService` time slots | comes from `availabilities` of the technician response | GET `/api/technicians/:id` |

Filters are kept in the url, so the server component refetches when a filter changes. The
search box is debounced, otherwise it was pushing a new url on every key press.

## Customer

| Page / Component | Function | Endpoint |
|------------------|----------|----------|
| Booking form (`BookService`) | `createBookingAction` | POST `/api/bookings` |
| `/dashboard/customer` | `getMyBookings`, `getMyPayments` | GET `/api/bookings`, GET `/api/payments` |
| `/dashboard/customer/bookings` | `getMyBookings` | GET `/api/bookings?status=&page=` |
| Cancel button on a booking card | `cancelBookingAction` | PATCH `/api/bookings/:id/cancel` |
| `/dashboard/customer/bookings/[id]/pay` | `getBooking` | GET `/api/bookings/:id` |
| Pay button | `startPaymentAction` | POST `/api/payments/create` |
| `/payment/success` | `getMyPayments` | GET `/api/payments` |
| "Check payment status" button | `confirmPaymentAction` | POST `/api/payments/confirm` |
| `/dashboard/customer/payments` | `getMyPayments` | GET `/api/payments?page=` |
| Review dialog | `createReviewAction` | POST `/api/reviews` |
| `/dashboard/customer/reviews` | `getMyReviews` | GET `/api/reviews/my-reviews` |

## Technician

| Page / Component | Function | Endpoint |
|------------------|----------|----------|
| `/dashboard/technician` | `getTechnicianProfile`, `getTechnicianBookings` | GET `/api/technician/profile`, GET `/api/technician/bookings` |
| `/dashboard/technician/profile` | `updateTechnicianProfileAction` | PUT `/api/technician/profile` |
| `/dashboard/technician/services` | `getMyServices`, `getCategories` | GET `/api/technician/services`, GET `/api/categories` |
| Service add / edit dialog | `saveServiceAction` | POST `/api/technician/services`, PATCH `/api/technician/services/:id` |
| Service delete button | `deleteServiceAction` | DELETE `/api/technician/services/:id` |
| `/dashboard/technician/availability` | `getMyAvailability` | GET `/api/technician/availability` |
| Availability save button | `updateAvailabilityAction` | PUT `/api/technician/availability` |
| `/dashboard/technician/bookings` | `getTechnicianBookings` | GET `/api/technician/bookings?status=&page=` |
| Accept / Decline / Start / Complete buttons | `updateBookingStatusAction` | PATCH `/api/technician/bookings/:id` |

## Admin

| Page / Component | Function | Endpoint |
|------------------|----------|----------|
| `/dashboard/admin` | `getAdminStats` | GET `/api/admin/stats` |
| `/dashboard/admin/users` | `getAdminUsers` | GET `/api/admin/users?search=&role=&status=&page=` |
| Ban / Unban button | `updateUserStatusAction` | PATCH `/api/admin/users/:id` |
| `/dashboard/admin/bookings` | `getAdminBookings` | GET `/api/admin/bookings?search=&status=&page=` |
| `/dashboard/admin/payments` | `getAdminPayments` | GET `/api/admin/payments?status=&page=` |
| `/dashboard/admin/categories` | `getAdminCategories` | GET `/api/admin/categories?search=&page=` |
| Category add / edit dialog | `saveCategoryAction` | POST `/api/admin/categories`, PATCH `/api/admin/categories/:id` |
| Category delete button | `deleteCategoryAction` | DELETE `/api/admin/categories/:id` |

## Payment callbacks

Gateway can not redirect to a json api and show anything useful, so the return urls point
to these route handlers instead. They forward the data to the backend and then redirect to
a real page.

| Route handler | Forwards to | Then redirects to |
|---------------|-------------|-------------------|
| `/api/payments/ssl/success` | POST `/api/payments/ssl/ipn` | `/payment/success?transactionId=...` |
| `/api/payments/ssl/fail` | POST `/api/payments/ssl/fail` | `/payment/cancel` |
| `/api/payments/ssl/cancel` | POST `/api/payments/ssl/cancel` | `/payment/cancel` |
| `/api/payments/ssl/ipn` | POST `/api/payments/ssl/ipn` | returns JSON (server to server call) |
| `/api/payments/stripe/success` | - | `/payment/success?transactionId=...` |
| `/api/payments/stripe/cancel` | - | `/payment/cancel` |

For this the backend `SERVER_URL` has to point to the frontend url. Stripe is confirmed by
the webhook on the backend side, so the success page shows "Payment is being confirmed"
until it arrives, and there is a button to check it manually.

## Errors

The backend always answers with the same shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": [{ "path": "email", "message": "Invalid email address" }]
}
```

`fieldErrors()` in `src/lib/api.ts` turns `errorDetails` into `{ field: message }` and the
form shows it under the input. The `message` goes to a toast. If the fetch itself throws
(server down, no internet) the wrapper returns a fake 500 with a readable message so the
page does not crash.

Route level failures go to `error.tsx` and unknown urls to `not-found.tsx`.
