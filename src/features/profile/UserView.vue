<template>
  <div class="user-card">
    <!-- Левое меню -->
    <div class="settings-container">
      <aside class="settings-menu">
        <ul>
          <li v-for="(category, index) in categories" :key="index">
            <button
              :class="{ 'active': activeCategory === category }"
              @click="setActiveCategory(category)"
            >
              {{ category }}
            </button>
          </li>
        </ul>
      </aside>
    </div>
    <!-- Правая панель -->
    <div class="content-container">
      <main class="settings-content">
        <UserProfile v-if="activeCategory === 'Profile'" />
        <UserSettings v-else-if="activeCategory === 'Settings'" />
        <Logout v-else-if="activeCategory === 'Logout'"/>
      </main>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { userStore } from '@/entities/store/user'
import UserProfile from './UserProfile.vue'
import UserSettings from './UserSettings.vue'
import Logout from './Logout.vue'

const uStore = userStore()
const user = computed(() => (uStore.currentUser!))

const categories = ['Profile', 'Settings', 'Logout']
const activeCategory = ref(categories[0])

function setActiveCategory(category: string) {
  activeCategory.value = category
}

</script>

<style scoped>
.user-card {
  display: flex;
  gap:10px;
  min-height: 400px;
  min-width: 550px;
}
.settings-container {
  display: flex;
  height: 100%;
}
.content-container {
  width: 100%;
  background-color: #46484e;
  border-radius: 3px;
}
.settings-menu ul {
  height: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.settings-menu li button {
  border-radius: 3px;
  background-color: #36393f;
  width:200px;
  border:none;
  display: block;
  padding: 6px;
  text-align: left;
  color: #a9a9a9;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.settings-menu li button.active {
  background-color: #4b4e56;
  color: white;
}

.settings-content {
  flex: 1;
  padding: 16px;
}
</style>