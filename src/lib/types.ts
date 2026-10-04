export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type PaymentProvider = 'STRIPE' | 'SSLCOMMERZ';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  technicianProfile?: TechnicianProfile | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  _count?: { services: number };
};

export type Availability = {
  id: string;
  technicianId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type Review = {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer?: { id: string; name: string };
  technician?: { id: string; user: { id: string; name: string } };
  booking?: { id: string; service: { title: string } };
};

// technician shown inside a service card
export type TechnicianCard = {
  id: string;
  city: string;
  serviceArea: string | null;
  hourlyRate: number;
  avgRating: number;
  totalReviews: number;
  isAvailable: boolean;
  user: { id: string; name: string; phone: string | null; email?: string };
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  categoryId: string;
  technicianId: string;
  createdAt: string;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  technician: TechnicianCard;
  _count?: { bookings: number };
};

export type TechnicianProfile = {
  id: string;
  userId: string;
  bio: string | null;
  experienceYears: number;
  hourlyRate: number;
  city: string;
  serviceArea: string | null;
  skills: string[];
  avgRating: number;
  totalReviews: number;
  isAvailable: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: UserStatus;
  };
  services: Service[];
  availabilities: Availability[];
  reviews: Review[];
  _count?: { bookings: number; reviews: number };
};

export type Booking = {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  note: string | null;
  price: number;
  status: BookingStatus;
  cancelReason: string | null;
  completedAt: string | null;
  createdAt: string;
  service: {
    id: string;
    title: string;
    price: number;
    durationMinutes: number;
    category: Pick<Category, 'id' | 'name' | 'slug'>;
  };
  technician: {
    id: string;
    userId: string;
    city: string;
    avgRating: number;
    user: { id: string; name: string; phone: string | null; email: string };
  };
  customer: { id: string; name: string; phone: string | null; email: string };
  payment: Payment | null;
  review: Review | null;
};

export type Payment = {
  id: string;
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: string | null;
  failReason: string | null;
  createdAt: string;
  booking?: {
    id: string;
    status: BookingStatus;
    scheduledAt: string;
    service: { id: string; title: string };
    technician: { id: string; user: { id: string; name: string } };
  };
};

