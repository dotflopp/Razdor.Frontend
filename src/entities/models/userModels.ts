export interface User {
  id: string;
  email: string;
  identityName: string;
  nickname: string;
  avatar: string | null; 
  credentialsChangeDate: string; 
  selectedStatus: 'Online' | 'Invisible' | 'DoNotDisturb'; 
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