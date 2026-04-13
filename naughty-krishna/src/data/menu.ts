import type { MenuItem, MenuCategory } from '@/types';

export const MENU_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'chaats', label: 'Chaats' },
  { id: 'breads', label: 'Breads & Fried' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'mains', label: 'Mains' },
  { id: 'innovative', label: 'Innovative' },
  { id: 'desserts', label: 'Desserts' },
];

export const MENU_ITEMS: MenuItem[] = [
  // ── Chaats ───────────────────────────────────────────────────────────────
  {
    id: 'samosa-chaat',
    name: 'Samosa Chaat',
    category: 'chaats',
    price: 12,
    description:
      'Crispy samosas crushed and topped with spiced chickpeas, tangy tamarind chutney, fresh mint, and a swirl of creamy yoghurt.',
    image: 'https://picsum.photos/seed/samosachaat/600/400',
    badge: 'popular',
    spiceLevel: 2,
    isVegan: false,
  },
  {
    id: 'aloo-tikki-chaat',
    name: 'Aloo Tikki Chaat',
    category: 'chaats',
    price: 12,
    description:
      'Golden potato patties layered with chole, vibrant chutneys, sev, and diced onions — a Mumbai street classic.',
    image: 'https://picsum.photos/seed/alootikki/600/400',
    badge: 'must-try',
    spiceLevel: 2,
    isVegan: false,
  },
  {
    id: 'paapdi-chaat',
    name: 'Paapdi Chaat',
    category: 'chaats',
    price: 12,
    description:
      'Crunchy wheat wafers with boiled potatoes, chickpeas, whisked yoghurt, chaat masala, and dual chutneys.',
    image: 'https://picsum.photos/seed/paapdi/600/400',
    spiceLevel: 1,
    isVegan: false,
  },
  {
    id: 'bombay-bhel',
    name: 'Bombay Bhel',
    category: 'chaats',
    price: 12,
    description:
      'The iconic street-food medley of puffed rice, sev, tomatoes, onions, and a toss of tamarind and green chutney.',
    image: 'https://picsum.photos/seed/bombaybhel/600/400',
    spiceLevel: 2,
    isVegan: true,
  },
  {
    id: 'pao-bhaji',
    name: 'Pao Bhaji',
    category: 'chaats',
    price: 12,
    description:
      'Rich, spiced mashed vegetable curry served hot with butter-toasted pav buns and a squeeze of lemon.',
    image: 'https://picsum.photos/seed/paobhaji/600/400',
    badge: 'popular',
    spiceLevel: 2,
    isVegan: false,
  },

  // ── Breads & Fried ───────────────────────────────────────────────────────
  {
    id: 'aloo-poori',
    name: 'Aloo Poori',
    category: 'breads',
    price: 10,
    description:
      'Deep-fried puffed wheat pooris served with a spiced aloo masala and a side of tangy pickle.',
    image: 'https://picsum.photos/seed/aloopoori/600/400',
    spiceLevel: 1,
    isVegan: true,
  },
  {
    id: 'aloo-parantha',
    name: 'Aloo Parantha',
    category: 'breads',
    price: 12,
    description:
      'Whole wheat flatbread stuffed with seasoned spiced potato, pan-fried in ghee, served with yoghurt and butter.',
    image: 'https://picsum.photos/seed/parantha/600/400',
    badge: 'popular',
    spiceLevel: 1,
    isVegan: false,
  },
  {
    id: 'chole-bhature',
    name: 'Chole Bhature',
    category: 'breads',
    price: 14,
    description:
      'Pillowy deep-fried bhatura paired with slow-cooked Punjabi chole — the north Indian brunch legend.',
    image: 'https://picsum.photos/seed/cholebhature/600/400',
    badge: 'must-try',
    spiceLevel: 2,
    isVegan: true,
  },

  // ── Snacks ───────────────────────────────────────────────────────────────
  {
    id: 'vada-pao',
    name: 'Vada Pao',
    category: 'snacks',
    price: 6.99,
    description:
      "Mumbai's favourite street burger — spiced potato dumpling in a soft bun with garlic chutney and fried green chilli.",
    image: 'https://picsum.photos/seed/vadapao/600/400',
    badge: 'popular',
    spiceLevel: 3,
    isVegan: true,
  },
  {
    id: 'aloo-pyaaz-pakodas',
    name: 'Aloo Pyaaz Pakodas',
    category: 'snacks',
    price: 6.99,
    description:
      'Crispy gram-flour fritters packed with sliced potato and caramelised onion — the perfect monsoon snack.',
    image: 'https://picsum.photos/seed/pakodas/600/400',
    spiceLevel: 2,
    isVegan: true,
  },

  // ── Mains ────────────────────────────────────────────────────────────────
  {
    id: 'chilli-paneer',
    name: 'Chilli Paneer',
    category: 'mains',
    price: 16,
    description:
      'Indo-Chinese style crispy paneer cubes tossed with capsicum, onion, soy, and house chilli sauce.',
    image: 'https://picsum.photos/seed/chillipaneer/600/400',
    badge: 'popular',
    spiceLevel: 3,
    isVegan: false,
  },
  {
    id: 'malai-kofta',
    name: 'Malai Kofta',
    category: 'mains',
    price: 17,
    description:
      'Soft paneer and potato dumplings in a luxurious, mildly spiced cream and tomato gravy.',
    image: 'https://picsum.photos/seed/malaipaneer/600/400',
    badge: 'must-try',
    spiceLevel: 1,
    isVegan: false,
  },

  // ── Innovative ───────────────────────────────────────────────────────────
  {
    id: 'kullad-pizza',
    name: 'Kullad Pizza',
    category: 'innovative',
    price: 14.99,
    description:
      'A viral street sensation — pizza served in a traditional clay kullad with melted cheese and Indian toppings.',
    image: 'https://picsum.photos/seed/kulladpizza/600/400',
    badge: 'new',
    spiceLevel: 2,
    isVegan: false,
  },
  {
    id: 'peri-peri-paneer-kullad',
    name: 'Peri Peri Paneer Kullad',
    category: 'innovative',
    price: 14.99,
    description:
      'Fiery peri-peri marinated paneer on a clay-pot pizza — bold, smoky, and absolutely addictive.',
    image: 'https://picsum.photos/seed/periperiku/600/400',
    badge: 'new',
    spiceLevel: 3,
    isVegan: false,
  },
  {
    id: 'veg-noodle-burger',
    name: 'Veg Noodle Burger',
    category: 'innovative',
    price: 9.99,
    description:
      'A crispy noodle patty burger with house slaw and secret sauce — crunchy, satisfying, and totally unique.',
    image: 'https://picsum.photos/seed/noodleburger/600/400',
    badge: 'must-try',
    spiceLevel: 1,
    isVegan: true,
  },
  {
    id: 'paneer-kaathi-roll',
    name: 'Paneer Kaathi Roll',
    category: 'innovative',
    price: 11.99,
    description:
      'Flame-kissed paneer tikka, crunchy onions, mint chutney, and house masala wrapped in a flaky parantha.',
    image: 'https://picsum.photos/seed/kaathiroll/600/400',
    badge: 'popular',
    spiceLevel: 2,
    isVegan: false,
  },
  {
    id: 'grilled-paneer-sandwich',
    name: 'Grilled Paneer Sandwich',
    category: 'innovative',
    price: 9.99,
    description:
      'Layers of marinated paneer, fresh veggies, and chutney in toasted bread — light, cheesy, and satisfying.',
    image: 'https://picsum.photos/seed/paneersandwich/600/400',
    spiceLevel: 1,
    isVegan: false,
  },
  {
    id: 'paneer-momos',
    name: 'Paneer Momos',
    category: 'innovative',
    price: 9.99,
    description:
      'Steamed Himalayan dumplings filled with spiced paneer and vegetables, served with fiery tomato-chilli dip.',
    image: 'https://picsum.photos/seed/paneermomo/600/400',
    badge: 'popular',
    spiceLevel: 2,
    isVegan: false,
  },

  // ── Desserts ─────────────────────────────────────────────────────────────
  {
    id: 'gourmet-cake',
    name: 'Gourmet Cake (Slice)',
    category: 'desserts',
    price: 8,
    description:
      'Artisan cakes crafted fresh daily with Indian-inspired flavours — from saffron and rose to dark chocolate cardamom.',
    image: 'https://picsum.photos/seed/gourmetcake/600/400',
    badge: 'new',
    isVegan: false,
  },
];
