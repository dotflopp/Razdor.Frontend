import { defineStore } from 'pinia'
import { RestApiClient } from '../api/apiClient'
import type { Message } from '../models/chatModels'
import { FileApiClient } from '../api/fileApiClient'

const url: string = 'https://dotflopp.ru/api'
const api = new RestApiClient(url) 
const fileApi = new FileApiClient(url)

export const messageStore = defineStore('messages', {
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
      async fetchMessages(channelId: string) {
        try {
          this.messages = ((await api.getMessages(channelId, '100')).reverse())
        } catch (error) {
          console.error('Ошибка загрузки сообщений:', error)
        }
      },
    addMessage(message: Message) {
      this.messages.push(message)
    },
    async sendMessage(channelId: string, data: string) {
      return await fileApi.sendMessage(channelId, data)
    }
  },
  getters: {
    getMessages: state => state.messages
  }
})