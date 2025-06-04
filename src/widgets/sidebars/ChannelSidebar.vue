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
          <span class="channel-name">{{ channel.name }}</span>
        </li>
      </ul>

      <!-- Кнопка добавления канала -->
      <div class="add-channel-button">
        <button class="add-btn" @click="showModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { communityStore } from '@/entities/store/community'
import ModalWindow from '@/features/modalWindow/ModalWindow.vue'

import { RestApiClient } from '@/entities/api/apiClient'
import PersonIcon from '@/shared/svg/PersonIcon.vue'

const api = new RestApiClient('https://dotflopp.ru/api') 
const commStore = communityStore()

const showModal = ref(false)
const lifetime = ref('')
const message = ref('')

const activeCommunityId = computed(() => commStore.activeCommunityId)
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
    //const params = new URLSearchParams({id: newInvitationId});

    const url = `http://localhost:5173/invite/${newInvitationId.id}`;
    await navigator.clipboard.writeText(url)
    message.value = 'Приглашение скопировано в буффер обмена '
  } catch (error) {
    console.error('Ошибка при создании приглашения:', error)
    message.value = 'Не удалось создать приглашение.'
  }
}

// async function createChannel() {
//   if (!name.value.trim()) return

//   try {
//     const newChannelData = NewChannel()
//     const newChannel = await api.createNewChannel(commStore.activeCommunityId!, name.value)
//     channelStore.addChannel(newChannel)
//     successMessage.value = 'Канал успешно создан!'
//   } catch (error) {
//     console.error('Ошибка при создании канала:', error)
//     successMessage.value = 'Не удалось создать канал.'
//   }
// }

</script>


<style scoped>
sidebar-content {
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
  width: 200px;
  border-bottom: 1px solid #444;
}

.channel-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.channel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  transition: background-color 0.2s ease;
}

.channel-item:hover,
.channel-item.active {
  background-color: #2f3136;
}

.channel-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: white;
  font-size: 14px;
}

.add-channel-button {
  display: flex;
  height: 40px;
  margin-top: 10px;
  justify-content: center;
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
  padding: 8px 12px;
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

</style>