<template>
  <div class="sidebar-content" v-if="currentCommunity">
    <div class="current-communities">
      <div class="community-card">
        <div class="community-name">
          {{ currentCommunity.name }}
        </div>
        <button class="addPerson-btn" @click="showModal = true">
          <!-- <CreateIcon :fillColor="'white'" :size="'50%'"></CreateIcon> -->
          <PersonIcon class="addPerson" :fillColor="'white'"></PersonIcon>
        </button>
        <ModalWindow :show="showModal" title="Create Invitation" @close="showModal = false">
          <form @submit.prevent="createInvitation" class="invitation-form">
            <!-- Время жизни приглашения -->
            <input id="lifetime" v-model="lifetime" type="text" placeholder="Seconds" required />
            <p v-if="message" class="message">{{ message }}</p>
            <!-- Кнопка отправки -->
            <button type="submit" class="create-button">Create Invitation</button>
          </form>
        </ModalWindow>
      </div>
    </div>
    <div class="sidebar-channels">
      <ul class="channel-list">
        <li
          v-for="channel in channels" :key="channel.id"
          class="channel-item" :class="{ active: channel.id === activeChannelId }"
          @click="setActiveChannel(channel.id)"
        > 
          <div class="channel">
            <div class="channel-name">{{ channel.name }}</div>
            <button class="addChannel-btn-simple" @click = "showModalChannel = true, setCurrentChannel(channel.id)">
              <CreateIcon :fillColor="'white'" :size="'100%'"></CreateIcon>
            </button>
          </div>
          
        </li>
      </ul>

      <!-- Кнопка добавления канала -->
      <div class="add-channel-button">
        <button class="addChannel-btn" @click="showModalChannel = true">
          <p>create channel</p>
        </button>
      </div>
      <ModalWindow :show="showModalChannel" title="Create channel" @close="showModalChannel = false">
          <form @submit.prevent="createChannel" class="invitation-form">
            <!-- channelName-->
            <input id="channelName" v-model="channelName" type="text" placeholder="channel name" required />
            <div class="channel-type">
              <p>Channel type</p>
              <div class="status-section">
                <select v-model="channelType" class="channeltype-select">
                  <option value="TextChannel">TextChannel</option>
                  <option value="ForkChannel">ForkChannel</option>
                  <option value="VoiceChannel">VoiceChannel</option>
                  <option value="CategoryChannel">CategoryChannel</option>
                </select>
              </div>
            </div>
            <p v-if="messageChannel" class="message">{{ messageChannel }}</p>
            <!-- Кнопка отправки -->
            <button type="submit" class="create-button">Create Channel</button>
          </form>
        </ModalWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { communityStore } from '@/entities/store/community'
import ModalWindow from '@/features/modalWindow/ModalWindow.vue'

import { RestApiClient } from '@/entities/api/apiClient'
import PersonIcon from '@/shared/svg/PersonIcon.vue'
import type { ChannelType, NewChannel } from '@/entities/models/channelModels'
import CreateIcon from '@/shared/svg/CreateIcon.vue'

const api = new RestApiClient('https://dotflopp.ru/api') 
const commStore = communityStore()

const showModal = ref(false)
const lifetime = ref('')
const message = ref('')

const showModalChannel = ref(false)
const channelName = ref('')
const channelType = ref<ChannelType>('TextChannel')
const messageChannel = ref('')

const activeCommunityId = computed(() => commStore.activeCommunityId)
const currentChannel = ref('0')
// Текущее сообщество (по ID)
const currentCommunity = computed(() => {
  if (!activeCommunityId.value) return null
  return commStore.getCommunityById(activeCommunityId.value)
})

const channels = computed(() => commStore.channels)
const activeChannelId = computed(() => commStore.activeChannelId)

function setActiveChannel(id: string) {
  commStore.setActiveChannel(id)
}

async function createInvitation() {
  if (!lifetime.value.trim()) return

  try {
    const newInvitationId = await api.createInvitation(commStore.getactiveCommunityId! ,lifetime.value)
    const url = `https://dotflopp.ru/invite/${newInvitationId.id}`;
    await navigator.clipboard.writeText(url)
    message.value = 'Invitation copied to clipboard'
  } catch (error) {
    console.error('Ошибка при создании приглашения:', error)
    message.value = 'Не удалось создать приглашение.'
  }
}

async function createChannel() {
  if (!channelName.value.trim() || channelType.value.length == 0) return
  try {
    const newChannel: NewChannel = {
      name: channelName.value,
      type: channelType.value,
      parentId: currentChannel.value
    }
    const createdChannel = await api.createNewChannel(activeCommunityId.value!, newChannel)
    console.log(createdChannel)
    commStore.addChannel(createdChannel)
    messageChannel.value = 'Канал успешно создан!'
    currentChannel.value = '0'
  } catch (error) {
    console.error('Ошибка при создании канала:', error)
    messageChannel.value = 'Не удалось создать канал.'
  }
}
function setCurrentChannel(channelId: string) {
  currentChannel.value = channelId;
}

</script>
<style scoped>
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sidebar-content {
  height: 100%;
}
.sidebar-channels {
  height: 100%;
  display:flex;
  flex-direction: column;
  width:100%;
}

.channel-type {
  display:flex;
}

.channel-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.channel-item {
  display: flex;
  cursor: pointer;
  padding: 4px 8px;
  transition: background-color 0.2s ease;
}

.channel-item:hover,
.channel-item.active {
  background-color: #36393f;
  color:white
}

.channel-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: rgb(220, 220, 220);
  font-size: 14px;
}


.add-btn {
  height: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 20px;
  width: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  border-radius: 100px;
}

.add-btn:hover {
  background-color: #3a3d44;
  border-radius: 100px;
}

.channel-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.channel-form input {
  padding: 8px 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #40444b;
  color: white;
  outline: none;
}

.success-message {
  color: #43b581;
  font-size: 14px;
}

.create-button {
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.create-button:hover {
  background-color: #4752c4;
}

.current-communities {
  background-color: #282a2d;
  padding: 18px 12px;
}

.community-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  width: 100%;
}

.community-name {
  padding-left: 15px;
  color: white;
  font-size: 16px; /* Увеличенный размер шрифта */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.addPerson-btn {
  height: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 20px;
  display: flex;
  transition: background-color 0.2s ease;
  border-radius: 100px;
}
.addPerson {
  opacity: 0.5;
  transition: opacity 0.2s ease, fill 0.2s ease;
  fill: white;
}

/* При наведении */
.addPerson-btn:hover .addPerson {
  opacity: 1;
  fill: #5865f2; /* Можно поменять на любой другой цвет */
}

.invitation-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.invitation-form input {
  padding: 8px 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #40444b;
  color: white;
  outline: none;
}
.create-button {
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}
.channel {
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: rgb(217, 209, 209);
}
.channel-item:hover .addChannel-btn-simple {
  opacity: 1;
  pointer-events: auto;
}
.addChannel-btn-simple {
  background-color: transparent;
  border: none;
  height: 20px;
  width: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  
}
.addChannel-btn {
  padding: 4px 8px;
  background-color: transparent;
  border: none;
  color: white;
  
}

</style>