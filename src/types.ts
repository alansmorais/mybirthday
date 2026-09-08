export type RsvpStatus = 'YES' | 'MAYBE' | 'NO';

export interface RsvpSubmission {
  id: string;
  status: RsvpStatus;
  name: string;
  guestCount: number;
  message?: string;
  createdAt: string;
  checkedIn?: boolean;
}

export interface WishlistItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: string;
  category: string;
  iconName: string;
  isReserved: boolean;
  reservedAt?: string;
}

export interface AdminStats {
  totalRsvps: number;
  totalHeadcount: number;
  yesCount: number;
  yesHeadcount: number;
  maybeCount: number;
  noCount: number;
  reservedWishlistCount: number;
  totalWishlistCount: number;
}
