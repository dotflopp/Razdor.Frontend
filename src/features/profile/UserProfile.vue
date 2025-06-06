<template>
  <div class="user-profile-top">
    <!-- Верхняя часть (Аватар + Имена) -->
    <div class="user-info-top">
      <div class="avatar">
        <AvatarWithStatus :avatar="user.avatar!" :name="user.identityName" :status="user.selectedStatus"/>
      </div>
      <div class="user-names">
        <h2>{{ user.nickname }} @{{ user.identityName }}</h2>
        <!-- Статус -->
        <div class="status-section">
          <select v-model="selectedStatus" @change="updateUserStatus()" class="status-select">
            <option value="Online">Online</option>
            <option value="DoNotDisturb">Don't disturb</option>
            <option value="Invisible">Invisible</option>
          </select>
        </div>
      </div>
      
    </div>
    

    <!-- Нижняя часть (Дополнительная информация) -->
    <div class="user-info">
      <p><strong>Last change:</strong> {{ formattedTime(user.credentialsChangeDate) }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p v-if="user.description"><strong>About</strong> {{ user.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { userStore } from '@/entities/store/user';
import AvatarWithStatus from '../avatar/AvatarWithStatus.vue';
import { formattedTime } from '@/shared/utils/formatedTime';

const uStore = userStore()
const user = computed(() => (uStore.currentUser!))

const selectedStatus = ref(uStore.currentUser!.selectedStatus)

function updateUserStatus() {
  if (selectedStatus.value) {
    uStore.setStatus(selectedStatus.value)
  }
}
</script>
<style scoped>

.avatar {
  height: 50px;
  width: 50px;
}
.user-profile-top {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info-top {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-names {
  display: flex;
  flex-direction: column;
}
.user-names h2 {
  
  margin: 0;
  font-size: 16px;
  color: white;
  font-weight: bold;
}

.user-names p {
  margin: 4px 0 0 0;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-info p {
  font-size: 14px;
  color: #d9d6d6;
  word-wrap: break-word;
}
.status-section {
  align-items: center;
}

.status-select {
  border: none;
  background-color: #46484e;
  color: white;
  font-size: 14px;
}
.status-select:focus {
  outline: none;
  box-shadow: none;
}
</style>
