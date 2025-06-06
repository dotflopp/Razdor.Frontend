export interface Message {
  id: string;
  userId: string;
  channelId: string;
  text: string | null;
  createdAt: string;
  reference: Reference | null;
  embed: Embed | null;
  isPinned: boolean;
  editedAt: string | null;
  attachments: Attachment[] | null;
  mentionedEveryone: boolean;
  mentionedUsers: MentionedUser[] | null;
  mentionedChannels: MentionedChannel[] | null;
  mentionedRoles: MentionedRole[] | null
}

export interface Reference {
  channelId: string;
  messageId: string;
}

export interface Embed {
  title: string | null;
  description: string | null;
  fields: EmbedField[];
  footer: EmbedFooter | null;
}

export interface EmbedField {
  isInline: boolean;
  title: string | null;
  description: string | null;
}

export interface EmbedFooter {
  imageUrl: string | null;
  title: string | null;
  timestamp: string | null; // ISO-8601
}
export interface Attachment {
  id: string;
  sourceUrl: string;
  mediaType: string;
  size: number;
}
export interface MentionedUser {
  userId: string;
}
export interface MentionedChannel {
  channelId: string;
}
export interface MentionedRole {
  roleId: string;
}