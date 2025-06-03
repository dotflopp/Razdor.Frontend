import type { AuthResponse, LoginRequest, RegisterRequest } from "../models/authModels";
import type { Channel, ConnectionToken, NewChannel } from "../models/channelModels";
import type { Community, Invite } from "../models/communityModels";
import type { User, UserInfo } from "../models/userModels";
import {userStore} from '@/entities/store/user'

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
  
  async request<T>(method: string, endpoint: string, needToken: boolean, options?: RequestInit): Promise<T> {
    const url = `${this.connectionUrl}${endpoint}`
    var headers: HeadersInit = {
      'Content-Type': 'application/json'
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
    return await response.json();
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
    await this.request<UserInfo>('PUT',`/users/@me/status`, true, {
      body: JSON.stringify({'status': status})
    });
  }

  //Сообщества
  async acceptInvitation(inviteId: string): Promise<void> {
    await this.request<void>('POST',`/invites/${inviteId}`, true );
  }

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

  async getCommunityChannel(communityId: string): Promise<Community> {
    return await this.request<Community>('GET',`communities/${communityId}/channels/${communityId}`, true );
  }

  async createNewChannel(communityId: string, data: NewChannel): Promise<Channel> {
    return await this.request<Channel>('POST',`/communities/${communityId}/channels`, true, {
      body: JSON.stringify(data)
    });
  }

  async createInvitation(communityId: string, lifeTime: string): Promise<Invite> {
    return await this.request<Invite>('POST',`/communities/${communityId}/channels`, true, {
      body: JSON.stringify({'lifeTime': lifeTime })
    });
  } 

  async connectionToVoiceChannel(communityId: string, lifeTime: string): Promise<ConnectionToken> {
    return await this.request<ConnectionToken>('POST',`/communities/${communityId}/connect`, true, );
  }
}