import { WishlistItem } from '../types';

export const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'item-1',
    title: 'JACK REACHER / LEE CHILD',
    subtitle: 'Because apparently one more book won\'t hurt.',
    description: 'Paperback preferred for comfortable reading during quiet hours.',
    price: 'Approx. 30–60 zł • Paperback',
    category: 'Literature',
    iconName: 'BookOpen',
    isReserved: false
  },
  {
    id: 'item-2',
    title: 'GUITAR TUNER',
    subtitle: 'For pretending the guitar is the problem.',
    description: 'Keep the riffs in tune without disturbing the neighbours.',
    price: 'Approx. 30–100 zł',
    category: 'Music Gear',
    iconName: 'Music',
    isReserved: false
  },
  {
    id: 'item-3',
    title: 'EDC / POCKET KNIFE',
    subtitle: 'Daddy likes sharp things.',
    description: 'Opinel No. 8, Victorinox Swiss Army, or sleek EDC folder.',
    price: 'Approx. 50–150 zł',
    category: 'EDC & Utility',
    iconName: 'ShieldAlert',
    isReserved: false
  },
  {
    id: 'item-4',
    title: 'SHARPENING ACCESSORIES',
    subtitle: 'Because apparently knives need spa days.',
    description: 'Whetstone (1000/6000 grit), leather strop, or ceramic honing rod.',
    price: 'Approx. 30–150 zł',
    category: 'Craft & Maintenance',
    iconName: 'Sparkles',
    isReserved: false
  },
  {
    id: 'item-5',
    title: 'PUZZLE / BRAIN TEASER',
    subtitle: 'Something to make Daddy question his intelligence.',
    description: 'Cast metal Hanayama puzzle or mechanical wooden teaser.',
    price: 'Approx. 30–150 zł',
    category: 'Puzzles & Novelties',
    iconName: 'Puzzle',
    isReserved: false
  },
  {
    id: 'item-6',
    title: 'SOMETHING CHEEKY',
    subtitle: 'You know who you are.',
    description: 'Discreet novelty, cheeky intrigue. Surprise Daddy responsibly.',
    price: 'Approx. 30–150 zł • 100% Confidential',
    category: 'Adult Cheeky',
    iconName: 'Flame',
    isReserved: false
  },
  {
    id: 'item-7',
    title: 'BOOK — SURPRISE ME',
    subtitle: 'History, biography, philosophy, or darkly funny fiction.',
    description: 'Feed Daddy’s voracious curiosity with a thoughtful, unexpected read.',
    price: 'Approx. 30–100 zł',
    category: 'Literature',
    iconName: 'BookMarked',
    isReserved: false
  },
  {
    id: 'item-8',
    title: 'SURPRISE DADDY',
    subtitle: 'The dangerous option.',
    description: 'Whisky miniature, fine craft coffee, or something completely absurd.',
    price: 'Any amount',
    category: 'Wildcard',
    iconName: 'Gift',
    isReserved: false
  }
];
