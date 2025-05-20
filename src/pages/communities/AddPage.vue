<script setup lang="ts">
</script>

<template>
  <div class="template">
    <div class="add-friend-or-community-modal">
    <!-- Заголовок -->
    <header class="modal-header">
      <h2>Add Friend or Join Community</h2>
      <button class="close-button">
        <router-link to="/main">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
        </router-link>
        
      </button>
    </header>

    <!-- Основной контент -->
    <section class="modal-content">
      <p>Choose an option:</p>
      <div class="option-buttons">
        <button class="option-button">
          <span>Add Friend</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
          </svg>
        </button>
        <button class="option-button">
          <span>Join Community</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </section>
  </div>
  </div>
  
</template>

<style>
.template {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Основной контейнер модального окна */
.add-friend-or-community-modal {
  width: 400px;
  background-color: #36393f;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Заголовок */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #2f3136;
  border-bottom: 1px solid #292b2f;
}

.modal-header h2 {
  font-size: 18px;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: white;
  transition: color 0.3s ease;
}

.close-button:hover svg {
  color: #ed4245; /* Красный цвет при наведении */
}

/* Основное содержимое */
.modal-content {
  padding: 20px;
}

.modal-content p {
  font-size: 14px;
  color: #b9bbbe;
  margin-bottom: 20px;
}

.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #40444b;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
  color: white;
}

.option-button:hover {
  background-color: #5865f2;
}

.option-button span {
  font-weight: bold;
}

.option-button svg {
  width: 24px;
  height: 24px;
  color: white;
}
</style>