export interface Role {
  id: string;
  priority: number;
  name: string;
  permissions: number; 
  isMentioned: boolean;
}

export interface Community {
  id: string;
  ownerId: string;
  name: string;
  avatar: string | null;
  description: string | null;
  defaultNotificationPolicy: 'All' | 'None' | 'Mentions'; 
  roles: Role[];
}

export interface Invite {
  id: string;
  creatorId: string;
  communityId: string;
  expiresAt: string | null; // Можно использовать Date, если нужно
  createdAt: string; // ISO 8601 формат даты и времени
  usesCount: number;
}