<template>
  <div class="profile-widget">
    <AvatarWithStatus :avatar="avatar" :name="name" :status = "status">
    </AvatarWithStatus>
    <!-- Информация о пользователе -->
    <div class="profile-info">
      <div class="username">{{ name }}</div>
      <div class="user-tag">@{{ identityName }}</div>
    </div>

    <!-- Кнопка настроек -->
    <button class="settings-button" @click="showModal = true">
      <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      width="20" 
      height="20"
      class="settings-icon"
      >
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.5-.03-.62.19l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.5.03.62-.19l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
      </svg>
    </button>
    <!-- Настройки -->
    <ModalWindow :show="showModal" title="User Environment" @close="showModal = false">
      <UserProfile></UserProfile>  
    </ModalWindow>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { userStore } from '@/entities/store/user'
import ModalWindow from '@/features/modalWindow/ModalWindow.vue'
import UserProfile from './UserView.vue'
import AvatarWithStatus from '../avatar/AvatarWithStatus.vue'

const store = userStore()

const avatar = computed<string>(() => store.currentUser!.avatar!)
const name = computed<string>(() => store.currentUser!.nickname)
const identityName = computed<string>(() => store.currentUser!.identityName)
const status = computed<string>(() => store.currentUser!.selectedStatus)

const showModal = ref(false)
</script>

<style scoped>
.profile-widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 8px 16px;
  background-color: #282a2d;
}

/* Контейнер для аватара и индикатора */
.avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
}

/* Статус-индикатор */
.status-dot {
  position: absolute;
  bottom: 2px;
  right: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid #282a2d; /* фон под индикатором */
  box-sizing: border-box;
}

.status-dot.online {
  background-color: #43b581;
}

.status-dot.dnd {
  background-color: #f04747;
}

.status-dot.invisible {
  background-color: #5e646c;
}

.profile-info {
  padding-right:25px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.user-tag {
  color: #72767d;
  font-size: 12px;
}

.status-select {
  background-color: #2f3136;
  border: none;
  color: #72767d;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

.status-select:hover {
  background-color: #3a3d41;
}

/* Кнопка настроек */
.settings-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
}

/* По умолчанию скрываем SVG */
.settings-icon {
  opacity: 0.5;
  transition: opacity 0.2s ease, color 0.2s ease;
  color: #ffffff;
}

/* Показываем SVG и меняем цвет при наведении */
.settings-button:hover .settings-icon {
  opacity: 1;
  color: #ffffff; /* или любой другой цвет */
}
</style>