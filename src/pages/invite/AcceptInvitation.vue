<template>
  <div class="accept-invite-page">
    <!-- Лоадер -->
    <div v-if="loading" class="loader-container">
      <svg class="loader" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
      </svg>
      <p>Загрузка информации...</p>
    </div>

    <!-- Информация о сообществе -->
    <div v-else-if="invite" class="invite-card">
      <!-- Аватар сообщества -->
      <Avatar :avatar="invite.community.avatar!" :name="invite.community.name!"></Avatar>
      <h2>{{ invite.community.name }}</h2>
      <p v-if="invite.community.description">{{ invite.community.description }}</p>

      <div class="info-row">
        <span>Создатель:</span>
        <span>{{ invite.creatorId }}</span>
      </div>

      <div class="info-row">
        <span>Создано:</span>
        <span>{{ formattedCreatedAt }}</span>
      </div>

      <div class="info-row">
        <span>Использований:</span>
        <span>{{ invite.usesCount }}</span>
      </div>

      <button @click="acceptInvite">Вступить в сообщество</button>
    </div>

    <!-- Ошибка -->
    <div v-else class="error-message">
      Не удалось загрузить информацию о приглашении.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityStore } from '@/entities/store/community'
import { userStore } from '@/entities/store/user'
import type { InviteExtended } from '@/entities/models/communityModels'
import Avatar from '@/features/avatar/Avatar.vue'

const router = useRouter()
const route = useRoute()
const commStore = communityStore()
const uStore = userStore()

const loading = ref(true)
const error = ref(false)
const invite = ref<InviteExtended | null>(null)

// Загружаем данные
onMounted(async () => {
  const pendingInviteId = commStore.pendingInviteId

  if (!pendingInviteId) {
    error.value = true
    loading.value = false
    return
  }

  try {
    const fetchedInvite = await getInviteInformation(pendingInviteId)
    invite.value = fetchedInvite
  } catch (err) {
    console.error('Ошибка получения данных приглашения:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})

// Форматируем дату
const formattedCreatedAt = computed(() => {
  if (!invite.value?.createdAt) return ''
  const date = new Date(invite.value.createdAt)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Пример функции получения данных — замени на свою реализацию
async function getInviteInformation(inviteId: string): Promise<InviteExtended> {
  // Здесь должна быть твоя логика API-запроса
  return commStore.getInviteInfo(inviteId)
}

// Обработка принятия инвайта
async function acceptInvite() {
  if (!invite.value) return

  try {
    await commStore.acceptInvite(invite.value.id)
    router.push('/main') // или любая другая страница после успешного вступления
  } catch (err) {
    alert('Не удалось принять приглашение')
    console.error(err)
  }
}
</script>

<style scoped>
.accept-invite-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2f3136;
  padding: 20px;
}

.loader-container {
  text-align: center;
  color: white;
}

.loader {
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.invite-card {
  background-color: #36393f;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  text-align: left;
  color: white;
}

.community-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.community-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #a9a9a9;
}

button {
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #4752c4;
}

.error-message {
  color: red;
  font-size: 16px;
  text-align: center;
}
</style>