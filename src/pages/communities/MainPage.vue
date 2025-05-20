<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <!-- Боковая панель с сообществами -->
    <aside class="sidebar">
      <div class="server-list">
        <div class="server-icon active" title="Home">
          <router-link to="/login">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
            </svg>
          </router-link>
        </div>
        <div class="server-icon" title="Community 1">
            <span>C1</span>
        </div>
        <div class="server-icon" title="Community 2">
          <span>C2</span>
        </div>
        <router-link to="/add">
          <div class="server-icon" title="Add Server">
            <span>+</span>
          </div>
        </router-link>
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
  width: 72px;
  background-color: #2f3136;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.server-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.server-icon {
  width: 48px;
  height: 48px;
  background-color: #40444b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.server-icon:hover,
.server-icon.active {
  background-color: #5865f2;
}

.server-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.server-icon span {
  font-size: 16px;
  font-weight: bold;
  color: white;
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