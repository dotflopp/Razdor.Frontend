import { defineStore } from 'pinia'
import type { SelectedStatus, User } from '../models/userModels'
import { RestApiClient } from '../api/apiClient'

const api = new RestApiClient('https://dotflopp.ru/api') 

export const userStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    token: localStorage.getItem('auth_token') || null
  }),
  actions: {
    async fetchCurrentUser() {
      if (!this.token) return
      try {
        this.user = await api.getCurrentUser()
      } catch (error) {
        throw error
      }
    },
    login() {
      this.isAuthenticated = true
    },
    logout() {
      this.isAuthenticated = false
    },
    setToken(token: string) {
      this.token = token
      // Сохраняем токен и пользователя в localStorage
      localStorage.setItem('auth_token', token)
    },
    setStatus(status: SelectedStatus) {
      this.user!.selectedStatus = status
    },
    async loadFromLocalStorage() {
      const token = localStorage.getItem('auth_token')
      if (token ) {
        try {
          this.isAuthenticated = true
          this.token = token
        } catch (error) {
          throw error
        }
      }
    }
  },
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => state.token,
    getStatus: (state) => state.user?.status
  }
  
})