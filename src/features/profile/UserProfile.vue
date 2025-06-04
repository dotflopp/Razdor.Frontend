<template>
  <div class="user-card">
    <!-- Аватар -->

    <!-- Основная информация -->
    <div class="user-info">
      <div class="username">{{ nickname }}</div>
      <div class="user-tag">@{{ tag }}</div>
      <div class="user-status"> {{ statusMessage }}</div>
    </div>

    <!-- Дополнительная информация -->
    <div class="additional-info">
      <div><strong>Город:</strong> {{ city }}</div>
      <div><strong>Дата регистрации:</strong> {{ formattedDate }}</div>
      <div><strong>Статус:</strong> {{ bio }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Avatar from '@/features/avatar/Avatar.vue'

// Пример данных пользователя
const nickname = 'User123'
const tag = '1234'
const city = 'Москва'
const bio = 'Люблю программирование и кофе'
const registrationDate = new Date('2020-05-15')

// Форматируем дату
const formattedDate = computed(() => {
  return registrationDate.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Статусы
type UserStatus = 'Online' | 'Invisible' | 'DoNotDisturb'
const selectedStatus = ref<UserStatus>('Online')

const statusMessage = computed(() => {
  switch (selectedStatus.value) {
    case 'Online':
      return 'В сети'
    case 'DoNotDisturb':
      return 'Не беспокоить'
    case 'Invisible':
      return 'Оффлайн'
  }
})


</script>

<style scoped>
.user-card {
  display: flex;
  align-items: start;
  gap: 20px;
  padding: 20px;
  background-color: #2f3136;
  border-radius: 10px;
  position: relative;
}



.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.user-tag {
  font-size: 14px;
  color: #72767d;
  margin-top: 4px;
}

.user-status {
  font-size: 14px;
  color: #72767d;
  margin-top: 4px;
}

.additional-info {
  flex: 1;
  font-size: 14px;
  color: #a9a9a9;
  line-height: 1.5;
}

.settings-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.settings-button:hover {
  background-color: #3a3d41;
}

.settings-button svg {
  color: #72767d;
}
</style>