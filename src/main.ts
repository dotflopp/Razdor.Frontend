import { createApp } from 'vue'
import App from './app/App.vue'
import router from './app/router'
import { createPinia } from 'pinia'
import SignalRClient from './entities/services/signalr'

const app = createApp(App)
const pinia = createPinia()
const communityGateway = new SignalRClient('https://dotflopp.ru/api/signalr')

app.provide("CGW", communityGateway)
app.use(router)
app.use(pinia)
app.mount('#app')
