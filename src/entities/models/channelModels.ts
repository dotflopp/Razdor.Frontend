
export interface Channel {
  id: string; 
  communityId: string; 
  type: "TextChannel" | "ForkChannel" | "VoiceChannel" | "CategoryChannel";
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
  type:"TextChannel" | "ForkChannel" | "VoiceChannel" | "CategoryChannel";
  parentId: string;
}

export interface ConnectionToken {
  token: string;
}




