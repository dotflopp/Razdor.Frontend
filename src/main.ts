import { createApp } from 'vue'
import App from './app/App.vue'
import router from './app/router'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
    
app.use(router)
app.use(pinia)
app.mount('#app')
