<template>
  <div class="register">
    <div class="register-card">
      <h2>Create an Account</h2>
      <p>Join us and start your journey!</p>

      <!-- Форма регистрации -->
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="input-group">
          <input v-model="username" type="text" placeholder="Enter your username" required />
        </div>
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group" :class="{ 'error': passwordError }">
          <input v-model="password" type="password" placeholder="Enter your password" required />
          <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
        </div>
        <div class="input-group" :class="{ 'error': confirmPasswordError }">
          <input v-model="confirmPassword" type="password" placeholder="Confirm your password" required />
          <p v-if="confirmPasswordError" class="field-error">{{ confirmPasswordError }}</p>
        </div>
        <button type="submit" class="register-button">Sign Up</button>
        
      </form>

      <!-- Дополнительные ссылки -->
      <div class="footer-links">
        <router-link to="/login">Already have an account? Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/entities/store/user'
import { RestApiClient } from '@/entities/api/apiClient'

const router = useRouter()
const uStore = userStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

// Проверка сложности пароля
function isPasswordStrong(password: string): boolean {
  const minLength = 8
  const hasDigit = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasDigit &&
    hasSpecialChar
  )
}
// Вычисляемые ошибки
const passwordError = computed(() => {
  if (!password.value) return ''
  return isPasswordStrong(password.value) ? '': 'Weak password'
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return ''
  return password.value === confirmPassword.value ? '' : 'The passwords do not match'
})

async function handleSubmit() {
  try {
    const api = new RestApiClient('https://dotflopp.ru/api')
    const { token } = await api.register({
      identityName: username.value,
      email: email.value, 
      password: password.value
    })

    // Сохраняем в store
    uStore.login()
    uStore.setToken(token)
    // Переход на главную
    router.push('/main')
  } 
  catch (err: any) {
    console.error()
    error.value = 'Ошибка регистрации. Проверьте данные'
  }
}
</script>

<style>
.input-group.error input {
  border-color: #e53935;
  box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.2);
}
.field-error {

  margin-top: 4px;
}
.register {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Регистрационная карточка */
.register-card {
  width: 100%;
  text-align: center;
  max-width: 400px;
  background-color: #36393f;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.register-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.register-card p {
  font-size: 14px;
  color: #b9bbbe;
  margin-bottom: 20px;
}

/* Форма регистрации */
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

.register-button {
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

.register-button:hover {
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