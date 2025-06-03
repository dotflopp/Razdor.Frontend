<template>
  <div class="app-container">
    <!-- Боковая панель с сообществами -->
    <Sidebar></Sidebar>
    <!-- Бовокая панель с каналами -->
    <aside class="sidebar">
    <div class="server-list">
      <!-- Активный сервер -->
      <div class="server-item active">
        <div class="server-icon">
          <router-link to="/login">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
            </svg>
          </router-link>
        </div>
        <div class="server-name">Home</div>
      </div>

      <!-- Другие серверы -->
      <div class="server-item">
        <div class="server-icon">
          <span>C1</span>
        </div>
        <div class="server-name">Community 1</div>
      </div>
      <div class="server-item">
        <div class="server-icon">
          <span>C2</span>
        </div>
        <div class="server-name">Community 2</div>
      </div>

      <!-- Кнопка добавления сервера -->
      <div class="server-item add-server">
        <div class="server-icon">
          <router-link to="/add">
            <span>+</span>
          </router-link>
        </div>
        <div class="server-name">Add Server</div>
      </div>
    </div>

    <!-- Профильный виджет -->
    <div class="profile-widget">
      <Avatar v-if="avatarInfo" :info="avatarInfo"/>
      <div class="profile-info">
        <div class="username">User123</div>
        <div class="status online"></div>
      </div>
    </div>
  </aside>

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
import Avatar from '@/features/avatar/Avatar.vue'
import Sidebar from '@/widgets/communitySidebar/Sidebar.vue'
import type { AvatarInfo } from '@/features/avatar/model/avatarInfo'

const store = userStore()

const info: AvatarInfo = {
  avatar: store.currentUser?.avatar || null,
  name: store.currentUser!.nickname
}

const avatarInfo = computed<AvatarInfo>(() => info)
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
/* Боковая панель */
.sidebar {
  width: 200px;
  background-color: #2f3136;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Распределяем элементы по высоте */
  height: 100vh;
}

.server-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.server-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.server-item:hover,
.server-item.active {
  background-color: #3a3d44;
  border-radius: 6px;

}

.server-icon {
  width: 32px;
  height: 32px;
  background-color: #40444b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
}

.server-icon span {
  color: inherit;
}

.server-name {
  color: #ccc;
  font-size: 14px;
  text-decoration: none;
  color: inherit;
}

.add-server .server-icon {
  background-color: #5865f2;
  color: white;
}

/* Профильный виджет */
.profile-widget {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #393c41;
  background-color: #282a2d;
  margin-top: auto; /* Отодвигает вниз */
}

.profile-icon {
  width: 40px;
  height: 40px;
  background-color: #5865f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.username {
  color: white;
  font-size: 14px;
}

.status {
  width: 8px;
  height: 8px;  
  border-radius: 50%;
  margin-left: 5px;
}

.status.online {
  background-color: #43b581;
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