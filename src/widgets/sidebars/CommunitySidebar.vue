<template>
  <div class="sidebar-communities">
    <ul class="community-list">
      <li
        v-for="community in communities" :key="community.id"
        class="community-item" :class="{ active: community.id === activeCommunityId }"
        @click="setActiveCommunity(community.id)"
      >
        <div class="community-avatar">
          <Avatar :name= "community.name" :avatar = "community.avatar!"/>
        </div>
      </li>
    </ul>
    <!-- Кнопка добавления сообщества -->
    <div class="add-community-button">
      <button class="add-btn" @click="showModal = true">
        <CreateIcon :fillColor="'white'" :size="'70%'"></CreateIcon>
      </button>
      <ModalWindow :show="showModal" title="Creating Community" @close="showModal = false">
        <form @submit.prevent="createCommunity" class="community-form">
            <input id="community-name" v-model="name" type="text" placeholder="community name" required />
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            <button type="submit" class="create-button">Create</button>
        </form>
      </ModalWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { communityStore } from '@/entities/store/community'
import Avatar from '@/features/avatar/Avatar.vue'
import ModalWindow from '@/features/modalWindow/ModalWindow.vue'
import { RestApiClient } from '@/entities/api/apiClient'
import CreateIcon from '@/shared/svg/CreateIcon.vue'

const api = new RestApiClient('https://dotflopp.ru/api')
const commStore = communityStore()

const showModal = ref(false)
const name = ref('')
const successMessage = ref('')

const communities = computed(() => commStore.communities)
const activeCommunityId = computed(() => commStore.activeCommunityId)

function setActiveCommunity(id: string) {
  commStore.setActiveCommunity(id)
}
async function createCommunity() {
  if (!name.value.trim()) return

  try {
    const newCommunity = await api.createNewCommunities(name.value)
    commStore.addCommunity(newCommunity)
    successMessage.value = 'Сообщество успешно создано!'
  } catch (error) {
    console.error('Ошибка при создании сообщества:', error)
    successMessage.value = 'Не удалось создать сообщество.'
  }
}
</script>

<style scoped>
.community-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.community-form input {
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

.sidebar-communities {
  width:60px;
  background-color: var(--bg-sidebar);
  border-bottom: 1px solid #444;
}

.community-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 60px;
}

.community-item {
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  transition: background-color 0.2s ease;
}

.community-item:hover,
.community-item.active {
  background-color: var(--bg-sidebar-hover);
}

.community-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.community-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.initials {
  font-weight: bold;
  color: white;
}
.add-community-button {
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
  background-color: var(--bg-sidebar-hover);
  border-radius: 100px;
}
</style>