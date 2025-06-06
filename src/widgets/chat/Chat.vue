<template>
  <!-- Чат -->
  <section class="chat-area" ref="chatContainer">
    <div 
      v-for="message in messages" :key="message.id" class="message" 
    >
      <div class="message-content">
        <div class="message-header">
          <!-- <span class="username">{{ (await getUser(message.userId)).nickname }}</span> -->
          <span class="timestamp">{{ formattedTime(message.createdAt) }}</span>
        </div>
        <div class="message-body">
          {{ message.text }}
        </div>
        
      </div>
    </div>
  </section>

  <!-- Поле ввода сообщения -->
  <footer class="message-input">
    <div class="clipicon-wrapper" @click="triggerFileInput()" :disabled="!selectedFile">
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
    <input 
      type="text" 
      placeholder="Type a message..." 
      v-model="newMessageText"
      @keydown.enter.prevent="sendMessage"
    />
    <button class="send-button" @click="sendMessage">Send</button>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, onUnmounted } from 'vue'
import { messageStore } from '@/entities/store/messages'
import { useRoute } from 'vue-router' // Если ты используешь vue-router
import { formattedTime } from '@/shared/utils/formatedTime'
import { userStore } from '@/entities/store/user'
import { communityStore } from '@/entities/store/community'
import type { User, UserInfo } from '@/entities/models/userModels'
import type SignalRClient from '@/entities/services/signalr'
import type { Message } from '@/entities/models/chatModels'
import ClipIcon from '@/shared/svg/СlipIcon.vue'


const mStore = messageStore()
const commStore = communityStore()
const uStore = userStore()

const selectedFile = ref<File | null>(null)
const fileInput = ref()
const route = useRoute()

const channelId = computed(() => commStore.activeChannelId)
// Сообщения текущего канала
const messages = computed(() => mStore.getMessages)
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
onMounted(() => {
  mStore.fetchMessages(channelId.value!)
  
  commGateway.on("MessageCreated", waitMessage)
})
onUnmounted(() => {
  commGateway.off("MessageCreated", waitMessage)
})

// Отправка сообщения
async function sendMessage() {
  if (!newMessageText.value.trim()) return
  try {
    await mStore.sendMessage(channelId.value!, newMessageText.value)
    newMessageText.value = ''
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error)
  }
}
// Скроллим к последнему сообщению
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

async function getUser(userId: string): Promise<UserInfo> {
  return await uStore.getUserWithId(userId)
}
// Обработчик выбора файла
function onFileSelected(event: Event) {
  console.log('кликаю')
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}
</script>

<style scoped>
.chat-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #36393f;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #5865f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
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
  font-weight: bold;
  margin-right: 10px;
}

.timestamp {
  font-size: 12px;
  color: #b9bbbe;
}

.message-body {
  background-color: #40444b;
  padding: 10px;
  border-radius: 5px;
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