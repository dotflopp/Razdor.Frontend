<template>
  <div class="accept-invite-page">
    <!-- Информация о сообществе -->
    <div v-if="invite" class="invite-card">
      <div class="community-info">
        <div class="community-avatar">
          <Avatar :avatar="invite.community.avatar!" :name="invite.community.name!"></Avatar>
        </div>
        <div class="community-text">
          <h2>{{ invite.community.name }}</h2>
          <p v-if="invite.community.description">{{ invite.community.description }}</p>
        </div>
      </div>
    
      <div class="info-row">
        <span>Creator</span>
        <span>{{ user?.nickname }}</span>
      </div>

      <div class="info-row">
        <span>Created</span>
        <span>{{ formattedCreatedAt }}</span>
      </div>

      <div class="info-row">
        <span>Expires</span>
        <span>{{ formattedExpiresAt }}</span>
      </div>

      <div class="info-row">
        <span>Uses count</span>
        <span>{{ invite.usesCount }}</span>
      </div>

      <button @click="acceptInvite">Join the community</button>
    </div>

    <!-- Ошибка -->
    <div v-else class="error-message">
      Failed to load invitation information 
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { communityStore } from '@/entities/store/community'
import { userStore } from '@/entities/store/user'
import type { InviteExtended } from '@/entities/models/communityModels'
import type { UserInfo } from '@/entities/models/userModels'
import Avatar from '@/features/avatar/Avatar.vue'
import { formattedTime } from '@/shared/utils/formatedTime'

const router = useRouter()
const commStore = communityStore()
const uStore = userStore()

const error = ref(false)
const invite = ref<InviteExtended | null> ()
const user = ref<UserInfo | null> (null) 

// Форматируем дату
const formattedCreatedAt = computed(() => {return formattedTime(invite.value!.createdAt!)})
const formattedExpiresAt = computed(() => {return formattedTime(invite.value!.expiresAt!)})

// Загружаем данные
onMounted(async () => {
  const pendingInviteId = commStore.pendingInviteId
  console.log(pendingInviteId)
  if (!pendingInviteId) {
    error.value = true
    return
  }
  try {
    await commStore.fetchInviteInfo(pendingInviteId)
    invite.value = commStore.getInvite
    console.log(invite.value)
    user.value = await uStore.getUserWithId(invite.value?.creatorId!)
  } 
  catch (err) {
    error.value = true
  } 
})

// Обработка принятия инвайта
async function acceptInvite() {
  try {
    await commStore.acceptInvite(invite.value!.id)
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
.community-info {
  height: 40px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 20px;
}
.community-avatar {
  width: 40px;
  height: 40px;
}
.community-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.invite-card {
  background-color: #36393f;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  text-align: left;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.invite-card h2 {
  font-size: 20px;
  margin: 8px 0 8px 0;
}

.invite-card p {
  font-size: 14px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
}

button {
  width: 100%;
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  margin-top: 16px;
}

button:hover {
  background-color: #4752c4;
}

.error-message {
  font-size: 16px;
  text-align: center;
}
</style>