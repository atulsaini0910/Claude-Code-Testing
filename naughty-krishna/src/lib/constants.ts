export const RESTAURANT = {
  name: 'Naughty Krishna',
  fullName: 'Naughty Krishna Vegetarian Restaurant',
  tagline: '100% Pure Vegetarian Indian',
  subTagline: 'Authentic flavours. Innovative soul. Zero compromise.',
  established: '2024',
  address: {
    street: '16 Westfield Place',
    suburb: 'Blacktown',
    state: 'NSW',
    postcode: '2148',
    country: 'Australia',
    full: '16 Westfield Place, Blacktown NSW 2148',
    googleMapsLink:
      'https://maps.google.com/?q=16+Westfield+Place+Blacktown+NSW+2148',
    googleMapsEmbed:
      'https://maps.google.com/maps?q=16+Westfield+Place+Blacktown+NSW+2148&output=embed&z=16',
  },
  phone: '0451 300 003',
  phoneHref: 'tel:+61451300003',
  hours: {
    display: '10:00 AM – 10:00 PM',
    days: 'Open Daily',
    openHour: 10,
    closeHour: 22,
  },
  social: {
    instagram: 'https://www.instagram.com/naughtyindianfoodcatering/',
    instagramHandle: '@naughtyindianfoodcatering',
    facebook:
      'https://www.facebook.com/p/Naughty-Krishna-Vegetarian-Restaurant-61556396037148/',
    facebookHandle: 'Naughty Krishna',
  },
  delivery: {
    uberEats:
      'https://www.ubereats.com/au/store/naughty-indian-blacktown/n1eyeBYaQk-m9F1MQqUZtg',
    doorDash:
      'https://www.doordash.com/store/naughty-indian-blacktown-29942225',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: 'home' },
  { label: 'Menu', href: 'menu' },
  { label: 'Reservations', href: 'reservations' },
  { label: 'Catering', href: 'catering' },
  { label: 'Gallery', href: 'gallery' },
  { label: 'Contact', href: 'contact' },
] as const;
