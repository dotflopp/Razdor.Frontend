<template>
  <button @click="toggleTheme" class="theme-toggle">
    {{ theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme' }}
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue'

// Указываем типы
type ToggleTheme = (event: MouseEvent) => void

const theme = inject('theme')
const toggleTheme = inject<ToggleTheme>('toggleTheme')

</script>

<style scoped>

</style>