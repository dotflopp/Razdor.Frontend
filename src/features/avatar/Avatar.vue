<template>
    <!-- Аватар -->
    <div class="avatar-container">
      <img v-if="info.avatar" :src="info.avatar" alt="User Avatar" class="avatar-image" />
      <div v-else class="avatar-initials" :style="{ backgroundColor: avatarColor }">
        {{ initials }}
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AvatarInfo } from './model/avatarInfo';

// Пользователь из props
const props = defineProps<{
  info: AvatarInfo
}>()


// Функция для генерации инициалов
function generateInitials(name: string): string {
  if (name.length === 0) return ''
  
  const firstLetter = name[0] || ''
  const secondLetter = name[1] || ''

  return (firstLetter + secondLetter).toUpperCase()
}

// Функция для цвета аватара
function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    '#5865F2', 
    '#7289DA',
    '#42B983',
    '#E74C3C',
    '#E67E22',
    '#9B59B6',
    '#1ABC9C',
    '#3498DB'
  ]

  return colors[Math.abs(hash % colors.length)]
}

// Вычисляемые свойства
const initials = computed(() => generateInitials(props.info.name))
const avatarColor = computed(() => getAvatarColor(props.info.name))
</script>

<style scoped>


.avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background-color: #5865f2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
}

.user-info p {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.7;
}
</style>