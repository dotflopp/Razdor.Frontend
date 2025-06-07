<template>
  <!-- Чат -->
  <section class="chat-area" ref="chatContainer">
    <div 
      v-for="message in messages" :key="message.id" class="message" 
    >
      <div class="message-avatars">
        <Avatar 
          :name = "users[message.userId]!.nickname"
          :avatar = "users[message.userId]!.avatar!">
        </Avatar>
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="username">{{ users[message.userId]?.nickname }}</span>
          <span class="timestamp">{{ formattedTimeForChat(message.createdAt) }}</span>
        </div>
        <div class="message-body">
          {{ message.text }}
        </div>
        <MessageFilePreview
          v-if="message.attachments?.length! > 0"
          :files="message.attachments!"
          :direction="'vertical'"
          :need-close-button="false">
        </MessageFilePreview>
      </div>
    </div>
  </section>

  <div class="message-container">
    <div class="file-preview">
      <FilePreview 
        v-if="selectedFiles?.length > 0"
        :files="selectedFiles!"
        :direction="'horizontal'"
        :need-close-button="true"
        @delete="handleDelete"
      />
    </div>

    <!-- Поле ввода сообщения -->
    <footer class="message-input">
      <div class="clipicon-wrapper" @click="triggerFileInput()">
        <ClipIcon :fill-color="'white'" :size="'55%'" class="clipicon"></ClipIcon>
      </div>
      <!-- Скрытый инпут для выбора файлов -->
      <input 
        type="file" 
        accept="image/*, .pdf, .txt" 
        @change="onFileSelected"
        ref="fileInput"
        hidden
      />
      <!-- чатикс -->
      <input 
        type="text" 
        placeholder="Type a message..." 
        v-model="newMessageText"
        @keydown.enter.prevent="sendMessage"
      />

      <button class="send-button" @click="sendMessage">Send</button>
    </footer>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, onUnmounted } from 'vue'
import { messageStore } from '@/entities/store/messages'
import { formattedTimeForChat } from '@/shared/utils/formatedTime'
import { communityStore } from '@/entities/store/community'
import type SignalRClient from '@/entities/services/signalr'
import type { Message } from '@/entities/models/chatModels'
import ClipIcon from '@/shared/svg/СlipIcon.vue'
import Avatar from '@/features/avatar/Avatar.vue'
import FilePreview from '@/features/file/FilePreview.vue'
import MessageFilePreview from '@/features/file/MessageFilePreview.vue'


const mStore = messageStore()
const commStore = communityStore()

const selectedFiles = ref<File[]>([])
const fileInput = ref()

const channelId = computed(() => commStore.activeChannelId)
// Сообщения текущего канала
const messages = computed(() => mStore.getMessages)
const users = computed(() => mStore.getUsers)

const chatContainer = ref<HTMLElement | null>(null)

// Новое сообщение
const newMessageText = ref('')
const user = ref()
// Gateway
const commGateway = inject<SignalRClient>('CGW')!
function waitMessage(message: Message) {
  mStore.addMessage(message)
  scrollToBottom()
}

// Загрузка сообщений при монтировании
onMounted(async () => {
  await mStore.fetchMessages(channelId.value!)
  scrollToBottom()
  commGateway.on("MessageCreated", waitMessage)
})
onUnmounted(() => {
  commGateway.off("MessageCreated", waitMessage)
})

// Отправка сообщения
async function sendMessage() {
  if (!newMessageText.value.trim()) return
  try {  
    await mStore.sendMessage(channelId.value!, newMessageText.value, selectedFiles.value)
    newMessageText.value = ''
    selectedFiles.value = []
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error)
  }
}
// Скроллим к последнему сообщению
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
// Обработчик выбора файла
function onFileSelected(event: Event) {
  console.log('кликаю')
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(input.files)]
  }
}
function handleDelete(index: number) {
  selectedFiles.value.splice(index, 1)
}
</script>

<style scoped>
.chat-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #36393f;
}
.message-container {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
}
.file-preview {
  display: flex;
  flex-direction: row;
  justify-content: start;
  background-color: #33363a;
}
.message {
  display: flex;
  padding: 19px 0px;
  gap: 15px;
  border-top:1px solid #4d4f53 ;
}
.message:first-child {
  border-top:none;
}

.message-avatars {
  width: 43px;
  height: 43px;
}
.message-content {
  max-width: 80%;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  margin-right: 10px;
}

.timestamp {
  font-size: 12px;
  color: #b9bbbe;
}

.message-body {
  padding: 0px;
  color: #b9bbbe;
}
.clipicon {
  transform: rotate(225deg);
  opacity: 0.5;
  transition: opacity 0.2s ease, color 0.2s ease;
}
.clipicon:hover {
  transform: rotate(225deg);
  opacity: 1;
}
.clipicon-wrapper {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Поле ввода сообщения */
.message-input {
  height: 50px;
  flex-shrink: 0;
  background-color: #2f3136;
  display: flex;
  align-items: center;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #40444b;
  color: white;
}

.send-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #5865f2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #4752c4;
}
/* Общие стили для скроллбара */
.chat-area::-webkit-scrollbar {
  width: 8px;
}

.chat-area::-webkit-scrollbar-track {
  border-radius: 4px;
}

.chat-area::-webkit-scrollbar-thumb {
  background-color: #5865f2; /* Цвет как у Discord */
  border-radius: 4px;
}

.chat-area::-webkit-scrollbar-thumb:hover {
  background-color: #4752c4;
}
</style> 