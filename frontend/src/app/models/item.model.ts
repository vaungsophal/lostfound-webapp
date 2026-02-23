export interface Item {
  id?: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: string;
  date: Date;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactTelegram?: string;
  imageUrl?: string;
  status: 'open' | 'claimed' | 'closed';
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItemResponse {
  id?: string;
  title: string;
  description: string;
  type: string;
  category: string;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactTelegram?: string;
  imageUrl?: string;
  status: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
