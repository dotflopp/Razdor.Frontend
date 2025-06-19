import { defineStore } from 'pinia'
import { RestApiClient } from '../api/apiClient'
import type { Community, InviteExtended } from '../models/communityModels'
import type { Channel } from '../models/channelModels'
import type { User, UserInCommunity } from '../models/userModels'
import { messageStore } from './messages'


const api = new RestApiClient('https://dotflopp.ru/api') 

export const communityStore = defineStore('community', {
  state: () => ({
    communities: null as Community[] | null,
    activeCommunityId: localStorage.getItem('activeCommunity')  || null,
    channels: null as Channel[] | null,
    channelsLevelsMap: null as Map<number, Channel> | null,
    activeChannelId: localStorage.getItem('activeChannel') as string | null,
    pendingInviteId: null as string | null,
    invite: null as InviteExtended | null,
    communityMembers: null as UserInCommunity[] | null
  }),
  actions: {
    setCommunityMember(communityMembers: UserInCommunity[]) {
      this.communityMembers = communityMembers
    },
    setActiveCommunity(id: string) {
      this.activeCommunityId = id
      localStorage.setItem('activeCommunity', id)
      this.fetchChannels()
      this.fetchCommunityMembers()
      this.setActiveChannel(null)
    },
    async loadActiveCommunity() {
      const id = localStorage.getItem('activeCommunity')
      
      if(this.communities!.length == 0 || id == null ) return
      this.communities!.forEach((community) => {
        if(community.id == id) {
          this.activeCommunityId = id
          this.fetchChannels()
          return
        } 
      })
    },
    setActiveChannel(id: string | null) {
      const mStore = messageStore()
      this.activeChannelId = id
      if(id != null) {
        localStorage.setItem('activeChannel', id) 
        mStore.fetchMessages(this.activeChannelId!)
      }
      else {
        mStore.messages = []
      }
    },
    setPendingInvite(id: string) {
      this.pendingInviteId = id
    },
    setInvite(invite: InviteExtended) {
      this.invite = invite
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
        await this.fetchCommunityMembers()
        await this.loadActiveCommunity()
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
    async fetchCommunityMembers() {
      try {
        this.communityMembers = await api.getCommunityMembers(this.activeCommunityId!, '0', '100')
      } 
      catch (error) {
        console.log('Ошибка запроса членов сообщества', error)
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
    async fetchInviteInfo(inviteId: string): Promise<void> {
      this.invite = await api.getInviteInformation(inviteId)
      console.log(this.invite)
    }
  },
  getters: {
    allCommunities: (state) => state.communities,
    communityById: (state) => (id: string) => state.communities?.find(c => c.id === id) || null,
    getActiveCommunityId : (state) => state.activeCommunityId,
    getActiveChannel: (state) => state.activeChannelId,
    getCommunityMembers: state => state.communityMembers,
    getInviteID: state => state.pendingInviteId,
    getInvite: state => state.invite
  }
})