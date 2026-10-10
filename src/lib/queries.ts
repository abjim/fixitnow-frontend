import { api } from '@/lib/api';
import type {
  Availability,
  Booking,
  Category,
  Payment,
  Review,
  Service,
  TechnicianCard,
  TechnicianProfile,
} from '@/lib/types';

type Query = Record<string, string | number | undefined>;

function toSearch(query: Query = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const search = params.toString();
  return search ? `?${search}` : '';
}

/* ---------- public ---------- */

export function getServices(query: Query = {}) {
  return api<Service[]>(`/api/services${toSearch(query)}`, {
    auth: false,
    tags: ['services'],
    revalidate: 60,
  });
}

export function getService(id: string) {
  return api<Service>(`/api/services/${id}`, { auth: false, tags: ['services'] });
}

export function getTechnicians(query: Query = {}) {
  return api<TechnicianCard[]>(`/api/technicians${toSearch(query)}`, {
    auth: false,
    tags: ['technicians'],
    revalidate: 60,
  });
}

export function getTechnician(id: string) {
  return api<TechnicianProfile>(`/api/technicians/${id}`, {
    auth: false,
    tags: ['technicians', `technician-${id}`],
  });
}

export function getCategories(query: Query = {}) {
  return api<Category[]>(`/api/categories${toSearch(query)}`, {
    auth: false,
    tags: ['categories'],
    revalidate: 300,
  });
}

export function getTechnicianReviews(technicianId: string, query: Query = {}) {
  return api<Review[]>(
    `/api/reviews/technician/${technicianId}${toSearch(query)}`,
    { auth: false, tags: [`technician-${technicianId}`] },
  );
}

/* ---------- customer ---------- */

export function getMyBookings(query: Query = {}) {
  return api<Booking[]>(`/api/bookings${toSearch(query)}`, { tags: ['bookings'] });
}

export function getBooking(id: string) {
  return api<Booking>(`/api/bookings/${id}`, { tags: ['bookings'] });
}

export function getMyPayments(query: Query = {}) {
  return api<Payment[]>(`/api/payments${toSearch(query)}`, { tags: ['payments'] });
}

export function getMyReviews() {
  return api<Review[]>('/api/reviews/my-reviews', { tags: ['reviews'] });
}

/* ---------- technician ---------- */

export function getTechnicianProfile() {
  return api<TechnicianProfile>('/api/technician/profile', {
    tags: ['technician-profile'],
  });
}

export function getMyAvailability() {
  return api<Availability[]>('/api/technician/availability', {
    tags: ['availability'],
  });
}

export function getMyServices() {
  return api<Service[]>('/api/technician/services', { tags: ['my-services'] });
}

export function getTechnicianBookings(query: Query = {}) {
  return api<Booking[]>(`/api/technician/bookings${toSearch(query)}`, {
    tags: ['bookings'],
  });
}
