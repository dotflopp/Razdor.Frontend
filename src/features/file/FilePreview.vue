<template>
  <div class="file-preview-container" :class="{ 'is-vertical': isVertical }">
    <div v-for="(file, index) in files" :key="index" class="file-item">
      <!-- Если это изображение -->
      <div v-if="isImage(file)" class="image-wrapper">
        <img :src="previewUrl(file)" class="image-preview" />
      </div>
      <!-- Если это не изображение -->
      <div v-else class="file-icon">
        <span class="icon">📄</span>
      </div>

      <div class="filename">{{ file.name }}</div>
      <button v-if="needCloseButton" class="delete-button" @click="onDelete(index)">
        <DeleteIcon class="delete-icon":fill-color="'white'" :size="'50%'"></DeleteIcon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DeleteIcon from '@/shared/svg/DeleteIcon.vue';
import { ref, computed } from 'vue'

const props = defineProps<{
  files: File[]
  direction: 'horizontal' | 'vertical'
  needCloseButton: boolean
}>()
const emit = defineEmits<{ 
  (e: 'delete', index: number): void
}>()

const isVertical = computed(() => props.direction === 'vertical')

function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

function previewUrl(file: File): string {
  return URL.createObjectURL(file)
}
// Удаление файла по индексу
function onDelete(index: number) {
  emit('delete', index)
}
</script>

<style scoped>
.file-preview-container {
  display: flex;
  gap: 10px;
  max-width: 80%;
  word-break: break-word;
  padding: 5px 10px;
  border-radius: 10px;
  align-self: center;
  flex-wrap: wrap;
}

.is-vertical {
  flex-direction: column;
}

.file-item {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.image-wrapper {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-label {
  font-size: 12px;
  color: white;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.file-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.icon {
  line-height: 1.6;
  font-size: 100px;
}

.filename {
  color:#b9bbbe;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.delete-button {
  position: absolute;
  top: 3px;
  right: 3px;
  border: none;
  border-radius: 4px;
  background-color: #33363a;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  opacity: 0.5;
}
.delete-icon {
 opacity: 0.8 ;
}
.delete-button:hover .delete-icon{
  opacity: 1 ;
}

</style>