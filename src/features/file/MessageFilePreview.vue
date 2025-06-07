<template>
  <div class="file-preview-container" :class="{ 'is-vertical': isVertical }">
    <div v-for="(file, index) in filePreviews" :key="file.id" class="file-item">
      <!-- Если это изображение -->
      <div v-if="isImage(file)" class="image-wrapper">
        <img :src="file.previewUrl!" class="image-preview" />
      </div>

      <!-- Если это не изображение -->
      <div v-else class="file-icon">
        <span class="icon">📄</span>
      </div>

      <div class="filename">{{ file.name }}</div>
      <button class="download-button" @click="onDownload(index)">
          <Download class="download-icon":fill-color="'white'" :size="'60%'"></Download>
      </button>
      <!-- <PhotoWindow
        :show=""
      >
      </PhotoWindow> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '@/entities/models/chatModels'
import { RestApiClient } from '@/entities/api/apiClient'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Download from '@/shared/svg/Download.vue';
import PhotoWindow from '../modalWindow/PhotoWindow.vue';

const api = new RestApiClient('https://dotflopp.ru/api') 

const props = defineProps<{
  files: Attachment[]
  direction: 'horizontal' | 'vertical'
}>()

const isVertical = computed(() => props.direction === 'vertical')

const filePreviews = computed(() => {
  return props.files.map((attachment, index) => {
    const file = downloadedFiles.value[index]
    return {
      ...attachment,
      previewUrl: file ? URL.createObjectURL(file) : null,
      name: file ? file.name : attachment.id
    }
  })
})

function isImage(attachment: Attachment): boolean {
  return attachment.mediaType.startsWith('image/')
}

const downloadedFiles = ref<File[]>([])

function onDownload(index: number) {
  const file = downloadedFiles.value[index];
  if (!file) return;

  // Создаём временный <a> элемент для скачивания
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(async () => {
  if (!props.files || props.files.length === 0) return

  const filePromises = props.files.map(attachment =>
    api.getFileAttachment(attachment.sourceUrl)
  )

  try {
    const files = await Promise.all(filePromises)
    downloadedFiles.value = files
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error)
  }
})

onUnmounted(() => {
  // Очистка временных URL
  if (downloadedFiles.value.length > 0) {
    for (const file of downloadedFiles.value) {
      URL.revokeObjectURL(file as unknown as string)
    }
  }
})
</script>

<style scoped>
.file-preview-container {
  display: flex;
  gap: 10px;
  max-width: 80%;
  word-break: break-word;
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
.file-item:hover .download-button {
  opacity: 1;
  visibility: visible;
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
.download-button {
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
  transition: opacity 0.2s ease-in;
  opacity: 0;
}

.download-button:hover .download-icon{
  opacity: 1 !important;
}

</style>