<template>
  <p><strong>Do you want to log out of your account?</strong></p>
  <!-- Выйти из аккаунта -->
  <div>
    <div class="logout-section">
      <button class="logout-button" @click="logout()">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/entities/store/user';
import router from '@/app/router';
const uStore = userStore()

function logout() {
  uStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.logout-section {
  margin-top: 40px;
  align-items: center;
}

.logout-button {
  background-color: #d0021b;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #a20012;
}
</style>
