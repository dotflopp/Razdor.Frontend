<template>
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
</template>

<style scoped>
.top-bar {
  flex-shrink: 0;
  height: 50px;
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
</style>