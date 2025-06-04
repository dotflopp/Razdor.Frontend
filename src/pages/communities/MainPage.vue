<template>
  <div class="app-container">
    <!-- Боковая панель с сообществами -->
    <CommunitySidebar></CommunitySidebar>
    <!-- Бовокая панель с каналами -->
    <div class="sidebar">
      <div class="main-content">
        <ChannelSidebar></ChannelSidebar>
      </div>
      <div class="profile">
        <ProfileCard></ProfileCard>
      </div>
    </div>

    
    
  

    <!-- Основная часть приложения -->
    <main class="main-content">
      <!-- Верхняя панель навигации -->
      <header class="top-bar">
        <div class="server-name">Chat</div>
        <div class="call-icons">
          <button class="call-icon" id="phone-btn" >
            <router-link to="/rooms">
              <img src="/assets/phone.png" />
            </router-link>
          </button>
          <button class="call-icon" id="camera-btn">
            <router-link to="/rooms">
              <img src="/assets/camera.png" /> 
            </router-link>
          </button>
        </div>
      </header>

      <!-- Чат -->
      <section class="chat-area">
        <div class="message">
          <div class="avatar">U</div>
          <div class="message-content">
            <div class="message-header">
              <span class="username">User1</span>
              <span class="timestamp">10:30 AM</span>
            </div>
            <div class="message-body">
              Hello, this is a sample message!
            </div>
          </div>
        </div>
        <div class="message">
          <div class="avatar">V</div>
          <div class="message-content">
            <div class="message-header">
              <span class="username">User2</span>
              <span class="timestamp">10:31 AM</span>
            </div>
            <div class="message-body">
              How are you doing?
            </div>
          </div>
        </div>
      </section>

      <!-- Поле ввода сообщения -->
      <footer class="message-input">
        <input type="text" placeholder="Type a message..." />
        <button class="send-button">Send</button>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { userStore } from '@/entities/store/user'
import ProfileCard from '@/features/profile/ProfileCard.vue'
import CommunitySidebar from '@/widgets/sidebars/CommunitySidebar.vue'
import ChannelSidebar from '@/widgets/sidebars/ChannelSidebar.vue'


const store = userStore()


const avatar= computed<string>(() => store.currentUser!.avatar!)
const name= computed<string>(() => store.currentUser!.nickname)

</script>

<style>
/* Общая структура */
.app-container {
  display: flex;
  height: 100vh;
  background-color: #36393f;
  color: white;
  font-family: Arial, sans-serif;
}

/* Боковая панель */
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  background-color: #2f3136;
}


/* Основная часть */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 56px;
  background-color: #2f3136;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.back-button button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.back-button svg {
  width: 24px;
  height: 24px;
  color: white;
}

.server-name {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1;
}

.call-icons {
  display: flex;
  align-items: center; /* Выравнивание по центру по вертикали */
  gap: 20px; /* Расстояние между иконками */
  margin-right: 10px;
}

.call-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0; /* Убираем отступы */
}

.call-icon img {
  width: 24px; /* Уменьшаем размер иконок */
  height: 24px;
  filter: brightness(0) invert(1); /* Делаем иконки белыми (если они черные) */
  transition: transform 0.3s ease; /* Анимация при наведении */
}


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

/* Поле ввода сообщения */
.message-input {
  height: 60px;
  background-color: #2f3136;
  display: flex;
  align-items: center;
  padding: 0 20px;
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
</style>