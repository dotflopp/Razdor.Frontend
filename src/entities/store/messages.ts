import { defineStore } from 'pinia'
import { RestApiClient } from '../api/apiClient'
import type { Message } from '../models/chatModels'
import { FileApiClient } from '../api/fileApiClient'
import type { UserInfo } from '../models/userModels'
import { userStore } from './user'

const url: string = 'https://dotflopp.ru/api'
const api = new RestApiClient(url) 
const fileApi = new FileApiClient(url)

export const messageStore = defineStore('messages', {
  state: () => ({
    messages: [] as Message[],
    users: {} as Record<string, UserInfo | null>
  }),
  actions: {
    async fetchMessages(channelId: string) {
      try {
        this.messages = ((await api.getMessages(channelId, '100')).reverse())
      } catch (error) {
        console.error('Ошибка загрузки сообщений:', error)
      }
      const uStore = userStore()
      console.log(this.messages)
      const userIds = this.messages.map(m => m.userId)
      console.log(userIds)
      if (userIds.length === 0) return

      const userPromises = userIds.map(async id => {
        try {
          const user = await uStore.getUserWithId(id)
          this.users[id] = user
        } catch (error) {
          console.error(`Не удалось получить данные пользователя ${id}:`, error)
          this.users[id] = null
        }
      })

      await Promise.all(userPromises)
    },

    addMessage(message: Message) {
      this.messages.push(message)
    },
    async sendMessage(channelId: string, data: string) {
      return await fileApi.sendMessage(channelId, data)
    },
    setUserInfo(id: string, userInfo: UserInfo) {
      this.users[id] = userInfo
    },
    getUserInfo(id: string): UserInfo | null {
      return this.users[id] || null
    }
  },
  getters: {
    getMessages: state => state.messages,
    getUsers: state => state.users
  }
})