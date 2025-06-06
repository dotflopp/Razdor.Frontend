<template>
  <div class="avatar-upload">
    <input
      type="file"
      accept="image/*"
      @change="onFileSelected"
      class="file-input"
    />
    <button @click="uploadSelectedFile" :disabled="!selectedFile">
      Загрузить аватар
    </button>

    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileApiClient } from '@/entities/api/fileApiClient'
const selectedFile = ref<File | null>(null)
const uploadStatus = ref<string | null>(null)
const fileApi = new FileApiClient('https://dotflopp.ru/api')
// Обработчик выбора файла
function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}

// Обработчик нажатия кнопки "Загрузить"
async function uploadSelectedFile() {
  if (!selectedFile.value) {
    alert('Пожалуйста, выберите файл')
    return
  }

  try {
    await fileApi.uploadUserAvatar(selectedFile.value)
    uploadStatus.value = 'Файл успешно загружен!'
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
    uploadStatus.value = 'Ошибка при загрузке файла'
  }
}

</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-input {
  padding: 8px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>