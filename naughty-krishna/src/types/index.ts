// ─── Menu ────────────────────────────────────────────────────────────────────

export type MenuCategory =
  | 'all'
  | 'chaats'
  | 'breads'
  | 'mains'
  | 'snacks'
  | 'innovative'
  | 'desserts';

export type MenuItemCategory = Exclude<MenuCategory, 'all'>;

export type BadgeType = 'new' | 'popular' | 'spicy' | 'must-try';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  price: number;
  description: string;
  image: string;
  badge?: BadgeType;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: 1 | 2 | 3;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ─── Reservation ─────────────────────────────────────────────────────────────

export interface ReservationFormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

// ─── Catering ────────────────────────────────────────────────────────────────

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  pricePerHead: number;
  includes: string[];
  badge?: string;
  highlight?: boolean;
}

export interface CateringInquiryData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  packageId: string;
  message: string;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

export interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  notes?: string;
  paymentMethod: 'card' | 'cash';
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export type ReviewSource = 'google' | 'facebook' | 'ubereats' | 'direct';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review: string;
  date: string;
  source: ReviewSource;
  initials: string;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}
