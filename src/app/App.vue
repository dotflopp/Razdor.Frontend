<script setup lang="ts">
import { userStore } from '@/entities/store/user';
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import router from './router';



onMounted(async () => {
  const store = userStore()
  try {
    await store.loadFromLocalStorage()
  } catch (error) {
    console.error('Ошибка загрузки локальных данных:', error)
    // Редирект на страницу входа
    router.push('/login')
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#button {
  background-color: transparent !important;
  border:none !important;
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
