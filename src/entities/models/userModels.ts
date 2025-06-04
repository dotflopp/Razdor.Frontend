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

export type SelectedStatus = 'Online' | 'Invisible' | 'DoNotDisturb'

export interface UserInfo {
  id: string;
  identityName: string;
  nickname: string;
  avatar: string | null; 
  status: 'Online' | 'Offline' | 'DoNotDisturb'; // То же самое
  description: null | string; // Может быть null или строка
}