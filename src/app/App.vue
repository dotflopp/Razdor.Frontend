<script setup lang="ts">
import { userStore } from '@/entities/store/user';
import { communityStore } from '@/entities/store/community';
import AnimatedRouterView from '@/shared/ui/animated-router-view/AnimatedRouterView.vue';
import { onMounted } from 'vue';
import router from './router';

const store = userStore()
const commStore = communityStore()
onMounted(async () => {
  try {
    await store.loadFromLocalStorage()
  } catch (error) {
    console.error('Ошибка авторизации:', error)
    // Редирект на страницу входа
    router.push('/login')
    
  }
})
</script>

<template>
  <div id="app">
    <AnimatedRouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
}
html {
  background-color: #23272a;
  color: white;
}

</style>
