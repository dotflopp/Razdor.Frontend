import { defineStore } from 'pinia'
import { RestApiClient } from '../api/apiClient'
import type { Community } from '../models/communityModels'

const api = new RestApiClient('https://dotflopp.ru/api') 

export const communityStore = defineStore('community', {
  state: () => ({
    communities: null as Community[] | null,
    activeCommunityId: null as string | null,
  }),
  actions: {
    setCommunities(communities: Community[]) {
      this.communities = communities
    },
    setActiveCommunity(id: string) {
      this.activeCommunityId = id
    },
    addCommunity(community: Community) {
      this.communities?.push(community)
    },
    async fetchCommunities() {
      try {
        this.communities = await api.getUserCommunities()
      } catch (error) {
        console.error('Ошибка получения сообществ', error)
      }
    },
  },
  getters: {
    allCommunities: (state) => state.communities,
    communityById: (state) => (id: string) =>
      state.communities?.find(c => c.id === id) || null
  }
})