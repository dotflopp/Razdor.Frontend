import type { AuthResponse, LoginRequest, RegisterRequest } from "../models/authModels";
import type { Channel, ConnectionToken, NewChannel } from "../models/channelModels";
import type { Message } from "../models/chatModels";
import type { Community, Invite, InviteExtended } from "../models/communityModels";
import type { User, UserInCommunity, UserInfo } from "../models/userModels";
import {userStore} from '@/entities/store/user'

interface RequestInitWithParams extends RequestInit {
  params?: Record<string, any>;
}

export class RestApiClient {
  private connectionUrl: String

  constructor(connectionUrl: string){
    this.connectionUrl = connectionUrl
  }

  private getAuthHeader() {
    const user = userStore()
    return {
      'Authorization': `Bearer ${user.token}`
    }
  }
  
  async request<T>(method: string, endpoint: string, needToken: boolean, options?: RequestInitWithParams): Promise<T> {
    const url = new URL(`${this.connectionUrl}${endpoint}`)
    var headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    if(needToken) {
      const authHeader = this.getAuthHeader()
      headers = {
        ...headers,
        ...authHeader
      }
    }
    const request: RequestInit= {
      ...options,
      method,
      headers
    }
    const response = await fetch(url, request);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'API Error');
    }
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    } 
    return {} as T;
  }

  //аунтефикация
  async login(data: LoginRequest): Promise<AuthResponse> {
    return await this.request<AuthResponse>('POST','/auth/login', false, {
      body: JSON.stringify(data)
    })
  }
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return await this.request<AuthResponse>('POST','/auth/signup', false, {
      body: JSON.stringify(data)
    });
  }

  //работа с пользователем 
  async getCurrentUser(): Promise<User> {
    return await this.request<User>('GET','/users/@me', true);
  }

  async getUserWithId(id: string): Promise<UserInfo> {
    return await this.request<UserInfo>('GET',`/users/${id}`, true);
  }

  async setUserStatus(status: string): Promise<void> {
    await this.request<void>('PUT',`/users/@me/status`, true, {
      body: JSON.stringify({'status': status})
    });
  }

  //Приглашения
  async acceptInvitation(inviteId: string): Promise<void> {
    await this.request<void>('POST',`/invites/${inviteId}`, true );
  }
  async createInvitation(communityId: string, lifeTime: string): Promise<InviteExtended> {
    return await this.request<InviteExtended>('POST',`/communities/${communityId}/invites`, true, {
      body: JSON.stringify({'lifeTime': lifeTime })
    });
  } 
  async getInviteInformation(inviteId: string): Promise<InviteExtended> { 
    return await this.request<InviteExtended>('GET', `/invites/${inviteId}`, true)
  } 

  //Сообщества
  async getUserCommunities(): Promise<Community[]> {
    return await this.request<Community[]>('GET',`/communities/@my`, true );
  }

  async getCurrentCommunity(communityId: string): Promise<Community> {
    return await this.request<Community>('GET',`/communities/${communityId}`, true );
  }

  async createNewCommunities(CommunityName: string): Promise<Community> {
    return await this.request<Community>('POST',`/communities`, true, {
      body: JSON.stringify({'name': CommunityName })
    });
  }

  //Члены сообщества 
  async getCommunityMembers(communityId: string, lastUserId: string, usersCount: string): Promise<UserInCommunity[]> {
    return await this.request<UserInCommunity[]>('GET',`/communities/${communityId}/members`, true, {
      params: {
        lastUserId,
        usersCount
      }
    })
  };
  
  async getCommunityMember(communityId: string, userId: string): Promise<UserInCommunity> {
    return await this.request<UserInCommunity>('GET',`/communities/${communityId}/members/${userId}`, true);
  }

  async addRoleToMember(communityId: string, userId: string, roleId: string): Promise<void> {
    return await this.request<void>('PATCH',`/communities/${communityId}/members/${userId}/roles/${roleId}`, true, {});
  }
  
  //Каналы
  async getChannels(communityId: string): Promise<Channel[]> {
    return await this.request<Channel[]>('GET',`/communities/${communityId}/channels`, true );
  }

  async createNewChannel(communityId: string, data: NewChannel): Promise<Channel> {
    return await this.request<Channel>('POST',`/communities/${communityId}/channels`, true, {
      body: JSON.stringify(data)
    });
  }
  //получение списка сообщений 
  async getMessages(channelId: string,  messagesCount: string): Promise<Message[]> {
    return await this.request<Message[]>('GET',`/channels/${channelId}/messages`, true, {
      params: {
        messagesCount
      }
    });
  }
  // /api/attachments/57052311402315776/57135294398332928/57135294440275968
  async getFileAttachment(url: string): Promise<File> {
  const user = userStore()
  const fullUrl = `https://dotflopp.ru${url}?access-token=${user.token}`;
  const response = await fetch(fullUrl, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить файл');
  }

  // Получаем содержимое файла
  const blob = await response.blob();

  // Получаем имя файла из Content-Disposition
  const disposition = response.headers.get('Content-Disposition');
  let filename = 'unknown-file';

  if (disposition && disposition.indexOf('filename=') !== -1) {
    const matches = /filename="?([^"]+)"?;?/g.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1];
    }
  }

  // Удаляем расширение, если оно дублируется в filename*
  // Это можно убрать, если тебе нужна только первая часть
  const encodedMatches = /filename\*=UTF-8''([\w.%-]+)/g.exec(disposition || '');
  if (encodedMatches && encodedMatches[1]) {
    try {
      filename = decodeURIComponent(encodedMatches[1]);
    } catch {
      // fallback to original filename
    }
  }

  return new File([blob], filename, { type: blob.type });
}

  //Соединение
  async connectionToVoiceChannel(communityId: string, lifeTime: string): Promise<ConnectionToken> {
    return await this.request<ConnectionToken>('POST',`/communities/${communityId}/connect`, true);
  }
  
}