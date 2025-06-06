export type SelectedStatus = 'Online' | 'Invisible' | 'DoNotDisturb'
export interface User {
  id: string;
  email: string;
  identityName: string;
  nickname: string;
  avatar: string | null; 
  credentialsChangeDate: string; 
  selectedStatus: SelectedStatus; 
  status: 'Online' | 'Offline' | 'DoNotDisturb'; 
  description: null | string; 
}

export interface UserInfo {
  id: string;
  identityName: string;
  nickname: string;
  avatar: string | null; 
  status: 'Online' | 'Offline' | 'DoNotDisturb'; // То же самое
  description: null | string; // Может быть null или строка
}


export interface VoiceState {
  channelId: number;
  isDeafened: boolean;
  isMuted: boolean;
  isSelfDeafened: boolean;
  isSelfMuted: boolean;
}

export interface UserInCommunity {
  userId: string;
  communityId: string;
  identityName: string;
  status: SelectedStatus; 
  nickname: string;
  avatar: string | null;
  joiningDate: string;
  voiceState: VoiceState;
  roleIds: string[];
}
