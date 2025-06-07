<template>
  <div class="file-preview-container" :class="{ 'is-vertical': isVertical }">
    <div v-for="(attachment, index) in files" :key="attachment.id" class="file-item">
      <!-- Если это изображение -->
      <div v-if="isImage(attachment)" class="image-wrapper">
        <img :src="'https://dotflopp.ru'+ attachment.sourceUrl" class="image-preview" />
      </div>

      <!-- Если это не изображение -->
      <div v-else class="file-icon">
        <span class="icon">📄</span>
      </div>

      <div class="filename">{{ attachment.id || 'Файл' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '@/entities/models/chatModels'
import { RestApiClient } from '@/entities/api/apiClient'
import { computed, onMounted } from 'vue';

onMounted(async ()=>{

  const file = await api.getFileAttachment('api/attachments/57052311402315776/57135294398332928/57135294440275968')
  
  console.log(file)
})

const api = new RestApiClient('https://dotflopp.ru/api')
const props = defineProps<{
  files: Attachment[]
  direction: 'horizontal' | 'vertical'
}>()


const isVertical = computed(() => props.direction === 'vertical')

function isImage(attachment: Attachment): boolean {
  return attachment.mediaType.startsWith('image/')
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

</style>