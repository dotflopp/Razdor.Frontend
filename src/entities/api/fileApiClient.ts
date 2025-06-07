import {userStore} from '@/entities/store/user'
import type { Message } from '../models/chatModels'

export class FileApiClient {
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

  async request<T>( method: string, endpoint: string, needToken: boolean, files?: File[] | null, data?: Record<string, any>): Promise<T> {
    const url = `${this.connectionUrl}${endpoint}`;
    const formData = new FormData();
    // Добавляем дополнительные данные
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }

    // Добавляем файлы
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`file`, files[i]); 
      }
    }

    // Настраиваем headers
    let headers: HeadersInit = {};

    if (needToken) {
      const authHeader = this.getAuthHeader();
      headers = { ...headers, ...authHeader };
    }

    const request: RequestInit = {
      method,
      body: formData, 
      headers: {
        ...headers,
      },
    };

    try {
      const response = await fetch(url, request);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API Error');
      }

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        return await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        return {} as T;
      }
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async uploadUserAvatar(file: File) {
    await this.request<void>("POST", "/users/@me/avatar", true, Array(file));
  }

  async uploadCommunityAvatar(communityId: string, file: File) {
    await this.request<void>("POST", `/communities/${communityId}/avatar`, true, Array(file));
  }

  async sendMessage(channelId: string, data: string, files?: File[] ):Promise<Message> {
    return await this.request<Message>("POST", `/channels/${channelId}/messages`, true, files, {text: JSON.stringify({ "text": data})})
  }
}