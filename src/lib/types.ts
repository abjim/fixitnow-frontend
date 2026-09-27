export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';

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

