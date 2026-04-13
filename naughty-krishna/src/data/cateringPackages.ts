import type { CateringPackage } from '@/types';

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'essential',
    name: 'Essential',
    description:
      'Perfect for small office gatherings, team lunches, and intimate get-togethers.',
    minGuests: 20,
    maxGuests: 50,
    pricePerHead: 25,
    includes: [
      'Choice of 3 chaat items',
      'Choice of 2 main dishes',
      'Bread selection (poori / parantha)',
      'Condiments & chutneys platter',
      'Disposable serving ware',
    ],
  },
  {
    id: 'celebration',
    name: 'Celebration',
    description:
      'Ideal for birthdays, anniversaries, cultural events, and community gatherings.',
    minGuests: 50,
    maxGuests: 150,
    pricePerHead: 35,
    includes: [
      'Choice of 5 chaat items',
      'Choice of 3 main dishes',
      'Full bread & fried selection',
      'Snacks & pakoda platter',
      'Dessert selection',
      'Setup & service staff (1 person)',
      'Chafing dishes & serving equipment',
    ],
    badge: 'Most Popular',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium Grand',
    description:
      'The complete Naughty Krishna experience for weddings, corporate events, and large festivals.',
    minGuests: 150,
    maxGuests: 500,
    pricePerHead: 55,
    includes: [
      'Full menu selection (all categories)',
      'Live chaat & snack station',
      'Dedicated service team',
      'Custom table & décor arrangement',
      'Gourmet dessert table',
      'Post-event cleanup',
      'Event coordination support',
      'Personalised menu cards',
    ],
    badge: 'Best Value',
  },
];
