export type ChannelType = "TextChannel" | "ForkChannel" | "VoiceChannel" | "CategoryChannel"

export interface Channel {
  id: string; 
  communityId: string; 
  type: ChannelType;
  parentId: string; 
  name: string;
  isSyncing: boolean;
  overwrites: PermissionOverwrite[];
}

export interface PermissionOverwrite {
  targetId: string; 
  targetType: 'User' | 'Role';
  permissions: {
    allow: number;
    deny: number;
  };
}

export interface NewChannel{
  name: string,
  type: ChannelType;
  parentId: string;
}

export interface ConnectionToken {
  token: string;
}





