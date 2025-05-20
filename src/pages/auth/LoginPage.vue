<script setup lang="ts">
</script>

<template>
  <div class="login">
    <div class="login-card">
      <h2>Welcome back!</h2>
      <p>We're so excited to see you again!</p>
      <!-- Форма входа -->
      <form class="login-form">
        <div class="input-group">
          <input type="text" placeholder="Enter your email" />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <!-- Дополнительные ссылки -->
      <div class="footer-links">
        <router-link to="/signup">Create an account</router-link>
      </div>
    </div>
  </div>
</template>



<style lang="css">

.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Логин карточка */
.login-card {
  width: 100%;
  text-align: center;
  max-width: 400px;
  background-color: #36393f;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.login-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.login-card p {
  font-size: 14px;
  color: #b9bbbe;
  margin-bottom: 20px;
}

/* Форма входа */
.input-group {
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #40444b;
  color: white;
  font-size: 14px;
}

.input-group input::placeholder {
  color: #b9bbbe;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #5865f2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #4752c4;
}

/* Дополнительные ссылки */
.footer-links {
  margin-top: 20px;
  font-size: 14px;
}

.footer-links a {
  color: #00aff4;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>