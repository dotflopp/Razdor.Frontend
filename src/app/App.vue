<template>
  <div id="app" :data-theme="theme">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/entities/store/user';
import { RouterView } from 'vue-router'
import { onMounted, provide, ref } from 'vue';
import router from './router';
import '@/shared/ui/style/global.css'

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

const theme = ref('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

// Загрузка сохранённой темы из localStorage
if (localStorage.getItem('theme')) {
  theme.value = localStorage.getItem('theme')!
} else {
  localStorage.setItem('theme', 'dark')
}

provide('toggleTheme', toggleTheme)
provide('theme', theme)
defineExpose({ toggleTheme })
</script>

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
  color: var(--text-color);
}
h2 {
  color: var(--text-color);
}

</style>
