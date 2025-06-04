import { defineStore } from 'pinia'
import { RestApiClient } from '../api/apiClient'
import type { Community, InviteExtended } from '../models/communityModels'
import type { Channel } from '../models/channelModels'

const api = new RestApiClient('https://dotflopp.ru/api') 

export const communityStore = defineStore('community', {
  state: () => ({
    communities: null as Community[] | null,
    activeCommunityId: null as string | null,
    channels: null as Channel[] | null,
    activeChannelId: null as string | null,
    pendingInviteId: null as string | null
  }),
  actions: {
    setActiveCommunity(id: string) {
      this.activeCommunityId = id
    },
    setActiveChannel(id: string) {
      this.activeCommunityId = id
    },
    setPendingInvite(id: string) {
      this.pendingInviteId = id
    },
    addCommunity(community: Community) {
      this.communities?.push(community)
    },
    addChannel(channel: Channel) {
      this.channels?.push(channel)
    },
    getCommunityById(id: string): Community | undefined {
      return this.communities!.find((community) => community.id === id)
    },
    async fetchCommunities() {
      try {
        this.communities = await api.getUserCommunities()
      } catch (error) {
        console.error('Ошибка получения сообществ', error)
      }
    },
    async fetchChannels() {
      try {
        this.channels = await api.getChannels(this.activeCommunityId!)
      } catch (error) {
        console.error('Ошибка получения каналов', error)
      }
    },
    async acceptInvite(id: string): Promise<void> {
      try {
        // Логика принятия инвайта
        await api.acceptInvitation(id)
        this.pendingInviteId = null
      } catch (error) {
        console.error('Ошибка при принятии инвайта:', error)
      }
    },
    async getInviteInfo(inviteId: string): Promise<InviteExtended> {
      return await api.getInviteInformation(inviteId)
    } 
  },
  getters: {
    allCommunities: (state) => state.communities,
    communityById: (state) => (id: string) => state.communities?.find(c => c.id === id) || null,
    getactiveCommunityId : (state) => state.activeCommunityId,
  }
})